<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require_once __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$transactions = \App\Models\WalletTransaction::all();
echo "Total transactions: " . $transactions->count() . "\n";
foreach($transactions as $t) {
    echo "ID: {$t->id}, Type: {$t->type}, Status: {$t->status}, Amount: {$t->amount}\n";
}
