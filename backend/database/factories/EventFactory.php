<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 days', '+3 months');
        $endDate   = $this->faker->dateTimeBetween($startDate, '+4 months');

        return [
            'id_admin'         => User::factory(),
            'title'            => $this->faker->sentence(4),
            'banner_image'     => 'default-banner.jpg',
            'poster_path'      => null,
            'category'         => $this->faker->randomElement(['music', 'technology', 'sports', 'art', 'food', 'business']),
            'location_type'    => $this->faker->randomElement(['offline', 'online']),
            'location_details' => $this->faker->address(),
            'venue_name'       => $this->faker->company(),
            'city'             => $this->faker->city(),
            'maps_link'        => null,
            'start_date'       => $startDate->format('Y-m-d'),
            'start_time'       => $this->faker->time('H:i'),
            'end_date'         => $endDate->format('Y-m-d'),
            'end_time'         => $this->faker->time('H:i'),
            'timezone'         => 'GMT+07:00',
            'description'      => $this->faker->paragraphs(3, true),
            'require_approval' => false,
            'custom_questions' => null,
            'capacity_type'    => 'limited',
            'max_capacity'     => $this->faker->numberBetween(50, 500),
            'seat_assignment'  => 'bebas',
            'seat_numbers'     => null,
            'status'           => 'active',
        ];
    }

    /**
     * State: Event dengan status 'active' dan belum berakhir.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'   => 'active',
            'end_date' => now()->addDays(30)->format('Y-m-d'),
        ]);
    }

    /**
     * State: Event dengan kapasitas unlimited.
     */
    public function unlimited(): static
    {
        return $this->state(fn (array $attributes) => [
            'capacity_type' => 'unlimited',
            'max_capacity'  => null,
        ]);
    }

    /**
     * State: Event yang memerlukan approval pendaftar.
     */
    public function withApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'require_approval' => true,
        ]);
    }

    /**
     * State: Event online (tidak perlu lokasi fisik).
     */
    public function online(): static
    {
        return $this->state(fn (array $attributes) => [
            'location_type'    => 'online',
            'location_details' => 'Zoom/Google Meet',
            'venue_name'       => null,
            'city'             => null,
        ]);
    }
}
