/**
 * NETWHO Advertisement Registry
 * Central configuration for all advertisements
 * 
 * Ads can be enabled/disabled and prioritized
 * Each ad specifies which pages it can appear on
 * 
 * EXTERNAL AD NETWORK CONFIGURATION:
 * - Script: https://pl30885739.effectivecpmnetwork.com/487b249ab83f6aa8203efe13fa4ee6d6/invoke.js
 * - Container ID: container-487b249ab83f6aa8203efe13fa4ee6d6
 * - Managed by: src/components/ExternalAdsContainer.tsx
 * - Placement: Between main content and footer
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
