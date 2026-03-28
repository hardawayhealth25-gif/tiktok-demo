# Hardaway Labs Social - TikTok OAuth & Content Posting Demo

A complete Flask web application demonstrating TikTok OAuth 2.0 login and Content Posting API integration. This demo is designed for app review presentations and serves as the foundation for the production platform.

## Features

- **TikTok OAuth 2.0 Login** - Secure user authentication via TikTok Login Kit
- **User Profile Display** - Shows TikTok display name, avatar, and bio
- **Video Upload** - File upload with caption support
- **Post Types** - Choose between saving as draft or posting directly
- **Modern UI** - Dark theme with TikTok-inspired cyan and pink accents
- **Error Handling** - Comprehensive error messages and validation
- **Production Ready** - Clean, documented code ready for scaling

## Prerequisites

- Python 3.9+
- TikTok Developer Account with approved OAuth 2.0 credentials
- For sandbox/demo: Sandbox client key and secret from TikTok Developer Console

## Installation

### 1. Clone or Download

```bash
cd /path/to/tiktok-demo
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your TikTok credentials:

```
FLASK_SECRET_KEY=your-secret-key-here
TIKTOK_CLIENT_KEY=your_sandbox_client_key
TIKTOK_CLIENT_SECRET=your_sandbox_client_secret
TIKTOK_REDIRECT_URI=http://localhost:5000/auth/tiktok/callback
```

### 5. Run the Application

```bash
python app.py
```

The app will start at `http://localhost:5000`

## Getting TikTok Developer Credentials

1. Go to [TikTok Developer Console](https://developer.tiktok.com/)
2. Create a new application
3. Set your redirect URI to: `http://localhost:5000/auth/tiktok/callback` (for development)
4. Copy your Client Key and Client Secret
5. Paste them into your `.env` file

### Important: Sandbox vs Production

- **Sandbox**: Use `TIKTOK_CLIENT_KEY` from sandbox credentials for testing
- **Production**: Use production credentials and update `TIKTOK_REDIRECT_URI` to your production domain

## Application Flow

### 1. Login
- User clicks "Connect TikTok" button
- Redirected to TikTok authorization page
- User grants permissions
- App exchanges code for access token

### 2. Dashboard
- User profile info displayed (name, avatar, bio)
- Video upload form available

### 3. Video Upload
- User selects video file (MP4, MOV, AVI, MKV)
- Optional caption added
- Choose "Draft" or "Direct Post"

### 4. Video Processing
- Video is uploaded to TikTok in chunks
- Metadata is submitted
- Result is displayed (success or error)

## API Endpoints

### Public Routes
- `GET /` - Home page with login button
- `GET /login` - Initiates OAuth flow
- `GET /auth/tiktok/callback` - OAuth callback handler

### Protected Routes (Require Login)
- `GET /dashboard` - User dashboard with upload form
- `POST /api/upload-video` - Upload video to TikTok
- `GET /logout` - Clear session and logout

## TikTok API Integration

### OAuth 2.0
- **Authorize URL**: `https://www.tiktok.com/v2/auth/authorize/`
- **Token URL**: `https://open.tiktokapis.com/v2/oauth/token/`
- **Scopes**: `user.info.basic`, `video.publish`, `video.upload`

### Content Posting
- **User Info**: `GET /v2/user/info/`
- **Video Init (Draft)**: `POST /v2/post/publish/inbox/video/init/`
- **Video Init (Direct)**: `POST /v2/post/publish/video/init/`
- **Chunk Upload**: `POST /v2/post/publish/video/chunk/upload/`
- **Publish**: `POST /v2/post/publish/video/publish/`

## File Structure

```
tiktok-demo/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── README.md                  # This file
└── templates/
    ├── index.html             # Landing page
    └── dashboard.html         # Dashboard with upload form
```

## Customization

### Styling
- All CSS is inline in HTML templates
- Dark theme with TikTok colors (black, cyan #00d9ff, pink #ff006e)
- Responsive design for mobile and desktop

### Branding
- App name: "Hardaway Labs Social"
- Logo displayed in header
- Customize colors by finding and replacing color codes

## Deployment

### Using Gunicorn (Production)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using uWSGI

```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app --processes 4
```

### Important for Production
1. Change `FLASK_SECRET_KEY` to a strong random string
2. Update `TIKTOK_REDIRECT_URI` to your production domain
3. Use production TikTok credentials (not sandbox)
4. Set `debug=False` in `app.run()`
5. Use a proper WSGI server (gunicorn, uwsgi, etc.)
6. Enable HTTPS/SSL
7. Set up proper logging and monitoring

## Troubleshooting

### "Invalid Client Key"
- Verify your TIKTOK_CLIENT_KEY is correct in `.env`
- Make sure you're using sandbox credentials for sandbox environment
- Check that your app is approved in TikTok Developer Console

### "Redirect URI Mismatch"
- Ensure `TIKTOK_REDIRECT_URI` in `.env` matches what you registered in TikTok Developer Console
- For local dev: `http://localhost:5000/auth/tiktok/callback`
- For production: `https://yourdomain.com/auth/tiktok/callback`

### "Upload Failed"
- Check video format (MP4, MOV, AVI, MKV)
- Verify file size is under 100MB
- Ensure video is valid (not corrupted)
- Check access token hasn't expired

### "No User Info Returned"
- Verify `user.info.basic` scope is included
- Check that access token is valid
- Ensure user hasn't revoked permissions

## Security Notes

- Access tokens are stored in session (server-side by default)
- For production, consider using Redis or database for session storage
- Never commit `.env` file with real credentials
- Implement CSRF protection for state parameter
- Validate all file uploads
- Rate limit API endpoints
- Use HTTPS in production

## Support & Contact

For issues or questions about the TikTok API:
- [TikTok Developer Documentation](https://developers.tiktok.com/)
- [TikTok API Reference](https://developers.tiktok.com/doc/login-kit-web)

For Hardaway Labs:
- Website: https://www.healthyoneapp.com
- Email: support@hardawaylabs.com

## License

This demo application is provided as-is for testing and development purposes.

---

**Last Updated**: March 2026
**Version**: 1.0.0
