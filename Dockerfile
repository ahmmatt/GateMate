FROM php:8.3-apache

# Set direktori kerja
WORKDIR /var/www/html

# Install dependensi sistem yang dibutuhkan
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install ekstensi PHP yang dibutuhkan Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Ubah DocumentRoot Apache ke folder /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Aktifkan mod_rewrite Apache (wajib untuk Laravel routing)
RUN a2enmod rewrite

# Ubah Port Apache ke 8080 sesuai syarat Cloud Run
RUN sed -i 's/80/8080/g' /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf

# Copy source code ke dalam image
COPY . .

# Copy entrypoint.sh dan berikan akses execute
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Install dependensi PHP (production mode)
# Catatan: node_modules / vendor sebaiknya ada di .dockerignore
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Buka port 8080
EXPOSE 8080

# Jalankan skrip entrypoint sebelum memulai Apache
ENTRYPOINT ["entrypoint.sh"]
CMD ["apache2-foreground"]
