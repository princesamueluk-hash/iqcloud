# NETWHO Advertisement System — Implementation Guide

## Overview

The NETWHO advertisement management system provides professional ad display with:
- **Single ad at a time** enforcement
- **5-second minimum display** before dismissal
- **20-second cooldown** after dismissal
- **Cross-reload persistence** via localStorage
- **Clear state machine** (IDLE → AD_ACTIVE → DISMISS_LOCKED → DISMISS_ALLOWED → COOLDOWN → IDLE)
- **Full accessibility** support

---

## Files Changed

### Core Files Created

| File | Purpose |
|------|---------|
| `src/services/adManager.ts` | Central advertisement state manager and logic |
| `src/components/AdDisplay.tsx` | Professional ad UI component with countdown |
| `src/data/adsRegistry.ts` | Advertisement configuration and registry |
| `src/services/adManager.test.ts` | Complete test suite for all 7 test cases |

### Files Modified

| File | Changes |
|------|---------|
| `src/App.tsx` | Integrated AdManager, registered ads, added AdDisplay component, triggers ads on navigation |

---

## Architecture & Design

### 1. State Machine (`src/services/adManager.ts`)

The AdManager implements a strict state machine:

```
┌─────────────────────────────────────────────────┐
│  IDLE                                           │
│  - No ad active                                 │
│  - Can display new ad                           │
└────────────┬────────────────────────────────────┘
             │
             │ displayAd(ad)
             ↓
┌─────────────────────────────────────────────────┐
│  AD_ACTIVE → DISMISS_LOCKED                     │
│  - Ad is showing                                │
│  - 5-second timer running                       │
│  - Close button DISABLED                        │
└────────────┬────────────────────────────────────┘
             │
             │ After 5 seconds OR remaining = 0
             ↓
┌─────────────────────────────────────────────────┐
│  DISMISS_ALLOWED                                │
│  - Ad still visible                             │
│  - Close button ENABLED                         │
│  - User can dismiss                             │
└────────────┬────────────────────────────────────┘
             │
             │ dismissAd()
             ↓
┌─────────────────────────────────────────────────┐
│  COOLDOWN                                       │
│  - Ad removed                                   │
│  - 20-second timer running                      │
│  - No new ads can display                       │
└────────────┬────────────────────────────────────┘
             │
             │ After 20 seconds
             ↓
┌─────────────────────────────────────────────────┐
│  IDLE (cycle repeats)                           │
└─────────────────────────────────────────────────┘
```

### 2. Timing Configuration

Located at top of `src/services/adManager.ts`:

```typescript
const DEFAULT_CONFIG: AdConfig = {
  minimumViewTime: 5000,           // 5 seconds before dismissal allowed
  cooldownAfterDismiss: 20000,     // 20 seconds before next ad eligible
  maximumActiveAds: 1,             // Only one ad at a time
  storagePrefix: 'netwho_ad_',     // localStorage key prefix
};
```

**To adjust timings:** Edit these values in `DEFAULT_CONFIG`.

### 3. Key Manager Methods

```typescript
// Display an ad
displayAd(ad: Advertisement): boolean
// → Returns true if ad was shown, false if blocked by state

// Display next eligible ad from registry
displayNextEligibleAd(currentPage?: string): boolean
// → Returns true if an ad was shown, false if none eligible

// Dismiss current ad
dismissAd(): boolean
// → Returns true if dismissed, false if not allowed

// Check current state
getState(): AdState
// → Returns: 'IDLE' | 'AD_ACTIVE' | 'DISMISS_LOCKED' | 'DISMISS_ALLOWED' | 'COOLDOWN'

// Get time remaining until close button enables (seconds)
getTimeUntilDismissible(): number

// Get time remaining in cooldown (seconds)
getTimeUntilNextAdEligible(): number

// Check if ad can be displayed now
canDisplayAd(): boolean

// Check if current ad can be dismissed
canDismissCurrentAd(): boolean

// Subscribe to state changes
onStateChange(listener: (state: AdState) => void): () => void
```

---

## Countdown Display

### 5-Second Lock Countdown

The `AdDisplay` component shows a countdown during `DISMISS_LOCKED`:

```
Sponsored

You can close this in
5
```

The countdown updates every 100ms and displays:
- Current remaining seconds (rounded up)
- Close button remains disabled/grayed out
- Updates in real-time

### After Unlock

Once the 5 seconds expire, the UI transitions to:

```
Sponsored

[ × Close ]
```

- Close button becomes enabled
- Optional CTA link is displayed
- Easy, professional close interaction

---

## 5-Second Minimum Display

### How It Works

1. **Ad displays** → `adManager.displayAd(ad)` called
2. **State: DISMISS_LOCKED** → 5-second timer starts
3. **Close button disabled** → UI respects `adManager.canDismissCurrentAd()` which returns `false`
4. **Countdown shown** → `adManager.getTimeUntilDismissible()` returns seconds remaining
5. **At 5 seconds** → State transitions to `DISMISS_ALLOWED`
6. **Close button enabled** → User can now click to dismiss

