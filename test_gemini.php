<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$key = env('GEMINI_API_KEY');
$res = Illuminate\Support\Facades\Http::get('https://generativelanguage.googleapis.com/v1beta/models?key=' . $key);

if ($res->failed()) {
    echo "FAILED: " . $res->body();
} else {
    print_r(array_column($res->json('models') ?? [], 'name'));
}
