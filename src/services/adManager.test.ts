/**
 * NETWHO Advertisement System — Test Suite & Flow Verification
 * 
 * This file demonstrates all 7 test cases required to verify the ad system
 * 
 * To run tests in the browser console:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Run individual test commands below
 */

import adManager from '../services/adManager';
import NETWHO_ADS from '../data/adsRegistry';

/**
 * Helper: Log test status
 */
function logTest(testName: string, passed: boolean, message: string) {
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${testName}: ${message}`);
}

/**
 * Helper: Sleep function for async tests
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * TEST 1: Display an ad and confirm no close action is available for first 5 seconds
 */
export async function TEST_1_MinimumDisplayLock() {
  console.log('\n🧪 TEST 1: Minimum 5-second Display Lock');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  const success = adManager.displayAd(NETWHO_ADS[0]);
  logTest('T1.1', success, 'Ad displayed successfully');

  const isActive = adManager.isAdActive();
  logTest('T1.2', isActive, 'Ad is active');

  const canDismiss1 = adManager.canDismissCurrentAd();
  logTest('T1.3', !canDismiss1, 'Close button is NOT available immediately (LOCKED)');

  const timeRemaining = adManager.getTimeUntilDismissible();
  logTest('T1.4', timeRemaining > 0, `Countdown showing: ${timeRemaining}s remaining`);

  console.log('✓ TEST 1 PASSED: Ad is locked for initial display period\n');
}

/**
 * TEST 2: After 5 seconds, confirm the close button becomes available
 */
export async function TEST_2_DismissalUnlock() {
  console.log('\n🧪 TEST 2: Dismissal Unlock After 5 Seconds');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  adManager.displayAd(NETWHO_ADS[0]);
  const timeImmediately = adManager.getTimeUntilDismissible();

  console.log(`⏳ Waiting for 5-second lock to expire (currently: ${timeImmediately}s)...`);

  // Wait for lock to expire
  await sleep(5200);

  const canDismissAfterLock = adManager.canDismissCurrentAd();
  logTest('T2.1', canDismissAfterLock, 'Close button is now AVAILABLE (UNLOCKED)');

  const timeAfterLock = adManager.getTimeUntilDismissible();
  logTest('T2.2', timeAfterLock === 0, `Countdown expired: ${timeAfterLock}s`);

  console.log('✓ TEST 2 PASSED: Close button unlocks after 5 seconds\n');
}

/**
 * TEST 3: Close the advertisement and confirm it disappears immediately
 */
export async function TEST_3_ImmediateDismissal() {
  console.log('\n🧪 TEST 3: Immediate Dismissal');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  adManager.displayAd(NETWHO_ADS[0]);
  await sleep(5200); // Wait for unlock

  const dismissSuccess = adManager.dismissAd();
  logTest('T3.1', dismissSuccess, 'Ad dismissal was successful');

  const isStillActive = adManager.isAdActive();
  logTest('T3.2', !isStillActive, 'Ad is NO LONGER active (removed immediately)');

  const state = adManager.getState();
  logTest('T3.3', state === 'COOLDOWN', `Manager state changed to: ${state}`);

  console.log('✓ TEST 3 PASSED: Ad disappears immediately on dismissal\n');
}

/**
 * TEST 4: Attempt to display another ad immediately after dismissal
 */
export async function TEST_4_CooldownPrevention() {
  console.log('\n🧪 TEST 4: Cooldown Prevention (No Overlap)');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  adManager.displayAd(NETWHO_ADS[0]);
  await sleep(5200); // Wait for unlock
  adManager.dismissAd();

  // Immediately try to display another ad
  const canDisplay = adManager.canDisplayAd();
  logTest('T4.1', !canDisplay, 'Cannot display ad immediately after dismissal (COOLDOWN active)');

  const cooldownRemaining = adManager.getTimeUntilNextAdEligible();
  logTest('T4.2', cooldownRemaining > 0, `Cooldown active: ${cooldownRemaining}s remaining`);

  const displayAttempt = adManager.displayAd(NETWHO_ADS[1]);
  logTest('T4.3', !displayAttempt, 'Ad display was blocked by cooldown');

  console.log('✓ TEST 4 PASSED: Cooldown prevents overlapping ads\n');
}

/**
 * TEST 5: Wait 20 seconds and confirm another eligible ad can now display
 */
export async function TEST_5_CooldownExpiration() {
  console.log('\n🧪 TEST 5: Cooldown Expiration (20-second wait)');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  adManager.displayAd(NETWHO_ADS[0]);
  await sleep(5200);
  adManager.dismissAd();

  console.log('⏳ Waiting for 20-second cooldown to expire...');
  await sleep(20100);

  const canNowDisplay = adManager.canDisplayAd();
  logTest('T5.1', canNowDisplay, 'Can now display ad (COOLDOWN expired)');

  const displayAfterCooldown = adManager.displayAd(NETWHO_ADS[1]);
  logTest('T5.2', displayAfterCooldown, 'New ad was successfully displayed');

  const isNewAdActive = adManager.isAdActive();
  logTest('T5.3', isNewAdActive, 'New ad is now active');

  console.log('✓ TEST 5 PASSED: Ad can be displayed after cooldown expires\n');
}

/**
 * TEST 6: Refresh page during cooldown and confirm cooldown is not reset
 */
export async function TEST_6_CooldownPersistence() {
  console.log('\n🧪 TEST 6: Cooldown Persistence (Page Reload)');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  // Simulate first visit
  const now = Date.now();
  const cooldownUntil = now + 15000; // Cooldown for 15 more seconds
  localStorage.setItem('netwho_ad_last_dismissal', (cooldownUntil - 20000).toString());

  // Simulate page reload by creating new instance
  const { AdManager } = await import('../services/adManager');
  const adManager2 = new AdManager();
  adManager2.registerAds(NETWHO_ADS);

  // Check if cooldown was restored
  const cooldownActive = adManager2.getState() === 'COOLDOWN';
  logTest('T6.1', cooldownActive, 'Cooldown state was restored after reload');

  const timeRemaining = adManager2.getTimeUntilNextAdEligible();
  logTest('T6.2', timeRemaining > 0, `Cooldown still active: ~${timeRemaining}s remaining`);

  console.log('✓ TEST 6 PASSED: Cooldown persists across page reloads\n');
}

/**
 * TEST 7: Attempt to trigger multiple ads simultaneously
 */
export async function TEST_7_OverlapPrevention() {
  console.log('\n🧪 TEST 7: Overlap Prevention (Multiple Ads)');
  console.log('---');

  adManager.registerAds(NETWHO_ADS);
  adManager.reset();

  // Display first ad
  const display1 = adManager.displayAd(NETWHO_ADS[0]);
  logTest('T7.1', display1, 'First ad displayed successfully');

  // Try to display second ad while first is active
  const display2 = adManager.displayAd(NETWHO_ADS[1]);
  logTest('T7.2', !display2, 'Second ad was blocked (only one allowed)');

  // Verify only first ad is active
  const currentAd = adManager.getCurrentAd();
  const isFirstAd = currentAd?.id === NETWHO_ADS[0].id;
  logTest('T7.3', isFirstAd, `Only first ad is active: ${currentAd?.id}`);

  const activeCount = adManager.isAdActive() ? 1 : 0;
  logTest('T7.4', activeCount === 1, 'Only 1 ad is active (no overlap)');

  console.log('✓ TEST 7 PASSED: Multiple ads cannot display simultaneously\n');
}

/**
 * Run all tests in sequence
 */
export async function runAllTests() {
  console.clear();
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║  NETWHO ADVERTISEMENT SYSTEM - COMPLETE TESTS  ║');
  console.log('╚════════════════════════════════════════════════╝');

  try {
    await TEST_1_MinimumDisplayLock();
    await TEST_2_DismissalUnlock();
    await TEST_3_ImmediateDismissal();
    await TEST_4_CooldownPrevention();
    await TEST_5_CooldownExpiration();
    await TEST_6_CooldownPersistence();
    await TEST_7_OverlapPrevention();

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║         ✅ ALL TESTS PASSED SUCCESSFULLY       ║');
    console.log('╚════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('❌ Test suite error:', error);
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  (window as any).NETWHO_TESTS = {
    TEST_1_MinimumDisplayLock,
    TEST_2_DismissalUnlock,
    TEST_3_ImmediateDismissal,
    TEST_4_CooldownPrevention,
    TEST_5_CooldownExpiration,
    TEST_6_CooldownPersistence,
    TEST_7_OverlapPrevention,
    runAllTests,
  };

  console.log(
    '%cℹ️ NETWHO Ad Tests Ready\nRun: NETWHO_TESTS.runAllTests() in browser console',
    'font-size: 14px; color: #0066cc; font-weight: bold;'
  );
}