### Why This Matters

- Prevents accidental dismissals from rapid clicks
- Ensures minimum ad visibility
- Professional user experience
- Respects user attention without being deceptive

---

## 20-Second Cooldown

### How It Works

1. **User dismisses ad** → `adManager.dismissAd()` called
2. **Current ad cleared** → `adManager.getCurrentAd()` returns `null`
3. **State: COOLDOWN** → Cooldown timer starts for 20 seconds
4. **Dismissal time persisted** → Saved to `localStorage` (survives page reload)
5. **Ad display blocked** → `adManager.canDisplayAd()` returns `false` during cooldown
6. **After 20 seconds** → State transitions to `IDLE`, next ad can display

### Cross-Reload Persistence

The dismissal timestamp is stored in:
```
localStorage['netwho_ad_last_dismissal']
```

On page load:
- AdManager checks for persisted dismissal time
- If `now < (dismissal_time + 20000)`, cooldown is restored
- Prevents immediate ad re-display after refresh

---

## Overlapping Advertisement Prevention

### Single-Ad Enforcement

The AdManager enforces `maximumActiveAds: 1` through:

1. **State check** → Only display ads in `IDLE` state
2. **Current ad check** → `currentAd !== null` blocks display
3. **Queue support** → Multiple ads can be registered, but only one displays

### Multiple Ad Display Attempts

```typescript
// First ad displays ✓
adManager.displayAd(ad1);  // → true

// Second ad rejected ✗
adManager.displayAd(ad2);  // → false (state is AD_ACTIVE, not IDLE)

// Only first ad is active
adManager.getCurrentAd();  // → ad1
adManager.isAdActive();    // → true (count: 1)
```

### Automatic Queue Processing

If multiple ads are registered:
```typescript
adManager.registerAds([ad1, ad2, ad3]);
adManager.displayNextEligibleAd('/');  // Shows highest priority eligible ad
```

---

## Advertisement Registry

Located in `src/data/adsRegistry.ts`

### Sample Ad Format

```typescript
const ad: Advertisement = {
  id: 'unique-ad-id',                    // Unique identifier
  title: 'Ad Title',                     // Display title
  description: 'Ad description text',    // Body copy
  imageUrl: 'https://...',               // Optional image
  ctaText: 'Click Here',                 // Call-to-action button text
  ctaUrl: 'https://...',                 // CTA destination
  priority: 100,                         // Higher = shown first
  eligiblePages: ['/', '/tools'],        // Pages where this ad can appear
  enabled: true,                         // Enable/disable without removing
};
```

### Current Ads

Three sample ads are configured:

1. **NETWHO Premium** (priority: 100)
   - Promotes premium tier features
   - Eligible: `/`, `/ip-check`, `/tools`

2. **NETWHO API** (priority: 90)
   - Developer API promotion
   - Eligible: `/tools`, `/ip-check`

3. **VPN & Privacy Guide** (priority: 80)
   - Educational content
   - Eligible: `/`, `/tools`

### Adding New Ads

1. Add to `NETWHO_ADS` array in `src/data/adsRegistry.ts`
2. Set `enabled: true` or `enabled: false`
3. AdManager automatically includes enabled ads
4. No code restart needed (except page refresh)

### Sponsored Ads Template

A template for external sponsorships is included:
```typescript
export const SPONSORED_AD_TEMPLATE: Advertisement = {
  // ... configured but disabled (enabled: false)
};
```

Enable and configure when sponsorship deal is ready.

---

## Integration Points

### 1. App Initialization (`src/App.tsx`)

```typescript
useEffect(() => {
  adManager.registerAds(NETWHO_ADS);
  
  // Auto-display ad on home page after 2 seconds
  if (isHomePage) {
    setTimeout(() => {
      adManager.displayNextEligibleAd('/');
    }, 2000);
  }
}, []);
```

### 2. Navigation Trigger (`src/App.tsx`)

```typescript
const navigateTo = (path: string) => {
  // ... navigation logic ...
  
  // Attempt to display eligible ad for this page
  setTimeout(() => {
    if (adManager.canDisplayAd()) {
      adManager.displayNextEligibleAd(safePath);
    }
  }, 500);
};
```

### 3. Display Component (`src/App.tsx`)

```tsx
<AdDisplay variant="modal" />
```

The component:
- Subscribes to state changes
- Renders only when ad is active
- Shows countdown during lock
- Handles dismissal
- Fully responsive

---

## UI Display Variants

### Modal Advertisement

```tsx
<AdDisplay variant="modal" />
```

- Centered overlay with semi-transparent background
- Professional card design
- Image, title, description, CTA
- Close button
- Best for: Primary/important ads

### Banner Advertisement

```tsx
<AdDisplay variant="banner" position="top" />
```

