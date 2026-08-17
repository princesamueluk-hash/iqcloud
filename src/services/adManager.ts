/**
 * NETWHO Advertisement Manager
 * Centralized system for managing ad display, timing, cooldowns, and state
 * 
 * Features:
 * - One ad at a time enforcement
 * - 5-second minimum display before dismissal
 * - 20-second cooldown after dismissal
 * - Cross-page-reload persistence
 * - Clear state transitions
 * - Type-safe state management
 */

export type AdState = 'IDLE' | 'AD_ACTIVE' | 'DISMISS_LOCKED' | 'DISMISS_ALLOWED' | 'COOLDOWN';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  priority: number;
  eligiblePages?: string[];
  enabled: boolean;
}

export interface AdConfig {
  minimumViewTime: number; // 5000ms
  cooldownAfterDismiss: number; // 20000ms
  maximumActiveAds: number; // 1
  storagePrefix: string; // 'netwho_ad_'
}

const DEFAULT_CONFIG: AdConfig = {
  minimumViewTime: 5000,
  cooldownAfterDismiss: 20000,
  maximumActiveAds: 1,
  storagePrefix: 'netwho_ad_',
};

export class AdManager {
  private state: AdState = 'IDLE';
  private currentAd: Advertisement | null = null;
  private adShowStartTime: number = 0;
  private dismissLockEndTime: number = 0;
  private cooldownEndTime: number = 0;
  private config: AdConfig;
  private stateChangeListeners: ((state: AdState) => void)[] = [];
  private stateUpdateInterval: NodeJS.Timeout | null = null;
  private ads: Advertisement[] = [];

  constructor(config: Partial<AdConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadPersistedCooldown();
    this.startStateMonitoring();
  }

  /**
   * Load persisted cooldown from storage to survive page reloads
   */
  private loadPersistedCooldown(): void {
    try {
      const lastDismissalKey = `${this.config.storagePrefix}last_dismissal`;
      const lastDismissalStr = localStorage.getItem(lastDismissalKey);
      
      if (lastDismissalStr) {
        const lastDismissal = parseInt(lastDismissalStr, 10);
        const now = Date.now();
        this.cooldownEndTime = lastDismissal + this.config.cooldownAfterDismiss;
        
        if (now < this.cooldownEndTime) {
          this.setState('COOLDOWN');
        } else {
          localStorage.removeItem(lastDismissalKey);
          this.setState('IDLE');
        }
      }
    } catch (e) {
      console.error('Failed to load persisted cooldown:', e);
    }
  }

  /**
   * Monitor state transitions and apply time-based changes
   */
  private startStateMonitoring(): void {
    if (this.stateUpdateInterval) {
      clearInterval(this.stateUpdateInterval);
    }

    this.stateUpdateInterval = setInterval(() => {
      const now = Date.now();

      if (this.state === 'DISMISS_LOCKED' && now >= this.dismissLockEndTime) {
        this.setState('DISMISS_ALLOWED');
      }

      if (this.state === 'COOLDOWN' && now >= this.cooldownEndTime) {
        this.setState('IDLE');
      }
    }, 100);
  }

