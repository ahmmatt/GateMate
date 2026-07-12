<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Services\FonnteService;
use App\Services\OtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * OtpServiceTest
 * ─────────────────────────────────────────────────────────────────────────────
 * Unit test untuk OtpService: generate, kirim, verifikasi OTP.
 */
class OtpServiceTest extends TestCase
{
    use RefreshDatabase;

    private OtpService $service;

    /** @var \Mockery\MockInterface&FonnteService */
    private $mockFonnte;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mockFonnte = Mockery::mock(FonnteService::class);
        $this->service    = new OtpService($this->mockFonnte);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    private function createUnverifiedUser(): User
    {
        return User::factory()->create([
            'phone'                => '081234567890',
            'phone_verified_at'    => null,
            'phone_otp'            => null,
            'phone_otp_expires_at' => null,
        ]);
    }

    #[Test]
    public function send_otp_generates_and_stores_otp_in_database(): void
    {
        $user = $this->createUnverifiedUser();

        $this->mockFonnte
            ->shouldReceive('send')
            ->once()
            ->andReturn(true);

        $result = $this->service->send($user);

        $this->assertArrayHasKey('expires_in', $result);
        $this->assertEquals(OtpService::EXPIRES_MINUTES * 60, $result['expires_in']);

        $user->refresh();
        $this->assertNotNull($user->phone_otp);
        $this->assertEquals(6, strlen($user->phone_otp));
        $this->assertNotNull($user->phone_otp_expires_at);
    }

    #[Test]
    public function send_otp_throws_exception_if_phone_already_verified(): void
    {
        $user = User::factory()->create([
            'phone'             => '081234567890',
            'phone_verified_at' => now(),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('sudah terverifikasi');

        $this->service->send($user);
    }

    #[Test]
    public function send_otp_throws_exception_if_no_phone(): void
    {
        $user = User::factory()->create([
            'phone'             => null,
            'phone_verified_at' => null,
        ]);

        $this->expectException(\RuntimeException::class);

        $this->service->send($user);
    }

    #[Test]
    public function verify_otp_marks_phone_as_verified_on_correct_code(): void
    {
        $otp  = '123456';
        $user = User::factory()->create([
            'phone'                => '081234567890',
            'phone_verified_at'    => null,
            'phone_otp'            => $otp,
            'phone_otp_expires_at' => now()->addMinutes(5),
        ]);

        $this->service->verify($user, $otp);

        $user->refresh();
        $this->assertNotNull($user->phone_verified_at);
        $this->assertNull($user->phone_otp);
        $this->assertNull($user->phone_otp_expires_at);
    }

    #[Test]
    public function verify_otp_throws_exception_on_wrong_code(): void
    {
        $user = User::factory()->create([
            'phone'                => '081234567890',
            'phone_verified_at'    => null,
            'phone_otp'            => '123456',
            'phone_otp_expires_at' => now()->addMinutes(5),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('salah');

        $this->service->verify($user, '999999');
    }

    #[Test]
    public function verify_otp_throws_exception_on_expired_code(): void
    {
        $user = User::factory()->create([
            'phone'                => '081234567890',
            'phone_verified_at'    => null,
            'phone_otp'            => '123456',
            'phone_otp_expires_at' => now()->subMinutes(10),
        ]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('kadaluarsa');

        $this->service->verify($user, '123456');
    }
}
