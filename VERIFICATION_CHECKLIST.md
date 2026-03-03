# ✅ PWA Implementation Verification Checklist

Complete this checklist to verify your PWA is properly set up.

## 📋 Pre-Flight Checks

### Files Exist

- [ ] `public/sw.js` exists (Custom service worker)
- [ ] `public/manifest.json` exists (App metadata)
- [ ] `public/images/shift.png` exists (App icon)
- [ ] `src/app/layout.tsx` updated with meta tags
- [ ] `src/app/page.tsx` updated with handlers
- [ ] `next.config.ts` updated with PWA config

### No Build Errors

- [ ] Run `npm run build` - completes without errors
- [ ] Run `npm start` - server starts successfully
- [ ] No TypeScript errors in console
- [ ] No console warnings about missing files

---

## 🏗️ Build & Setup Verification

### Step 1: Build Project

```bash
npm run build
```

- [ ] Completes without errors
- [ ] No warnings about missing manifest
- [ ] No warnings about service worker
- [ ] Build size reasonable (<10MB)

**Expected output:** Should list build info and completion message

### Step 2: Start Development Server

```bash
npm start
```

- [ ] Server starts on localhost:3000
- [ ] No port conflicts
- [ ] No module not found errors

**Expected output:** "ready - started server on 0.0.0.0:3000"

### Step 3: Open in Browser

```
http://localhost:3000
```

- [ ] Page loads without errors
- [ ] No 404 errors for resources
- [ ] CSS loads correctly
- [ ] Images display properly

---

## 🔍 Service Worker Verification

### Open DevTools

1. Press `F12` to open DevTools
2. Go to "Application" tab
3. Click "Service Workers" in left menu

**Expected:**

- [ ] Service worker listed with URL `/sw.js`
- [ ] Status shows "active and running" (green dot)
- [ ] Scope shows "/"
- [ ] No error messages

**If not showing:**

- [ ] Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- [ ] Clear cache: DevTools → Application → Clear site data
- [ ] Reload page

### Test Service Worker Update Check

Copy-paste in console:

```javascript
navigator.serviceWorker.controller.postMessage({ type: "CHECK_FOR_UPDATES" });
console.log("✓ Update check posted");
```

**Expected:** ✓ in console

---

## 📦 Manifest Verification

### In DevTools, Click "Manifest"

**Expected fields visible:**

- [ ] Name: "Shift | Lock In"
- [ ] Short name: "Shift"
- [ ] Start URL: "/dashboard"
- [ ] Display: "standalone"
- [ ] Theme color: "#050505"
- [ ] Background color: "#050505"
- [ ] 4 icons listed
- [ ] Screenshots section with 1 entry

**If manifest shows errors:**

- [ ] Check manifest.json syntax (use jsonlint.com)
- [ ] Verify all URLs start with "/"
- [ ] Verify icon files exist

### Manual Manifest Check

Run in console:

```javascript
fetch("/manifest.json")
  .then((r) => r.json())
  .then((m) => console.log("✓ Manifest OK:", m.name))
  .catch((e) => console.error("❌ Manifest Error:", e));
```

**Expected:** ✓ Manifest OK: Shift | Lock In

---

## 🖼️ Cache Verification

### Check Cache Storage

1. DevTools → Application → Cache Storage
2. Expand the cache entries

**Expected:**

- [ ] At least one cache named "shift-cache-v\*"
- [ ] Cache contains HTML/CSS/JS files
- [ ] Images cached
- [ ] No 404 errors for cached items

### Cache Contents

Expand cache and look for cached files

**Expected to see:**

- [ ] HTML pages
- [ ] Images from /public/images/
- [ ] CSS files
- [ ] JavaScript bundles

---

## 🔧 Installation Handler Verification

### Check beforeinstallprompt Event

Run in console:

```javascript
console.log(
  "beforeinstallprompt available:",
  "onbeforeinstallprompt" in window,
);
```

**Expected:** `true` on Chrome/Edge, `false` on Safari/Firefox

### Test Download Button

1. Scroll to top of page
2. Find "Download App" button in navbar
3. Click it

**Expected behavior:**

- **Chrome/Edge:** Browser install prompt appears (top of page)
- **Safari/Firefox:** Alert box with instructions
- **Mobile after install:** Redirects to dashboard

### Check Console Logs

1. Open DevTools Console tab
2. Look for these messages:
   - [ ] "Service Worker registered: ServiceWorkerRegistration"
   - [ ] "beforeinstallprompt event fired" (first visit before install)
   - [ ] "PWA installed successfully" (after install)

---

## 📱 Installation Testing

### Test on Chrome/Edge (Recommended)

1. Open page on Chrome/Edge
2. Look for install icon in address bar (⬇️ or menu)
3. Click it
4. Click "Install" in prompt
5. Should minimize and show "App installed"
6. App should appear on desktop/home screen
7. Opening app should show full-screen experience

**Checklist:**

- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] No directory bar visible when app opens
- [ ] App works offline (enable offline mode in DevTools)
- [ ] Performance good

### Test on Safari (iOS or Mac)

1. Tap/Click Share button
2. Tap/Click "Add to Home Screen"
3. Verify app name is "Shift"
4. Confirm and install
5. Verify appears on home screen

### Test on Android

