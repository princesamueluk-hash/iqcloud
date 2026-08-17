import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Download,
  Search,
  Globe,
  Network,
  Shield,
  Layers,
  ArrowLeft,
  ArrowRight,
  Terminal,
  Server,
  Cpu,
  FileCode,
  FileSpreadsheet,
} from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';

interface GeneratedIpItem {
  id: string;
  ip: string;
  version: 'IPv4' | 'IPv6';
  type: 'Public' | 'Private (RFC 1918)' | 'Carrier NAT (RFC 6598)' | 'Loopback' | 'Documentation';
  classType: string;
  cidr: string;
  subnetMask: string;
  simulatedRegion: string;
  simulatedCountry: string;
  simulatedAsn: string;
  simulatedIsp: string;
  reversePtr: string;
  binary: string;
  decimal: number | string;
  timestamp: string;
}

interface GenerateIpToolProps {
  onNavigate?: (path: string) => void;
}

const REGION_POOLS = [
  { region: 'United Kingdom (London)', country: 'United Kingdom', flag: '🇬🇧', asn: 'AS2856', isp: 'BT Group plc', prefix: '51.140.' },
  { region: 'United Kingdom (Manchester)', country: 'United Kingdom', flag: '🇬🇧', asn: 'AS5089', isp: 'Virgin Media UK', prefix: '82.132.' },
  { region: 'United Kingdom (Edinburgh)', country: 'United Kingdom', flag: '🇬🇧', asn: 'AS13037', isp: 'Zen Internet Ltd', prefix: '185.73.' },
  { region: 'United States (East / NY)', country: 'United States', flag: '🇺🇸', asn: 'AS7018', isp: 'AT&T Services', prefix: '12.180.' },
  { region: 'United States (West / CA)', country: 'United States', flag: '🇺🇸', asn: 'AS15169', isp: 'Google Cloud LLC', prefix: '35.247.' },
  { region: 'Germany (Frankfurt)', country: 'Germany', flag: '🇩🇪', asn: 'AS3320', isp: 'Deutsche Telekom AG', prefix: '80.187.' },
  { region: 'Ireland (Dublin)', country: 'Ireland', flag: '🇮🇪', asn: 'AS16509', isp: 'Amazon Data Services', prefix: '54.246.' },
  { region: 'Japan (Tokyo)', country: 'Japan', flag: '🇯🇵', asn: 'AS2514', isp: 'NTT Communications', prefix: '153.120.' },
  { region: 'Singapore', country: 'Singapore', flag: '🇸🇬', asn: 'AS4657', isp: 'StarHub Ltd', prefix: '116.14.' },
];

