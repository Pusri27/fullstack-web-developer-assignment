# Setup Guide

Complete setup instructions for the Full Stack Web Developer Assignment project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed on your system:

### Required Software

1. **PHP** >= 8.2
   ```bash
   php --version
   ```

2. **Composer** >= 2.0
   ```bash
   composer --version
   ```

3. **Node.js** >= 18.x
   ```bash
   node --version
   ```

4. **npm** >= 9.x
   ```bash
   npm --version
   ```

5. **Git**
   ```bash
   git --version
   ```

### Optional but Recommended

- **MySQL** or **PostgreSQL** (for production)
- **Redis** (for caching and queues)
- **Docker** (for containerized development)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Pusri27/fullstack-web-developer-assignment.git
cd fullstack-web-developer-assignment
```

### 2. Install Root Dependencies

```bash
npm install
```

This will install:
- `concurrently` - For running multiple processes simultaneously

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Database

Edit `.env` file and configure your database settings:

```env
DB_CONNECTION=sqlite
# For SQLite (default - easiest for development)
# DB_DATABASE=/absolute/path/to/database.sqlite

# OR for MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

### 6. Create Database (SQLite)

```bash
touch database/database.sqlite
```

### 7. Run Migrations

```bash
php artisan migrate
```

### 8. Seed Database (Optional)

```bash
php artisan db:seed
```

### 9. Build Frontend Assets

```bash
npm run build
```

## Frontend Setup

> **Note**: Frontend implementation coming in next session.

Frontend setup instructions will be added once the frontend framework is selected and implemented.

## Running the Application

### Option 1: Run All Services (Recommended)

From the **root directory**:

```bash
npm run dev
```

This will start:
- Laravel development server (port 8000)
- Queue worker
- Log viewer (Pail)
- Vite development server
- Frontend server (when implemented)

### Option 2: Run Backend Only

From the **backend directory**:

```bash
composer run dev
```

Or manually:

```bash
php artisan serve
```

### Option 3: Run Individual Services

```bash
# Laravel server
php artisan serve

# Queue worker
php artisan queue:listen

# Vite dev server
npm run dev

# Log viewer
php artisan pail
```

## Accessing the Application

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/documentation (if configured)
- **Frontend**: Coming soon

## Testing

### Run All Tests

From backend directory:

```bash
composer test
```

Or:

```bash
php artisan test
```

### Run Specific Test Suite

```bash
# Feature tests
php artisan test --testsuite=Feature

# Unit tests
php artisan test --testsuite=Unit
```

### Run with Coverage

```bash
php artisan test --coverage
```

## Code Quality

### Run Laravel Pint (Code Formatter)

```bash
cd backend
./vendor/bin/pint
```

Or:

```bash
composer run pint
```

## Troubleshooting

### Common Issues

#### 1. Permission Errors

```bash
# Fix storage and cache permissions
cd backend
chmod -R 775 storage bootstrap/cache
```

#### 2. Composer Install Fails

```bash
# Clear composer cache
composer clear-cache

# Try install again
composer install --no-cache
```

#### 3. Migration Errors

```bash
# Reset database and re-run migrations
php artisan migrate:fresh

# With seeding
php artisan migrate:fresh --seed
```

#### 4. Port Already in Use

```bash
# Use different port
php artisan serve --port=8001
```

#### 5. Node Modules Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

If you encounter issues not covered here:

1. Check the [Laravel Documentation](https://laravel.com/docs)
2. Review error logs in `backend/storage/logs/`
3. Check the project's GitHub Issues
4. Refer to the [Architecture Documentation](ARCHITECTURE.md)

## Next Steps

After successful setup:

1. Review the [Architecture Documentation](ARCHITECTURE.md)
2. Check the [API Documentation](API.md)
3. Start developing features
4. Run tests regularly
5. Keep dependencies updated

---

**Happy Coding! 🚀**
