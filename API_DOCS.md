# API Documentation

Complete reference for all endpoints in the TikTok Integration Demo.

## Base URL

### Local Development
```
http://localhost:3000
```

### Production (Render)
```
https://your-app-name.onrender.com
```

---

## Authentication Endpoints

### GET `/`

Homepage with login button.

**Response:** HTML page

**Status Codes:**
- `200` - Success (shows login page)

**Behavior:**
- If user is logged in: Redirects to `/dashboard`
- If user is not logged in: Shows login page with "Sign in with TikTok" button

---

### GET `/auth/tiktok`

Initiates OAuth 2.0 authorization flow.

**Response:** Redirect to TikTok OAuth authorization endpoint

**Status Codes:**
- `302` - Redirect to TikTok
- `500` - Missing environment variables (TIKTOK_CLIENT_KEY or REDIRECT_URI)

**Scopes Requested:**
- `user.info.basic` - Access basic user information
- `video.publish` - Permission to publish videos
- `video.upload` - Permission to upload video files

**Environment Variables Required:**
- `TIKTOK_CLIENT_KEY` - Your TikTok client key
- `REDIRECT_URI` - Your callback URL (e.g., http://localhost:3000/auth/tiktok/callback)

---

### GET `/auth/tiktok/callback`

OAuth 2.0 callback handler. TikTok redirects here after user authorization.

**Query Parameters:**
- `code` (required) - Authorization code from TikTok
- `state` (optional) - CSRF protection token

**Response:** Redirect to `/dashboard` on success

**Status Codes:**
- `302` - Redirect to dashboard (success)
- `400` - Missing authorization code
- `500` - Failed to exchange code for token or missing environment variables

**Process:**
1. Receives authorization code from TikTok
2. Exchanges code for access token via POST to `https://open.tiktokapis.com/v2/oauth/token/`
3. Stores `access_token` and `open_id` in session
4. Redirects to `/dashboard`

**Environment Variables Required:**
- `TIKTOK_CLIENT_SECRET` - Your TikTok client secret
- `REDIRECT_URI` - Must match value used in `/auth/tiktok`

---

### GET `/dashboard`

Main application dashboard. Requires authentication.

**Response:** HTML dashboard page with user profile and publishing forms

**Status Codes:**
- `200` - Success
- `302` - Redirect to `/` (user not authenticated)
- `500` - Failed to fetch user info from TikTok

**Requires:**
- Valid session with `accessToken`

**Displays:**
- User's TikTok avatar
- User's display name
- User's Open ID
- Video upload form
- Direct post form
- Logout button

**API Call (internal):**
```
GET https://open.tiktokapis.com/v2/user/info/
Authorization: Bearer {accessToken}
Fields: open_id, union_id, avatar_url, display_name
```

---

### GET `/logout`

Clears user session and logs out.

**Response:** Redirect to `/`

**Status Codes:**
- `302` - Redirect to home
- `500` - Session destruction error

**Process:**
1. Destroys session
2. Removes `accessToken` and `openId` from memory
3. Redirects to home page

---

## Health Check

### GET `/health`

Basic health check endpoint. Used for monitoring.

**Response:**
```json
{
  "status": "ok",
  "environment": "production"
}
```

**Status Codes:**
- `200` - Server is healthy

**Use Case:** Render or monitoring service can ping this to ensure app is running.

---

## Content Publishing Endpoints

### POST `/api/publish/video`

Upload and publish a video to TikTok.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `video` (file, required) - Video file to upload
  - Accepted formats: MP4, MOV, AVI
  - Max size: 100 MB
- `description` (text, required) - Video title and description

**Response (Success):**
```json
{
  "success": true,
  "message": "Video published successfully (Sandbox Mode)",
  "publish_id": "1234567890"
}
```

**Response (Error):**
```json
{
  "error": "Error description"
}
```

**Status Codes:**
- `200` - Video published successfully
- `400` - Missing video file or description
- `401` - Not authenticated
- `413` - File too large
- `500` - Failed to publish video

**Requires:**
- Valid session with `accessToken`
- Video file selected
- Description provided

**Process:**
1. Receives video file upload via Multer
2. POST to `https://open.tiktokapis.com/v2/post/publish/video/init/` to get upload URL
3. Upload video content to returned URL
4. POST to `https://open.tiktokapis.com/v2/post/publish/video/publish/` to finalize
5. Delete temporary file from server
6. Return success/error response

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/publish/video \
  -F "video=@sample_video.mp4" \
  -F "description=My awesome TikTok video!"
```

**Example JavaScript (Fetch):**
```javascript
const formData = new FormData();
formData.append('video', videoFile); // File input
formData.append('description', 'My video description');

const response = await fetch('/api/publish/video', {
  method: 'POST',
  body: formData
});

const data = await response.json();
if (data.success) {
  console.log('Video published!', data.publish_id);
}
```

---

### POST `/api/publish/direct`

Create a direct text-based post on TikTok.

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "description": "Your post content here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Direct post created successfully (Sandbox Mode)",
  "post_id": "1234567890"
}
```

**Response (Error):**
```json
{
  "error": "Error description"
}
```

**Status Codes:**
- `200` - Post created successfully
- `400` - Missing description
- `401` - Not authenticated
- `500` - Failed to create post

**Requires:**
- Valid session with `accessToken`
- Description provided

**Process:**
1. Validates user is authenticated
2. POST to `https://open.tiktokapis.com/v2/post/publish/content/init/` with post content
3. Return response with post_id

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/publish/direct \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Check out this new feature on TikTok!"
  }'
