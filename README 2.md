# BeyondChats Article Enhancement System

A full-stack web application that scrapes blog articles, enhances them using AI, and displays them in a modern interface.

## 📋 Assignment Overview

This project is built for BeyondChats Full Stack Web Developer Intern position, consisting of:

1. **Phase 1**: Laravel backend with article scraping and CRUD APIs
2. **Phase 2**: NodeJS script for AI-powered article enhancement using Google Search + LLM
3. **Phase 3**: React frontend for displaying original and enhanced articles

## 📁 Project Structure

```
├── backend/          # Laravel API
├── scraper/          # NodeJS Enhancement Script
├── frontend/         # React Application
└── docs/             # Documentation & Diagrams
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm/yarn

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Scraper Setup
```bash
cd scraper
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run enhance
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Architecture Diagram](docs/architecture.md)

## 🔗 Live Links

- **Frontend**: Coming Soon
- **Backend API**: Coming Soon

## 🛠️ Tech Stack

- **Backend**: Laravel 11, SQLite/PostgreSQL
- **Scraper**: Node.js, Cheerio, Google Gemini API
- **Frontend**: React, Vite, Tailwind CSS
- **Deployment**: Railway (backend), Vercel (frontend)

## 📝 License

MIT
