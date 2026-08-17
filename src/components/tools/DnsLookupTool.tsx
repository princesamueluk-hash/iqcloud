import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { queryDnsRecords, DnsLookupResponse } from '../../utils/networkService';

export const DnsLookupTool: React.FC = () => {
  const [domain, setDomain] = useState('profieldhub.online');
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME'>('A');
  const [dnsResult, setDnsResult] = useState<DnsLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleQuery = async (targetDomain?: string, targetType?: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME') => {
    setLoading(true);
    try {
      const res = await queryDnsRecords(targetDomain || domain, targetType || recordType);
      setDnsResult(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleQuery('profieldhub.online', 'A');
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recordTypes: ('A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME')[] = [
    'A',
    'AAAA',
    'MX',
    'TXT',
    'NS',
    'CNAME',
  ];

  return (
    <div className="space-y-8">
      {/* Query Control Panel */}
      <div className="border-2 border-black bg-white p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold uppercase tracking-wider text-black">
            Domain Name & Record Type
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. profieldhub.online, google.com, bbc.co.uk"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-full pl-11 pr-4 py-3 border-2 border-black font-mono text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleQuery()}
              disabled={loading}
              className="px-8 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Query DNS</span>
            </button>
          </div>
        </div>

        {/* Record Type Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200">
          <span className="font-mono text-xs font-bold uppercase text-neutral-600 mr-2">
            Record Type:
          </span>
          {recordTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setRecordType(type);
                handleQuery(domain, type);
              }}
              className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase border-2 transition-colors cursor-pointer ${
                recordType === type
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-neutral-400 hover:border-black'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* DNS Results Table */}
      {dnsResult && (
        <div className="border-2 border-black bg-white space-y-0">
          <div className="bg-neutral-100 border-b-2 border-black p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-neutral-600 block mb-1">
                Authoritative Query via Cloudflare DoH
              </span>
              <h3 className="font-mono text-xl sm:text-2xl font-bold text-black flex items-center gap-2">
                <span>{dnsResult.domain}</span>
                <span className="bg-black text-white text-xs px-2 py-0.5 font-mono">
                  {dnsResult.recordType} Record
                </span>
              </h3>
            </div>

            <span className="font-mono text-xs font-bold bg-neutral-200 border border-neutral-400 px-3 py-1 text-black">
              Status Code: {dnsResult.status} (NOERROR)
            </span>
          </div>

          <div className="overflow-x-auto">
            {dnsResult.records.length === 0 ? (
              <div className="p-8 text-center text-neutral-600 font-mono text-sm">
                No {dnsResult.recordType} records found for {dnsResult.domain}.
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse font-mono">
                <thead>
                  <tr className="bg-neutral-50 border-b-2 border-neutral-300 text-xs font-bold text-black uppercase">
                    <th className="p-4 border-r border-neutral-300">Target Host / Name</th>
                    <th className="p-4 border-r border-neutral-300 w-24">Type</th>
                    <th className="p-4 border-r border-neutral-300 w-24">TTL</th>
                    <th className="p-4">Resolved Record Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {dnsResult.records.map((rec, i) => (
                    <tr key={i} className="hover:bg-neutral-50">
                      <td className="p-4 font-semibold text-black border-r border-neutral-200">
                        {rec.name}
                      </td>
                      <td className="p-4 font-bold text-neutral-800 border-r border-neutral-200">
                        {rec.type}
                      </td>
                      <td className="p-4 text-neutral-600 border-r border-neutral-200">
                        {rec.TTL}s
                      </td>
                      <td className="p-4 font-bold text-black break-all flex items-center justify-between gap-4">
                        <span>{rec.data}</span>
                        <button
                          onClick={() => handleCopy(rec.data)}
                          className="text-neutral-500 hover:text-black p-1 border border-neutral-300 hover:bg-neutral-100 transition-colors"
                          title="Copy data"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
