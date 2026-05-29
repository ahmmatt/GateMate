<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    if (Schema::hasColumn('users', 'id_event')) {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('id_event');
        });
        echo "SUCCESS: Column id_event dropped.\n";
    } else {
        echo "INFO: Column id_event does not exist.\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . PHP_EOL;
}
