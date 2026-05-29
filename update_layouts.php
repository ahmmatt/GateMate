<?php
\ = [
    'resources/views/admin/dashboard.blade.php',
    'resources/views/superadmin/dashboard.blade.php',
    'resources/views/tenant/dashboard.blade.php',
    'resources/views/wallet/index.blade.php',
    'resources/views/my_tickets.blade.php'
];

foreach (\ as \) {
    if (!file_exists(\)) continue;
    \ = file_get_contents(\);

    // If it already extends layouts.app, skip
    if (strpos(\, '@extends(\'layouts.app\')') !== false) {
        continue;
    }

    // Extract the style block
    preg_match('/<style>(.*?)<\/style>/s', \, \);
    \ = isset(\[1]) ? \[1] : '';
    
    // Remove the background colors from the body style
    \ = preg_replace('/body\s*\{.*?\}/is', '', \);
    \ = preg_replace('/body::before\s*\{.*?\}/is', '', \);
    \ = preg_replace('/html,body\s*\{.*?\}/is', '', \);
    \ = preg_replace('/--bg:[^;]+;/', '', \);
    \ = str_replace('bg-gray-900', 'bg-transparent', \); // Tailwind class
    \ = str_replace('dark-theme', '', \);

    // Extract the scripts
    preg_match('/<script>(.*?)<\/script>/s', \, \);
    \ = isset(\[1]) ? \[1] : '';

    // Remove everything before <div class="page"> or <div class="pos-layout"> or <div class="page-frame"> or whatever main container
    // We can just find the end of the <nav> block
    if (preg_match('/<\/nav>\s*(<div.*)/is', \, \)) {
        \ = \[1];
        
        // Remove trailing scripts and body/html tags
        \ = preg_replace('/<script[\s\S]*?<\/script>/is', '', \);
        \ = preg_replace('/<\/body>[\s\S]*<\/html>/is', '', \);
        
        // Also remove hardcoded dark mode wrappers like <div class="bg-gray-900 ...">
        \ = str_replace('bg-gray-900', 'bg-transparent', \);
        
        // Build the new content
        \ = "@extends('layouts.app')\n\n@section('styles')\n<style>\n\\n</style>\n@endsection\n\n@section('content')\n\\n@endsection\n";
        
        if (\) {
            \ .= "\n@section('scripts')\n<script>\n\\n</script>\n@endsection\n";
        }
        
        file_put_contents(\, \);
        echo "Updated \\n";
    }
}
