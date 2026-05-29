<?php
$file = 'resources/views/my_tickets.blade.php';
$content = file_get_contents($file);

preg_match('/<style>(.*?)<\/style>/s', $content, $matches);
$styles = isset($matches[1]) ? $matches[1] : '';
$styles = preg_replace('/body\s*\{.*?\}/is', '', $styles);

// My tickets might have scripts
preg_match('/<script>(.*?)<\/script>\s*<\/body>/is', $content, $scriptMatches);
$scripts = isset($scriptMatches[1]) ? $scriptMatches[1] : '';

preg_match('/(<main[\s\S]*?(?:<\/main>|<\/div>))\s*<footer/is', $content, $mainMatches);
if (!isset($mainMatches[1])) {
    // try matching up to script
    preg_match('/(<main[\s\S]*?)<script/is', $content, $mainMatches);
}

$bodyContent = isset($mainMatches[1]) ? $mainMatches[1] : '';

// If bodyContent is empty, just match from <main to end
if (empty($bodyContent)) {
    preg_match('/<main[\s\S]*/is', $content, $mainMatches);
    $bodyContent = isset($mainMatches[0]) ? $mainMatches[0] : '';
    $bodyContent = preg_replace('/<footer[\s\S]*?<\/footer>/is', '', $bodyContent);
    $bodyContent = preg_replace('/<!-- Bottom Nav -->[\s\S]*?<\/div>/is', '', $bodyContent);
    $bodyContent = preg_replace('/<script[\s\S]*?<\/script>/is', '', $bodyContent);
    $bodyContent = preg_replace('/<\/body>[\s\S]*<\/html>/is', '', $bodyContent);
}

$newContent = "@extends('layouts.app')\n\n@section('styles')\n<style>\n$styles\n</style>\n@endsection\n\n@section('content')\n$bodyContent\n@endsection\n";

if ($scripts) {
    $newContent .= "\n@section('scripts')\n<script>\n$scripts\n</script>\n@endsection\n";
}

file_put_contents($file, $newContent);
echo "Updated my_tickets\n";
