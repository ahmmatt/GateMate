<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\TicketTier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketTier>
 */
class TicketTierFactory extends Factory
{
    protected $model = TicketTier::class;

    public function definition(): array
    {
        $capacity = $this->faker->numberBetween(20, 200);

        return [
            'id_event'        => Event::factory(),
            'tier_name'       => $this->faker->randomElement(['Regular', 'VIP', 'VVIP', 'Early Bird', 'Student']),
            'price'           => $this->faker->randomElement([0, 50000, 100000, 150000, 200000, 350000]),
            'capacity'        => $capacity,
            'remaining_seats' => $capacity,
            'is_unlimited'    => false,
        ];
    }

    /**
     * State: Tiket gratis.
     */
    public function free(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => 0,
        ]);
    }

    /**
     * State: Tiket unlimited (tanpa batas kuota).
     */
    public function unlimited(): static
    {
        return $this->state(fn (array $attributes) => [
            'capacity'        => 0,
            'remaining_seats' => 0,
            'is_unlimited'    => true,
        ]);
    }

    /**
     * State: Tiket sudah habis terjual.
     */
    public function soldOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'remaining_seats' => 0,
            'is_unlimited'    => false,
        ]);
    }
}
