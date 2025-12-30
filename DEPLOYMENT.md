# Deployment Guide

## Backend Deployment (Railway)

### Prerequisites
- Railway account
- GitHub repository connected

### Steps

1. **Create New Project on Railway**
   ```bash
   # Visit https://railway.app
   # Click "New Project" → "Deploy from GitHub repo"
   # Select your repository
   ```

2. **Configure Environment Variables**
   ```
   APP_NAME=BeyondChats Blog Scraper
   APP_ENV=production
   APP_KEY=base64:your_key_here
   APP_DEBUG=false
   APP_URL=https://your-app.railway.app
   
   DB_CONNECTION=sqlite
   
   LOG_CHANNEL=stack
   LOG_LEVEL=error
   ```

3. **Generate APP_KEY**
   ```bash
   php artisan key:generate --show
   ```

4. **Deploy**
   - Railway will auto-deploy on push to main branch
   - Backend URL: `https://your-app.railway.app`

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository connected

### Steps

1. **Create New Project on Vercel**
   ```bash
   # Visit https://vercel.com
   # Click "Add New" → "Project"
   # Import from GitHub
   ```

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Configure Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

4. **Deploy**
   - Vercel will auto-deploy on push to main branch
   - Frontend URL: `https://your-app.vercel.app`

---

## Post-Deployment

### Update CORS (Backend)
Update `backend/config/cors.php`:
```php
'allowed_origins' => [
    'https://your-app.vercel.app',
    'http://localhost:5173', // for local development
],
```

### Test Deployment
1. Visit frontend URL
2. Check article list loads
3. Test article detail page
4. Verify comparison view works
5. Check citations display

---

## Troubleshooting

### Backend Issues
- Check Railway logs
- Verify environment variables
- Ensure database is accessible
- Check APP_KEY is set

### Frontend Issues
- Check Vercel logs
- Verify API URL is correct
- Check CORS configuration
- Test API endpoints directly

---

## Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

### Vercel
- View deployment logs
- Monitor analytics
- Check performance metrics
