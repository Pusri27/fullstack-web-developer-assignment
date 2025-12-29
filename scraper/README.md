# BeyondChats Article Enhancer

NodeJS automation script to enhance BeyondChats articles using Google Search and LLM (Gemini).

## Features

- Fetch articles from Laravel backend API
- Google Search for top-ranking articles
- Extract content from top results
- Enhance articles using Gemini LLM
- Add citations to enhanced articles
- Update articles back to database

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Laravel backend API running
- Google Gemini API key

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
# Laravel Backend API
API_BASE_URL=http://localhost:8000/api

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

## Usage

```bash
# Run the enhancement script
npm start

# Or
npm run enhance
```

## How It Works

1. **Fetch Articles**: Get articles from Laravel API
2. **Google Search**: Search for each article title
3. **Extract Content**: Scrape top 2 ranking articles
4. **LLM Enhancement**: Use Gemini to improve article
5. **Add Citations**: Include reference links
6. **Update Database**: Save enhanced version via API

## Dependencies

- `axios` - HTTP client for API calls
- `cheerio` - HTML parsing and scraping
- `dotenv` - Environment variable management
- `@google/generative-ai` - Google Gemini LLM integration

## License

MIT
