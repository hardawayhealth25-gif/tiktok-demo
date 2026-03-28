# TikTok API Integration Demo

A production-ready Node.js Express application demonstrating TikTok Login Kit (OAuth 2.0) and Content Posting API integration. Built for Hardaway Labs Social.

## Features

- **TikTok Login Kit (OAuth 2.0)**: Seamless user authentication using TikTok accounts
- **User Profile Display**: Shows connected user's display name, avatar, and Open ID
- **Video Upload & Publishing**: Upload and publish videos using TikTok's Content Posting API
- **Direct Post Support**: Create text-based posts on TikTok
- **Session Management**: Secure token storage with express-session
- **Responsive Design**: Clean, modern UI optimized for demo videos
- **Production-Ready**: Proper error handling, logging, and environment configuration

## Tech Stack

- **Node.js 18+** with Express.js
- **Axios** for HTTP requests to TikTok API
- **Multer** for multipart file uploads
- **Express-Session** for session management
- **Dotenv** for environment configuration

## Prerequisites

1. **Node.js 18+** installed locally
2. **TikTok Developer Account** with:
   - A registered application
   - Client Key and Client Secret
   - Authorized Redirect URI configured
   - Scopes enabled: `user.info.basic`, `video.publish`, `video.upload`

3. **Render Account** (for deployment)

## Local Setup & Testing

### 1. Clone and Install Dependencies

```bash
cd tiktok-demo
npm install
```

### 2. Configure Environment Variables

Copy the example file and add your TikTok credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
TIKTOK_CLIENT_KEY=your_client_key_from_tiktok_dev_console
TIKTOK_CLIENT_SECRET=your_client_secret_from_tiktok_dev_console
REDIRECT_URI=http://localhost:3000/auth/tiktok/callback
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-random-secret-key-here
```

### 3. Register Callback URL in TikTok Developer Console

In TikTok Developer Console → Your Application:

1. Go to **Settings** → **Redirect URLs**
2. Add: `http://localhost:3000/auth/tiktok/callback` (for local testing)
3. Ensure scopes are enabled: `user.info.basic`, `video.publish`, `video.upload`

### 4. Run the Application

```bash
npm start
# or for development with auto-restart:
npm run dev
```

The server will start at `http://localhost:3000`.

### 5. Test the OAuth Flow

1. Open `http://localhost:3000` in your browser
2. Click "Sign in with TikTok"
3. You'll be redirected to TikTok's OAuth consent screen
4. After authorization, you'll see the dashboard with your TikTok profile
5. Test video upload or direct post features

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page with login button |
| GET | `/auth/tiktok` | Initiates OAuth 2.0 flow |
| GET | `/auth/tiktok/callback` | OAuth callback handler |
| GET | `/dashboard` | User dashboard (requires authentication) |
| GET | `/logout` | Clears session and logs out |

### Content Publishing Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/publish/video` | Upload and publish a video |
| POST | `/api/publish/direct` | Create a direct post |

### Example: Publish a Video

```bash
curl -X POST http://localhost:3000/api/publish/video \
  -F "video=@sample_video.mp4" \
  -F "description=My awesome TikTok video!"
```

**Response:**

```json
{
  "success": true,
  "message": "Video published successfully (Sandbox Mode)",
  "publish_id": "1234567890"
}
```

## Deployment to Render (Free Tier)

### Step 1: Prepare Your Repository

Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial TikTok API demo app"
git push origin main
```

### Step 2: Create a Render Web Service

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tiktok-api-demo`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Step 3: Add Environment Variables

In Render dashboard → Your Service → **Environment**:

```
TIKTOK_CLIENT_KEY=your_production_client_key
TIKTOK_CLIENT_SECRET=your_production_client_secret
REDIRECT_URI=https://your-app-name.onrender.com/auth/tiktok/callback
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-long-random-secret-key-here
```

### Step 4: Update TikTok Console

In TikTok Developer Console → Your Application → **Redirect URLs**:

Add: `https://your-app-name.onrender.com/auth/tiktok/callback`

### Step 5: Deploy

Click **Deploy** in Render dashboard. Your app will be live at:
```
https://your-app-name.onrender.com
```

