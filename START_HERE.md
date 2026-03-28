# START HERE - TikTok API Demo Setup Guide

Welcome! Follow this guide to get your TikTok integration demo up and running.

## What You Have

A complete Node.js application that demonstrates:
- TikTok OAuth 2.0 Login Kit
- Video upload and publishing
- User profile management
- Content Posting API integration

Ready to deploy to Render free tier.

## Quick Decision Tree

### I want to start NOW (5 minutes)
→ Follow **QUICKSTART.md**

### I want complete setup instructions
→ Read **README.md**

### I want to understand the API
→ Check **API_DOCS.md**

### I'm recording a demo video
→ Use **DEMO_CHECKLIST.md**

### I want an overview
→ Read **PROJECT_SUMMARY.md**

---

## The 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Create config file
cp .env.example .env

# 3. Edit .env with TikTok credentials
# TIKTOK_CLIENT_KEY=your_key_here
# TIKTOK_CLIENT_SECRET=your_secret_here

# 4. Start server
npm start

# 5. Visit http://localhost:3000 in your browser
```

That's it! You should see the login page.

---

## Getting TikTok Credentials

1. Go to https://developers.tiktok.com
2. Sign in with your TikTok account
3. Create a new application
4. Go to Settings → Copy Client Key and Client Secret
5. Go to Settings → Redirect URLs → Add:
   - For local: `http://localhost:3000/auth/tiktok/callback`
   - For Render: `https://your-app.onrender.com/auth/tiktok/callback`
6. Ensure scopes are enabled:
   - `user.info.basic`
   - `video.publish`
   - `video.upload`

---

## Testing Locally

### 1. Start the app
```bash
npm start
```

### 2. Open in browser
```
http://localhost:3000
```

### 3. Click "Sign in with TikTok"

### 4. You'll see:
- Redirect to TikTok's OAuth page
- Login/authorize prompt
- Redirect back to dashboard
- Your TikTok profile displayed

### 5. Test features:
- Upload a video file
- Create a direct post
- Click logout

---

## Deploying to Render

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "TikTok API demo"
git push origin main
```

### 2. Go to render.com
- Click "New Web Service"
- Connect your GitHub repo
- Select the repository
- Click "Deploy"

### 3. Set Environment Variables
In Render dashboard:
```
TIKTOK_CLIENT_KEY = your_key
TIKTOK_CLIENT_SECRET = your_secret
REDIRECT_URI = https://your-app.onrender.com/auth/tiktok/callback
SESSION_SECRET = random-string-here
```

### 4. Update TikTok Console
Add your Render URL to OAuth Redirect URLs:
```
https://your-app.onrender.com/auth/tiktok/callback
```

Your app is now live!

---

## File Guide

| File | Purpose | Read When |
|------|---------|-----------|
| **QUICKSTART.md** | 5-minute setup | You want to start immediately |
| **README.md** | Complete guide | You want detailed instructions |
| **API_DOCS.md** | API reference | You need endpoint details |
| **DEMO_CHECKLIST.md** | Demo recording | You're recording a video |
| **PROJECT_SUMMARY.md** | Project overview | You want the big picture |
| **server.js** | Main application | You want to read the code |
| **.env.example** | Config template | You need to set variables |
| **package.json** | Dependencies | You want to know what's used |
| **render.yaml** | Deploy config | You're deploying to Render |

---

## Common Questions

**Q: What's sandbox mode?**
A: Videos don't actually publish to live accounts. Perfect for testing.

**Q: Do I need a database?**
A: No, it uses in-memory sessions. Add one later if needed.

**Q: Can I customize the UI?**
A: Yes! Edit the CSS in server.js template functions.

**Q: What if I get an error?**
A: Check the console log. See troubleshooting in README.md.

**Q: How do I record a demo?**
A: Follow DEMO_CHECKLIST.md step by step.

---

## Support Resources

- **TikTok Docs**: https://developers.tiktok.com
- **OAuth Guide**: https://developers.tiktok.com/doc/login-kit
- **API Docs**: https://developers.tiktok.com/doc/content-posting-api-get-started
- **This App**: All documentation is in .md files

---

## What Happens When You Run It

```
┌─────────────────────────────────────────────────────┐
│ 1. User visits http://localhost:3000                │
│    Sees: "Hardaway Labs Social" login page          │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│ 2. User clicks "Sign in with TikTok"                │
│    Redirects to: tiktok.com oauth page              │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│ 3. User logs into TikTok and grants permissions     │
│    TikTok redirects back with authorization code    │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│ 4. App exchanges code for access token              │
│    Stores token in session                          │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│ 5. App fetches user profile from TikTok             │
│    Displays avatar, name, and Open ID               │
└─────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│ 6. User sees dashboard with two options:            │
│    - Upload a video                                 │
│    - Create a direct post                           │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

**Choose your path:**

### Path 1: Quick Demo (15 minutes)
1. Follow QUICKSTART.md
2. Test login flow
3. Test video upload
4. Record video with DEMO_CHECKLIST.md

### Path 2: Full Setup (1 hour)
1. Read README.md completely
2. Set up locally following all instructions
3. Deploy to Render
4. Test in production
5. Record demo

### Path 3: Deep Dive (2+ hours)
1. Read all documentation
2. Review server.js code
3. Study API_DOCS.md
4. Customize UI
5. Test edge cases
6. Deploy and monitor

---

## You're Ready!

Everything is configured and ready to go. Just add your TikTok credentials and run:

```bash
npm install && npm start
```

Then visit http://localhost:3000 and start testing!

---

### Questions?

Each section of the documentation answers specific questions:
- **Stuck on setup?** → QUICKSTART.md
- **Need API details?** → API_DOCS.md
- **Recording a video?** → DEMO_CHECKLIST.md
- **Want full info?** → README.md
- **Deploying?** → README.md Deployment section

**Let's build something great!** 🚀
