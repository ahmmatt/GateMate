<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * LoginTest
 * ─────────────────────────────────────────────────────────────────────────────
 * Menguji endpoint POST /api/auth/login.
 */
class LoginTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'email'    => 'user@gatemate.test',
            'password' => bcrypt('password123'),
            'role'     => 'user',
        ], $attributes));
    }

    #[Test]
    public function user_can_login_with_valid_credentials(): void
    {
        $this->createUser();

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'user@gatemate.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
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
    }

    #[Test]
    public function login_fails_with_wrong_password(): void
    {
        $this->createUser();

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'user@gatemate.test',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    #[Test]
    public function login_fails_with_unregistered_email(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'notexist@gatemate.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    #[Test]
    public function login_requires_email_field(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function login_requires_valid_email_format(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'bukan-email',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function login_token_can_be_used_for_authenticated_endpoints(): void
    {
        $admin = $this->createUser(['role' => 'admin']);

        $response = $this->postJson('/api/auth/login', [
            'email'    => $admin->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);

        $token = $response->json('data.token');
        $me    = $this->withToken($token)->getJson('/api/auth/me');
        $me->assertStatus(200)->assertJson(['success' => true]);
    }

    #[Test]
    public function logout_revokes_token(): void
    {
        $user = $this->createUser();

        // Login untuk dapatkan token nyata (bukan TransientToken dari actingAs())
        $loginResponse = $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'password123',
        ]);
        $loginResponse->assertStatus(200);

        $token = $loginResponse->json('data.token');

        // Token aktif bisa mengakses /me
        $this->withToken($token)->getJson('/api/auth/me')
            ->assertStatus(200);

        // Logout dengan token yang sama
        $this->withToken($token)->postJson('/api/auth/logout')
            ->assertStatus(200)
            ->assertJson(['success' => true]);

        // Bersihkan session dan cookie test client agar menguji murni Bearer token
        $this->flushSession();
        $this->defaultCookies = [];

        // Setelah logout, token tidak bisa digunakan lagi
        $this->withToken($token)->getJson('/api/auth/me')
            ->assertStatus(401);
    }
}
