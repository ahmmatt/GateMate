<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require_once __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$adminId = \App\Models\User::where('role', 'superadmin')->value('id_user') ?? 3;

\App\Models\AuditLog::create([
    'admin_id' => $adminId,
    'action' => 'Update Biaya Platform',
    'target_type' => 'Settings',
    'target_name' => 'Biaya Layanan',
    'created_at' => now()->subHours(2)
]);

\App\Models\AuditLog::create([
    'admin_id' => $adminId,
    'action' => 'Verifikasi Organizer',
    'target_type' => 'Organizer',
    'target_name' => 'TechEvent ID',
    'created_at' => now()->subMinutes(15)
]);

echo "Dummy logs created successfully.\n";
