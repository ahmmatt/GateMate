import re

file_path = r'd:\laragon\www\JVC26\gatemate\routes\web.php'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add use statement
if 'use App\Http\Controllers\Admin\FinanceController;' not in content:
    content = content.replace('use App\Http\Controllers\Admin\DashboardController;', 
                              'use App\Http\Controllers\Admin\DashboardController;\nuse App\Http\Controllers\Admin\FinanceController;')

# Add routes
routes_code = """
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Finance / Keuangan Global Admin
        Route::get('/finance', [FinanceController::class, 'index'])->name('finance');
        Route::post('/finance/withdraw', [FinanceController::class, 'withdraw'])->name('finance.withdraw');
"""

content = re.sub(
    r"// Dashboard\s+Route::get\('/dashboard', \[DashboardController::class, 'index'\]\)->name\('dashboard'\);",
    routes_code.strip(),
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done patch routes")