```

**Example JavaScript (Fetch):**
```javascript
const response = await fetch('/api/publish/direct', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'My direct post!'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Post created!', data.post_id);
}
```

---

## Error Handling

All endpoints include comprehensive error handling. Error responses follow this format:

### Error Response Format

```json
{
  "error": "Description of what went wrong"
}
```

### Common Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Missing required field | Form validation failed |
| 401 | Not authenticated | No valid session/token |
| 413 | File too large | Video exceeds 100MB |
| 500 | Failed to publish video | TikTok API error |
| 500 | Missing environment variables | Server misconfiguration |

### Error Examples

**Missing Authentication:**
```json
{
  "error": "Not authenticated"
}
```

**Missing Description:**
```json
{
  "error": "Description is required"
}
```

**API Failure:**
```json
{
  "error": "The OAuth token is invalid, expired, or has been revoked."
}
```

---

## Session Management

### Session Storage

Sessions are stored in-memory using `express-session`. Data persists for the duration of the browser session.

### Session Data

When user logs in, session stores:

```javascript
{
  accessToken: "abcd1234...", // TikTok API access token
  openId: "12345678..."        // TikTok user Open ID
}
```

### Session Duration

- Expires when browser closes
- Can be configured via `COOKIE_EXPIRES` or manually set expiration

### For Production

For multi-server deployments, upgrade to persistent session storage:

```bash
npm install connect-mongo
```

Then use:
```javascript
const MongoStore = require('connect-mongo');
app.use(session({
  store: new MongoStore({ url: process.env.MONGODB_URI })
}));
```

---

## TikTok API Integration

### OAuth Flow

This app implements the full TikTok OAuth 2.0 flow:

1. **Authorization Request**
   ```
   GET https://www.tiktok.com/v1/oauth/authorize
   ```
   Parameters: client_key, response_type, scope, redirect_uri, state

2. **Token Exchange**
   ```
   POST https://open.tiktokapis.com/v2/oauth/token/
   ```
   Body: client_key, client_secret, code, grant_type, redirect_uri

3. **User Info Fetch**
   ```
   GET https://open.tiktokapis.com/v2/user/info/
   Authorization: Bearer {access_token}
   ```
   Fields: open_id, union_id, avatar_url, display_name

4. **Content Publishing**
   ```
   POST https://open.tiktokapis.com/v2/post/publish/video/init/
   POST https://open.tiktokapis.com/v2/post/publish/video/publish/
   or
   POST https://open.tiktokapis.com/v2/post/publish/content/init/
   ```

### Rate Limiting

TikTok API has rate limits. If exceeded:

**Response:**
```json
{
  "error": "Rate limit exceeded",
  "error_code": 1047
}
```

**Solution:** Implement exponential backoff in production.

---

## Authentication Header

All TikTok API calls use Bearer token authentication:

```
Authorization: Bearer {access_token}
```

Example:
```bash
curl -H "Authorization: Bearer abc123def456" \
  https://open.tiktokapis.com/v2/user/info/
```

---

## Sandbox Mode Notes

When deployed with sandbox credentials:

✓ Works:
- OAuth flow completes
- User info is retrieved
- API accepts requests
- Responses are valid

✗ Does NOT work:
- Videos are not actually published
- Posts don't appear on TikTok
- No data persists to user accounts

This is ideal for demo/testing environments.

---

## Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| TIKTOK_CLIENT_KEY | Yes | abc123... | OAuth client ID |
| TIKTOK_CLIENT_SECRET | Yes | xyz789... | OAuth client secret |
| REDIRECT_URI | Yes | http://localhost:3000/auth/tiktok/callback | OAuth callback URL |
| PORT | No | 3000 | Server port |
| NODE_ENV | No | production | Environment type |
| SESSION_SECRET | No | random-key | Session encryption key |

---

## Testing with cURL

### Login Flow (Cannot be tested with cURL directly - requires browser redirect)

### Publish Video
```bash
curl -X POST http://localhost:3000/api/publish/video \
  -F "video=@video.mp4" \
  -F "description=Test video"
```

### Create Direct Post
```bash
curl -X POST http://localhost:3000/api/publish/direct \
  -H "Content-Type: application/json" \
  -d '{"description": "Test post"}'
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## Response Examples

### Successful Login Flow

After completing OAuth:
- Redirected to `/dashboard`
- Session contains valid `accessToken`
- User profile displayed with avatar and name

### Successful Video Upload

```json
{
  "success": true,
  "message": "Video published successfully (Sandbox Mode)",
  "publish_id": "1704067200000000000"
}
```

### Successful Direct Post

```json
{
  "success": true,
  "message": "Direct post created successfully (Sandbox Mode)",
  "post_id": "1704067200000000000"
}
```

---

## Pagination & Limits

Current implementation does not support pagination. Each endpoint handles single requests:

- Single video upload
- Single direct post
- Single user session

For multiple users/videos in production, add:
- Database to store publish history
- Queue system for batch uploads
- Pagination for history endpoints

---

## Webhooks (Future)

TikTok supports webhooks for events like:
- Video upload complete
- Account connected/disconnected
- Engagement metrics

Implementation not included in this demo but can be added with:
```javascript
app.post('/webhooks/tiktok', (req, res) => {
  // Handle webhook event
});
```

---

For more information, see:
- [TikTok Developer Docs](https://developers.tiktok.com)
- [OAuth 2.0 Guide](https://developers.tiktok.com/doc/login-kit)
- [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started)
