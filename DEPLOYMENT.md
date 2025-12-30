# Vercel Deployment Guide

## 🚀 Deploy to Vercel (Full-Stack)

This guide will help you deploy both frontend and backend to Vercel.

### Prerequisites
- Vercel account (free tier works)
- GitHub repository connected to Vercel

---

## Option 1: Frontend Only on Vercel (Recommended)

### Step 1: Deploy Frontend

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Project**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
   (Update this after backend is deployed)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be at: `https://your-app.vercel.app`

### Step 2: Deploy Backend (Use Railway/Render)

For Laravel backend, it's better to use:
- **Railway**: https://railway.app (Recommended)
- **Render**: https://render.com
- **Heroku**: https://heroku.com

**Why?** Laravel needs persistent storage and database, which Vercel serverless doesn't support well.

### Step 3: Update Frontend Environment

After backend is deployed, update Vercel environment variable:
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

Then redeploy frontend.

---

## Option 2: Monorepo on Vercel (Advanced)

### Configuration

The project is already configured with `vercel.json` at root for monorepo deployment.

### Deploy Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   # Frontend
   vercel env add VITE_API_BASE_URL production
   
   # Backend
   vercel env add APP_KEY production
   vercel env add APP_ENV production
   vercel env add APP_DEBUG production
   ```

---

## Post-Deployment Checklist

### Frontend
- ✅ Build successful
- ✅ Environment variables set
- ✅ API URL points to backend
- ✅ CORS configured on backend

### Backend
- ✅ Database connected
- ✅ APP_KEY generated
- ✅ CORS allows frontend domain
- ✅ API routes working

---

## Testing Deployment

### Test Frontend
1. Visit your Vercel URL
2. Check article list loads
3. Test article detail page
4. Verify comparison view
5. Check citations display

### Test Backend API
```bash
# Test articles endpoint
curl https://your-backend.railway.app/api/articles

# Test single article
curl https://your-backend.railway.app/api/articles/{slug}
```

---

## Troubleshooting

### Frontend Issues
- **Build fails**: Check Node version (use 18.x)
- **Blank page**: Check browser console for errors
- **API errors**: Verify VITE_API_BASE_URL is correct

### Backend Issues
- **500 errors**: Check APP_KEY is set
- **CORS errors**: Update `backend/config/cors.php`
- **Database errors**: Verify database connection

---

## Automatic Deployments

Vercel automatically deploys when you push to:
- **main branch** → Production
- **other branches** → Preview deployments

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain
5. Update DNS records as instructed

---

## Monitoring

### Vercel Analytics
- View deployment logs
- Monitor performance
- Check error rates

### Backend Monitoring
- Use Railway/Render dashboard
- Check application logs
- Monitor resource usage

---

## Cost Estimation

### Vercel (Free Tier)
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

### Railway (Free Tier)
- ✅ $5 free credit/month
- ✅ 500 hours runtime
- ✅ Automatic deployments

**Total**: Free for development/portfolio projects!

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- GitHub Issues: Create issue in your repo
