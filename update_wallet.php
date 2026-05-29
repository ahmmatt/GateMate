<?php
$file = 'resources/views/wallet/index.blade.php';
$content = file_get_contents($file);

preg_match('/<style>(.*?)<\/style>/s', $content, $matches);
$styles = isset($matches[1]) ? $matches[1] : '';
$styles = preg_replace('/body\s*\{.*?\}/is', '', $styles);

preg_match('/<script>(.*?)<\/script>\s*<\/body>/s', $content, $scriptMatches);
$scripts = isset($scriptMatches[1]) ? $scriptMatches[1] : '';

preg_match('/(<main[\s\S]*?)<script>/is', $content, $mainMatches);
$bodyContent = isset($mainMatches[1]) ? $mainMatches[1] : '';

$bodyContent = preg_replace('/<footer[\s\S]*?<\/footer>/is', '', $bodyContent);
$bodyContent = preg_replace('/<!-- Mobile Bottom Navigation -->[\s\S]*?<\/div>/is', '', $bodyContent);

$newContent = "@extends('layouts.app')\n\n@section('styles')\n<style>\n$styles\n</style>\n@endsection\n\n@section('scripts')\n<script src=\"https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js\"></script>\n<script type=\"text/javascript\" src=\"https://app.sandbox.midtrans.com/snap/snap.js\" data-client-key=\"{{ config('services.midtrans.client_key') }}\"></script>\n<script>\n$scripts\n</script>\n@endsection\n\n@section('content')\n$bodyContent\n@endsection\n";

file_put_contents($file, $newContent);
echo "Updated wallet\n";
