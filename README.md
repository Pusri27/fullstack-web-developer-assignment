# BeyondChats Full Stack Web Developer Assignment

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12.x-red?logo=laravel)
![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Status](https://img.shields.io/badge/Status-Complete-success)

**A full-stack monorepo application for article management with AI-powered content enhancement**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Deployment](#deployment) • [API Documentation](#api-documentation)

</div>

---

## 📋 Overview

This project is a comprehensive full-stack application that scrapes BeyondChats blog articles, stores them in a database, enhances them using Google Gemini LLM, and provides a beautiful React frontend for viewing and comparing original vs enhanced content.

### Key Features

- 🔍 **Blog Scraping**: Automated scraping of BeyondChats blog articles
- 🤖 **AI Enhancement**: Article enhancement using Google Gemini LLM
- 🔄 **Content Comparison**: Side-by-side view of original vs enhanced content
- 📚 **Citation Management**: Automatic citation generation and display
- 🎨 **Modern UI**: Beautiful, animated React interface
- 🚀 **Production Ready**: Deployed on Render + Vercel

---

## 🎯 Features

### Backend (Laravel + NodeJS)
- ✅ RESTful API with complete CRUD operations
- ✅ Article database with SQLite
- ✅ Blog scraper service using DOMDocument
- ✅ Google Search integration for top-ranking articles
- ✅ Content extraction from external sources
- ✅ LLM integration with Google Gemini
- ✅ Automated enhancement pipeline
- ✅ Citation formatting and management

### Frontend (React + Vite)
- ✅ Article list with pagination and filtering
- ✅ Article detail page with rich content display
- ✅ Original vs Enhanced comparison view
- ✅ Smooth animations and transitions
- ✅ Responsive design for all devices
- ✅ Error handling and loading states

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12.x (PHP 8.2+)
- **Database**: SQLite (dev) / MySQL (prod)
- **Testing**: PHPUnit
- **HTTP Client**: Guzzle
- **Parser**: DOMDocument + XPath

### Scraper & Automation
- **Runtime**: Node.js 18+
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **LLM**: Google Gemini API
- **Package Manager**: npm

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with animations

### DevOps
- **Backend Hosting**: Render (Free)
- **Frontend Hosting**: Vercel (Free)
- **Version Control**: Git + GitHub
- **CI/CD**: Automatic deployments

---

## 🚀 Getting Started

### Prerequisites

```bash
# Backend
PHP >= 8.2
Composer
SQLite

# Scraper
Node.js >= 18
npm >= 9

# Frontend
Node.js >= 18
npm >= 9
```

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/Pusri27/fullstack-web-developer-assignment.git
   cd fullstack-web-developer-assignment
   ```

2. **Setup Backend**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate
   php artisan serve
   ```

3. **Setup Scraper (Optional)**
   ```bash
   cd scraper
   npm install
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   npm start
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Running the Application

**Backend API**: http://localhost:8000
**Frontend**: http://localhost:5173

---

## 📖 Usage

### Scrape Articles
```bash
cd backend
php artisan scrape:beyondchats
```

### Enhance Articles with AI
```bash
cd scraper
npm start
# Or: npm start enhance 10
```

### View Articles
Open http://localhost:5173 in your browser

---

## 🌐 Deployment

### Production URLs
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com

### Deploy Your Own

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

**Backend to Render:**
1. Fork this repository
2. Go to https://render.com
3. Create new Web Service
4. Connect your repo, select `backend` directory
5. Add environment variables
6. Deploy!

**Frontend to Vercel:**
1. Go to https://vercel.com
2. Import your repository
3. Set root directory to `frontend`
4. Add `VITE_API_BASE_URL` env variable
5. Deploy!

---

## 📚 API Documentation

### Base URL
```
Production: https://your-backend.onrender.com/api
Development: http://localhost:8000/api
```

### Endpoints

#### Get All Articles
```http
GET /api/articles
```

Query Parameters:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 15)
- `is_enhanced` - Filter by enhancement status (0|1)
- `search` - Search by title
- `sort_by` - Sort field (default: published_at)
- `sort_order` - Sort direction (asc|desc)

#### Get Single Article
```http
GET /api/articles/{slug}
```

#### Get Enhanced Content
```http
GET /api/articles/{slug}/enhanced
```

#### Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "slug": "article-slug",
  "url": "https://example.com/article",
  "content": "Article content..."
}
```

#### Update Article
```http
PUT /api/articles/{slug}
Content-Type: application/json

{
  "title": "Updated Title",
  "enhanced_content": "Enhanced content..."
}
```

#### Delete Article
```http
DELETE /api/articles/{slug}
```

For complete API documentation, see [docs/API.md](./docs/API.md)

---

## 🏗️ Project Structure

```
fullstack-web-developer-assignment/
├── backend/              # Laravel backend
│   ├── app/
│   │   ├── Console/      # Artisan commands
│   │   ├── Http/         # Controllers, Requests, Resources
│   │   ├── Models/       # Eloquent models
│   │   └── Services/     # Business logic
│   ├── database/
│   │   ├── factories/    # Model factories
│   │   └── migrations/   # Database migrations
│   ├── routes/           # API routes
│   └── tests/            # Feature tests
├── scraper/              # NodeJS automation
│   ├── index.js          # Main entry point
│   ├── apiClient.js      # Laravel API client
│   ├── googleSearcher.js # Google search
│   ├── contentExtractor.js
│   ├── articleEnhancer.js # Gemini LLM
│   ├── enhancementPipeline.js
│   └── citationFormatter.js
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   └── public/           # Static assets
└── docs/                 # Documentation
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

**Coverage**: 11 tests, 65 assertions ✅

### Test Categories
- CRUD operations
- Validation
- Filtering & searching
- Pagination
- Enhanced content

---

## 🎨 Screenshots

### Article List
![Article List](docs/screenshots/article-list.png)

### Article Detail & Comparison
![Comparison View](docs/screenshots/comparison-view.png)

---

## 📝 Development Workflow

This project follows a structured commit workflow across 6 sessions:

1. **Session 1**: Laravel Backend Setup
2. **Session 2**: CRUD API Implementation
3. **Session 3**: NodeJS Automation & LLM
4. **Session 4**: React Frontend
5. **Session 5**: Deployment
6. **Session 6**: Documentation & Polish

Total: 30 commits showcasing professional development practices ✨

---

## 🤝 Contributing

This is an assignment project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is created for the BeyondChats Full Stack Web Developer Intern assignment.

---

## 👤 Author

**Pusri27**

- GitHub: [@Pusri27](https://github.com/Pusri27)
- Repository: [fullstack-web-developer-assignment](https://github.com/Pusri27/fullstack-web-developer-assignment)

---

## 🙏 Acknowledgments

- BeyondChats for the assignment opportunity
- Laravel community for excellent documentation
- React & Vite teams for amazing developer experience
- Google Gemini for LLM capabilities

---

<div align="center">

**Made with ❤️ for BeyondChats**

[⬆ Back to Top](#beyondchats-full-stack-web-developer-assignment)

</div>
