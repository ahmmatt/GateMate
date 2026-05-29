<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $result = Illuminate\Support\Facades\DB::statement('ALTER TABLE wallet_transactions MODIFY COLUMN type VARCHAR(50)');
    echo "SUCCESS: Column type changed to VARCHAR(50). Result: " . ($result ? 'true' : 'false') . PHP_EOL;
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
}
