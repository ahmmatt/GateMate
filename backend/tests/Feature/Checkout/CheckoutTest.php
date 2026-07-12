<?php

namespace Tests\Feature\Checkout;

use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * CheckoutTest
 * ─────────────────────────────────────────────────────────────────────────────
 * Menguji endpoint POST /api/checkout (pembelian tiket via wallet).
 */
class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Event $event;
    private TicketTier $tier;

    protected function setUp(): void
    {
        parent::setUp();

        // Fake mail & queue agar tidak benar-benar mengirim email di test
        Mail::fake();
        Queue::fake();

        $organizer = User::factory()->create(['role' => 'admin']);

        $this->user = User::factory()->create([
            'role'             => 'user',
            'wallet_balance'   => 500000,
            'face_verified_at' => now()->subDays(10),
        ]);

        $this->event = Event::factory()->create([
            'id_admin'         => $organizer->id_user,
            'status'           => 'active',
            'require_approval' => false,
            'seat_assignment'  => 'bebas',
        ]);

        $this->tier = TicketTier::factory()->create([
            'id_event'        => $this->event->id_event,
            'price'           => 150000,
            'capacity'        => 100,
            'remaining_seats' => 100,
            'is_unlimited'    => false,
        ]);
    }

    #[Test]
    public function user_can_checkout_ticket_with_sufficient_balance(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => ['order_id', 'event_title', 'tier_name', 'gross_amount', 'new_balance', 'status'],
            ]);

        $this->assertDatabaseHas('users', [
            'id_user'        => $this->user->id_user,
            'wallet_balance' => 350000,
        ]);

        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('attendees', 1);
    }

    #[Test]
    public function checkout_fails_if_user_has_insufficient_balance(): void
    {
        $this->user->update(['wallet_balance' => 50000]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
        $this->assertDatabaseCount('transactions', 0);
    }

    #[Test]
    public function checkout_fails_if_user_kyc_not_verified(): void
    {
        $this->user->update(['face_verified_at' => null]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(403)->assertJson(['success' => false]);
    }

    #[Test]
    public function checkout_fails_if_user_kyc_expired(): void
    {
        $this->user->update(['face_verified_at' => now()->subMonths(6)]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function checkout_fails_anti_scalp_when_user_already_has_ticket(): void
    {
        Transaction::factory()->create([
            'user_id'        => $this->user->id_user,
            'event_id'       => $this->event->id_event,
            'ticket_tier_id' => $this->tier->id_tier,
            'payment_status' => 'success',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    #[Test]
    public function checkout_fails_if_tier_is_sold_out(): void
    {
        $this->tier->update(['remaining_seats' => 0]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    #[Test]
    public function checkout_requires_authentication(): void
    {
        $response = $this->postJson('/api/checkout', [
            'event_id' => $this->event->id_event,
            'tier_id'  => $this->tier->id_tier,
        ]);

        $response->assertStatus(401);
    }

    #[Test]
    public function checkout_remaining_seats_decremented_after_purchase(): void
    {
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/checkout', [
                'event_id' => $this->event->id_event,
                'tier_id'  => $this->tier->id_tier,
            ]);

        $this->assertDatabaseHas('ticket_tiers', [
            'id_tier'         => $this->tier->id_tier,
            'remaining_seats' => 99,
        ]);
    }
}
