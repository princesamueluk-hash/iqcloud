import React from 'react';
import { Shield, Globe, MapPin, Users, Info, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-20 border-t-2 border-black bg-white pt-16 pb-12 w-full text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Brand & Categorized Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-black text-white font-mono font-black text-base px-2 py-0.5">
                W
              </div>
              <span className="text-2xl font-black tracking-tight text-black">
                NETWHO
              </span>
            </div>
            <div className="inline-block bg-neutral-100 border border-neutral-300 px-2.5 py-1 text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider">
              A Creatiq Product
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed max-w-sm">
              NETWHO helps users explore, analyse and work with digital, network, location and structured information through a growing collection of online tools.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-neutral-600 block">
                Domain: <strong className="text-black font-mono">profieldhub.online</strong>
              </span>
            </div>
          </div>

          {/* Col 1: Network & IP */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black pb-1.5">
              <Globe className="w-3.5 h-3.5" /> Network & IP
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#/tools/ip-lookup"
                  onClick={(e) => handleNav('/tools/ip-lookup', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  IP Lookup
                </a>
              </li>
              <li>
                <a
                  href="#/tools/my-ip"
                  onClick={(e) => handleNav('/tools/my-ip', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  My IP
                </a>
              </li>
              <li>
                <a
                  href="#/tools/ip-location"
                  onClick={(e) => handleNav('/tools/ip-location', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  IP Location
                </a>
              </li>
              <li>
                <a
                  href="#/tools/isp-lookup"
                  onClick={(e) => handleNav('/tools/isp-lookup', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  ISP Lookup
                </a>
              </li>
              <li>
                <a
                  href="#/tools/asn-lookup"
                  onClick={(e) => handleNav('/tools/asn-lookup', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  ASN Lookup
                </a>
              </li>
              <li>
                <a
                  href="#/tools/network-info"
                  onClick={(e) => handleNav('/tools/network-info', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Network Info
                </a>
              </li>
              <li>
                <a
                  href="#/tools/dns-lookup"
                  onClick={(e) => handleNav('/tools/dns-lookup', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  DNS Lookup
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Privacy & Location */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black pb-1.5">
              <Shield className="w-3.5 h-3.5" /> Privacy & Location
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#/tools/vpn-detection"
                  onClick={(e) => handleNav('/tools/vpn-detection', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  VPN Detection
                </a>
              </li>
              <li>
                <a
                  href="#/tools/proxy-detection"
                  onClick={(e) => handleNav('/tools/proxy-detection', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Proxy Detection
                </a>
              </li>
              <li>
                <a
                  href="#/tools/privacy-check"
                  onClick={(e) => handleNav('/tools/privacy-check', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Privacy Check
                </a>
              </li>
              <li>
                <a
                  href="#/tools/location-lookup"
                  onClick={(e) => handleNav('/tools/location-lookup', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Location Lookup
                </a>
              </li>
              <li>
                <a
                  href="#/tools/location-generator"
                  onClick={(e) => handleNav('/tools/location-generator', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Location Generator
                </a>
              </li>
              <li>
                <a
                  href="#/tools/location-info"
                  onClick={(e) => handleNav('/tools/location-info', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Location Info
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Profile Tools & Platform */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black pb-1.5">
              <Users className="w-3.5 h-3.5" /> Profile & Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#/tools/uk-profile"
                  onClick={(e) => handleNav('/tools/uk-profile', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  UK Profile Generator
                </a>
              </li>
              <li>
                <a
                  href="#/tools/build-profile"
                  onClick={(e) => handleNav('/tools/build-profile', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Build Profile
                </a>
              </li>
              <li>
                <a
                  href="#/tools/profile-library"
                  onClick={(e) => handleNav('/tools/profile-library', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Profile Library
                </a>
              </li>
              <li>
                <a
                  href="#/tools/profile-comparison"
                  onClick={(e) => handleNav('/tools/profile-comparison', e)}
                  className="text-neutral-800 hover:text-black hover:underline font-medium"
                >
                  Profile Comparison
                </a>
              </li>
              <li className="pt-2 border-t border-neutral-200">
                <a
                  href="#/about"
                  onClick={(e) => handleNav('/about', e)}
                  className="text-black font-bold hover:underline"
                >
                  About NETWHO
                </a>
              </li>
              <li>
                <a
                  href="#/tools"
                  onClick={(e) => handleNav('/tools', e)}
                  className="text-black font-bold hover:underline"
                >
                  All Tools Directory
                </a>
              </li>
              <li>
                <a
                  href="#/offline"
                  onClick={(e) => handleNav('/offline', e)}
                  className="text-amber-800 hover:text-black font-bold hover:underline flex items-center gap-1"
                >
                  <span>Offline Catalog</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1 font-mono">Cached</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-700">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-bold text-black">NETWHO</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-semibold text-black">A Creatiq Product</span>
            <span className="hidden sm:inline">•</span>
            <span>© Creatiq • profieldhub.online</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-neutral-600">
            Generated profiles and mock coordinates are for demonstration and testing purposes.
          </div>
        </div>
      </div>
    </footer>
  );
};
