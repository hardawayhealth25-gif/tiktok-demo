# Development Guide - Hardaway Labs Social Demo

This guide is for developers working on extending or maintaining the TikTok demo application.

---

## Code Overview

### app.py Structure

```python
app.py
├── Imports & Configuration
│   ├── Flask setup
│   ├── Environment loading
│   └── TikTok API endpoints
│
├── Decorators
│   └── @login_required - Protect routes
│
├── Public Routes (no auth required)
│   ├── GET / - index.html
│   ├── GET /login - Initiate OAuth
│   ├── GET /auth/tiktok/callback - OAuth callback
│   └── GET /logout - Clear session
│
├── Protected Routes (require login)
│   ├── GET /dashboard - dashboard.html
│   └── POST /api/upload-video - Video upload API
│
├── Helper Functions
│   ├── get_user_info() - Fetch user from TikTok
│   ├── init_video_upload() - Initialize upload
│   ├── upload_video_chunk() - Upload video chunks
│   └── publish_video() - Finalize video
│
└── Error Handlers
    ├── 404 - Not found
    └── 500 - Server error
```

---

## Extending the App

### Adding a New Route

```python
@app.route('/new-feature')
@login_required
def new_feature():
    """New feature description"""
    user_info = {
        'display_name': session.get('user_display_name'),
        'avatar': session.get('user_avatar')
    }
    return render_template('new_feature.html', user=user_info)
```

### Adding a New API Endpoint

```python
@app.route('/api/new-endpoint', methods=['POST'])
@login_required
def new_endpoint():
    """New API endpoint"""
    try:
        data = request.get_json()
        access_token = session.get('tiktok_access_token')

        # Your logic here

        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
```

### Adding HTML Template

1. Create new file in `templates/` directory
2. Use same HTML structure for consistency:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Page Title - Hardaway Labs Social</title>
       <style>
           /* Inline CSS */
       </style>
   </head>
   <body>
       <!-- Content -->
   </body>
   </html>
   ```

---

## Common Modifications

### Change App Name
Find and replace: `Hardaway Labs Social`
Files: `app.py`, `templates/index.html`, `templates/dashboard.html`

### Change Colors
Primary theme colors:
- Cyan: `#00d9ff` - Replace with your accent color
- Pink: `#ff006e` - Replace with your secondary color
- Black: `#000000` or `#1a1a1a` - Background

Search for these hex codes in HTML files to change theme.

### Modify Required Scopes
In `app.py`:
```python
TIKTOK_SCOPES = ['user.info.basic', 'video.publish', 'video.upload']
# Add or remove scopes as needed
# Available: user.info.basic, user.info.stats, video.publish, video.upload, etc.
```

### Change Upload Size Limit
In `dashboard.html` (JavaScript):
```javascript
const maxSize = 100 * 1024 * 1024; // Change 100 to desired MB
```

---

## Debugging

### Enable Debug Logging

In `app.py`, uncomment:
```python
app.logger.setLevel(logging.DEBUG)
```

Or set environment variable:
```bash
export FLASK_DEBUG=1
```

### View Request Logs

```python
@app.before_request
def log_request():
    app.logger.debug(f"Request: {request.method} {request.path}")
```

### Test API Endpoints with curl

```bash
# Get user info
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url"

# Init video upload (draft)
curl -X POST https://open.tiktokapis.com/v2/post/publish/inbox/video/init/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source_info": {"source": "FILE_UPLOAD"}}'
```

### Use Browser DevTools

1. Open DevTools (F12)
2. Check Network tab for API calls
3. Check Console for JavaScript errors
4. Check Storage for session cookies

---

## Testing Workflows

### Test OAuth Flow
1. Clear browser cookies
2. Go to http://localhost:5000
3. Click "Connect TikTok"
4. Verify redirect to TikTok authorize
5. Grant permissions
6. Verify redirect back to app
7. Check session stores access token

### Test Video Upload
1. Login successfully
2. Select test video file
3. Add caption
4. Choose post type (draft/direct)
5. Click upload
6. Monitor Network tab for chunks
7. Verify success message

### Test Error Handling
1. Upload invalid video format
2. Upload file > 100MB
3. Disconnect internet mid-upload
4. Use expired access token
5. Verify graceful error messages

---

## Performance Optimization

### Current Performance
- Page load: ~200ms (local)
- OAuth roundtrip: ~2-3 seconds
- Video upload: Depends on file size
  - 5MB file: ~5 seconds (5MB chunks)
  - 50MB file: ~50 seconds

