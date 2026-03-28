# Quick Start Guide - Hardaway Labs Social Demo

Get the TikTok OAuth demo running in 5 minutes.

## Prerequisites
- Python 3.9+
- TikTok Developer Account credentials (sandbox or production)

## Step 1: Get Your TikTok Credentials

1. Go to https://developer.tiktok.com/
2. Create a new application
3. In Developer Console:
   - Copy your **Client Key** (also called App Key)
   - Copy your **Client Secret**
   - Set Redirect URI to: `http://localhost:5000/auth/tiktok/callback`

## Step 2: Setup Local Environment

### macOS/Linux:
```bash
cd /path/to/tiktok-demo
bash setup.sh
```

### Windows:
```bash
cd path\to\tiktok-demo
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## Step 3: Configure Credentials

Edit `.env` file:
```
FLASK_SECRET_KEY=any-random-string-here
TIKTOK_CLIENT_KEY=your_client_key_from_tiktok
TIKTOK_CLIENT_SECRET=your_client_secret_from_tiktok
TIKTOK_REDIRECT_URI=http://localhost:5000/auth/tiktok/callback
```

## Step 4: Run the App

### macOS/Linux:
```bash
bash run.sh
```

### Windows:
```bash
venv\Scripts\activate
python app.py
```

## Step 5: Test It!

1. Open http://localhost:5000 in your browser
2. Click "Connect TikTok"
3. Authorize the app
4. Upload a test video
5. Choose "Save as Draft" or "Post Directly"

## Testing Videos

For testing, you can use:
- Any MP4 video file
- Minimum: 100px × 100px resolution
- Maximum: 100MB file size

## Troubleshooting

### "Invalid Client Key"
- Copy exact key from TikTok Developer Console
- Make sure .env is in the project root
- Restart the Flask app after updating .env

### "Redirect URI Mismatch"
- Must match EXACTLY what you registered in TikTok Console
- For local dev: `http://localhost:5000/auth/tiktok/callback`
- No trailing slash

### "Video Upload Failed"
- Check video format (MP4, MOV, AVI, MKV)
- Verify video is not corrupted
- Check file size < 100MB

## Demo Flow for App Review

1. **Show Login Page** - Clean UI with Hardaway Labs branding
2. **Authenticate** - Click login, show authorization flow
3. **Dashboard** - Display user profile (name, avatar, bio)
4. **Upload Video** - Select video file, add caption
5. **Post** - Show draft or direct post options
6. **Success** - Display upload ID and confirmation

## Architecture Overview

```
User Browser
    ↓
Flask Web Server (app.py)
    ↓
TikTok OAuth Server (user login)
    ↓
TikTok API (upload & publish)
```

## Key Features Demonstrated

- ✅ OAuth 2.0 authentication flow
- ✅ User profile retrieval
- ✅ Video file upload with chunking
- ✅ Draft vs Direct publishing
- ✅ Error handling and user feedback
- ✅ Modern responsive UI

## File Breakdown

| File | Purpose |
|------|---------|
| `app.py` | Main Flask application with all API logic |
| `templates/index.html` | Login landing page |
| `templates/dashboard.html` | User dashboard with upload form |
| `.env` | Your credentials (create from .env.example) |
| `requirements.txt` | Python dependencies |
| `README.md` | Full documentation |

## Next Steps

### For App Review Demo
- Test login flow 2-3 times
- Try uploading different video formats
- Show both draft and direct post options
- Demonstrate error handling (bad file, etc.)

### For Production
- Switch to production TikTok credentials
- Update TIKTOK_REDIRECT_URI to real domain
- Deploy using gunicorn or uWSGI
- Set up database for sessions
- Enable HTTPS
- Add rate limiting

## Common Questions

**Q: Can I use this in production?**
A: Yes, but first switch to production credentials and deploy on a proper server.

**Q: Is the video really posted to TikTok?**
A: Yes, if you use production credentials. With sandbox credentials, it's a dry run.

**Q: Can I customize the UI?**
A: Yes, all CSS is inline in the HTML templates. Just edit the style tags.

**Q: Does this handle TikTok Shop videos?**
A: This demo handles standard video uploads. Shop integration requires additional setup.

## Support

For TikTok API issues:
- Check TikTok API status: https://status.tiktokapis.com/
- Review TikTok docs: https://developers.tiktok.com/

For setup help:
- See README.md for detailed documentation
- Check app.py comments for code explanation

---

**Ready? Let's go!** 🚀
