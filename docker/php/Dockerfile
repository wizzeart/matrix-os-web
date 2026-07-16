FROM php:8.3-fpm-alpine

# En cuanto PHP 8.4 estable esté disponible en docker hub, se actualizará la imagen base.
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    linux-headers \
    $PHPIZE_DEPS

# Instalar extensiones necesarias para DDD, CQRS, Websockets
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd sockets

# Instalar Redis extension
RUN pecl install redis \
    && docker-php-ext-enable redis

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

EXPOSE 9000
CMD ["php-fpm"]