### Optimization Ideas
1. **Caching**: Cache user info for 1 hour
2. **Async uploads**: Use Celery for background uploads
3. **Compression**: Compress video before upload
4. **Streaming**: Stream chunks instead of loading full file
5. **CDN**: Distribute assets via CDN

---

## Security Hardening

### Current Implementation
- Session-based token storage
- CSRF state parameter
- Input validation
- Error message sanitization

### Production Checklist
- [ ] Change FLASK_SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Set secure session cookies
- [ ] Implement rate limiting
- [ ] Add request signing
- [ ] Validate all file types
- [ ] Log security events
- [ ] Use secure headers
- [ ] Implement CORS properly
- [ ] Monitor for suspicious activity

### Add Rate Limiting
```bash
pip install flask-limiter
```

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: session.get('user_id'))

@app.route('/api/upload-video', methods=['POST'])
@limiter.limit("5 per minute")
def upload_video():
    # ...
```

---

## Database Integration (Future)

### Add SQLAlchemy
```bash
pip install flask-sqlalchemy
```

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tiktok_demo.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tiktok_id = db.Column(db.String(100), unique=True)
    display_name = db.Column(db.String(100))
    avatar_url = db.Column(db.String(500))
    access_token = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

---

## Deployment Preparation

### Pre-Deployment Checklist
- [ ] Update FLASK_SECRET_KEY
- [ ] Change TikTok redirect URI to production domain
- [ ] Switch to production TikTok credentials
- [ ] Set debug=False in app.run()
- [ ] Use gunicorn or uwsgi
- [ ] Configure HTTPS/SSL
- [ ] Set up error logging
- [ ] Test all features on staging
- [ ] Set up monitoring/alerts
- [ ] Create deployment documentation

### Environment-Specific Config
```python
import os

ENV = os.getenv('FLASK_ENV', 'development')

if ENV == 'production':
    DEBUG = False
    TIKTOK_REDIRECT_URI = 'https://yourdomain.com/auth/tiktok/callback'
else:
    DEBUG = True
    TIKTOK_REDIRECT_URI = 'http://localhost:5000/auth/tiktok/callback'
```

---

## Testing Best Practices

### Unit Tests Example
```python
import unittest
from app import app

class TestAuth(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_index_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Connect TikTok', response.data)

    def test_login_redirect(self):
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 302)
        self.assertIn('tiktok.com', response.location)
```

Run tests:
```bash
python -m pytest tests/
```

---

## Monitoring & Analytics

### Add Request Tracking
```python
from datetime import datetime

@app.before_request
def before_request():
    g.start_time = datetime.utcnow()

@app.after_request
def after_request(response):
    duration = (datetime.utcnow() - g.start_time).total_seconds()
    app.logger.info(f"{request.method} {request.path} - {response.status_code} ({duration}s)")
    return response
```

### Key Metrics to Monitor
- Page load times
- OAuth success rate
- Upload success rate
- API error rates
- Session duration
- User retention

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution**: `pip install -r requirements.txt`

### Issue: "Address already in use"
**Solution**: `lsof -i :5000` then `kill -9 <PID>`

### Issue: "TikTok API returns 403"
**Solution**: Check scopes, verify access token validity, check rate limits

### Issue: "Session data not persisting"
**Solution**: Verify FLASK_SECRET_KEY is set, check session cookie settings

### Issue: "Video upload fails on large files"
**Solution**: Increase chunk size or use async processing with Celery

---

## Tools & Commands

```bash
# Start development server
python app.py

# Run with gunicorn
gunicorn -w 4 -b localhost:5000 app:app

# Install dependencies
pip install -r requirements.txt

# Update dependencies
pip list --outdated
pip install --upgrade package_name

# Generate requirements
pip freeze > requirements.txt

# Python debugger
python -m pdb app.py

# Run tests
python -m pytest tests/

# Code formatting
black app.py
flake8 app.py
```

---

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes with clear commit messages
3. Test thoroughly before submitting
4. Update documentation
5. Create pull request with description

---

## Contact & Support

For questions about the codebase:
- Review code comments in app.py
- Check README.md for overview
- See PROJECT_SUMMARY.md for architecture
- Contact: support@hardawaylabs.com

---

**Happy coding!** 🚀

Last updated: March 28, 2026
