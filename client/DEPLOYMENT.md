# Deployment Guide

This guide explains how to deploy the React Dashboard to different platforms.

## Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# Application base URL (for routing)
VITE_APP_BASE_URL=/

# API base URL (for backend API calls)
VITE_API_BASE_URL=https://your-backend-domain.com

# Application name
VITE_APP_NAME=React Dashboard

# Application version
VITE_APP_VERSION=1.0.0
```

## Deployment Platforms

### 1. Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_APP_BASE_URL`: `/`
   - `VITE_API_BASE_URL`: Your backend URL
3. Build command: `npm run build`
4. Output directory: `dist`

### 2. Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### 3. Render.com

1. Create a new Static Site
2. Connect your GitHub repository
3. Set environment variables
4. Build command: `chmod +x build.sh && ./build.sh`
5. Publish directory: `dist`

### 4. GitHub Pages

1. Set environment variables in GitHub repository settings
2. Use GitHub Actions for deployment
3. Build command: `npm run build`
4. Deploy to `gh-pages` branch

## Build Commands

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm install
npm run build
```

### Using Build Script
```bash
chmod +x build.sh
./build.sh
```

## Important Notes

1. **API URL**: Make sure your backend is deployed and accessible
2. **CORS**: Ensure your backend allows requests from your frontend domain
3. **Environment Variables**: All VITE_* variables are embedded in the build
4. **Base URL**: Set correctly if deploying to a subdirectory

## Troubleshooting

### Build Errors
- Check Node.js version (recommended: 18.x or 20.x)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Runtime Errors
- Check environment variables are set correctly
- Verify API endpoints are accessible
- Check browser console for errors

### CORS Issues
- Ensure backend allows your frontend domain
- Check API base URL is correct
- Verify HTTPS/HTTP protocol matches 