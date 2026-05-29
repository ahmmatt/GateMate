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

    # Replace Finance / account_balance_wallet links
    content = re.sub(
        r'(<a[^>]*href=")(#)("[^>]*>\s*<span[^>]*>account_balance_wallet</span>\s*(?:<span[^>]*>)?\s*Finance\s*(?:</span>)?\s*</a>)',
        r"\1{{ route('admin.finance') }}\3",
        content,
        flags=re.IGNORECASE
    )

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {file_path}")

print("done patching loose nav links 3")