## OAuth 2.0 Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Sign in with TikTok" on homepage           │
│    → Redirects to /auth/tiktok                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. App redirects to TikTok OAuth endpoint with:             │
│    - client_key                                              │
│    - scopes: user.info.basic, video.publish, video.upload  │
│    - redirect_uri                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User logs in to TikTok and grants permissions           │
│    → TikTok redirects back with authorization code          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. App exchanges code for access token via:                 │
│    POST /v2/oauth/token/ with code, client_key, secret     │
│    → Returns access_token and open_id                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. App fetches user profile:                                │
│    GET /v2/user/info/ with Bearer token                    │
│    → Returns display_name, avatar_url, open_id              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Dashboard displays user info and publishing options     │
└─────────────────────────────────────────────────────────────┘
```

## Content Posting Flow

### Video Upload

```
1. User selects video file and adds description
   ↓
2. POST /api/publish/video with multipart form data
   ↓
3. Server calls /v2/post/publish/video/init/ to get upload URL
   ↓
4. Server uploads video chunk to returned URL
   ↓
5. Server calls /v2/post/publish/video/publish/ to finalize
   ↓
6. Video is queued for publishing (sandbox mode)
```

### Direct Post

```
1. User enters post description
   ↓
2. POST /api/publish/direct with JSON body
   ↓
3. Server calls /v2/post/publish/content/init/
   ↓
4. Post is created (sandbox mode)
```

## Error Handling

The app includes comprehensive error handling for:

- Missing environment variables
- OAuth failures
- Invalid file uploads
- API rate limiting
- Network errors
- Invalid tokens

All errors are logged to console and returned as JSON responses.

## Session Management

- **Storage**: In-memory (suitable for demo/single-server)
- **Duration**: Default browser session (closes when browser shuts down)
- **Data Stored**:
  - `accessToken`: TikTok API access token
  - `openId`: User's TikTok Open ID

For production with multiple servers, upgrade to database-backed sessions:

```bash
npm install connect-mongo  # For MongoDB
npm install connect-pg-simple  # For PostgreSQL
```

## File Structure

```
tiktok-demo/
├── server.js              # Main application
├── package.json           # Dependencies
├── .env.example           # Environment template
├── render.yaml            # Render deployment config
├── README.md              # This file
└── uploads/               # Temporary video upload directory (gitignored)
```

## Sandbox Mode Notes

When deployed with the credentials above, TikTok operates in **Sandbox Mode**, meaning:

- ✓ OAuth flow works normally
- ✓ User profile data is retrieved
- ✓ API endpoints accept requests
- ✗ Videos are NOT published to live accounts
- ✗ No data is persisted

This is perfect for demo videos and testing the integration.

## Development Tips

### Adding Console Logging

The app includes basic logging. For production, upgrade to Winston or Pino:

```bash
npm install winston
```

### Testing API Endpoints

Use curl or Postman to test endpoints:

```bash
# Check health
curl http://localhost:3000/health

# Get user info (requires valid session)
curl -H "Cookie: connect.sid=..." http://localhost:3000/api/user
```

### Debugging OAuth Flow

1. Check browser DevTools Network tab for redirects
2. Monitor console logs for API errors
3. Verify environment variables are loaded: `console.log(process.env)`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing TIKTOK_CLIENT_KEY" | Check `.env` file and verify credentials are set |
| OAuth redirect fails | Ensure `REDIRECT_URI` matches TikTok console and DNS |
| Video upload error | Check file size (<100MB) and format (MP4/MOV) |
| Session expires | Sessions are browser-session by default; refresh logs you out |
| Render deploy fails | Check Node.js version; verify `.env` vars in Render dashboard |

## Next Steps

1. **Recording Demo Video**: Use screen recording software (Loom, OBS) to capture the OAuth flow and posting workflow
2. **Expanding Features**: Add draft saving, scheduling, analytics dashboard
3. **Production Setup**: Migrate to database sessions, add monitoring/logging
4. **Multi-User**: Implement database to store multiple user sessions

## License

Built for Hardaway Labs Social - TikTok Developer Demo

## Support

For TikTok API documentation, visit:
- [TikTok Open Platform Docs](https://developers.tiktok.com)
- [OAuth 2.0 Guide](https://developers.tiktok.com/doc/login-kit)
- [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started)
