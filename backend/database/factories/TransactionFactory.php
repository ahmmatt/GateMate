<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\TicketTier;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'event_id'       => Event::factory(),
            'ticket_tier_id' => TicketTier::factory(),
            'order_id'       => 'TRX-' . $this->faker->unique()->numerify('########'),
            'gross_amount'   => $this->faker->randomElement([100000, 150000, 200000, 300000, 500000]),
            'payment_status' => 'success',
            'snap_token'     => null,
            'is_used'        => false,
            'scanned_at'     => null,
            'seat_number'    => null,
        ];
    }

    /**
     * State: Transaksi berhasil.
     */
    public function successful(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'success',
        ]);
    }

    /**
     * State: Transaksi pending (menunggu approval).
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 'pending',
        ]);
    }

    /**
     * State: Tiket sudah digunakan (sudah di-scan).
     */
    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_used'    => true,
            'scanned_at' => now(),
        ]);
    }

    /**
     * State: Transaksi dengan nomor kursi.
     */
    public function withSeat(string $seatNumber = 'A1'): static
    {
        return $this->state(fn (array $attributes) => [
            'seat_number' => $seatNumber,
        ]);
    }
}
