# Quick Start Guide - TikTok API Demo

Get the demo running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- TikTok Developer credentials (from developer.tiktok.com)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:
```
TIKTOK_CLIENT_KEY=abc123...
TIKTOK_CLIENT_SECRET=xyz789...
REDIRECT_URI=http://localhost:3000/auth/tiktok/callback
```

### 3. Add Callback URL to TikTok Console

In TikTok Developer Console → Your App → Settings:
- Add Redirect URL: `http://localhost:3000/auth/tiktok/callback`

### 4. Start the Server
```bash
npm start
```

Server runs at: `http://localhost:3000`

## Testing the OAuth Flow

1. Open browser: `http://localhost:3000`
2. Click "Sign in with TikTok"
3. Authorize on TikTok's OAuth screen
4. You'll see your profile and dashboard
5. Test video upload or direct post

## Deploying to Render

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Create Render Service
- Go to render.com
- Click "New Web Service"
- Connect GitHub repo
- Set Environment: Node
- Render will auto-detect and deploy

### 3. Add Environment Variables
In Render dashboard → Environment:
```
TIKTOK_CLIENT_KEY=your_key
TIKTOK_CLIENT_SECRET=your_secret
REDIRECT_URI=https://your-app.onrender.com/auth/tiktok/callback
SESSION_SECRET=generate_random_string
```

### 4. Update TikTok Console
Add your Render URL to OAuth Redirect URLs:
```
https://your-app.onrender.com/auth/tiktok/callback
```

Your app is live!

## Project Structure

```
.
├── server.js          ← Main application
├── package.json       ← Dependencies
├── .env              ← Your credentials (create from .env.example)
├── README.md         ← Full documentation
└── uploads/          ← Temp video files
```

## Key Routes

| URL | Purpose |
|-----|---------|
| `/` | Login page |
| `/auth/tiktok` | Start OAuth |
| `/auth/tiktok/callback` | OAuth callback |
| `/dashboard` | Main app (after login) |
| `/logout` | Sign out |

## Troubleshooting

**"Can't find module 'express'"**
```bash
npm install
```

**"Invalid client credentials"**
- Check TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in .env
- Verify they match TikTok Developer Console

**"Redirect URI mismatch"**
- Ensure REDIRECT_URI in .env matches TikTok Console settings
- For local: `http://localhost:3000/auth/tiktok/callback`
- For Render: `https://your-app.onrender.com/auth/tiktok/callback`

**Video upload fails**
- Check file is MP4 or MOV
- File must be under 100MB
- Ensure you're logged in first

## Recording Demo Video

Perfect for dev review submissions:

1. Open `http://localhost:3000` in clean browser
2. Use Loom, OBS, or ScreenFlow to record
3. Show:
   - Click login button
   - OAuth redirect/login flow
   - Dashboard with profile
   - Video upload form
   - Submit and success message
4. Export and submit to TikTok review

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check TikTok docs: https://developers.tiktok.com
- Customize UI in `server.js` template functions
- Add database for multi-user support

---

Happy building! 🚀
