"""
Hardaway Labs Social - TikTok OAuth Login & Content Posting Demo
This is a Flask app demonstrating TikTok's Login Kit (OAuth 2.0) and Content Posting API.

IMPORTANT: This demo is for SANDBOX environment. The Client Key will differ from production.
In production, you would use TIKTOK_CLIENT_KEY (production) instead of TIKTOK_SANDBOX_CLIENT_KEY.

Author: Hardaway Labs
"""

import os
import requests
import json
import hashlib
import base64
import secrets
from datetime import datetime
from functools import wraps
from urllib.parse import urlencode

from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')

# TikTok OAuth Configuration
# NOTE: For sandbox/demo environment, we use TIKTOK_CLIENT_KEY
# For production, replace with production credentials
TIKTOK_CLIENT_KEY = os.getenv('TIKTOK_CLIENT_KEY')
TIKTOK_CLIENT_SECRET = os.getenv('TIKTOK_CLIENT_SECRET')
TIKTOK_REDIRECT_URI = os.getenv('TIKTOK_REDIRECT_URI', 'https://hardaway-labs-social.onrender.com/auth/tiktok/callback')

# TikTok API Endpoints
TIKTOK_AUTHORIZE_URL = 'https://www.tiktok.com/v2/auth/authorize/'
TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
TIKTOK_USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/'
TIKTOK_VIDEO_INIT_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/'
TIKTOK_DRAFT_INIT_URL = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/'
TIKTOK_UPLOAD_CHUNK_URL = 'https://open.tiktokapis.com/v2/post/publish/video/chunk/upload/'
TIKTOK_PUBLISH_URL = 'https://open.tiktokapis.com/v2/post/publish/video/publish/'

# Required scopes for TikTok
TIKTOK_SCOPES = ['user.info.basic', 'video.publish', 'video.upload']


