<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * Define the model's default state.
     * Disesuaikan dengan skema tabel users SecureGate (full_name, gender, phone, role, dll.)
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name'            => fake()->name(),
            'gender'               => fake()->randomElement(['Male', 'Female']),
            'email'                => fake()->unique()->safeEmail(),
            'phone'                => '08' . fake()->numerify('##########'),
            'password'             => static::$password ??= Hash::make('password'),
            'role'                 => 'user',
            'wallet_balance'       => 0,
            'is_verified_organizer' => false,
            'phone_verified_at'    => null,
            'phone_otp'            => null,
            'phone_otp_expires_at' => null,
            'face_verified_at'     => null,
            'profile_picture'      => null,
        ];
    }

    /**
     * State: User dengan role admin (organizer).
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * State: Admin yang sudah diverifikasi superadmin.
     */
    public function verifiedOrganizer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role'                  => 'admin',
            'is_verified_organizer' => true,
        ]);
    }

    /**
     * State: User dengan saldo wallet tertentu.
     */
    public function withBalance(float $amount): static
    {
        return $this->state(fn (array $attributes) => [
            'wallet_balance' => $amount,
        ]);
    }

    /**
     * State: User dengan KYC (face scan) yang sudah terverifikasi dan masih valid.
     */
    public function kycVerified(): static
    {
        return $this->state(fn (array $attributes) => [
            'face_verified_at' => now()->subDays(10),
        ]);
    }

    /**
     * State: User dengan nomor telepon yang sudah diverifikasi.
     */
    public function phoneVerified(): static
    {
        return $this->state(fn (array $attributes) => [
            'phone_verified_at' => now(),
        ]);
    }

    /**
     * State: User dengan role tenant.
     */
    public function tenant(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'tenant',
        ]);
    }

    /**
     * State: User dengan role superadmin.
     */
    public function superadmin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'superadmin',
        ]);
    }
}