export const GenerateIpTool: React.FC<GenerateIpToolProps> = ({ onNavigate }) => {
  const { lookupIp } = useIpResult();

  const [addressVersion, setAddressVersion] = useState<'IPv4' | 'IPv6'>('IPv4');
  const [addressCategory, setAddressCategory] = useState<'public' | 'private' | 'carrier' | 'all'>('public');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [cidrPrefix, setCidrPrefix] = useState<number>(24);

  const [generatedList, setGeneratedList] = useState<GeneratedIpItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'cidr-calculator'>('generator');

  // CIDR Calculator State
  const [calcBaseIp, setCalcBaseIp] = useState<string>('192.168.1.0');
  const [calcPrefix, setCalcPrefix] = useState<number>(24);

  // Helper to convert IPv4 to 32-bit unsigned int and binary string
  const ipv4ToBinary = (octets: number[]) => {
    return octets.map((o) => o.toString(2).padStart(8, '0')).join('.');
  };

  const generateIpItem = (): GeneratedIpItem => {
    const timestamp = new Date().toISOString();
    const id = `GEN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    if (addressVersion === 'IPv6') {
      // Generate IPv6
      const randomHexGroup = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
      const isDocumentation = addressCategory === 'private';
      const prefix = isDocumentation ? '2001:db8' : '2a00:23c5';
      const ip = `${prefix}:${randomHexGroup()}:${randomHexGroup()}:${randomHexGroup()}:${randomHexGroup()}:${randomHexGroup()}`;
      
      return {
        id,
        ip,
        version: 'IPv6',
        type: isDocumentation ? 'Documentation' : 'Public',
        classType: 'Global Unicast',
        cidr: '/64',
        subnetMask: 'ffff:ffff:ffff:ffff::',
        simulatedRegion: 'Global Anycast',
        simulatedCountry: 'United Kingdom',
        simulatedAsn: 'AS2856',
        simulatedIsp: 'BT IPv6 Core Routing',
        reversePtr: `${ip.split(':').reverse().join('.')}.ip6.arpa`,
        binary: '0010101000000000.0010001111000101...',
        decimal: '3.4028236692e+38',
        timestamp,
      };
    }

    // IPv4 Generation Logic
    let octet1 = 0;
    let octet2 = 0;
    let octet3 = 0;
    let octet4 = 0;
    let type: GeneratedIpItem['type'] = 'Public';
    let classType = 'Class A';
    let reg = REGION_POOLS[Math.floor(Math.random() * REGION_POOLS.length)];

    if (selectedRegion !== 'all') {
      const found = REGION_POOLS.find((r) => r.region === selectedRegion);
      if (found) reg = found;
    }

    if (addressCategory === 'private') {
      type = 'Private (RFC 1918)';
      const privatePool = Math.floor(Math.random() * 3);
      if (privatePool === 0) {
        octet1 = 10;
        octet2 = Math.floor(Math.random() * 256);
        octet3 = Math.floor(Math.random() * 256);
        octet4 = Math.floor(Math.random() * 254) + 1;
        classType = 'Class A Private (10.0.0.0/8)';
      } else if (privatePool === 1) {
        octet1 = 172;
        octet2 = Math.floor(Math.random() * 16) + 16;
        octet3 = Math.floor(Math.random() * 256);
        octet4 = Math.floor(Math.random() * 254) + 1;
        classType = 'Class B Private (172.16.0.0/12)';
      } else {
        octet1 = 192;
        octet2 = 168;
        octet3 = Math.floor(Math.random() * 256);
        octet4 = Math.floor(Math.random() * 254) + 1;
        classType = 'Class C Private (192.168.0.0/16)';
      }
      reg = { region: 'Local Area Network', country: 'Private / RFC1918', flag: '🔒', asn: 'N/A', isp: 'Private Intranet', prefix: '' };
    } else if (addressCategory === 'carrier') {
      type = 'Carrier NAT (RFC 6598)';
      octet1 = 100;
      octet2 = Math.floor(Math.random() * 64) + 64; // 100.64.0.0 to 100.127.255.255
      octet3 = Math.floor(Math.random() * 256);
      octet4 = Math.floor(Math.random() * 254) + 1;
      classType = 'Shared Address Space (100.64.0.0/10)';
      reg = { region: 'Carrier-Grade CGNAT', country: 'ISP Infrastructure', flag: '📡', asn: 'AS-CGNAT', isp: 'ISP Middlebox Pool', prefix: '' };
    } else {
      // Public IPv4 using region prefix or random public pool
      type = 'Public';
      const parts = reg.prefix.split('.').filter(Boolean);
      octet1 = parseInt(parts[0], 10);
      octet2 = parseInt(parts[1], 10);
      octet3 = Math.floor(Math.random() * 254) + 1;
      octet4 = Math.floor(Math.random() * 254) + 1;

      if (octet1 <= 126) classType = 'Class A (Public)';
      else if (octet1 <= 191) classType = 'Class B (Public)';
      else classType = 'Class C (Public)';
    }

    const ip = `${octet1}.${octet2}.${octet3}.${octet4}`;
    const decimal = (octet1 * 16777216) + (octet2 * 65536) + (octet3 * 256) + octet4;
    const binary = ipv4ToBinary([octet1, octet2, octet3, octet4]);

    return {
      id,
      ip,
      version: 'IPv4',
      type,
      classType,
      cidr: `/${cidrPrefix}`,
      subnetMask: getSubnetMaskFromPrefix(cidrPrefix),
      simulatedRegion: reg.region,
      simulatedCountry: reg.country,
      simulatedAsn: reg.asn,
      simulatedIsp: reg.isp,
      reversePtr: `${octet4}.${octet3}.${octet2}.${octet1}.in-addr.arpa`,
      binary,
      decimal,
      timestamp,
    };
  };

  const getSubnetMaskFromPrefix = (prefix: number): string => {
    const mask = [];
    for (let i = 0; i < 4; i++) {
      const n = Math.min(prefix, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      prefix -= n;
    }
    return mask.join('.');
  };

  const handleGenerate = () => {
    const list: GeneratedIpItem[] = [];
    for (let i = 0; i < batchCount; i++) {
      list.push(generateIpItem());
    }
    setGeneratedList(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [addressVersion, addressCategory, selectedRegion, batchCount, cidrPrefix]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = generatedList.map((item) => `${item.ip}\t${item.type}\t${item.simulatedRegion}\t${item.simulatedAsn}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `netwho-generated-ips-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = 'IP,Version,Type,Class,CIDR,SubnetMask,Region,Country,ASN,ISP,ReversePTR\n';
    const rows = generatedList
      .map(
        (i) =>
          `"${i.ip}","${i.version}","${i.type}","${i.classType}","${i.cidr}","${i.subnetMask}","${i.simulatedRegion}","${i.simulatedCountry}","${i.simulatedAsn}","${i.simulatedIsp}","${i.reversePtr}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `netwho-ips-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleAnalyzeInLookup = (ip: string) => {
    lookupIp(ip, true);
    if (onNavigate) {
      onNavigate('/ip-lookup');
    } else {
      window.location.hash = '/ip-lookup';
    }
  };

  const primaryGenerated = generatedList[0];

  // Calculate Subnet CIDR Details
  const calculateCidrInfo = () => {
    const totalAddresses = Math.pow(2, 32 - calcPrefix);
    const usableHosts = calcPrefix >= 31 ? (calcPrefix === 31 ? 2 : 1) : totalAddresses - 2;
    const mask = getSubnetMaskFromPrefix(calcPrefix);
    return {
      totalAddresses: totalAddresses.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      mask,
      wildcard: mask.split('.').map((o) => 255 - parseInt(o, 10)).join('.'),
      cidrNotation: `${calcBaseIp}/${calcPrefix}`,
    };
  };

  const cidrInfo = calculateCidrInfo();

  return (
    <div id="generate-ip-workspace" className="space-y-8">
      {/* Return to All Services Navigation */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <button
          id="back-to-services-btn"
          onClick={() => {
            if (onNavigate) onNavigate('/');
            else window.location.hash = '/';
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border-2 border-black text-xs font-mono font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← All Services</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 uppercase">
          <span className="font-bold text-black">Generate IP</span>
          <span>•</span>
          <span>A Creatiq Product</span>
        </div>
      </div>

      {/* Workspace Header */}
      <header className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-neutral-600">
          <span className="bg-black text-white px-2 py-0.5">NETWHO</span>
          <span>/</span>
          <span>Generate IP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black">
          Generate IP & Network Address Suite
        </h1>
        <p className="text-base sm:text-lg text-neutral-700 max-w-3xl leading-relaxed">
          Generate valid synthetic IPv4, IPv6, CIDR subnet blocks, and private test addresses for API benchmarking, software verification, and network diagnostics.
        </p>
      </header>

      {/* Sub-Tabs: Generator vs CIDR Calculator */}
      <div className="flex border-b-2 border-black gap-2">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-t-2 border-l-2 border-r-2 -mb-[2px] transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'generator'
              ? 'bg-black text-white border-black z-10'
              : 'bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>IP Address Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('cidr-calculator')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-t-2 border-l-2 border-r-2 -mb-[2px] transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'cidr-calculator'
              ? 'bg-black text-white border-black z-10'
              : 'bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Subnet & CIDR Inspector</span>
        </button>
      </div>

      {activeTab === 'generator' ? (
        <div className="space-y-8">
          {/* Generation Configuration Controls Panel */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3 flex items-center justify-between">
              <span>Configuration & Synthesis Parameters</span>
              <span className="text-xs font-mono font-normal text-neutral-500 lowercase">
                ready to generate
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Protocol Version */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Address Family
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddressVersion('IPv4')}
                    className={`py-2.5 px-3 text-xs font-mono font-bold uppercase border-2 transition-colors cursor-pointer ${
                      addressVersion === 'IPv4'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-neutral-300 hover:border-black'
                    }`}
                  >
                    IPv4 (32-bit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressVersion('IPv6')}
                    className={`py-2.5 px-3 text-xs font-mono font-bold uppercase border-2 transition-colors cursor-pointer ${
                      addressVersion === 'IPv6'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-neutral-300 hover:border-black'
                    }`}
                  >
                    IPv6 (128-bit)
                  </button>
                </div>
              </div>

              {/* Address Scope */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Network Scope
                </label>
                <select
                  value={addressCategory}
                  onChange={(e) => setAddressCategory(e.target.value as any)}
                  className="w-full py-2.5 px-3 border-2 border-black bg-white font-mono text-xs font-bold text-black focus:outline-none"
                >
                  <option value="public">Public Routable IP</option>
                  <option value="private">Private LAN (RFC 1918)</option>
                  <option value="carrier">Carrier-Grade NAT (RFC 6598)</option>
                  <option value="all">Random Mixed Pool</option>
                </select>
              </div>

              {/* Geographic Simulation */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Target Region / Origin
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={addressCategory === 'private' || addressCategory === 'carrier'}
                  className="w-full py-2.5 px-3 border-2 border-black bg-white font-mono text-xs font-bold text-black focus:outline-none disabled:opacity-50"
                >
                  <option value="all">Global Multi-Region (All)</option>
                  {REGION_POOLS.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.flag} {r.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Quantity */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                  Batch Output Count
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 5, 10, 25].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setBatchCount(cnt)}
                      className={`py-2 text-xs font-mono font-bold border-2 transition-colors cursor-pointer ${
                        batchCount === cnt
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-300 hover:border-black'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200">
              <button
                id="generate-ip-action-btn"
                onClick={handleGenerate}
                className="px-8 py-3.5 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate IP Now</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAll}
                  className="px-4 py-2.5 bg-neutral-100 border-2 border-black text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied Batch!' : 'Copy Batch'}</span>
                </button>
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-2.5 bg-white border-2 border-black text-black font-bold text-xs uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Export JSON"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2.5 bg-white border-2 border-black text-black font-bold text-xs uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Export CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Featured IP Result Card */}
          {primaryGenerated && (
            <div className="border-2 border-black bg-white">
              <div className="bg-neutral-100 border-b-2 border-black p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-0.5">
                      {primaryGenerated.version}
                    </span>
                    <span className="font-mono text-xs font-bold bg-neutral-200 text-neutral-900 px-2 py-0.5 border border-neutral-300">
                      {primaryGenerated.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-600">
                      {primaryGenerated.classType}
                    </span>
                  </div>
                  <div className="font-mono text-2xl sm:text-4xl font-black text-black tracking-tight pt-1">
                    {primaryGenerated.ip}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    id={`copy-ip-${primaryGenerated.id}`}
                    onClick={() => handleCopy(primaryGenerated.ip, primaryGenerated.id)}
                    className="px-4 py-2.5 bg-white border-2 border-black text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    {copiedId === primaryGenerated.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedId === primaryGenerated.id ? 'Copied' : 'Copy IP'}</span>
                  </button>

                  <button
                    onClick={() => handleAnalyzeInLookup(primaryGenerated.ip)}
                    className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <Search className="w-4 h-4" />
                    <span>Analyse in IP Lookup →</span>
                  </button>
                </div>
              </div>

              {/* Diagnostic Metadata Grid */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                    Simulated Region & Country
                  </span>
                  <div className="font-bold text-black text-base flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-neutral-500" />
                    <span>{primaryGenerated.simulatedRegion}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono block">
                    {primaryGenerated.simulatedCountry}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                    Simulated ASN & ISP
                  </span>
                  <div className="font-bold text-black text-base flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-neutral-500" />
                    <span>{primaryGenerated.simulatedAsn}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono block truncate">
                    {primaryGenerated.simulatedIsp}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                    Subnet Mask & CIDR
                  </span>
                  <div className="font-mono font-bold text-black text-base">
                    {primaryGenerated.subnetMask}
                  </div>
                  <span className="text-xs text-neutral-500 font-mono block">
                    Prefix: {primaryGenerated.cidr}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                    Reverse PTR Structure
                  </span>
                  <div className="font-mono text-xs font-bold text-black truncate" title={primaryGenerated.reversePtr}>
                    {primaryGenerated.reversePtr}
                  </div>
                  <span className="text-xs text-neutral-500 font-mono block">
                    Decimal: {primaryGenerated.decimal}
                  </span>
                </div>
              </div>

              {/* Binary Representation */}
              <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-3 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-neutral-600 font-bold uppercase">Binary Bitmask:</span>
                <span className="text-black font-semibold tracking-wider select-all">{primaryGenerated.binary}</span>
              </div>
            </div>
          )}

          {/* Batch Table if > 1 */}
          {generatedList.length > 1 && (
            <div className="bg-white border-2 border-black overflow-hidden space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Batch Generated IP Records ({generatedList.length})
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  Click any row to copy or analyse
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b-2 border-black bg-neutral-100 text-neutral-700">
                      <th className="p-2.5 font-bold uppercase">#</th>
                      <th className="p-2.5 font-bold uppercase">IP Address</th>
                      <th className="p-2.5 font-bold uppercase">Type / Class</th>
                      <th className="p-2.5 font-bold uppercase">Region</th>
                      <th className="p-2.5 font-bold uppercase">Simulated ASN</th>
                      <th className="p-2.5 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {generatedList.map((item, index) => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-2.5 font-bold text-neutral-400">{index + 1}</td>
                        <td className="p-2.5 font-bold text-black text-sm">{item.ip}</td>
                        <td className="p-2.5 text-neutral-700">{item.type}</td>
                        <td className="p-2.5 text-neutral-700">{item.simulatedRegion}</td>
                        <td className="p-2.5 text-neutral-700">{item.simulatedAsn}</td>
                        <td className="p-2.5 text-right space-x-2">
                          <button
                            onClick={() => handleCopy(item.ip, item.id)}
                            className="px-2 py-1 bg-neutral-100 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer text-[11px] font-bold"
                          >
                            {copiedId === item.id ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleAnalyzeInLookup(item.ip)}
                            className="px-2 py-1 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer text-[11px] font-bold"
                          >
                            Analyse →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Subnet & CIDR Calculator Workspace */
        <div className="bg-white border-2 border-black p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
            Subnet & CIDR Range Calculator
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                Base IPv4 Address
              </label>
              <input
                type="text"
                value={calcBaseIp}
                onChange={(e) => setCalcBaseIp(e.target.value)}
                placeholder="192.168.1.0"
                className="w-full py-3 px-4 border-2 border-black font-mono text-sm text-black focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700">
                CIDR Prefix Length (/{calcPrefix})
              </label>
              <input
                type="range"
                min={8}
                max={32}
                value={calcPrefix}
                onChange={(e) => setCalcPrefix(parseInt(e.target.value, 10))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>/8 (Class A)</span>
                <span>/16 (Class B)</span>
                <span>/24 (Class C)</span>
                <span>/32 (Single Host)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            <div className="p-4 bg-neutral-50 border-2 border-black">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                Subnet Mask
              </span>
              <span className="font-mono text-lg font-bold text-black block mt-1">
                {cidrInfo.mask}
              </span>
              <span className="text-xs font-mono text-neutral-500 mt-1 block">
                Wildcard: {cidrInfo.wildcard}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 border-2 border-black">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                Total Subnet Addresses
              </span>
              <span className="font-mono text-lg font-bold text-black block mt-1">
                {cidrInfo.totalAddresses}
              </span>
              <span className="text-xs font-mono text-neutral-500 mt-1 block">
                Block: {cidrInfo.cidrNotation}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 border-2 border-black">
              <span className="text-[11px] font-mono font-bold uppercase text-neutral-600 block">
                Usable Host Capacity
              </span>
              <span className="font-mono text-lg font-bold text-emerald-700 block mt-1">
                {cidrInfo.usableHosts} IPs
              </span>
              <span className="text-xs font-mono text-neutral-500 mt-1 block">
                Excludes Net & Broadcast
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Educational Reference Cards */}
      <section className="border-2 border-black bg-neutral-50 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold uppercase tracking-wider text-black">
          About IP Generation & Diagnostic Testing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-neutral-800 leading-relaxed">
          <div className="space-y-1.5">
            <span className="font-bold text-black block">Private RFC 1918 Ranges</span>
            <p className="text-neutral-700">
              Reserved for local area networks and corporate intranets: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses are not routable across the public internet.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-bold text-black block">Carrier-Grade NAT (RFC 6598)</span>
            <p className="text-neutral-700">
              The 100.64.0.0/10 block is allocated for ISP shared address space to connect millions of mobile devices and fiber connections behind a centralized NAT pool.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-bold text-black block">Seamless Intelligence Bridge</span>
            <p className="text-neutral-700">
              Generated addresses can be fed directly into the NETWHO IP Lookup tool to test geolocation handling, BGP routing fallbacks, and security risk indicators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenerateIpTool;
