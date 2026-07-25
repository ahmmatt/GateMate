<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * RegisterTest
 * ─────────────────────────────────────────────────────────────────────────────
 * Menguji endpoint POST /api/auth/register.
 */
class RegisterTest extends TestCase
{
    use RefreshDatabase;

    private array $validPayload = [
        'full_name'             => 'Budi Santoso',
        'gender'                => 'Male',
        'email'                 => 'budi@securegate.test',
        'phone'                 => '081234567890',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ];

    #[Test]
    public function user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/auth/register', $this->validPayload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'token_type',
                    'user' => ['full_name', 'email'],
                ],
            ])
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('users', [
            'email'     => 'budi@securegate.test',
            'full_name' => 'Budi Santoso',
            'role'      => 'user',
        ]);
    }

    #[Test]
    public function register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'budi@securegate.test']);

        $response = $this->postJson('/api/auth/register', $this->validPayload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function register_fails_when_passwords_dont_match(): void
    {
        $payload = array_merge($this->validPayload, [
            'password_confirmation' => 'berbedapassword',
        ]);

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function register_requires_full_name(): void
    {
        $payload = $this->validPayload;
        unset($payload['full_name']);

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['full_name']);
    }

    #[Test]
    public function register_requires_valid_gender(): void
    {
        $payload = array_merge($this->validPayload, ['gender' => 'Unknown']);

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['gender']);
    }

    #[Test]
    public function register_fails_with_short_password(): void
    {
        $payload = array_merge($this->validPayload, [
            'password'              => 'short',
            'password_confirmation' => 'short',
        ]);

        $response = $this->postJson('/api/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function registered_user_can_immediately_login(): void
    {
        $this->postJson('/api/auth/register', $this->validPayload)->assertStatus(201);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email'    => 'budi@securegate.test',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)->assertJson(['success' => true]);
    }
}
