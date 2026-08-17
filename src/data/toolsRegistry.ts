// Master Tools Registry for NETWHO Platform (profieldhub.online)

export interface ToolCategory {
  id: 'network-ip' | 'privacy-connection' | 'location' | 'profile';
  name: string;
  shortDescription: string;
  description: string;
  iconName: string;
}

export interface ToolDefinition {
  id: string;
  slug: string; // e.g. /tools/ip-lookup
  name: string;
  shortDescription: string;
  category: 'network-ip' | 'privacy-connection' | 'location' | 'profile';
  categoryName: string;
  iconName: string;
  status: 'active' | 'coming-soon';
  h1: string;
  intro: string;
  howItWorks: { step: string; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  relatedToolIds: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
  };
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'network-ip',
    name: 'Network & IP Tools',
    shortDescription: 'Inspect IP addresses, autonomous systems, DNS records, and network interfaces.',
    description:
      'A comprehensive suite of network utilities designed for developers, network engineers, and curious users to investigate IP addresses, routing paths, DNS records, and ISP networks.',
    iconName: 'Network',
  },
  {
    id: 'privacy-connection',
    name: 'Privacy & Connection Tools',
    shortDescription: 'Analyze VPN status, proxy detection, browser leaks, and connection security.',
    description:
      'Diagnostic tools to examine your connection privacy, detect VPN/proxy usage, inspect WebRTC candidate leaks, and assess client-side fingerprinting exposure.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'location',
    name: 'Location Tools',
    shortDescription: 'Geolocate IP addresses, inspect coordinate data, and generate location samples.',
    description:
      'Geographic intelligence utilities to inspect geographic positions, regional coordinates, timezone offsets, and generate realistic test addresses and postcodes.',
    iconName: 'MapPin',
  },
  {
    id: 'profile',
    name: 'Profile Tools',
    shortDescription: 'Generate, build, inspect, compare, and manage structured UK profiles.',
    description:
      'Structured demographic and lifestyle profile generation suite for UI prototyping, software testing, user research benchmarks, and demographic modelling.',
    iconName: 'Users',
  },
];

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // ==========================================
  // CATEGORY 1: NETWORK & IP TOOLS
  // ==========================================
  {
    id: 'generate-ip',
    slug: '/generate-ip',
    name: 'Generate IP',
    shortDescription: 'Generate and analyse synthetic IPv4/IPv6 addresses, subnet CIDRs, and test payloads.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Sparkles',
    status: 'active',
    h1: 'Generate IP & Synthetic Network Address Suite',
    intro:
      'Generate valid public IPv4, IPv6, private RFC1918, carrier-grade NAT, and custom subnet CIDR test addresses. Inspect simulated routing properties, binary bitmasks, reverse DNS structures, and analyze generated addresses instantly.',
    howItWorks: [
      {
        step: '01',
        title: 'Configure IP Parameters',
        desc: 'Select address family (IPv4 / IPv6), address class, target geographic region, or custom CIDR prefix.',
      },
      {
        step: '02',
        title: 'Algorithmic Synthesis',
        desc: 'NETWHO synthesizes structurally valid network addresses with proper octet allocation, host IDs, and simulated BGP origin data.',
      },
      {
        step: '03',
        title: 'Inspect & Analyse',
        desc: 'Copy generated addresses, export batch lists (JSON/CSV), or send directly to the live IP Lookup intelligence engine with one click.',
      },
    ],
    faqs: [
      {
        question: 'What types of IP addresses can I generate?',
        answer:
          'You can generate public IPv4 (Class A/B/C), global unicast IPv6, private LAN addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), carrier NAT (100.64.0.0/10), and custom CIDR subnet ranges.',
      },
      {
        question: 'Can I test a generated IP with the IP Lookup engine?',
        answer:
          'Yes. Every generated IP includes an instant "Analyse in IP Lookup" button to inspect live or simulated routing, ASN, and geographic metadata.',
      },
      {
        question: 'Is batch generation supported for API testing and QA?',
        answer:
          'Yes, you can generate up to 25 IP addresses in a single batch and export them as JSON, CSV, or formatted text.',
      },
    ],
    relatedToolIds: ['ip-lookup', 'my-ip', 'ip-location', 'location-generator'],
    seo: {
      title: 'Generate IP | Synthetic IPv4 & IPv6 Address Generator | NETWHO',
      description:
        'Generate and analyse synthetic IPv4, IPv6, CIDR subnets, and test IP ranges with NETWHO IP generation utilities.',
      keywords: ['generate ip', 'ip generator', 'ipv4 generator', 'ipv6 generator', 'test ip generator', 'cidr calculator'],
      canonicalUrl: 'https://profieldhub.online/generate-ip',
    },
  },
  {
    id: 'ip-lookup',
    slug: '/tools/ip-lookup',
    name: 'IP Lookup',
    shortDescription: 'Retrieve available information associated with an IP address.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Search',
    status: 'active',
    h1: 'IP Lookup & Address Inspector',
    intro:
      'Retrieve comprehensive network and geolocation intelligence for any public IPv4 or IPv6 address. Inspect ASN, ISP, geographic coordinates, country, and reverse DNS records in real-time.',
    howItWorks: [
      {
        step: '01',
        title: 'Input or Detect IP',
        desc: 'Enter any valid IPv4 or IPv6 address or quickly load your current connected public IP address.',
      },
      {
        step: '02',
        title: 'Query Network Registrars',
        desc: 'NETWHO interrogates regional internet registries (RIPE, ARIN, APNIC) and global BGP routing tables.',
      },
      {
        step: '03',
        title: 'Inspect Structured Results',
        desc: 'Review structured data including Autonomous System Number, organization, postal code, timezone, and coordinates.',
      },
    ],
    faqs: [
      {
        question: 'What information does an IP lookup provide?',
        answer:
          'An IP lookup provides the geographic region, country, city, postal code prefix, Internet Service Provider (ISP), Autonomous System Number (ASN), and host configuration associated with that IP.',
      },
      {
        question: 'Does an IP lookup reveal an exact physical home address?',
        answer:
          'No. IP geolocation identifies the approximate city, region, and ISP routing node. It does not pinpoint a private residential house or exact individual street address.',
      },
      {
        question: 'Can I lookup both IPv4 and IPv6 addresses?',
        answer:
          'Yes, NETWHO supports both standard IPv4 (e.g. 8.8.8.8) and 128-bit IPv6 address notations (e.g. 2001:4860:4860::8888).',
      },
    ],
    relatedToolIds: ['my-ip', 'ip-location', 'vpn-detection', 'proxy-detection', 'dns-lookup'],
    seo: {
      title: 'IP Lookup | IP Address Information & Geolocation | NETWHO',
      description:
        'Lookup any IPv4 or IPv6 address to retrieve ISP, ASN, geographic coordinates, city, and connection details with NETWHO.',
      keywords: ['IP lookup', 'IP address information', 'IP location lookup', 'IPv4 lookup', 'IPv6 lookup'],
      canonicalUrl: 'https://profieldhub.online/tools/ip-lookup',
    },
  },
  {
    id: 'my-ip',
    slug: '/tools/my-ip',
    name: 'My IP',
    shortDescription: 'Inspect your active public IP address, ISP, and connection diagnostics.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Globe',
    status: 'active',
    h1: 'My IP Address & Live Connection Details',
    intro:
      'Instantly discover your current public IPv4 or IPv6 address, measure live round-trip latency, inspect your ISP, and evaluate your active browser network stack.',
    howItWorks: [
      {
        step: '01',
        title: 'Instant Discovery',
        desc: 'NETWHO resolves your public connection endpoint immediately upon opening the tool.',
      },
      {
        step: '02',
        title: 'Diagnostic Probing',
        desc: 'Measures live round-trip latency (RTT), evaluates WebRTC interface candidates, and parses client headers.',
      },
      {
        step: '03',
        title: 'Comprehensive Summary',
        desc: 'Provides full visibility into your public address, ISP provider, ASN routing block, and browser telemetry.',
      },
    ],
    faqs: [
      {
        question: 'Why does my IP change when I restart my router or switch networks?',
        answer:
          'Most consumer internet providers assign dynamic IP addresses via DHCP. Your public IP updates when your connection lease renews or when you switch from Wi-Fi to cellular data.',
      },
      {
        question: 'Can websites see my private local IP address (e.g. 192.168.x.x)?',
        answer:
          'Normally, websites only see your public router IP. However, unpatched WebRTC configurations can sometimes leak local LAN addresses to client scripts.',
      },
    ],
    relatedToolIds: ['ip-lookup', 'vpn-detection', 'network-info', 'privacy-check'],
    seo: {
      title: 'My IP Address & Connection Details | NETWHO',
      description:
        'Check your current public IP address, ISP, ASN, connection speed latency, and geographic location instantly on NETWHO.',
      keywords: ['my ip', 'what is my ip', 'check my ip', 'my ip address', 'public ip lookup'],
      canonicalUrl: 'https://profieldhub.online/tools/my-ip',
    },
  },
  {
    id: 'ip-location',
    slug: '/tools/ip-location',
    name: 'IP Location',
    shortDescription: 'Pinpoint geographic coordinates, city, and timezone from an IP.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'MapPin',
    status: 'active',
    h1: 'IP Location & Geographic Coordinates Inspector',
    intro:
      'Map the approximate geographic coordinates, municipality, administrative subdivision, postal district, and local timezone for any public IP address.',
    howItWorks: [
      {
        step: '01',
        title: 'Coordinate Resolution',
        desc: 'Cross-references IP routing nodes against multi-source geographic database feeds.',
      },
      {
        step: '02',
        title: 'Map Visualization',
        desc: 'Renders interactive coordinate bounds, city center pinpoint, and regional demarcation.',
      },
      {
        step: '03',
        title: 'Time & Locale Data',
        desc: 'Calculates UTC offset, local time, and regional currency codes.',
      },
    ],
    faqs: [
      {
        question: 'How accurate is IP-based geolocation?',
        answer:
          'Country-level accuracy is typically 99%+, while city-level accuracy is usually between 70% and 90% depending on whether the ISP routes traffic through regional hubs.',
      },
    ],
    relatedToolIds: ['ip-lookup', 'location-lookup', 'location-generator', 'ip-geolocation'],
    seo: {
      title: 'IP Location Lookup & Map Coordinates | NETWHO',
      description:
        'Find the geographic location, coordinates, city, region, and local time for any IP address with NETWHO IP Location tool.',
      keywords: ['ip location', 'ip geolocation lookup', 'ip coordinates', 'locate ip address'],
      canonicalUrl: 'https://profieldhub.online/tools/ip-location',
    },
  },
  {
    id: 'isp-lookup',
    slug: '/tools/isp-lookup',
    name: 'ISP Lookup',
    shortDescription: 'Identify the Internet Service Provider and organization behind an IP.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Radio',
    status: 'active',
    h1: 'ISP Lookup & Provider Intelligence',
    intro:
      'Discover the commercial organization, telecom provider, and network carrier operating any specific IP block or host.',
    howItWorks: [
      {
        step: '01',
        title: 'Carrier Parsing',
        desc: 'Examines the autonomous organization registry and carrier allocation prefix.',
      },
      {
        step: '02',
        title: 'Connection Type Analysis',
        desc: 'Identifies whether the connection represents residential broadband, mobile LTE/5G, or enterprise hosting.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between an ISP and an ASN?',
        answer:
          'An ISP is the commercial internet company (e.g. BT, Virgin Media, Comcast). An ASN (Autonomous System Number) is the technical identifier used in BGP routing to manage that network.',
      },
    ],
    relatedToolIds: ['asn-lookup', 'ip-lookup', 'my-ip', 'network-info'],
    seo: {
      title: 'ISP Lookup | Internet Service Provider Checker | NETWHO',
      description:
        'Find out which Internet Service Provider (ISP) and organization owns an IP address with NETWHO ISP Lookup.',
      keywords: ['isp lookup', 'who is my isp', 'internet service provider check', 'isp identifier'],
      canonicalUrl: 'https://profieldhub.online/tools/isp-lookup',
    },
  },
  {
    id: 'asn-lookup',
    slug: '/tools/asn-lookup',
    name: 'ASN Lookup',
    shortDescription: 'Explore Autonomous System Numbers, BGP routes, and IP prefixes.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Server',
    status: 'active',
    h1: 'ASN Lookup & Autonomous System Explorer',
    intro:
      'Search Autonomous System Numbers (ASN) or IP blocks to view routing peers, BGP prefix ranges, registration details, and network ownership.',
    howItWorks: [
      {
        step: '01',
        title: 'Autonomous System Query',
        desc: 'Input an ASN (e.g. AS13335, AS15169) or public IP to query global BGP tables.',
      },
      {
        step: '02',
        title: 'Registry Routing Audit',
        desc: 'Resolves RIR registry entries, upstream carriers, and assigned subnet prefixes.',
      },
    ],
    faqs: [
      {
        question: 'What is an Autonomous System (AS)?',
        answer:
          'An Autonomous System is a collection of connected IP routing prefixes controlled by one or more network operators under a single routing policy using BGP.',
      },
    ],
    relatedToolIds: ['isp-lookup', 'ip-lookup', 'dns-lookup'],
    seo: {
      title: 'ASN Lookup | Autonomous System Number & BGP Routes | NETWHO',
      description:
        'Lookup Autonomous System Numbers (ASN), BGP routing prefixes, and network owners with NETWHO ASN Lookup.',
      keywords: ['asn lookup', 'autonomous system number', 'bgp lookup', 'asn checker'],
      canonicalUrl: 'https://profieldhub.online/tools/asn-lookup',
    },
  },
  {
    id: 'network-info',
    slug: '/tools/network-info',
    name: 'Network Information',
    shortDescription: 'Inspect browser connection telemetry, downlink speeds, and RTT.',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Activity',
    status: 'active',
    h1: 'Network Information & Interface Telemetry',
    intro:
      'Inspect client-side network parameters using the browser Network Information API. Review effective connection type, estimated downlink, RTT, and data-saver preferences.',
    howItWorks: [
      {
        step: '01',
        title: 'Browser Interface Query',
        desc: 'Queries the Web Network Information API to extract real-time cellular and broadband parameters.',
      },
      {
        step: '02',
        title: 'Performance Diagnostics',
        desc: 'Evaluates network round-trip time, effective speed class (4G/3G/2G), and connectivity status.',
      },
    ],
    faqs: [
      {
        question: 'How is effective connection type calculated?',
        answer:
          'Modern browsers measure the actual round-trip time (RTT) and bandwidth throughput over recent HTTP requests to classify your connection (e.g. 4g, 3g).',
      },
    ],
    relatedToolIds: ['my-ip', 'connection-analysis', 'privacy-check'],
    seo: {
      title: 'Network Information & Connection Telemetry | NETWHO',
      description:
        'Analyze your browser network interface, bandwidth estimate, RTT latency, and connection status with NETWHO.',
      keywords: ['network information', 'connection telemetry', 'network speed test', 'browser network check'],
      canonicalUrl: 'https://profieldhub.online/tools/network-info',
    },
  },
  {
    id: 'dns-lookup',
    slug: '/tools/dns-lookup',
    name: 'DNS Lookup',
    shortDescription: 'Query authoritative DNS records (A, AAAA, MX, TXT, NS, CNAME).',
    category: 'network-ip',
    categoryName: 'Network & IP Tools',
    iconName: 'Database',
    status: 'active',
    h1: 'DNS Lookup & Record Inspector',
    intro:
      'Perform live DNS-over-HTTPS (DoH) queries against any domain name. Inspect A, AAAA, MX, TXT, NS, and CNAME records with full TTL data.',
    howItWorks: [
      {
        step: '01',
        title: 'Specify Target Domain',
        desc: 'Enter any domain name (e.g. profieldhub.online, google.com) and choose your target record type.',
      },
      {
        step: '02',
        title: 'DNS-over-HTTPS Query',
        desc: 'Sends encrypted queries to top-tier DNS resolvers with zero cache poisoning risk.',
      },
      {
        step: '03',
        title: 'Examine Record Table',
        desc: 'Inspect resolved IP addresses, mail servers, verification TXT records, and authoritative nameservers.',
      },
    ],
    faqs: [
      {
        question: 'What is DNS-over-HTTPS (DoH)?',
        answer:
          'DoH sends DNS queries over an encrypted HTTPS connection, preventing eavesdropping and manipulation of DNS data by intermediaries.',
      },
    ],
    relatedToolIds: ['ip-lookup', 'asn-lookup', 'my-ip'],
    seo: {
      title: 'DNS Lookup | Query Domain DNS Records Online | NETWHO',
      description:
        'Check domain DNS records online including A, AAAA, MX, TXT, NS, and CNAME with NETWHO DNS Lookup tool.',
      keywords: ['dns lookup', 'check dns records', 'mx record lookup', 'dns checker', 'txt record lookup'],
      canonicalUrl: 'https://profieldhub.online/tools/dns-lookup',
    },
  },

  // ==========================================
  // CATEGORY 2: PRIVACY & CONNECTION TOOLS
  // ==========================================
  {
    id: 'vpn-detection',
    slug: '/tools/vpn-detection',
    name: 'VPN Detection',
    shortDescription: 'Analyse connection indicators and check whether a VPN or proxy may be detected.',
    category: 'privacy-connection',
    categoryName: 'Privacy & Connection Tools',
    iconName: 'ShieldAlert',
    status: 'active',
    h1: 'VPN Detection & Connection Risk Audit',
    intro:
      'Examine key connection indicators to detect active VPN tunnels, datacenter IPs, WebRTC candidate leaks, and system timezone discrepancies.',
    howItWorks: [
      {
        step: '01',
        title: 'Multi-Signal Heuristic Audit',
        desc: 'NETWHO analyzes datacenter ASN signatures, WebRTC UDP candidate consistency, and clock disparities.',
      },
      {
        step: '02',
        title: 'Risk Score Computation',
        desc: 'Combines verified telemetry into an objective Low, Medium, or High VPN probability rating.',
      },
      {
        step: '03',
        title: 'Actionable Breakdown',
        desc: 'Reviews each test parameter with detailed explanations of why a flag was raised or passed.',
      },
    ],
    faqs: [
      {
        question: 'How do websites detect that I am using a VPN?',
        answer:
          'Websites detect VPNs by cross-referencing your IP against known commercial hosting providers, checking if your browser timezone mismatches your IP location, and inspecting WebRTC interfaces.',
      },
      {
        question: 'Is it illegal to use a VPN?',
        answer:
          'In the vast majority of countries (including the UK, US, and EU), using a VPN for privacy and security is completely legal.',
      },
    ],
    relatedToolIds: ['proxy-detection', 'privacy-check', 'my-ip', 'ip-lookup'],
    seo: {
      title: 'VPN Detection | Detect VPN Connection Online | NETWHO',
      description:
        'Check if your connection is detected as a VPN or proxy using multi-signal heuristics, WebRTC leak tests, and ASN audits.',
      keywords: ['vpn detection', 'detect vpn', 'check vpn connection', 'vpn checker', 'is my vpn leaking'],
      canonicalUrl: 'https://profieldhub.online/tools/vpn-detection',
    },
  },
  {
    id: 'proxy-detection',
    slug: '/tools/proxy-detection',
    name: 'Proxy Detection',
    shortDescription: 'Inspect proxy header signatures, latency jitter, and routing flags.',
    category: 'privacy-connection',
    categoryName: 'Privacy & Connection Tools',
    iconName: 'ShieldX',
    status: 'active',
    h1: 'Proxy Detection & Intermediary Inspector',
    intro:
      'Analyze network headers, round-trip packet timing, and routing anomalies to determine if a forward proxy, reverse proxy, or SOCKS node is intercepting traffic.',
    howItWorks: [
      {
        step: '01',
        title: 'Header & Gateway Inspection',
        desc: 'Checks for transparent forwarding headers such as Via, X-Forwarded-For, and Forwarded.',
      },
      {
        step: '02',
        title: 'Port & Protocol Audit',
        desc: 'Evaluates common proxy port signatures and latency jitter behavior.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between a proxy and a VPN?',
        answer:
          'A proxy typically reroutes web browser traffic at the application layer (HTTP/SOCKS), while a VPN encrypts all operating system traffic at the network tunnel layer.',
      },
    ],
    relatedToolIds: ['vpn-detection', 'privacy-check', 'connection-analysis'],
    seo: {
      title: 'Proxy Detection | Detect HTTP & SOCKS Proxies | NETWHO',
      description:
        'Scan connection signatures and routing headers to detect active proxies, forwarders, and anonymizers with NETWHO.',
      keywords: ['proxy detection', 'detect proxy', 'proxy checker', 'http proxy detection'],
      canonicalUrl: 'https://profieldhub.online/tools/proxy-detection',
    },
  },
  {
    id: 'connection-analysis',
    slug: '/tools/connection-analysis',
    name: 'Connection Analysis',
    shortDescription: 'Evaluate protocol version, TLS cipher support, and connection health.',
    category: 'privacy-connection',
    categoryName: 'Privacy & Connection Tools',
    iconName: 'Cpu',
    status: 'active',
    h1: 'Connection Analysis & Network Health Benchmark',
    intro:
      'Run an in-depth audit of your active browser session: protocol version (HTTP/2, HTTP/3), round-trip stability, cipher security, and header hygiene.',
    howItWorks: [
      {
        step: '01',
        title: 'Session Handshake Analysis',
        desc: 'Examines TLS protocol parameters, HTTP transport type, and compression support.',
      },
      {
        step: '02',
        title: 'Stability Benchmark',
        desc: 'Measures live packet round-trip timing variance to detect connection jitter.',
      },
    ],
    faqs: [
      {
        question: 'Why does connection stability matter?',
        answer:
          'High jitter and packet instability can cause degraded performance in real-time applications like video calls, API streaming, and online gaming.',
      },
    ],
    relatedToolIds: ['network-info', 'privacy-check', 'vpn-detection'],
    seo: {
      title: 'Connection Analysis & Network Health Audit | NETWHO',
      description:
        'Evaluate network connection quality, transport protocol, TLS handshake latency, and stability metrics with NETWHO.',
      keywords: ['connection analysis', 'network health audit', 'tls connection check', 'network stability'],
      canonicalUrl: 'https://profieldhub.online/tools/connection-analysis',
    },
  },
  {
    id: 'privacy-check',
    slug: '/tools/privacy-check',
    name: 'Privacy Check',
    shortDescription: 'Audit WebRTC IP leaks, canvas entropy, and tracking headers.',
    category: 'privacy-connection',
    categoryName: 'Privacy & Connection Tools',
    iconName: 'EyeOff',
    status: 'active',
    h1: 'Privacy Check & Browser Fingerprint Audit',
    intro:
      'Conduct a comprehensive privacy audit of your browser. Detect WebRTC IP leaks, canvas fingerprint entropy, third-party cookie isolation, and Do Not Track headers.',
    howItWorks: [
      {
        step: '01',
        title: 'WebRTC Leak Testing',
        desc: 'Initiates a local STUN transaction to detect if your private or real public IP bypasses the browser proxy.',
      },
      {
        step: '02',
        title: 'Fingerprint Entropy Audit',
        desc: 'Tests Canvas rendering uniqueness, audio context quirks, and hardware concurrency flags.',
      },
      {
        step: '03',
        title: 'Tracking Header Review',
        desc: 'Verifies Do Not Track (DNT) and Global Privacy Control (GPC) signal broadcasting.',
      },
    ],
    faqs: [
      {
        question: 'What is browser fingerprinting?',
        answer:
          'Browser fingerprinting is a tracking method that collects information about your browser configuration, screen size, installed fonts, and hardware rendering to create a unique identifier.',
      },
    ],
    relatedToolIds: ['vpn-detection', 'proxy-detection', 'my-ip'],
    seo: {
      title: 'Privacy Check | Browser Privacy & Leak Audit | NETWHO',
      description:
        'Audit browser privacy, WebRTC leaks, canvas fingerprinting, and tracking protection with NETWHO Privacy Check.',
      keywords: ['privacy check', 'browser privacy audit', 'webrtc leak test', 'fingerprint check'],
      canonicalUrl: 'https://profieldhub.online/tools/privacy-check',
    },
  },

  // ==========================================
  // CATEGORY 3: LOCATION TOOLS
  // ==========================================
  {
    id: 'location-lookup',
    slug: '/tools/location-lookup',
    name: 'Location Lookup',
    shortDescription: 'Explore geographic boundaries, coordinates, and region details.',
    category: 'location',
    categoryName: 'Location Tools',
    iconName: 'Compass',
    status: 'active',
    h1: 'Location Lookup & Coordinate Explorer',
    intro:
      'Search and inspect global locations, administrative divisions, latitude/longitude coordinates, and regional timezone metadata.',
    howItWorks: [
      {
        step: '01',
        title: 'Location Search',
        desc: 'Search by city, town, coordinate pair, or postal district.',
      },
      {
        step: '02',
        title: 'Geographic Breakdown',
        desc: 'Resolves administrative regions, elevation estimates, and timezone offsets.',
      },
    ],
    faqs: [
      {
        question: 'Can I search coordinates in decimal degrees (e.g. 51.5074, -0.1278)?',
        answer:
          'Yes, NETWHO supports direct coordinate input in decimal degrees format.',
      },
    ],
    relatedToolIds: ['ip-location', 'location-generator', 'ip-geolocation', 'location-info'],
    seo: {
      title: 'Location Lookup & Geographic Coordinates Explorer | NETWHO',
      description:
        'Explore coordinates, administrative boundaries, city details, and regional metadata with NETWHO Location Lookup.',
      keywords: ['location lookup', 'coordinates lookup', 'geographic location check', 'latitude longitude finder'],
      canonicalUrl: 'https://profieldhub.online/tools/location-lookup',
    },
  },
  {
    id: 'ip-geolocation',
    slug: '/tools/ip-geolocation',
    name: 'IP Geolocation',
    shortDescription: 'Map IP addresses with precision coordinates and regional data.',
    category: 'location',
    categoryName: 'Location Tools',
    iconName: 'Navigation',
    status: 'active',
    h1: 'IP Geolocation & Mapping Engine',
    intro:
      'Pinpoint the physical location of any IP address on a world map with country flags, subdivision codes, and ISP infrastructure details.',
    howItWorks: [
      {
        step: '01',
        title: 'Geocoding IP Block',
        desc: 'Translates IP ranges into geographic coordinates and postal districts.',
      },
      {
        step: '02',
        title: 'Visual Representation',
        desc: 'Displays accurate map pins and boundary estimations for technical audits.',
      },
    ],
    faqs: [
      {
        question: 'Why do different geolocation databases show different cities for the same IP?',
        answer:
          'Geolocation providers use different data sources and network telemetry. Minor discrepancies can occur if an ISP shifts IP blocks between regional routing nodes.',
      },
    ],
    relatedToolIds: ['ip-location', 'ip-lookup', 'location-lookup'],
    seo: {
      title: 'IP Geolocation Engine | Map IP Addresses Online | NETWHO',
      description:
        'Geolocate any IP address on interactive maps with accurate coordinates, city, and ISP data on NETWHO.',
      keywords: ['ip geolocation', 'map ip address', 'ip geolocator', 'ip coordinates finder'],
      canonicalUrl: 'https://profieldhub.online/tools/ip-geolocation',
    },
  },
  {
    id: 'location-info',
    slug: '/tools/location-info',
    name: 'Location Information',
    shortDescription: 'Inspect time zone offsets, DST status, calling codes, and currency.',
    category: 'location',
    categoryName: 'Location Tools',
    iconName: 'Clock',
    status: 'active',
    h1: 'Location Information & Regional Intelligence',
    intro:
      'Access essential regional intelligence including daylight saving time (DST) schedules, ISO country codes, local currency symbols, and international dialling codes.',
    howItWorks: [
      {
        step: '01',
        title: 'Country & Territory Selection',
        desc: 'Select from global territories or inspect current location metadata.',
      },
      {
        step: '02',
        title: 'Comprehensive Regional Matrix',
        desc: 'Instant view of UTC offsets, currency ISO codes, calling prefixes, and language standards.',
      },
    ],
    faqs: [
      {
        question: 'What is UTC offset vs GMT?',
        answer:
          'UTC (Coordinated Universal Time) is the primary time standard. GMT (Greenwich Mean Time) is a time zone used in specific countries (such as the UK during winter).',
      },
    ],
    relatedToolIds: ['location-lookup', 'location-generator', 'ip-location'],
    seo: {
      title: 'Location Information | Timezones, Currency & Country Codes | NETWHO',
      description:
        'Inspect international time zones, UTC offsets, country codes, currency, and dialling codes with NETWHO.',
      keywords: ['location information', 'timezone lookup', 'currency codes', 'country calling codes'],
      canonicalUrl: 'https://profieldhub.online/tools/location-info',
    },
  },
  {
    id: 'location-generator',
    slug: '/tools/location-generator',
    name: 'Location Generator',
    shortDescription: 'Generate structured, realistic UK and global addresses for testing.',
    category: 'location',
    categoryName: 'Location Tools',
    iconName: 'Sparkles',
    status: 'active',
    h1: 'Location Generator & Test Address Suite',
    intro:
      'Generate structured, realistic synthetic UK and international addresses, postcode districts, and geographic coordinates for QA testing, software development, and mock databases.',
    howItWorks: [
      {
        step: '01',
        title: 'Choose Country / Region',
        desc: 'Select England, Scotland, Wales, Northern Ireland, or international regions.',
      },
      {
        step: '02',
        title: 'Algorithmic Synthesis',
        desc: 'Generates valid street patterns, valid postal codes, realistic coordinate pairs, and district classifications.',
      },
      {
        step: '03',
        title: 'Export & Copy',
        desc: 'Export structured JSON or copy formatted address strings directly to your clipboard.',
      },
    ],
    faqs: [
      {
        question: 'Are generated test addresses real residences?',
        answer:
          'Generated addresses use valid postcode prefixes and typical street nomenclatures for software development and layout testing. They are not intended to represent actual individuals.',
      },
    ],
    relatedToolIds: ['uk-profile', 'location-lookup', 'ip-location'],
    seo: {
      title: 'Location Generator | Synthetic Test Addresses & Postcodes | NETWHO',
      description:
        'Generate structured test addresses, UK postcodes, and geographic coordinates for software development with NETWHO.',
      keywords: ['location generator', 'uk address generator', 'fake address test data', 'postcode generator'],
      canonicalUrl: 'https://profieldhub.online/tools/location-generator',
    },
  },

  // ==========================================
  // CATEGORY 4: PROFILE TOOLS
  // ==========================================
  {
    id: 'uk-profile',
    slug: '/tools/uk-profile',
    name: 'UK Profile',
    shortDescription: 'Generate and manage structured UK profiles with selectable criteria.',
    category: 'profile',
    categoryName: 'Profile Tools',
    iconName: 'UserCheck',
    status: 'active',
    h1: 'UK Profile Generator & Structured Register',
    intro:
      'Generate, customize, and inspect comprehensive UK demographic and lifestyle profiles. Filter by gender, age group, employment status, job category, and constituent UK country with 100% internal consistency.',
    howItWorks: [
      {
        step: '01',
        title: 'Select Optional Criteria',
        desc: 'Configure Gender, Age Group (17 to 66+), Employment Status, Job Category, or UK Country (England, Scotland, Wales, Northern Ireland).',
      },
      {
        step: '02',
        title: 'Generate Full Profile',
        desc: 'Generates a coherent 8-section record spanning personal demographics, employment, household, income, technology, and lifestyle.',
      },
      {
        step: '03',
        title: 'Save, Compare, & Export',
        desc: 'Store profiles in your local library, copy formatted text, or compare up to 3 profiles side-by-side.',
      },
    ],
    faqs: [
      {
        question: 'What fields are included in a generated UK profile?',
        answer:
          'Every profile includes 8 core sections: Personal Demographics, Location & Housing, Employment & Education, Household Structure, Household Income, Technology, Digital Services, and Interests.',
      },
      {
        question: 'How is data consistency ensured?',
        answer:
          'NETWHO enforces logical coherence between age, employment status, education level, constituent UK country regions, housing types, and household structures.',
      },
      {
        question: 'Can I export saved profiles?',
        answer:
          'Yes, you can export and import your entire profile library as JSON from the settings menu.',
      },
    ],
    relatedToolIds: ['build-profile', 'profile-library', 'profile-comparison', 'location-generator'],
    seo: {
      title: 'UK Profile Generator | Structured Demographic Test Data | NETWHO',
      description:
        'Generate structured, realistic UK profiles with selectable gender, age, employment, and regional criteria on NETWHO.',
      keywords: ['uk profile generator', 'structured profile generator', 'uk persona generator', 'uk test profiles'],
      canonicalUrl: 'https://profieldhub.online/tools/uk-profile',
    },
  },
  {
    id: 'build-profile',
    slug: '/tools/build-profile',
    name: 'Build Profile',
    shortDescription: 'Construct and define custom UK profiles across all dimensions.',
    category: 'profile',
    categoryName: 'Profile Tools',
    iconName: 'UserPlus',
    status: 'active',
    h1: 'Build Custom UK Profile',
    intro:
      'Manually construct detailed UK demographic profiles with full control over all personal, geographic, employment, income, and technology variables.',
    howItWorks: [
      {
        step: '01',
        title: 'Personal Demographics',
        desc: 'Enter names, select gender, exact age, date of birth, and marital status.',
      },
      {
        step: '02',
        title: 'Geographic Placement',
        desc: 'Choose UK country, region, city, postcode prefix, and housing architecture.',
      },
      {
        step: '03',
        title: 'Save to Local Library',
        desc: 'Save your custom record directly to your browser library for instant comparison and export.',
      },
    ],
    faqs: [
      {
        question: 'Can I use autofill to start with a realistic base?',
        answer:
          'Yes! The "Autofill Form" button populates the builder with a balanced random profile that you can customize.',
      },
    ],
    relatedToolIds: ['uk-profile', 'profile-library', 'profile-comparison'],
    seo: {
      title: 'Build Custom UK Profile | Profile Creator | NETWHO',
      description:
        'Construct custom UK demographic profiles with full control over location, job, income, and technology choices on NETWHO.',
      keywords: ['build uk profile', 'custom profile builder', 'uk persona creator'],
      canonicalUrl: 'https://profieldhub.online/tools/build-profile',
    },
  },
  {
    id: 'profile-library',
    slug: '/tools/profile-library',
    name: 'Profile Library',
    shortDescription: 'Search, inspect, copy, and compare registered UK profiles.',
    category: 'profile',
    categoryName: 'Profile Tools',
    iconName: 'FolderArchive',
    status: 'active',
    h1: 'Profile Library & Stored Dataset',
    intro:
      'Search, filter, inspect, copy, and manage all your saved UK profiles stored securely in local browser storage.',
    howItWorks: [
      {
        step: '01',
        title: 'Search & Filter',
        desc: 'Filter by UK Country, Employment Status, or search by name, ID, city, or job title.',
      },
      {
        step: '02',
        title: 'Inspect & Compare',
        desc: 'View full records in detailed modals or select up to 3 profiles for side-by-side matrix comparison.',
      },
    ],
    faqs: [
      {
        question: 'Where are my saved profiles stored?',
        answer:
          'All profiles are stored locally in your browser storage (LocalStorage), ensuring private and offline-accessible data management.',
      },
    ],
    relatedToolIds: ['uk-profile', 'build-profile', 'profile-comparison'],
    seo: {
      title: 'Profile Library | Manage Saved UK Profiles | NETWHO',
      description:
        'Browse, filter, search, and export your saved UK demographic profiles with NETWHO Profile Library.',
      keywords: ['profile library', 'saved uk profiles', 'persona repository', 'dataset manager'],
      canonicalUrl: 'https://profieldhub.online/tools/profile-library',
    },
  },
  {
    id: 'profile-comparison',
    slug: '/tools/profile-comparison',
    name: 'Profile Comparison',
    shortDescription: 'Compare demographic variables across up to 3 profiles side-by-side.',
    category: 'profile',
    categoryName: 'Profile Tools',
    iconName: 'Columns3',
    status: 'active',
    h1: 'Profile Comparison & Demographic Matrix',
    intro:
      'Compare core demographics, employment, household structures, income bands, and technology habits across up to 3 profiles simultaneously.',
    howItWorks: [
      {
        step: '01',
        title: 'Populate Comparison Slots',
        desc: 'Select profiles from your library or add quick random benchmark profiles.',
      },
      {
        step: '02',
        title: 'Analyze Matrix',
        desc: 'Review side-by-side rows comparing age, geography, income, employment, devices, and lifestyle.',
      },
    ],
    faqs: [
      {
        question: 'How many profiles can I compare simultaneously?',
        answer:
          'You can compare up to 3 profiles side-by-side in high-contrast tabular matrix layout.',
      },
    ],
    relatedToolIds: ['uk-profile', 'profile-library', 'build-profile'],
    seo: {
      title: 'Profile Comparison Matrix | Side-by-Side Demographic Analysis | NETWHO',
      description:
        'Compare up to 3 structured UK profiles side-by-side across demographics, income, and tech habits on NETWHO.',
      keywords: ['profile comparison', 'compare personas', 'demographic comparison matrix'],
      canonicalUrl: 'https://profieldhub.online/tools/profile-comparison',
    },
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.id === id);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  // Normalize slug to match with or without leading/trailing slashes
  const clean = slug.startsWith('/') ? slug : `/${slug}`;
  const withoutTools = clean.replace(/^\/tools\//, '/');
  const withTools = clean.startsWith('/tools/') ? clean : `/tools${clean}`;
  
  return TOOLS_REGISTRY.find(
    (t) =>
      t.slug === clean ||
      t.slug === withoutTools ||
      t.slug === withTools ||
      t.id === clean.replace(/^\//, '') ||
      t.id === withoutTools.replace(/^\//, '')
  );
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS_REGISTRY;
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === categoryId);
}

export function getRelatedTools(toolId: string): ToolDefinition[] {
  const tool = getToolById(toolId);
  if (!tool) return [];
  return tool.relatedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => t !== undefined);
}
