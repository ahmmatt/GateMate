<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * EventModelTest
 * ─────────────────────────────────────────────────────────────────────────────
 * Unit test untuk model Event — scopes, accessors, dan relasi.
 */
class EventModelTest extends TestCase
{
    use RefreshDatabase;

    private User $organizer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->organizer = User::factory()->create(['role' => 'admin']);
    }

    #[Test]
    public function scope_active_returns_only_active_events(): void
    {
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'status'   => 'active',
        ]);
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'status'   => 'ended',
        ]);

        $active = Event::active()->get();

        $this->assertCount(1, $active);
        $this->assertEquals('active', $active->first()->status);
    }

    #[Test]
    public function scope_upcoming_returns_active_events_not_yet_ended(): void
    {
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'status'   => 'active',
            'end_date' => now()->addDays(7)->format('Y-m-d'),
        ]);

        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'status'   => 'active',
            'end_date' => now()->subDays(1)->format('Y-m-d'),
        ]);

        $upcoming = Event::upcoming()->get();

        $this->assertCount(1, $upcoming);
    }

    #[Test]
    public function scope_by_city_filters_events_by_city(): void
    {
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'city'     => 'Jakarta Selatan',
            'status'   => 'active',
        ]);
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'city'     => 'Bandung',
            'status'   => 'active',
        ]);

        $jakarta = Event::byCity('Jakarta')->get();

        $this->assertCount(1, $jakarta);
        $this->assertStringContainsString('Jakarta', $jakarta->first()->city);
    }

    #[Test]
    public function scope_by_category_filters_events_by_category(): void
    {
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'category' => 'music',
            'status'   => 'active',
        ]);
        Event::factory()->create([
            'id_admin' => $this->organizer->id_user,
            'category' => 'technology',
            'status'   => 'active',
        ]);

        $music = Event::byCategory('music')->get();

        $this->assertCount(1, $music);
        $this->assertEquals('music', $music->first()->category);
    }

    #[Test]
    public function accessor_banner_image_url_returns_full_url(): void
    {
        $event = Event::factory()->create([
            'id_admin'     => $this->organizer->id_user,
            'banner_image' => 'test-banner.jpg',
        ]);

        $this->assertStringContainsString('test-banner.jpg', $event->banner_image_url);
        $this->assertStringStartsWith('http', $event->banner_image_url);
    }

    #[Test]
    public function accessor_banner_image_url_returns_null_when_no_image(): void
    {
        // banner_image adalah NOT NULL di DB, kita test dengan string kosong yang berarti tidak ada gambar
        $event = Event::factory()->create([
            'id_admin'     => $this->organizer->id_user,
            'banner_image' => 'default-banner.jpg',
        ]);

        // Tidak ada image berarti URL tetap mengarah ke file default, bukan null
        // Jika banner_image kosong (''), accessor mengembalikan URL ke string kosong atau null
        $eventEmpty = tap(clone $event, fn ($e) => $e->banner_image = null);
        $this->assertNull($eventEmpty->banner_image_url);
    }

    #[Test]
    public function event_has_ticket_tiers_relation(): void
    {
        $event = Event::factory()->create(['id_admin' => $this->organizer->id_user]);

        $this->assertInstanceOf(
            \Illuminate\Database\Eloquent\Relations\HasMany::class,
            $event->ticketTiers()
        );
    }

    #[Test]
    public function event_belongs_to_admin_user(): void
    {
        $event = Event::factory()->create(['id_admin' => $this->organizer->id_user]);

        $this->assertInstanceOf(
            \Illuminate\Database\Eloquent\Relations\BelongsTo::class,
            $event->admin()
        );
        $this->assertEquals($this->organizer->id_user, $event->admin->id_user);
    }
}
