# Deployment Guide - Render + Vercel

## 🚀 Quick Deploy

### Backend: Render (Free)
### Frontend: Vercel (Free)

---

## Backend Deployment (Render)

### Step 1: Create Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select `fullstack-web-developer-assignment`

### Step 3: Configure Service
```
Name: beyondchats-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: PHP
Build Command: composer install --optimize-autoloader --no-dev && php artisan config:cache
Start Command: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Step 4: Environment Variables
Add these in Render dashboard:
```
APP_NAME=BeyondChats Blog Scraper
APP_ENV=production
APP_KEY=base64:your_key_here
APP_DEBUG=false
APP_URL=https://your-app.onrender.com
DB_CONNECTION=sqlite
LOG_CHANNEL=stack
LOG_LEVEL=error
```

**Generate APP_KEY:**
Run locally: `php artisan key:generate --show`

### Step 5: Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for first deployment
- Backend URL: `https://your-app.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Create Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New"** → **"Project"**
2. Import your GitHub repository
3. Select `fullstack-web-developer-assignment`

### Step 3: Configure Build
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Environment Variables
```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Step 5: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- Frontend URL: `https://your-app.vercel.app`

---

## Post-Deployment Configuration

### Update CORS (Backend)
After frontend is deployed, update `backend/config/cors.php`:

```php
'allowed_origins' => [
    'https://your-app.vercel.app',
    'http://localhost:5173', // for local dev
],
```

Then redeploy backend on Render.

### Update Frontend Environment
In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Update `VITE_API_BASE_URL` with your Render backend URL
3. Redeploy frontend

---

## Testing Deployment

### Test Backend API
```bash
# Health check
curl https://your-backend.onrender.com/up

# Articles endpoint
curl https://your-backend.onrender.com/api/articles

# Single article
curl https://your-backend.onrender.com/api/articles/{slug}
```

### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Should see article list
3. Click on article to view details
4. Test comparison view
5. Check citations display

---

## Automatic Deployments

### Render
- Automatically deploys when you push to `main` branch
- View logs in Render dashboard
- Can disable auto-deploy if needed

### Vercel
- Automatically deploys when you push to `main` branch
- Creates preview deployments for other branches
- View deployments in Vercel dashboard

---

## Troubleshooting

### Backend Issues

**Build Fails**
- Check PHP version (8.2+)
- Verify `composer.json` is present
- Check build logs in Render

**500 Internal Server Error**
- Ensure `APP_KEY` is set
- Check if `APP_DEBUG=false`
- View logs: Render Dashboard → Logs

**CORS Errors**
- Update `allowed_origins` in `backend/config/cors.php`
- Include your Vercel URL
- Redeploy backend

**Database Errors**
- SQLite should work out of the box
- Check file permissions
- Ensure `storage/` directory exists

### Frontend Issues

**Build Fails**
- Check Node version (18.x+)
- Verify `package.json` is present
- Check build logs in Vercel

**Blank Page**
- Open browser console
- Check for JavaScript errors
- Verify `VITE_API_BASE_URL` is set

**API Not Loading**
- Check network tab in browser
- Verify backend URL is correct
- Check CORS configuration
- Test backend API directly

**404 on Refresh**
- Already fixed with `vercel.json` rewrites
- If issue persists, check `vercel.json` is in frontend folder

---

## Performance Tips

### Backend (Render)
- ✅ Config caching enabled (`php artisan config:cache`)
- ✅ Route caching enabled (`php artisan route:cache`)
- ⚠️ Free tier sleeps after 15 min inactivity
- 💡 First request after sleep may be slow

### Frontend (Vercel)
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Asset optimization
- ✅ No cold starts

---

## Cost

### Render (Free Tier)
- ✅ 750 hours/month free
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min inactivity

### Vercel (Hobby Plan - Free)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

**Total: FREE** ✨

---

## Monitoring

### Render
- View logs in real-time
- Monitor service metrics
- Set up alerts

### Vercel
- View deployment history
- Analytics dashboard
- Performance insights

---

## Custom Domains (Optional)

### Render
1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records

### Vercel
1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records

---

## Useful Commands

### Local Testing
```bash
# Backend
cd backend
php artisan serve

# Frontend
cd frontend
npm run dev
```

### Production Build Test
```bash
# Frontend
cd frontend
npm run build
npm run preview
```

### Generate New APP_KEY
```bash
cd backend
php artisan key:generate --show
```

---

## Support Links

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Deployment**: https://laravel.com/docs/deployment
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## Deployment Checklist

### Before Deploy
- [ ] Test locally
- [ ] Run tests (`php artisan test`)
- [ ] Check environment variables
- [ ] Update CORS configuration
- [ ] Generate APP_KEY

### After Deploy
- [ ] Test all API endpoints
- [ ] Verify frontend loads
- [ ] Check article list
- [ ] Test article detail page
- [ ] Verify comparison view
- [ ] Check citations display
- [ ] Test on mobile
- [ ] Monitor logs

---

**🎉 Your app is now live!**
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-app.vercel.app`
