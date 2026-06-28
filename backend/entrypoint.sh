#!/bin/bash
set -e

# Berikan akses Tulis ke folder storage dan bootstrap/cache kepada user Apache (www-data)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Jalankan cache configuration jika .env.production / config tersedia di environment
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Eksekusi command utama (CMD dari Dockerfile, biasanya apache2-foreground)
exec "$@"
