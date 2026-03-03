# PWA Testing & Verification Checklist

## Before Testing

1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Access via `https://localhost:3000` (PWA features require HTTPS or localhost)

## Automated Checks

### Service Worker Registration

```javascript
// Run in browser console
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log("Service Workers:", registrations);
  registrations.forEach((reg) => {
    console.log("Scope:", reg.scope);
    console.log("Active:", reg.active);
    console.log("Installing:", reg.installing);
    console.log("Waiting:", reg.waiting);
  });
});
```

### Check Manifest Loading

```javascript
// Run in browser console
fetch("/manifest.json")
  .then((r) => r.json())
  .then((manifest) => {
    console.log("Manifest loaded successfully:", manifest);
    console.log("App name:", manifest.name);
    console.log("Start URL:", manifest.start_url);
    console.log("Icons:", manifest.icons.length);
  })
  .catch((e) => console.error("Manifest error:", e));
```

## Manual Testing Steps

### 1. Service Worker Check

- [ ] Open DevTools (F12)
- [ ] Go to "Application" tab
- [ ] Click "Service Workers"
- [ ] Verify `sw.js` is listed and "active and running"
- [ ] Click "Cache Storage" to see cached assets

### 2. Manifest Validation

- [ ] Still in Application tab
- [ ] Click "Manifest"
- [ ] Verify all fields display correctly:
  - [ ] Name: "Shift | Lock In"
  - [ ] Start URL: "/dashboard"
  - [ ] Display: "standalone"
  - [ ] Icons are listed
  - [ ] No warnings/errors shown

### 3. Installation Prompt (Chrome/Edge)

- [ ] Look for install icon in address bar (download icon or menu)
- [ ] Click it - install prompt should appear
- [ ] Click "Install"
- [ ] App should appear on desktop/home screen
- [ ] Opening app should load full-screen without browser UI

### 4. Offline Functionality

- [ ] In DevTools Network tab, check "Offline"
- [ ] Refresh page (Ctrl+F5)
- [ ] Page should still load from cache
- [ ] Navigation should work
- [ ] API calls may fail gracefully

### 5. iOS Testing (if available)

- [ ] Open Safari on iPhone
- [ ] Visit application URL
- [ ] Tap Share button (bottom right)
- [ ] Tap "Add to Home Screen"
- [ ] Name should be "Shift"
- [ ] Tap "Add"
- [ ] Icon appears with correct image
- [ ] Full-screen when opened

### 6. Different Browsers

- [ ] **Chrome**: Install via icon, offline mode works
- [ ] **Firefox**: Install via menu (three dots), offline works
- [ ] **Edge**: Install via icon, offline works
- [ ] **Safari (iOS)**: Add via Share menu, offline cached
- [ ] **Safari (macOS)**: Add via Share menu if supported

## Expected Behavior

### Download Button

- ✅ Android/Chrome: Shows native install prompt
- ✅ iOS: Shows instruction alert
- ✅ Already installed: Navigates to dashboard
- ✅ Fallback: Shows manual installation steps

### After Installation

- ✅ App name shown: "Shift | Lock In"
- ✅ Standalone mode: No browser address bar
- ✅ Status bar: Matches theme color (#050505)
- ✅ Offline: Cached pages load without internet
- ✅ Updated indicator: Shows when updates available

## Console Checks

### Service Worker Logs

You should see these in the console:

```
Service Worker registered: ServiceWorkerRegistration
beforeinstallprompt event fired (on first visit before install)
appinstalled (when install is confirmed)
PWA installed successfully (on install)
```

### Common Issues in Console

| Issue                                | Solution                                  |
| ------------------------------------ | ----------------------------------------- |
| `Service Worker registration failed` | Check browser supports SW, use HTTPS      |
| `Failed to load manifest`            | Check manifest.json exists in public/     |
| `Icons 404`                          | Ensure shift.png exists in public/images/ |
| `Mixed Content blocked`              | Use HTTPS for all resources in production |

## Lighthouse Audit

1. Open DevTools
2. Go to "Lighthouse" tab
3. Select "PWA"
4. Click "Analyze page load"
5. Should see all PWA checks pass:
   - [ ] Installable
   - [ ] Fast reliable
   - [ ] Web app metadata
   - [ ] Offline support
   - [ ] Service worker

## Production Deployment

Before deploying to production:

1. **HTTPS Required**: PWA only works over HTTPS (or localhost)

   ```bash
   # Check in next.config.ts
   # Ensure domain uses SSL certificate
   ```

2. **Icons**: Replace shift.png with actual app icons

   ```bash
   # Recommended sizes
   192x192.png   # Standard
   512x512.png   # Includes splashscreen
   1024x1024.png # Maximum
   ```

3. **Test on Real Device**:
   - [ ] Deploy to staging/production domain
   - [ ] Test on real Android phone
   - [ ] Test on real iPhone
   - [ ] Test install workflow
   - [ ] Test offline behavior

4. **Monitor PWA Health**:
   - Check console for errors
   - Monitor service worker updates
   - Track installation rates
   - Monitor offline usage

## Quick Verification Command

```bash
# Build and test locally
npm run build && npm start

# Then in browser console:
navigator.serviceWorker.getRegistrations().then(r => {
  console.log('SW Active:', r[0]?.active ? '✅' : '❌');
  fetch('/manifest.json').then(m => m.json()).then(j => {
    console.log('Manifest:', j.name ? '✅' : '❌');
  });
});
```

## Troubleshooting Guide

### Install Prompt Not Showing

```javascript
// Check why prompt isn't available
console.log(
  "beforeinstallprompt available:",
  "onbeforeinstallprompt" in window,
);
```

### Clear Everything and Restart

1. Uninstall app if installed
2. Clear DevTools:
   - Application → Clear cache
   - Application → Unregister Service Worker
3. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Reload page

### Force Service Worker Update

```javascript
// In console
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((reg) => {
    reg.update(); // Check for updates
  });
});
```

## Reference URLs

- [PWA Setup Documentation](./PWA_SETUP.md)
- [web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Manifest Spec](https://www.w3.org/TR/appmanifest/)
