# Demo Checklist - TikTok API Integration

Use this checklist when recording your developer review demo video.

## Pre-Demo Setup

- [ ] App running locally with `npm start`
- [ ] TikTok Developer credentials configured in `.env`
- [ ] Browser opened to `http://localhost:3000`
- [ ] Browser developer tools closed (clean screen)
- [ ] Screen resolution set to 1920x1080 or similar
- [ ] Recording software ready (Loom, OBS, ScreenFlow, etc.)
- [ ] Clear desk/workspace visible in frame

## Demo Flow (Script)

### Segment 1: Introduction (30 seconds)

```
"This is the Hardaway Labs Social TikTok API integration demo.
I'm going to walk through the OAuth login flow and content
publishing capabilities using TikTok's API v2."
```

- [ ] Show application homepage with "Hardaway Labs Social" branding
- [ ] Highlight the "Sign in with TikTok" button
- [ ] Point out the feature list below the button

### Segment 2: OAuth Login Flow (1-2 minutes)

```
"First, I'll click the login button, which will redirect to
TikTok's OAuth authorization page."
```

- [ ] Click "Sign in with TikTok" button
- [ ] Pause briefly to show the redirect
- [ ] Show TikTok OAuth consent screen
- [ ] Explain the requested scopes: user.info.basic, video.publish, video.upload
- [ ] Complete TikTok login (or skip if already logged in)
- [ ] Grant permissions on consent screen

```
"After authorizing, we're redirected back to the dashboard
with the user's TikTok profile information."
```

- [ ] Show dashboard loading
- [ ] Highlight user avatar and display name
- [ ] Point out the "Connected" status indicator
- [ ] Note the "Sandbox Mode - Demo Only" disclaimer

### Segment 3: Profile Information (30 seconds)

```
"The dashboard displays the authenticated user's profile details,
including their Open ID which is used for API calls."
```

- [ ] Hover over avatar to show image loads from TikTok
- [ ] Highlight the Open ID display
- [ ] Explain what this info will be used for in API calls

### Segment 4: Video Upload (2-3 minutes)

```
"Next, let's upload a video. I'll click on the Video Upload tab
and select a sample video file."
```

- [ ] Ensure you're on the "Video Upload" tab
- [ ] Click "Choose Video File" button
- [ ] Select a video file from your system
- [ ] Show the file name appears after selection

```
"Now I'll add a description for the video. This will be the title
and description when the video is published."
```

- [ ] Click in the Description field
- [ ] Type a sample description: "Check out this amazing content! #TikTok #API"
- [ ] Point out the form validation in real time

```
"With the video selected and description added, I can now
click the 'Publish Video' button to initiate the upload."
```

- [ ] Click "Publish Video" button
- [ ] Show the status message appearing: "Uploading and publishing video..."
- [ ] Wait for response (show success or relevant message)

```
"The video has been submitted for publishing. In production, this
would immediately appear on the user's TikTok account. In sandbox
mode, the request is accepted and logged."
```

- [ ] Show the success message
- [ ] Point out the "Sandbox Mode" note in the message
- [ ] Show the form has cleared (ready for next upload)

### Segment 5: Direct Post (1 minute)

```
"We also support direct text-based posts. Let me click on the
'Direct Post' tab."
```

- [ ] Click the "Direct Post" tab
- [ ] Show the simplified form (just description field)

```
"For direct posts, we only need a description. This uses a different
API endpoint optimized for quick content creation."
```

- [ ] Click in the description field
- [ ] Type a sample post: "Loving the new TikTok API capabilities!"
- [ ] Click "Create Direct Post"
- [ ] Show success message

### Segment 6: Logout & Conclusion (30 seconds)

```
"Finally, I can log out by clicking the Logout button in the header,
which clears the session and returns to the login page."
```

- [ ] Click "Logout" button
- [ ] Show redirect back to home page
- [ ] Point out we're back at the initial login screen

```
"This demo shows a complete OAuth 2.0 implementation with the
TikTok Login Kit and Content Posting API. The code is production-ready
and can be deployed to Render in minutes. All endpoints are properly
error-handled and the session management is secure."
```

## Recording Tips

### Video Quality
- [ ] Use 1080p or higher resolution
- [ ] 60fps if possible
- [ ] Good lighting (face visible if showing yourself)
- [ ] Minimize background distractions

### Pacing
- [ ] Speak clearly and at moderate pace
- [ ] Pause between segments (3-5 seconds)
- [ ] Allow API responses to fully load before proceeding
- [ ] Don't rush through important parts

### Navigation
- [ ] Move mouse deliberately (not too fast)
- [ ] Highlight important UI elements with mouse hover
- [ ] Click buttons with purposeful intent
- [ ] Wait for page loads to complete

### Audio
- [ ] Use a quiet environment
- [ ] Speak into the microphone directly
- [ ] Avoid background noise
- [ ] Test audio levels before recording

## Post-Recording

- [ ] Review final video for timing and clarity
- [ ] Total length: 5-8 minutes recommended
- [ ] Export at high quality (preferably MP4)
- [ ] Test playback on different devices
- [ ] Prepare upload to TikTok Developer Review

## Optional Enhancements

Show these if time permits:

### Code Review
- [ ] Open `server.js` in editor
- [ ] Show OAuth endpoint implementation
- [ ] Highlight error handling
- [ ] Show API token exchange code

### Environment Configuration
- [ ] Show `.env.example` template
- [ ] Explain each configuration variable
- [ ] Point out security best practices

### Deployment
- [ ] Show Render.yaml configuration
- [ ] Explain how to deploy to Render free tier
- [ ] Point out automatic GitHub integration

### Testing Different Scenarios
- [ ] Show what happens if you try to upload without logging in
- [ ] Demonstrate form validation
- [ ] Show error message handling

## Common Issues to Avoid

- [ ] Don't show real credentials in code
- [ ] Don't record actual personal TikTok account info if sensitive
- [ ] Don't use extremely large video files (testing can be slow)
- [ ] Don't skip the OAuth screen - it's important to show
- [ ] Don't ignore error messages - address them in narrative
- [ ] Don't record with notifications/Slack visible

## File Checklist

Before submitting, verify all files are present:

- [ ] `server.js` - Main application (30KB, ~900 lines)
- [ ] `package.json` - Dependencies configured
- [ ] `.env.example` - Template for credentials
- [ ] `render.yaml` - Render deployment config
- [ ] `README.md` - Full documentation
- [ ] `QUICKSTART.md` - Quick setup guide
- [ ] `.gitignore` - Git configuration
- [ ] `DEMO_CHECKLIST.md` - This file

## Submission Checklist

- [ ] Video recorded and exported
- [ ] Video is clear and professional
- [ ] Audio is audible and clear
- [ ] All endpoints demonstrated working
- [ ] Error handling shown (at least briefly)
- [ ] Total length is 5-8 minutes
- [ ] Code is clean and well-commented
- [ ] All environment variables properly configured
- [ ] README is comprehensive
- [ ] Deployed to Render (optional but shows completeness)

---

Good luck with your demo! This app showcases TikTok API best practices. 🚀
