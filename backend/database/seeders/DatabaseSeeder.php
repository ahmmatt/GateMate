<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\TicketTier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── 1. Buat Admin User ────────────────────────────────────────────────
        $admin = User::create([
            'full_name' => 'GateMate Organizer',
            'gender'    => 'Male',
            'email'     => 'admin@gatemate.com',
            'password'  => Hash::make('password123'),
            'role'      => 'admin',
        ]);

        // ── 2. Buat 2 Event Aktif ─────────────────────────────────────────────
        $nextWeek    = now()->addWeek()->toDateString();      // e.g. 2026-05-22
        $nextWeekEnd = now()->addWeek()->addDays(1)->toDateString();

        $eventOffline = Event::create([
            'id_admin'         => $admin->id_user,
            'title'            => 'Jakarta Tech Summit 2026',
            'banner_image'     => 'default_banner.jpg',
            'category'         => 'Tech Seminar',
            'location_type'    => 'offline',
            'location_details' => 'Jakarta Convention Center, Jl. Gatot Subroto, Jakarta Selatan',
            'venue_name'       => 'Jakarta Convention Center',
            'city'             => 'Jakarta',
            'maps_link'        => 'https://maps.google.com/?q=Jakarta+Convention+Center',
            'start_date'       => $nextWeek,
            'start_time'       => '09:00:00',
            'end_date'         => $nextWeek,
            'end_time'         => '17:00:00',
            'timezone'         => 'GMT+08:00',
            'description'      => 'Acara teknologi terbesar di Jakarta yang menghadirkan pembicara dari perusahaan-perusahaan teknologi terkemuka. Bergabunglah bersama ribuan developer, startup founder, dan tech enthusiast.',
            'require_approval' => false,
            'capacity_type'    => 'limited',
            'max_capacity'     => 250,
            'seat_assignment'  => 'bebas',
            'status'           => 'active',
        ]);

        $eventOnline = Event::create([
            'id_admin'         => $admin->id_user,
            'title'            => 'GateMate Dev Bootcamp — Online',
            'banner_image'     => 'default_banner.jpg',
            'category'         => 'Workshop & Training',
            'location_type'    => 'online',
            'location_details' => 'Zoom Meeting — tautan akan dikirim via E-Ticket',
            'venue_name'       => null,
            'city'             => null,
            'maps_link'        => null,
            'start_date'       => $nextWeek,
            'start_time'       => '13:00:00',
            'end_date'         => $nextWeekEnd,
            'end_time'         => '16:00:00',
            'timezone'         => 'GMT+08:00',
            'description'      => 'Bootcamp intensif selama 2 hari bersama mentor berpengalaman. Pelajari cara membangun aplikasi web modern menggunakan Laravel 13 dan ekosistemnya dari nol hingga deployment.',
            'require_approval' => true,
            'capacity_type'    => 'limited',
            'max_capacity'     => 100,
            'seat_assignment'  => 'bebas',
            'status'           => 'active',
        ]);

        // ── 3. Buat Ticket Tiers untuk setiap Event ───────────────────────────
        $tierTemplates = [
            [
                'tier_name'       => 'VIP',
                'price'           => 500000.00,
                'capacity'        => 50,
                'remaining_seats' => 50,
            ],
            [
                'tier_name'       => 'Regular',
                'price'           => 0.00,
                'capacity'        => 200,
                'remaining_seats' => 200,
            ],
        ];

        foreach ([$eventOffline, $eventOnline] as $event) {
            foreach ($tierTemplates as $template) {
                TicketTier::create([
                    'id_event'        => $event->id_event,
                    'tier_name'       => $template['tier_name'],
                    'price'           => $template['price'],
                    'capacity'        => $template['capacity'],
                    'remaining_seats' => $template['remaining_seats'],
                ]);
            }
        }
    }
}
