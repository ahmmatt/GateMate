<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Akun GateMate Disetujui</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #ebebeb;">
        <h2 style="color: #F04E37; text-align: center;">GateMate</h2>
        <h3 style="color: #333333;">Halo, {{ $user->full_name }}!</h3>
        <p style="color: #555555; line-height: 1.6;">
            Selamat! Akun penyelenggara (organizer) Anda untuk <strong>{{ $user->organization_name }}</strong> telah disetujui oleh tim kami. Anda sekarang dapat mulai mengelola event, memantau penjualan tiket, dan menggunakan semua fitur unggulan GateMate.
        </p>
        <p style="color: #555555; line-height: 1.6;">
            Berikut adalah detail login akun Anda yang telah digenerate otomatis oleh sistem:
        </p>
        <div style="background-color: #f5f5f7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #333333;"><strong>Email:</strong> {{ $user->email }}</p>
            <p style="margin: 5px 0 0; color: #333333;"><strong>Password:</strong> {{ $password }}</p>
        </div>
        <p style="color: #555555; line-height: 1.6;">
            Mohon jaga kerahasiaan informasi login ini. Anda dapat mengubah password ini di dalam dashboard pengaturan akun setelah berhasil login.
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/login" style="background-color: #F04E37; color: white; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-weight: bold; display: inline-block;">Login ke Dashboard</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
        <p style="color: #999999; font-size: 12px; text-align: center;">
            &copy; {{ date('Y') }} GateMate. All rights reserved.
        </p>
    </div>
</body>
</html>