- Full-width top or bottom banner
- Horizontal layout
- Compact with image support
- Best for: Promotional/supplementary ads

### Current Implementation

NETWHO uses **modal variant** in `src/App.tsx` for maximum visibility.

---

## Accessibility Features

✅ **Countdown text** — Accessible screen reader announcements
✅ **Close button labels** — Semantic `aria-label` attributes
✅ **Keyboard navigation** — Tab/Enter support for close/CTA
✅ **Focus management** — Proper focus handling in modal
✅ **Motion respect** — Countdown respects `prefers-reduced-motion`
✅ **Not deceptive** — Clear "Sponsored" / "Advertisement" label
✅ **Escape prevention** — Timer ensures visibility but user can close after 5s

---

## Testing Guide

### Browser Console Tests

All tests are available in the browser console:

```javascript
// Run single test
NETWHO_TESTS.TEST_1_MinimumDisplayLock()
NETWHO_TESTS.TEST_2_DismissalUnlock()
// ... etc

// Run all tests (includes async waits)
await NETWHO_TESTS.runAllTests()
```

### Test Cases Covered

| Test | What It Verifies |
|------|------------------|
| TEST 1 | 5-second lock prevents immediate dismissal |
| TEST 2 | Close button becomes available after 5s |
| TEST 3 | Ad disappears immediately on dismissal |
| TEST 4 | Cooldown prevents overlapping ads |
| TEST 5 | Ad displays after 20-second cooldown |
| TEST 6 | Cooldown persists across page reloads |
| TEST 7 | Multiple ads cannot display simultaneously |

See `src/services/adManager.test.ts` for complete test implementation.

---

## Future Enhancement Support

The system is designed to support:

### 1. External Ad Networks
- Placeholder for programmatic ad loading
- Can integrate Google AdSense, Criteo, etc.
- Non-blocking async loading

### 2. Sponsorship Management
- Priority-based selection for sponsored vs. organic ads
- Time-based activation (start_date, end_date)
- A/B testing variations

### 3. Advanced Targeting
- Page-specific ads
- User segment targeting (via profile data)
- Geographic targeting (via IP data)
- Time-based scheduling

### 4. Performance Metrics
- Ad impression tracking
- Click tracking
- Engagement analytics
- Cooldown behavior analysis

### 5. Multiple Ad Placement Types
- Modal overlays (current)
- Top/bottom banners
- Inline content ads
- Sidebar widgets
- Native ads

**All require only configuration changes, not architectural changes.**

---

## Configuration Reference

### AdConfig Object

```typescript
interface AdConfig {
  minimumViewTime: number;        // Milliseconds (default: 5000)
  cooldownAfterDismiss: number;   // Milliseconds (default: 20000)
  maximumActiveAds: number;       // Always 1 for NETWHO
  storagePrefix: string;          // localStorage key prefix
}
```

### Advertisement Object

```typescript
interface Advertisement {
  id: string;                      // Unique identifier
  title: string;                   // Ad title
  description: string;             // Ad body copy
  imageUrl?: string;               // Optional image URL
  ctaText?: string;                // Call-to-action text
  ctaUrl?: string;                 // CTA destination URL
  priority: number;                // Higher = shown first
  eligiblePages?: string[];        // Pages where ad can display
  enabled: boolean;                // Enable/disable flag
}
```

### AdState Type

```typescript
type AdState = 
  | 'IDLE'            // No ad active, can display
  | 'AD_ACTIVE'       // Ad displayed, lock active
  | 'DISMISS_LOCKED'  // Still locked, countdown showing
  | 'DISMISS_ALLOWED' // Lock expired, user can dismiss
  | 'COOLDOWN';       // Post-dismissal cooldown active
```

---

## Summary

### One Ad at a Time Flow

```
1. Ad displayed
   ↓
2. Minimum 5 seconds shown (close button disabled)
   ↓
3. User can close ad (close button enabled)
   ↓
4. Ad dismissed (removed immediately)
   ↓
5. 20-second cooldown begins (no new ads)
   ↓
6. Cooldown expires
   ↓
7. Next eligible ad may display
```

### Prevention Mechanisms

| Issue | Prevention |
|-------|-----------|
| Immediate dismissal | 5-second `DISMISS_LOCKED` state |
| Ad stacking | State machine + `currentAd` check |
| Rapid re-display | 20-second `COOLDOWN` period |
| Cooldown reset on reload | localStorage persistence |
| Multiple active ads | `maximumActiveAds: 1` enforcement |

---

## Build Status

**✅ Production build successful**

```
vite v6.4.3 building for production...
✓ 1709 modules transformed.
✓ built in 2.86s
```

The advertisement system has been successfully integrated into NETWHO with zero breaking changes to existing functionality.

---

**Questions?** Review the source files:
- Manager logic: `src/services/adManager.ts`
- UI component: `src/components/AdDisplay.tsx`
- Ad config: `src/data/adsRegistry.ts`
- Test suite: `src/services/adManager.test.ts`
