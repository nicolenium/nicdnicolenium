
# Progressive Web App (PWA) Documentation

## Overview
This application is configured as a Progressive Web App (PWA), allowing users to install it on their devices, play offline, and receive push notifications.

## Features
- **Offline Support:** Service worker caches static assets and provides an offline fallback.
- **Installable:** `manifest.json` is configured with icons and theme colors.
- **Background Sync:** Ready for background data synchronization.
- **Push Notifications:** Service worker includes push event listeners.

## Setup Instructions
1. The `manifest.json` and `service-worker.js` are located in the `public/` directory.
2. The service worker is registered in `src/main.jsx`.
3. Meta tags are included in `index.html`.

## Generating App Icons
To generate the required app icons (48x48, 72x72, 96x96, 144x144, 192x192, 512x512) and splash screens:
1. Use a tool like [PWA Asset Generator](https://github.com/vite-pwa/assets-generator) or [RealFaviconGenerator](https://realfavicongenerator.net/).
2. Place the generated PNG files in `public/app-icons/`.
3. Update `manifest.json` to point to these new files if you change the naming convention.

## Submitting to App Stores
### Google Play Store (Android)
You can wrap this PWA into an Android app using **Trusted Web Activities (TWA)** or **Capacitor**.
1. Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) to generate an APK/AAB.
2. Sign the APK using Android Studio or the command line.
3. Create a developer account on Google Play Console and upload the AAB file.

### Apple App Store (iOS)
Apple requires PWAs to be wrapped in a native shell (like WKWebView) to be listed in the App Store.
1. Use **Capacitor** (`npx cap add ios`) to wrap the web app.
2. Open the project in Xcode.
3. Configure your signing certificates and provisioning profiles.
4. Archive and upload to App Store Connect.

## Testing Checklist
- [ ] Verify "Install App" prompt appears on supported browsers.
- [ ] Test offline mode by disabling network in DevTools.
- [ ] Verify Lighthouse PWA score is 100/100.
- [ ] Check responsive design on mobile (320px) and tablet (768px).
