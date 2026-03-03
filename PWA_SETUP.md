# PWA Configuration Guide for Shift

This document outlines the Progressive Web App (PWA) setup for the Shift application.

## What's Configured

### 1. **Manifest File** (`public/manifest.json`)

- Complete app metadata (name, description, start URL)
- Multiple icon sizes for different devices (192px, 512px)
- Maskable icons for adaptive backgrounds
- Display mode: `standalone` (full app experience without browser UI)
- Theme color and background color matching branding
- Screenshots for install prompts
- Categories and scope settings

### 2. **Service Worker** (`public/sw.js`)

Custom service worker with:

- Installation and activation events
- Network-first caching strategy with fallback to cache
- Automatic cache updates
- Works offline with cached content
- Supports message handling for updates

### 3. **Next.js PWA Configuration** (`next.config.ts`)

Using `next-pwa` plugin with:

- Automatic service worker generation and registration
- Runtime caching for fonts and images
- Skip waiting for faster updates
- Cache busting with proper versioning

### 4. **HTML Metadata** (`src/app/layout.tsx`)

Complete PWA support with:

- Manifest link in metadata
- Apple Web App meta tags for iOS support
- Viewport configuration for mobile
- Theme color specification
- Apple touch icon setup
- Status bar styling for iOS

### 5. **Installation Handler** (`src/app/page.tsx`)

Smart download button that:

- Detects `beforeinstallprompt` event (Android/Chrome)
- Falls back to manual instructions for iOS/Safari
- Registers service worker on load
- Handles app installation confirmation
- Redirects to dashboard after successful install
- Checks if app is already installed

## How Installation Works

### Android/Chrome Users

1. User clicks "Download App" or "Get Shift" button
2. Browser shows native install prompt
3. User confirms installation
4. App installed to home screen
5. Opens with standalone experience

### iOS Users

1. User clicks "Download App" button
2. Shows instructions since iOS doesn't support `beforeinstallprompt`
3. User manually adds to home screen via Share menu
4. App works as web app with offline support

## Installation Instructions for Users

### Chrome/Edge/Brave (Android & Desktop)

```
1. Click "Download App" button
2. Tap "Install" when prompted
3. App appears on home screen
4. Opens full-screen without browser UI
```

### Safari (iOS & macOS)

```
1. Click "Get Shift" button
2. Tap "Share" icon (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Confirm with "Add"
5. Icon appears on home screen
```

## Features Enabled

✅ **Offline Support** - Works without internet using cached content
✅ **Fast Loading** - Cached resources load instantly
✅ **Mobile App Feel** - Full-screen, no browser chrome
✅ **Home Screen Icon** - Appears like native app
✅ **Splash Screen** - Custom startup experience (iOS)
✅ **Status Bar Styling** - Integrates with OS on iOS
✅ **Background Sync** - Can sync data when back online
✅ **Install Prompt** - Native install UI on supported browsers

## Development vs Production

- **Development**: PWA is disabled (`disable: process.env.NODE_ENV === "development"`)
- **Production**: Full PWA features enabled

To test PWA in development, remove the `disable` condition or set `NODE_ENV=production`.

## Testing PWA Installation

1. **Chrome DevTools**
   - Open DevTools → Application → Service Workers
   - Check "Service Worker" is registered
   - Go to "Manifest" tab to verify manifest.json

2. **Test Offline**
   - Check "Offline" in DevTools Network tab
   - Verify cached pages still load

3. **Install Testing**
   - Chrome: Look for install icon in address bar
   - Android: Use "Add to Home Screen" from menu
   - iOS: Use Share → Add to Home Screen

## File Structure

```
shift/
├── public/
│   ├── manifest.json          # PWA metadata
│   ├── sw.js                  # Service worker
│   └── images/
│       └── shift.png          # App icons
├── src/
│   └── app/
│       ├── layout.tsx         # PWA meta tags
│       └── page.tsx           # Install handler
└── next.config.ts             # PWA configuration
```

## Browser Support

| Browser | Android | iOS    | Desktop |
| ------- | ------- | ------ | ------- |
| Chrome  | ✅ Full | ✅ Web | ✅ Full |
| Firefox | ✅ Full | ✅ Web | ✅ Full |
| Safari  | N/A     | ✅ Web | ✅ Web  |
| Edge    | ✅ Full | ✅ Web | ✅ Full |

**Full** = Native install and offline support
**Web** = Webpage shortcut with offline support

## Troubleshooting

### Install prompt not showing

- Clear browser cache
- Ensure app meets PWA criteria (HTTPS in production, manifest.json valid)
- Refresh page after changes

### Service worker not updating

- Close and reopen the app
- Clear site data in browser settings
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Images not loading offline

- Check that images are in public folder
- Verify image URLs are relative
- Ensure caching rules include image extensions

## Next Steps

1. **Customize Icons** - Replace `shift.png` with higher resolution versions
   - 192x192 for standard
   - 512x512 for splash screens
   - 1024x1024 for maximum compatibility

2. **Add Offline Page** - Create a custom offline.html page

3. **Notification Support** - Add push notifications for task reminders

4. **Background Sync** - Sync task completions when online

5. **Shortcuts** - Add app shortcuts for quick actions (new task, view profile)

## Resources

- [Web App Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [next-pwa Documentation](https://github.com/shadowwalker/next-pwa)
- [PWA Checklist](https://web.dev/pwa-checklist/)