def login_required(f):
    """Decorator to require user to be logged in."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'tiktok_access_token' not in session:
            flash('Please login with TikTok first.', 'error')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def index():
    """Home page - displays login button."""
    return render_template('index.html')


@app.route('/login')
def login():
    """Initiates TikTok OAuth 2.0 login flow with PKCE."""

    # Generate PKCE code_verifier and code_challenge
    code_verifier = secrets.token_urlsafe(43)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).rstrip(b'=').decode()

    # Store code_verifier in session for the token exchange
    session['code_verifier'] = code_verifier

    # Generate OAuth authorization URL
    params = {
        'client_key': TIKTOK_CLIENT_KEY,
        'redirect_uri': TIKTOK_REDIRECT_URI,
        'scope': ','.join(TIKTOK_SCOPES),
        'response_type': 'code',
        'state': 'random_state_string',
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256',
    }

    auth_url = f"{TIKTOK_AUTHORIZE_URL}?{urlencode(params)}"
    return redirect(auth_url)


@app.route('/auth/tiktok/callback')
def tiktok_callback():
    """Handle TikTok OAuth 2.0 callback."""

    # Get authorization code from query parameters
    auth_code = request.args.get('code')

    if not auth_code:
        flash('Authorization failed. Please try again.', 'error')
        return redirect(url_for('index'))

    try:
        # Exchange authorization code for access token (with PKCE verifier)
        code_verifier = session.pop('code_verifier', '')
        token_data = {
            'client_key': TIKTOK_CLIENT_KEY,
            'client_secret': TIKTOK_CLIENT_SECRET,
            'code': auth_code,
            'grant_type': 'authorization_code',
            'redirect_uri': TIKTOK_REDIRECT_URI,
            'code_verifier': code_verifier,
        }

        token_response = requests.post(TIKTOK_TOKEN_URL, data=token_data, timeout=10)
        token_response.raise_for_status()

        token_result = token_response.json()

        if token_result.get('error'):
            flash(f"Token error: {token_result.get('error_description', 'Unknown error')}", 'error')
            return redirect(url_for('index'))

        # Store access token and user ID in session
        access_token = token_result.get('access_token')
        user_id = token_result.get('open_id')

        session['tiktok_access_token'] = access_token
        session['tiktok_user_id'] = user_id

        # Fetch user info
        user_info = get_user_info(access_token, user_id)

        if user_info:
            session['user_display_name'] = user_info.get('display_name', 'TikTok User')
            session['user_avatar'] = user_info.get('avatar_url', '')
            session['user_bio'] = user_info.get('bio_description', '')

        flash('Successfully logged in with TikTok!', 'success')
        return redirect(url_for('dashboard'))

    except requests.RequestException as e:
        flash(f'Login error: {str(e)}', 'error')
        return redirect(url_for('index'))


@app.route('/dashboard')
@login_required
def dashboard():
    """Dashboard page showing user info and video upload form."""

    user_info = {
        'display_name': session.get('user_display_name', 'User'),
        'avatar': session.get('user_avatar', ''),
        'bio': session.get('user_bio', '')
    }

    return render_template('dashboard.html', user=user_info)


@app.route('/api/upload-video', methods=['POST'])
@login_required
def upload_video():
    """Handle video file upload and posting to TikTok."""

    try:
        # Get form data
        video_file = request.files.get('video_file')
        caption = request.form.get('caption', '')
        post_type = request.form.get('post_type', 'draft')  # 'draft' or 'direct'

        if not video_file:
            return jsonify({'success': False, 'error': 'No video file provided'}), 400

        # Read video file into memory
        video_data = video_file.read()
        filename = video_file.filename

        if not filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
            return jsonify({'success': False, 'error': 'Invalid video format. Please upload MP4, MOV, AVI, or MKV.'}), 400

        access_token = session.get('tiktok_access_token')
        user_id = session.get('tiktok_user_id')

        # Step 1: Initialize video upload
        init_response = init_video_upload(access_token, user_id, post_type, video_size=len(video_data))

        if not init_response or 'error' in init_response:
            error_msg = init_response.get('error_description', 'Failed to initialize upload') if init_response else 'Upload initialization failed'
            return jsonify({'success': False, 'error': error_msg}), 400

        upload_id = init_response.get('data', {}).get('upload_id')
        if not upload_id:
            return jsonify({'success': False, 'error': 'No upload_id returned from TikTok'}), 400

        # Step 2: Upload video chunks
        chunk_response = upload_video_chunk(access_token, upload_id, video_data)

        if not chunk_response or 'error' in chunk_response:
            error_msg = chunk_response.get('error_description', 'Failed to upload video') if chunk_response else 'Video upload failed'
            return jsonify({'success': False, 'error': error_msg}), 400

        # Step 3: Publish the video
        publish_response = publish_video(access_token, upload_id, caption, post_type)

        if not publish_response or 'error' in publish_response:
            error_msg = publish_response.get('error_description', 'Failed to publish video') if publish_response else 'Video publication failed'
            return jsonify({'success': False, 'error': error_msg}), 400

        # Success!
        result_data = {
            'success': True,
            'message': f'Video successfully {"posted" if post_type == "direct" else "saved as draft"}!',
            'upload_id': upload_id,
            'post_type': post_type,
            'caption': caption
        }

        return jsonify(result_data), 200

    except Exception as e:
        app.logger.error(f"Video upload error: {str(e)}")
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'}), 500


@app.route('/logout')
def logout():
    """Logout user and clear session."""
    session.clear()
    flash('Successfully logged out.', 'success')
    return redirect(url_for('index'))


# ===== Helper Functions =====

def get_user_info(access_token, user_id):
    """Fetch user info from TikTok API."""
    try:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        params = {
            'fields': 'open_id,union_id,user_id,display_name,avatar_url,bio_description'
        }

        response = requests.get(
            TIKTOK_USER_INFO_URL,
            headers=headers,
            params=params,
            timeout=10
        )
        response.raise_for_status()

        result = response.json()

        if result.get('data'):
            return result['data']
        return None

    except Exception as e:
        app.logger.error(f"Error fetching user info: {str(e)}")
        return None


def init_video_upload(access_token, user_id, post_type='draft', video_size=0):
    """Initialize video upload with TikTok API."""
    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        # Use different endpoint for draft vs direct post
        url = TIKTOK_DRAFT_INIT_URL if post_type == 'draft' else TIKTOK_VIDEO_INIT_URL

        payload = {
            'post_info': {
                'title': 'Video Upload',
                'privacy_level': 'SELF_ONLY',
            },
            'source_info': {
                'source': 'FILE_UPLOAD',
                'video_size': video_size,
                'chunk_size': min(video_size, 5242880),
                'total_chunk_count': max(1, (video_size + 5242879) // 5242880),
            }
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        return response.json()

    except Exception as e:
        app.logger.error(f"Error initializing upload: {str(e)}")
        return {'error': 'init_failed', 'error_description': str(e)}


def upload_video_chunk(access_token, upload_id, video_data, chunk_size=5242880):
    """Upload video in chunks to TikTok API."""
    try:
        # Calculate chunks
        total_size = len(video_data)
        chunks_count = (total_size + chunk_size - 1) // chunk_size

        for chunk_index in range(chunks_count):
            start = chunk_index * chunk_size
            end = min((chunk_index + 1) * chunk_size, total_size)
            chunk_data = video_data[start:end]

            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Range': f'bytes {start}-{end-1}/{total_size}',
                'Content-Type': 'video/mp4'
            }

            params = {
                'upload_id': upload_id,
                'chunk_index': chunk_index
            }

            response = requests.post(
                TIKTOK_UPLOAD_CHUNK_URL,
                headers=headers,
                params=params,
                data=chunk_data,
                timeout=30
            )
            response.raise_for_status()

            result = response.json()
            if result.get('error'):
                return result

        return {'success': True}

    except Exception as e:
        app.logger.error(f"Error uploading video chunk: {str(e)}")
        return {'error': 'chunk_upload_failed', 'error_description': str(e)}


def publish_video(access_token, upload_id, caption='', post_type='draft'):
    """Publish video to TikTok."""
    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        payload = {
            'data': {
                'upload_id': upload_id
            }
        }

        # Add caption if provided and posting directly
        if caption and post_type == 'direct':
            payload['data']['title'] = caption
            payload['publish_info'] = {
                'title': caption
            }

        response = requests.post(
            TIKTOK_PUBLISH_URL,
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()

        return response.json()

    except Exception as e:
        app.logger.error(f"Error publishing video: {str(e)}")
        return {'error': 'publish_failed', 'error_description': str(e)}


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return render_template('index.html'), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    app.logger.error(f"Server error: {str(error)}")
    flash('An unexpected error occurred. Please try again.', 'error')
    return redirect(url_for('index')), 500


if __name__ == '__main__':
    # Development server - use debug=True for auto-reload
    # In production, Render uses gunicorn via the Procfile
    port = int(os.getenv('PORT', 5002))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') != 'production'
    )
