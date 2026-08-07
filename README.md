# semiloker.com

Personal portfolio and devlog site hosted on Discloud.

## Structure

- `home.html` - Main landing page
- `about.html` - About me / whoami
- `devlog.html` - Development log for Pixora Engine
- `css/` - Stylesheets
- `js/` - Scripts

## Deploy to Discloud

### Via Discloud CLI

```bash
npm install -g discloud-cli
discloud login
discloud deploy
```

### Via Discloud Web Dashboard

1. Go to [discloud.app](https://discloud.app)
2. Sign in / Create account
3. Click "Upload App"
4. Upload this entire folder (zip it first)
5. Discloud will read `discloud.config` automatically

### Manual Upload

1. Zip all files in this directory
2. Upload to Discloud dashboard
3. The app will be configured using `discloud.config`

## Local Testing

Open `index.html` or `home.html` in your browser.

## Tech Stack

- Pure HTML5
- CSS3 (custom styling)
- No JavaScript frameworks
- Static site (no backend)