1. Open Chrome
2. Wait for install prompt or click menu
3. Select "Install app"
4. Accept permissions
5. App should install to home screen

---

## 🌐 Offline Testing

### Enable Offline Mode

1. DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page (Ctrl+F5)

**Expected:**

- [ ] Page still loads (from cache)
- [ ] Navigation links still work
- [ ] Images display (from cache)
- [ ] No broken links
- [ ] Graceful handling of network requests

### Disable Offline Mode

1. Uncheck "Offline"
2. Refresh page
3. Network requests resume normally

---

## 🎨 Visual Verification

### Manifest & Icons

- [ ] App name displays correctly
- [ ] Icon shows in home screen/taskbar
- [ ] Theme color matches (dark #050505)
- [ ] Status bar color matches on iOS

### Responsive Design

- [ ] Works on mobile (375px width)
- [ ] Works on tablet (768px width)
- [ ] Works on desktop (1920px width)
- [ ] All buttons clickable
- [ ] Forms responsive

---

## 📊 Lighthouse PWA Audit

### Run Audit

1. DevTools → Lighthouse tab
2. Select "PWA" category
3. Click "Analyze page load"

**Expected Results:**

- [ ] ✅ Installable
- [ ] ✅ Fast and reliable
- [ ] ✅ Has web app metadata
- [ ] ✅ Supports offline experience
- [ ] ✅ Service worker installed correctly
- [ ] Score: 90+

**If any fail:**

- [ ] Check DevTools > Application > Manifest
- [ ] Verify service worker active
- [ ] Check console for errors

---

## 🧪 Advanced Verification

### Check Installation Status

Run in console:

```javascript
(async () => {
  if ("getInstalledRelatedApps" in navigator) {
    const apps = await navigator.getInstalledRelatedApps();
    console.log(
      "Installed apps:",
      apps.length > 0 ? "✓ App installed" : "✗ Not installed",
    );
  }
})();
```

### Get Service Worker Info

```javascript
navigator.serviceWorker.getRegistrations().then((regs) => {
  regs.forEach((reg) => {
    console.log("SW Scope:", reg.scope);
    console.log("SW Active:", reg.active ? "Yes" : "No");
    console.log("SW State:", reg.active?.state || "Not active");
  });
});
```

### List All Caches

```javascript
caches.keys().then((cacheNames) => {
  console.log("Caches:", cacheNames);
  cacheNames.forEach((cacheName) => {
    caches.open(cacheName).then((cache) => {
      cache.keys().then((requests) => {
        console.log(`${cacheName} has ${requests.length} items`);
      });
    });
  });
});
```

---

## 🚀 Production Readiness Checklist

### Before Deploying

- [ ] HTTPS enabled on domain (PWA requirement)
- [ ] Domain correctly configured in `metadataBase` (layout.tsx)
- [ ] manifest.json returns 200 status
- [ ] service worker returns 200 status
- [ ] Icons accessible from domain
- [ ] All external resources over HTTPS
- [ ] No mixed content warnings

### Test Production Build

```bash
npm run build
npm start
```

Then test all items above in production build

### Monitor After Deploy

- [ ] Check error logs for SW issues
- [ ] Monitor installation rates
- [ ] Watch for console errors
- [ ] Test on real devices (Android & iOS)
- [ ] Verify offline functionality

---

## 📋 Complete Verification Script

Run this in browser console for complete verification:

```javascript
async function fullPWACheck() {
  console.group("🧪 Full PWA Verification");

  try {
    // 1. Service Worker
    const regs = await navigator.serviceWorker.getRegistrations();
    console.log("✓ SW Registered:", regs.length > 0);

    // 2. Manifest
    const manifest = await fetch("/manifest.json").then((r) => r.json());
    console.log("✓ Manifest Loaded:", manifest.name);

    // 3. Cache
    const caches_list = await caches.keys();
    console.log("✓ Cache Storage:", caches_list.length > 0);

    // 4. Installed
    if ("getInstalledRelatedApps" in navigator) {
      const apps = await navigator.getInstalledRelatedApps();
      console.log("✓ App Installed:", apps.length > 0);
    }

    console.log("✅ All checks passed!");
  } catch (error) {
    console.error("❌ Check failed:", error);
  }

  console.groupEnd();
}
fullPWACheck();
```

---

## ✅ Sign-Off

Once all items are checked, sign off:

- [ ] All file checks passed
- [ ] Build succeeds without errors
- [ ] Service worker active and running
- [ ] Manifest loads correctly
- [ ] Installation works on target platform
- [ ] Offline mode works
- [ ] No console errors
- [ ] Lighthouse PWA audit passes
- [ ] Production deployment prepared

**Prepared By:** [Your Name]  
**Date:** [Date]  
**Status:** ✅ READY FOR PRODUCTION

---

## 🆘 Troubleshooting Quick Links

| Issue                      | Solution                                        |
| -------------------------- | ----------------------------------------------- |
| SW not registering         | Check console, hard refresh, clear cache        |
| Manifest 404               | Verify public/manifest.json exists              |
| Install prompt not showing | Try different browser, check allowlisting       |
| Offline not working        | Check SW active, verify cache populated         |
| Icons not showing          | Verify public/images/shift.png exists           |
| Build errors               | Delete node_modules, npm install, npm run build |

---

**Last Updated:** March 2026  
**Guide Version:** 1.0
