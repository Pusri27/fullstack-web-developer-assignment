# BeyondChats Blog Scraper - Backend

Laravel backend API for scraping and managing BeyondChats blog articles.

## Features

- Article scraping from BeyondChats blogs
- CRUD API for article management
- SQLite database for easy development
- RESTful API architecture

## Tech Stack

- **Framework**: Laravel 12.44.0
- **PHP**: 8.2+
- **Database**: SQLite (development)
- **Testing**: PHPUnit

## Setup

### Prerequisites

- PHP >= 8.2
- Composer >= 2.0
- SQLite3

### Installation

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

The API will be available at `http://localhost:8000`

## Development

```bash
# Run all services (from root directory)
composer run dev

# Run tests
php artisan test

# Code formatting
./vendor/bin/pint
```

## API Endpoints

Coming soon in next commits...

## License

MIT
