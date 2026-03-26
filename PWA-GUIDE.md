# Progressive Web App (PWA) Guide

GoalTrack is now a fully functional Progressive Web App that works offline!

## Features

### Offline Support
- Works without an internet connection
- All your goals and tasks are stored locally
- Service Worker caches essential files for offline access
- Automatically syncs when connection is restored

### Installation
You can install GoalTrack on your device:

**On Desktop (Chrome, Edge, Brave):**
1. Visit the GoalTrack website
2. Look for the install icon in the address bar
3. Click "Install" and the app will be added to your applications

**On Mobile (iOS Safari):**
1. Open GoalTrack in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

**On Mobile (Android Chrome):**
1. Open GoalTrack in Chrome
2. Tap the menu icon (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add" to confirm

### App Features
- **Standalone Mode**: Runs in its own window without browser UI
- **App Shortcuts**: Quick access to Goals and Dashboard
- **Offline First**: All features work without internet
- **Responsive Design**: Optimized for all screen sizes
- **Fast Loading**: Cached resources load instantly

## Technical Details

### Files Created
- `public/manifest.json` - PWA configuration
- `public/sw.js` - Service Worker for offline functionality
- `public/icon-*.svg` - App icons in various sizes
- Updated `index.html` with PWA meta tags

### Service Worker Strategy
- **Cache First**: Serves cached content when available
- **Network Fallback**: Fetches from network if not cached
- **Offline Fallback**: Shows cached content when offline
- **Dynamic Caching**: Automatically caches visited pages

### Browser Support
- Chrome/Edge: Full support
- Safari: Full support (iOS 11.3+)
- Firefox: Full support
- Samsung Internet: Full support

## Testing Offline Mode

1. Open DevTools (F12)
2. Go to Application tab
3. Select "Service Workers"
4. Check "Offline" checkbox
5. Refresh the page - it should still work!

## Cache Management

The service worker automatically:
- Caches essential files on first visit
- Updates cache when new versions are deployed
- Cleans up old cache versions
- Dynamically caches pages as you visit them

To manually clear cache:
1. Open DevTools
2. Go to Application > Storage
3. Click "Clear site data"

## Data Storage

All your goals and activity data are stored in:
- **localStorage**: For persistent data
- **Service Worker Cache**: For offline file access

Your data stays private and is stored only on your device.

## Updates

When a new version is available:
1. The service worker will download it in the background
2. It will activate on the next page load
3. No user action required

## Troubleshooting

**App not installing?**
- Make sure you're using HTTPS (required for PWA)
- Check if service worker is supported in your browser
- Try clearing browser cache and reloading

**Offline mode not working?**
- Check if service worker is registered (DevTools > Application)
- Ensure you visited the app at least once while online
- Try unregistering and re-registering the service worker

**Icons not showing?**
- Icons are SVG format and should work on all modern browsers
- Check browser console for any loading errors

## Development

To test PWA features during development:
```bash
npm run build
npm run preview
```

Note: Service workers only work over HTTPS or localhost.
