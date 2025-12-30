# BeyondChats Article Manager - Frontend

React frontend for managing and viewing BeyondChats articles with enhanced content.

## Features

- 📝 Article list with pagination
- 🔍 Article detail view
- 🔄 Original vs Enhanced content comparison
- 📚 Citation display
- ⚡ Fast and responsive UI
- 🎨 Modern design with animations

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with animations

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Laravel backend API running

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT
