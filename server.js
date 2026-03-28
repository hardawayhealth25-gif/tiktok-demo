require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Allow only video files
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ============================================================================
// TEMPLATE FUNCTIONS
// ============================================================================

function getLoginPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hardaway Labs Social - TikTok Integration Demo</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .container {
          max-width: 500px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .logo {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ff0050 0%, #ff6b35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 30px;
          font-weight: 500;
        }

        .description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .login-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          border: 2px solid #25f4ee;
          color: #25f4ee;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          width: 100%;
        }

        .login-btn:hover {
          background: #25f4ee;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 244, 238, 0.3);
        }

        .features {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .feature-icon {
          color: #25f4ee;
          font-weight: 700;
          font-size: 16px;
        }

        .tiktok-icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: linear-gradient(45deg, #25f4ee 0%, #ff0050 100%);
          border-radius: 4px;
          margin-right: 4px;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Hardaway Labs Social</div>
        <div class="subtitle">TikTok Integration Demo</div>

        <div class="description">
          Experience seamless TikTok login and content posting integration powered by TikTok API v2.
        </div>

        <a href="/auth/tiktok" class="login-btn">
          <span class="tiktok-icon"></span>
          Sign in with TikTok
        </a>

        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            OAuth 2.0 Login Kit integration
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            Video upload & publishing
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            User profile display
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            Production-ready code
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getDashboardPage(userInfo) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - Hardaway Labs Social</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: #ffffff;
          min-height: 100vh;
          padding: 20px;
        }

        .header {
          max-width: 1000px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff0050 0%, #ff6b35 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logout-btn {
          background: #ff0050;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 14px;
        }

        .logout-btn:hover {
          background: #ff1a6e;
          transform: translateY(-2px);
        }

        .main-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25f4ee 0%, #ff0050 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          flex-shrink: 0;
          overflow: hidden;
          border: 3px solid rgba(37, 244, 238, 0.5);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #25f4ee;
        }

        .user-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #25f4ee 0%, #ff0050 100%);
          border-radius: 2px;
        }

        .upload-section {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(37, 244, 238, 0.3);
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 30px;
          text-align: center;
        }

        .upload-section.active {
          border-color: #25f4ee;
          background: rgba(37, 244, 238, 0.05);
        }

        .file-input-label {
          display: inline-block;
          background: linear-gradient(135deg, #25f4ee 0%, #00d9ff 100%);
          color: black;
          padding: 12px 30px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }

        .file-input-label:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 244, 238, 0.3);
        }

        input[type="file"] {
          display: none;
        }

        .file-name {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-top: 10px;
        }

        .upload-info {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          margin-top: 15px;
          line-height: 1.6;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #ffffff;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #25f4ee;
          background: rgba(37, 244, 238, 0.05);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .post-btn {
          flex: 1;
          background: linear-gradient(135deg, #25f4ee 0%, #00d9ff 100%);
          color: black;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .post-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(37, 244, 238, 0.3);
        }

        .post-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reset-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .status-message {
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          font-size: 14px;
          display: none;
        }

        .status-message.success {
          background: rgba(76, 175, 80, 0.2);
          border: 1px solid rgba(76, 175, 80, 0.5);
          color: #4caf50;
          display: block;
        }

        .status-message.error {
          background: rgba(244, 67, 54, 0.2);
          border: 1px solid rgba(244, 67, 54, 0.5);
          color: #f44336;
          display: block;
        }

        .status-message.info {
          background: rgba(37, 244, 238, 0.2);
          border: 1px solid rgba(37, 244, 238, 0.5);
          color: #25f4ee;
          display: block;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 10px;
          display: none;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #25f4ee 0%, #ff0050 100%);
          width: 0%;
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .progress-bar.active {
          display: block;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 12px 20px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-weight: 600;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .tab.active {
          color: #25f4ee;
          border-bottom-color: #25f4ee;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Hardaway Labs Social</div>
        <a href="/logout" class="logout-btn">Logout</a>
      </div>

      <div class="main-container">
        <div class="user-card">
          <div class="user-avatar">
            ${userInfo.avatar_url ? `<img src="${userInfo.avatar_url}" alt="${userInfo.display_name}">` : '👤'}
          </div>
          <div class="user-info">
            <h2>${userInfo.display_name}</h2>
            <p><strong>Open ID:</strong> ${userInfo.open_id}</p>
            <p><strong>Status:</strong> <span style="color: #4caf50;">Connected</span></p>
            <p style="font-size: 12px; margin-top: 10px; color: rgba(255, 255, 255, 0.5);">Sandbox Mode - Demo Only</p>
          </div>
        </div>

        <div>
          <div class="section-title">Publish Content</div>

          <div class="tabs">
            <button class="tab active" data-tab="video">Video Upload</button>
            <button class="tab" data-tab="direct">Direct Post</button>
          </div>

          <div id="video" class="tab-content active">
            <form id="videoForm">
              <div class="upload-section" id="uploadSection">
                <label for="videoFile" class="file-input-label">
                  📹 Choose Video File
                </label>
                <input type="file" id="videoFile" name="video" accept="video/*" required>
                <div class="file-name" id="fileName"></div>
                <div class="upload-info">
                  Supported formats: MP4, MOV, AVI<br>
                  Maximum size: 100 MB
                </div>
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea id="description" name="description" placeholder="Add a description for your video..." required></textarea>
              </div>

              <div class="progress-bar" id="progressBar">
                <div class="progress-fill" id="progressFill"></div>
              </div>

              <div class="button-group">
                <button type="submit" class="post-btn" id="postBtn">Publish Video</button>
                <button type="reset" class="reset-btn">Clear</button>
              </div>

              <div class="status-message" id="statusMessage"></div>
            </form>
          </div>

          <div id="direct" class="tab-content">
            <form id="directForm">
              <div class="form-group">
                <label>Content Description</label>
                <textarea id="directDescription" name="description" placeholder="Add your content description..." required></textarea>
              </div>

              <div class="button-group">
                <button type="submit" class="post-btn" id="directPostBtn">Create Direct Post</button>
                <button type="reset" class="reset-btn">Clear</button>
              </div>

              <div class="status-message" id="directStatusMessage"></div>
            </form>
          </div>
        </div>
      </div>

      <script>
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
          tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tabName).classList.add('active');
          });
        });

        // File input display
        document.getElementById('videoFile').addEventListener('change', (e) => {
          const fileName = e.target.files[0]?.name || '';
          document.getElementById('fileName').textContent = fileName ? 'Selected: ' + fileName : '';
          document.getElementById('uploadSection').classList.toggle('active', !!fileName);
        });

        // Video upload form
        document.getElementById('videoForm').addEventListener('submit', async (e) => {
          e.preventDefault();

          const videoFile = document.getElementById('videoFile').files[0];
          const description = document.getElementById('description').value;

          if (!videoFile || !description) {
            showMessage('statusMessage', 'Please select a video and add a description', 'error');
            return;
          }

          const formData = new FormData();
          formData.append('video', videoFile);
          formData.append('description', description);

          document.getElementById('postBtn').disabled = true;
          showMessage('statusMessage', 'Uploading and publishing video...', 'info');

          try {
            const response = await fetch('/api/publish/video', {
              method: 'POST',
              body: formData
            });

            const data = await response.json();

            if (response.ok) {
              showMessage('statusMessage', '✓ Video published successfully! (Sandbox Mode)', 'success');
              document.getElementById('videoForm').reset();
              document.getElementById('uploadSection').classList.remove('active');
              document.getElementById('fileName').textContent = '';
            } else {
              showMessage('statusMessage', 'Error: ' + (data.error || 'Failed to publish video'), 'error');
            }
          } catch (err) {
            showMessage('statusMessage', 'Error: ' + err.message, 'error');
          } finally {
            document.getElementById('postBtn').disabled = false;
          }
        });

        // Direct post form
        document.getElementById('directForm').addEventListener('submit', async (e) => {
          e.preventDefault();

          const description = document.getElementById('directDescription').value;

          if (!description) {
            showMessage('directStatusMessage', 'Please add a description', 'error');
            return;
          }

          document.getElementById('directPostBtn').disabled = true;
          showMessage('directStatusMessage', 'Creating post...', 'info');

          try {
            const response = await fetch('/api/publish/direct', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description })
            });

            const data = await response.json();

            if (response.ok) {
              showMessage('directStatusMessage', '✓ Post created successfully! (Sandbox Mode)', 'success');
              document.getElementById('directForm').reset();
            } else {
              showMessage('directStatusMessage', 'Error: ' + (data.error || 'Failed to create post'), 'error');
            }
          } catch (err) {
            showMessage('directStatusMessage', 'Error: ' + err.message, 'error');
          } finally {
            document.getElementById('directPostBtn').disabled = false;
          }
        });

        function showMessage(elementId, message, type) {
          const el = document.getElementById(elementId);
          el.textContent = message;
          el.className = 'status-message ' + type;
        }
      </script>
    </body>
    </html>
  `;
}

// ============================================================================
// ROUTES
// ============================================================================

// Home page
app.get('/', (req, res) => {
  if (req.session.accessToken) {
    return res.redirect('/dashboard');
  }
  res.send(getLoginPage());
});

// Step 1: Initiate OAuth - Redirect to TikTok
app.get('/auth/tiktok', (req, res) => {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.REDIRECT_URI;
  const scopes = ['user.info.basic', 'video.publish', 'video.upload'];

  if (!clientKey || !redirectUri) {
    return res.status(500).json({ error: 'Missing TIKTOK_CLIENT_KEY or REDIRECT_URI in environment variables' });
  }

  const authUrl = `https://www.tiktok.com/v1/oauth/authorize?client_key=${clientKey}&response_type=code&scope=${scopes.join(',')}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${Math.random().toString(36).substring(7)}`;

  res.redirect(authUrl);
});

// Step 2: Handle OAuth Callback
app.get('/auth/tiktok/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Authorization failed: No code received');
  }

  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    if (!clientKey || !clientSecret || !redirectUri) {
      throw new Error('Missing required environment variables');
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const { access_token, open_id } = tokenResponse.data.data;

    if (!access_token) {
      throw new Error('No access token received from TikTok');
    }

    // Store in session
    req.session.accessToken = access_token;
    req.session.openId = open_id;
    req.session.save((err) => {
      if (err) {
        return res.status(500).send('Session error: ' + err.message);
      }
      res.redirect('/dashboard');
    });

  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed: ' + (error.response?.data?.error_description || error.message));
  }
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/');
  }

  try {
    // Fetch user info
    const userResponse = await axios.get(
      'https://open.tiktokapis.com/v2/user/info/',
      {
        params: {
          fields: 'open_id,union_id,avatar_url,display_name'
        },
        headers: {
          'Authorization': `Bearer ${req.session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const userInfo = userResponse.data.data.user;
    res.send(getDashboardPage(userInfo));

  } catch (error) {
    console.error('User Info Error:', error.response?.data || error.message);
    // Show dashboard anyway with limited info
    const fallbackUser = {
      display_name: 'TikTok User',
      open_id: req.session.openId || 'Unknown',
      avatar_url: null
    };
    res.send(getDashboardPage(fallbackUser));
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.redirect('/');
  });
});

// ============================================================================
// CONTENT PUBLISHING API ROUTES
// ============================================================================

// Video Publishing - Step 1: Initialize Upload
app.post('/api/publish/video', upload.single('video'), async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    // Step 1: Initialize video upload
    const initResponse = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      {
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: req.file.size
        },
        post_info: {
          title: description,
          description: description
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${req.session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { upload_url, publish_id } = initResponse.data.data;

    if (!upload_url) {
      throw new Error('No upload URL received');
    }

    // Step 2: Upload video file
    const videoBuffer = fs.readFileSync(req.file.path);

    await axios.put(upload_url, videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4'
      }
    });

    // Step 3: Publish (in sandbox, this initiates but doesn't actually publish)
    const publishResponse = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/video/publish/',
      {
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: req.file.size
        },
        post_info: {
          title: description,
          description: description
        },
        publish_id: publish_id
      },
      {
        headers: {
          'Authorization': `Bearer ${req.session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Video published successfully (Sandbox Mode)',
      publish_id: publishResponse.data.data?.publish_id
    });

  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Video Publishing Error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error_description || error.message || 'Failed to publish video'
    });
  }
});

// Direct Post Publishing
app.post('/api/publish/direct', async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/post/publish/content/init/',
      {
        post_info: {
          title: description,
          description: description
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${req.session.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Direct post created successfully (Sandbox Mode)',
      post_id: response.data.data?.post_id
    });

  } catch (error) {
    console.error('Direct Post Error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error_description || error.message || 'Failed to create post'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Hardaway Labs Social - TikTok Demo      ║
║   Server running on http://localhost:${PORT}   ║
║   Status: Ready for OAuth flow            ║
╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
