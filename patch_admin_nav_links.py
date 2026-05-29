import os
import re

base_dir = r'd:\laragon\www\JVC26\gatemate\resources\views\admin'

files_to_check = []
for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.blade.php'):
            files_to_check.append(os.path.join(root, f))

for file_path in files_to_check:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Dashboard
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span[^>]*>\s*Dashboard\s*</span>)',
        r"\1{{ route('admin.dashboard') }}\3",
        content
    )
    
    # Event Saya
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span[^>]*>\s*Event(s)? Saya\s*</span>)',
        r"\1{{ route('admin.events.index') }}\3",
        content
    )
    
    # Keuangan
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span[^>]*>\s*Keuangan\s*</span>)',
        r"\1{{ route('admin.finance') }}\3",
        content
    )
    
    # Scanner
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>[^<]*</span>\s*<span[^>]*>\s*Scanner\s*</span>)',
        r"\1{{ route('admin.scanner') }}\3",
        content
    )

    # Mobile nav Keuangan
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>payments</span>\s*<span[^>]*>Keuangan</span>)',
        r"\1{{ route('admin.finance') }}\3",
        content
    )
    
    # Mobile nav Scanner
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>qr_code_scanner</span>\s*<span[^>]*>Scanner</span>)',
        r"\1{{ route('admin.scanner') }}\3",
        content
    )
    
    # Mobile nav Dashboard / Home
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>home</span>\s*<span[^>]*>Home</span>)',
        r"\1{{ route('admin.dashboard') }}\3",
        content
    )

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {file_path}")

print("done patching nav links")
