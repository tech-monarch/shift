# PWA Quick Reference Card

## Essential Files

| File                   | Purpose                                    | Type   |
| ---------------------- | ------------------------------------------ | ------ |
| `public/sw.js`         | Service worker - handles caching & offline | Core   |
| `public/manifest.json` | App metadata & icons                       | Core   |
| `src/app/layout.tsx`   | PWA meta tags & setup                      | Core   |
| `src/app/page.tsx`     | Installation handler                       | Logic  |
| `next.config.ts`       | PWA plugin config                          | Config |

## How Installation Works

### Android/Chrome

```
1. beforeinstallprompt event fires
2. handleDownload() shows native prompt
3. User clicks "Install"
4. App installed from manifest.json
5. Redirects to /dashboard
```

### iOS/Safari

```
1. beforeinstallprompt doesn't fire
2. handleDownload() shows manual instructions
3. User taps Share → Add to Home Screen
4. Creates web app shortcut
5. Service worker provides offline support
```

## Download Button Behavior

**Location**: Top nav and multiple CTAs on page

**Triggers**: Click "Download App" or "Get Shift"

**Function**: `handleDownload()`

```typescript
if (isInstalled) → Go to dashboard
else if (deferredPrompt) → Show install prompt
else → Show manual instructions
```

## Service Worker Features

| Feature         | Status | Details                |
| --------------- | ------ | ---------------------- |
| Caching         | ✅     | Network-first strategy |
| Offline         | ✅     | Works without internet |
| Updates         | ✅     | Checks on every visit  |
| Background Sync | ⏳     | Can be added           |
| Notifications   | ⏳     | Can be added           |

## Quick Deploy Checklist

```bash
# 1. Build
npm run build

# 2. Test locally
npm start

# 3. Verify in browser
# - Check Service Worker: DevTools → Application → Service Workers
# - Check Manifest: DevTools → Application → Manifest
# - Check offline: DevTools → Network → Offline

# 4. Deploy to production
# (must use HTTPS)
```

## Browser Console Commands

```javascript
// Check service worker
navigator.serviceWorker.getRegistrations();

// Check manifest
fetch("/manifest.json")
  .then((r) => r.json())
  .then(console.log);

// Clear everything
navigator.serviceWorker
  .getRegistrations()
  .then((r) => r.forEach((reg) => reg.unregister()));
then(caches.delete("shift-cache-v1"));

// Force update
navigator.serviceWorker
  .getRegistrations()
  .then((r) => r.forEach((reg) => reg.update()));
```

## Environment Notes

- **Development**: PWA disabled (from next.config.ts)
- **Production**: PWA enabled with caching
- **Testing**: Use `npm start` for production build

## Common Issues

| Issue                      | Fix                                                |
| -------------------------- | -------------------------------------------------- |
| Install prompt not showing | Hard refresh (Ctrl+Shift+R), check browser support |
| Service worker stuck       | Clear cache, unregister, reload                    |
| Manifest 404               | Check public/manifest.json exists                  |
| Icons not showing          | Check public/images/shift.png exists               |
| Offline doesn't work       | Check SW active in DevTools                        |

## Key Metadata

- **App Name**: Shift \| Lock In
- **Short Name**: Shift
- **Start URL**: /dashboard
- **Display**: standalone (fullscreen app)
- **Theme Color**: #050505 (dark)
- **Categories**: productivity

## Important Locations

```
Downloads triggered by: onClick={handleDownload}
Button locations:
  - Top navbar
  - Hero section main CTA
  - Features section
  - Pricing/CTA section
  - Footer

Service worker scope: /
Cache name: shift-cache-v1
Manifest: /manifest.json
```

## Testing Script

```javascript
// Paste in console to verify PWA setup
async function testPWA() {
  console.log("=== PWA VERIFICATION ===");

  // 1. Service Worker
  const registrations = await navigator.serviceWorker.getRegistrations();
  console.log("✓ SW Registered:", registrations.length > 0);

  // 2. Manifest
  const manifest = await fetch("/manifest.json").then((r) => r.json());
  console.log("✓ Manifest:", manifest.name);
  console.log("  - Start URL:", manifest.start_url);
  console.log("  - Icons:", manifest.icons.length);

  // 3. Cache
  const caches_list = await caches.keys();
  console.log("✓ Caches:", caches_list.length > 0);

  // 4. Installation status
  console.log("✓ Installation available:", !!window.deferredPrompt);

  console.log("=== END VERIFICATION ===");
}
testPWA();
```

## Documentation Files

- **PWA_SETUP.md** - Detailed configuration & features
- **PWA_TESTING.md** - Testing procedures & validation
- **PWA_SUMMARY.md** - Complete change summary

## Related Code Sections

**Service Worker Registration**

- `src/app/page.tsx` lines 18-27

**Installation Handlers**

- `src/app/page.tsx` lines 96-157
- `handleDownload()` function
- `showInstallInstructions()` function

**Manifest Link**

- `src/app/layout.tsx` line 22

**PWA Configuration**

- `next.config.ts` lines 5-39

## Production Deployment

⚠️ **IMPORTANT**: PWA requires HTTPS in production (or localhost)

```bash
# Ensure your domain has SSL certificate
# Configure in next.config.ts if needed:
export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  ...
}
```

## Performance Tips

- Icons cached for app lifetime
- Static assets cached indefinitely
- Fonts cached for 7 days
- Images cached for 24 hours
- Check cache storage: DevTools → Application → Cache Storage

## Support Escalation

1. **Installation not working** → Check PWA_TESTING.md
2. **Icons not showing** → Verify public/images/shift.png
3. **Service worker issues** → Check DevTools → Application → Service Workers
4. **Offline not working** → Verify manifest.json and sw.js exist
5. **Performance issues** → Check cache sizes in DevTools

---

For detailed info, see PWA_SETUP.md and PWA_TESTING.md
