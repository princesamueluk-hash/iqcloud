import React, { useEffect } from 'react';

interface SeoManagerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
  breadcrumbs?: { name: string; path: string }[];
}

export const SeoManager: React.FC<SeoManagerProps> = ({
  title = 'NETWHO | Digital Intelligence and Online Utilities',
  description = 'NETWHO provides browser-based utilities for IP intelligence, network diagnostics, VPN and proxy analysis, location checks, privacy review, and structured profile generation.',
  keywords = [
    'NETWHO',
    'profieldhub.online',
    'digital intelligence',
    'online utilities',
    'IP lookup',
    'my IP',
    'VPN detection',
    'proxy detection',
    'location tools',
    'UK profile generator',
  ],
  canonicalPath = '/',
  structuredData,
  breadcrumbs,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // 3. Helper for Canonical Link
    const fullCanonicalUrl = `https://profieldhub.online${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = fullCanonicalUrl;

    // Standard Meta
    setMetaTag('description', description);
    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }
    setMetaTag('author', 'Creatiq');

    // OpenGraph Meta
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', fullCanonicalUrl, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', 'NETWHO', true);

    // Twitter Card Meta
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);

    // 4. Structured Data (JSON-LD)
    const baseWebsiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'NETWHO',
      url: 'https://profieldhub.online',
      description:
        'NETWHO is a digital intelligence platform offering browser-based network, privacy, IP, location, and profile analysis tools.',
      publisher: {
        '@type': 'Organization',
        name: 'Creatiq',
        url: 'https://profieldhub.online',
      },
    };

    const breadcrumbsSchema = breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((bc, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: bc.name,
            item: `https://profieldhub.online${bc.path}`,
          })),
        }
      : null;

    const allSchemas = [
      baseWebsiteSchema,
      ...(breadcrumbsSchema ? [breadcrumbsSchema] : []),
      ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    ];

    let jsonLdScript = document.getElementById('netwho-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'netwho-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(allSchemas);

    return () => {
      // cleanup if needed
    };
  }, [title, description, keywords, canonicalPath, structuredData, breadcrumbs]);

  return null;
};
