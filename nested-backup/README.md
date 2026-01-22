<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your app (self-hosted, no Gemini required)

This repository contains a small client-side app that uses the Wikipedia REST API for search. You can run it locally for development or build a static site and host it yourself (nginx, Caddy, Docker, etc.)

## Run locally (development)
**Prerequisites:** Node.js

1. Install dependencies:
   npm ci
2. Run the dev server:
   npm run dev
3. Open the URL shown by Vite (default: http://localhost:5173)

## Build and serve a static production site
1. Build:
   npm run build
2. Serve the `dist` directory with any static server:
   - Simple test server:
     npx serve -s dist
   - Or configure nginx/Caddy to point root to `/path/to/repo/dist` and use single-page fallback to `index.html`.

## Docker (recommended for simple hosting)
A Dockerfile is included that builds the app and serves it via nginx.

1. Build the image:
   docker build -t hhgttg:latest .
2. Run:
   docker run -d -p 80:80 --name hhgttg hhgttg:latest
3. Visit http://<host-ip> in a browser.

## Notes
- The app now uses the Wikipedia REST API and does not require any external API key.
- If you need a private/controlled search proxy (to add caching, rate-limits, or to avoid CORS in some environments), consider adding a tiny proxy service that endpoints to Wikipedia and caches results.
- If you later want to integrate a local LLM backend instead of Wikipedia, add a server component (Express/Fastify) to proxy model calls and update SearchScreen to call that server.