  /**
   * Set the internal state and notify listeners
   */
  private setState(newState: AdState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.notifyStateChange();
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyStateChange(): void {
    this.stateChangeListeners.forEach((listener) => listener(this.state));
  }

  /**
   * Register a listener for state changes
   */
  onStateChange(listener: (state: AdState) => void): () => void {
    this.stateChangeListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current manager state
   */
  getState(): AdState {
    return this.state;
  }

  /**
   * Get current active ad or null
   */
  getCurrentAd(): Advertisement | null {
    return this.currentAd;
  }

  /**
   * Register ads that can be displayed
   */
  registerAds(ads: Advertisement[]): void {
    this.ads = ads.filter((ad) => ad.enabled);
  }

  /**
   * Display an advertisement
   * Returns true if ad was successfully displayed, false if prevented by state
   */
  displayAd(ad: Advertisement): boolean {
    // Only allow display if in IDLE state
    if (this.state !== 'IDLE') {
      return false;
    }

    // Enforce single ad at a time
    if (this.currentAd !== null) {
      return false;
    }

    this.currentAd = ad;
    this.adShowStartTime = Date.now();
    this.dismissLockEndTime = this.adShowStartTime + this.config.minimumViewTime;
    this.setState('AD_ACTIVE');
    this.setState('DISMISS_LOCKED');

    return true;
  }

  /**
   * Try to display next eligible ad from registry
   * Returns true if an ad was displayed
   */
  displayNextEligibleAd(currentPage?: string): boolean {
    if (this.state !== 'IDLE') {
      return false;
    }

    // Filter ads by eligibility and priority
    const eligibleAds = this.ads.filter((ad) => {
      if (!ad.enabled) return false;
      if (currentPage && ad.eligiblePages && ad.eligiblePages.length > 0) {
        return ad.eligiblePages.includes(currentPage);
      }
      return true;
    });

    if (eligibleAds.length === 0) {
      return false;
    }

    // Sort by priority (higher priority first)
    eligibleAds.sort((a, b) => b.priority - a.priority);

    return this.displayAd(eligibleAds[0]);
  }

  /**
   * Dismiss the current advertisement
   * Returns true if dismissed, false if not allowed
   */
  dismissAd(): boolean {
    if (this.state !== 'DISMISS_ALLOWED' && this.state !== 'DISMISS_LOCKED') {
      return false;
    }

    if (this.currentAd === null) {
      return false;
    }

    this.currentAd = null;
    const now = Date.now();
    this.cooldownEndTime = now + this.config.cooldownAfterDismiss;

    // Persist dismissal for cross-reload cooldown
    try {
      const lastDismissalKey = `${this.config.storagePrefix}last_dismissal`;
      localStorage.setItem(lastDismissalKey, now.toString());
    } catch (e) {
      console.error('Failed to persist dismissal:', e);
    }

    this.setState('COOLDOWN');
    return true;
  }

  /**
   * Get time remaining until ad can be dismissed (in seconds)
   */
  getTimeUntilDismissible(): number {
    if (this.state !== 'DISMISS_LOCKED') {
      return 0;
    }
    const remaining = Math.max(0, this.dismissLockEndTime - Date.now());
    return Math.ceil(remaining / 1000);
  }

  /**
   * Get time remaining for cooldown (in seconds)
   */
  getTimeUntilNextAdEligible(): number {
    if (this.state !== 'COOLDOWN') {
      return 0;
    }
    const remaining = Math.max(0, this.cooldownEndTime - Date.now());
    return Math.ceil(remaining / 1000);
  }

  /**
   * Check if an ad can currently be displayed
   */
  canDisplayAd(): boolean {
    return this.state === 'IDLE';
  }

  /**
   * Check if close button should be enabled
   */
  canDismissCurrentAd(): boolean {
    return this.state === 'DISMISS_ALLOWED';
  }

  /**
   * Check if currently showing an ad
   */
  isAdActive(): boolean {
    return this.currentAd !== null;
  }

  /**
   * Force reset (use sparingly, mainly for testing)
   */
  reset(): void {
    this.currentAd = null;
    this.adShowStartTime = 0;
    this.dismissLockEndTime = 0;
    this.cooldownEndTime = 0;
    this.setState('IDLE');

    try {
      const lastDismissalKey = `${this.config.storagePrefix}last_dismissal`;
      localStorage.removeItem(lastDismissalKey);
    } catch (e) {
      console.error('Failed to clear persisted state:', e);
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.stateUpdateInterval) {
      clearInterval(this.stateUpdateInterval);
      this.stateUpdateInterval = null;
    }
    this.stateChangeListeners = [];
  }
}

// Export singleton instance
export const adManager = new AdManager();

export default adManager;
