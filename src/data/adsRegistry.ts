/**
 * NETWHO Advertisement Registry
 * Central configuration for all advertisements
 * 
 * Ads can be enabled/disabled and prioritized
 * Each ad specifies which pages it can appear on
 * 
 * EXTERNAL AD NETWORK CONFIGURATION:
 * 
 * AD 1 - Container-Based Advertisement:
 * - Script: https://pl30885739.effectivecpmnetwork.com/487b249ab83f6aa8203efe13fa4ee6d6/invoke.js
 * - Container ID: container-487b249ab83f6aa8203efe13fa4ee6d6
 * - Managed by: src/components/ExternalAdsContainer.tsx
 * - Placement: Between main content and footer
 * 
 * AD 2 - Script-Based Advertisement:
 * - Script: https://pl30885738.effectivecpmnetwork.com/50/b6/fc/50b6fc8dcb4d46f0e4ec4f7a48984c97.js
 * - Managed by: src/components/ScriptAdsManager.tsx
 * - Type: Self-injecting advertisement (no container required)
 * 
 * AD 3 - Script-Based Advertisement:
 * - Script: https://pl30885741.effectivecpmnetwork.com/d8/e7/66/d8e7667a985e60d3761ebb99b34e858b.js
 * - Managed by: src/components/ScriptAdsManager.tsx
 * - Type: Self-injecting advertisement (no container required)
 */

import { type Advertisement } from '../services/adManager';

export const NETWHO_ADS: Advertisement[] = [
  {
    id: 'netwho-premium-1',
    title: 'NETWHO Premium — Advanced Threat Detection',
    description:
      'Unlock real-time threat intelligence, historical IP tracking, and advanced network diagnostics.',
    imageUrl: undefined,
    ctaText: 'Learn More',
    ctaUrl: 'https://netwho.example/premium',
    priority: 100,
    eligiblePages: ['/', '/ip-check', '/tools'],
    enabled: true,
  },
  {
    id: 'netwho-api-1',
    title: 'NETWHO API — For Developers',
    description:
      'Integrate NETWHO IP intelligence into your applications. RESTful API with comprehensive documentation.',
    imageUrl: undefined,
    ctaText: 'API Documentation',
    ctaUrl: 'https://netwho.example/api',
    priority: 90,
    eligiblePages: ['/tools', '/ip-check'],
    enabled: true,
  },
  {
    id: 'netwho-vpn-guide-1',
    title: 'VPN & Privacy Guide',
    description:
      'Learn how to protect your privacy online. Read our comprehensive guide on VPN protocols and privacy best practices.',
    imageUrl: undefined,
    ctaText: 'Read Guide',
    ctaUrl: 'https://netwho.example/guides/vpn-privacy',
    priority: 80,
    eligiblePages: ['/', '/tools'],
    enabled: true,
  },
];

/**
 * Sample premium ad demonstrating external sponsorship potential
 * Keep disabled by default until live sponsorships are configured
 */
export const SPONSORED_AD_TEMPLATE: Advertisement = {
  id: 'sponsored-external-1',
  title: '[Sponsor Name] — Cybersecurity Solutions',
  description: '[Sponsor description here]',
  imageUrl: undefined,
  ctaText: '[CTA Text]',
  ctaUrl: '[Sponsor URL]',
  priority: 110, // Higher priority when enabled
  eligiblePages: ['/', '/tools'],
  enabled: false, // Disabled until real sponsor is configured
};

export default NETWHO_ADS;
