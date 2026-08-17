export const DOMAIN_ROUTES: Record<string, string> = {
  'domain-one.example': '/ip-check',
  'www.domain-one.example': '/ip-check',
  'domain-two.example': '/tools/uk-profile',
  'www.domain-two.example': '/tools/uk-profile',
  'domain-three.example': '/tools/location-generator',
  'www.domain-three.example': '/tools/location-generator',
};

export const getConfiguredRouteForHostname = (hostname?: string): string | null => {
  if (!hostname) return null;

  const normalized = hostname.toLowerCase().trim();
  if (!normalized || normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '[::1]') {
    return null;
  }

  const directMatch = DOMAIN_ROUTES[normalized];
  if (directMatch) return directMatch;

  const withoutWww = normalized.replace(/^www\./, '');
  return DOMAIN_ROUTES[withoutWww] || null;
};
