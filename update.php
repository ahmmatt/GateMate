<?php
$files = [
    'resources/views/admin/dashboard.blade.php',
    'resources/views/superadmin/dashboard.blade.php',
    'resources/views/tenant/dashboard.blade.php',
    'resources/views/wallet/index.blade.php',
    'resources/views/my_tickets.blade.php'
];

foreach ($files as $file) {
    if (!file_exists($file)) continue;
    $content = file_get_contents($file);

    if (strpos($content, "@extends('layouts.app')") !== false) {
        continue;
    }

    preg_match('/<style>(.*?)<\/style>/s', $content, $matches);
    $styles = isset($matches[1]) ? $matches[1] : '';
    
    $styles = preg_replace('/body\s*\{.*?\}/is', '', $styles);
    $styles = preg_replace('/body::before\s*\{.*?\}/is', '', $styles);
    $styles = preg_replace('/html,body\s*\{.*?\}/is', '', $styles);
    $styles = preg_replace('/--bg:[^;]+;/is', '', $styles);

    preg_match('/<script[\s\S]*?>(.*?)<\/script>/s', $content, $scriptMatches);
    $scripts = isset($scriptMatches[1]) ? $scriptMatches[1] : '';

    if (preg_match('/<\/nav>\s*(<div.*)/is', $content, $bodyMatches)) {
        $bodyContent = $bodyMatches[1];
        
        $bodyContent = preg_replace('/<script[\s\S]*?<\/script>/is', '', $bodyContent);
        $bodyContent = preg_replace('/<\/body>[\s\S]*<\/html>/is', '', $bodyContent);
        
        $bodyContent = str_replace('bg-gray-900', 'bg-transparent', $bodyContent);
        
        $newContent = "@extends('layouts.app')\n\n@section('styles')\n<style>\n$styles\n</style>\n@endsection\n\n@section('content')\n$bodyContent\n@endsection\n";
        
        if ($scripts) {
            $newContent .= "\n@section('scripts')\n<script>\n$scripts\n</script>\n@endsection\n";
        }
        
        file_put_contents($file, $newContent);
        echo "Updated $file\n";
    }
}
