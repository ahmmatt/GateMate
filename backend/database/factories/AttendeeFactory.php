<?php

namespace Database\Factories;

use App\Models\Attendee;
use App\Models\Event;
use App\Models\TicketTier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendee>
 */
class AttendeeFactory extends Factory
{
    protected $model = Attendee::class;

    public function definition(): array
    {
        return [
            'id_user'          => User::factory(),
            'id_event'         => Event::factory(),
            'id_tier'          => TicketTier::factory(),
            'ticket_code'      => 'TRX-' . $this->faker->unique()->numerify('########'),
            'qr_token'         => Str::random(40),
            'status'           => 'approved',
            'vibe_bio'         => null,
            'ig_handle'        => null,
            'looking_for_match' => false,
        ];
    }

    /**
     * State: Attendee menunggu approval dari organizer.
     */
    public function needApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'need_approval',
        ]);
    }

    /**
     * State: Attendee sudah disetujui.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * State: Attendee aktif mencari match (matchmaking enabled).
     */
    public function lookingForMatch(): static
    {
        return $this->state(fn (array $attributes) => [
            'looking_for_match' => true,
            'vibe_bio'          => $this->faker->sentence(),
            'ig_handle'         => '@' . $this->faker->userName(),
        ]);
    }
}
