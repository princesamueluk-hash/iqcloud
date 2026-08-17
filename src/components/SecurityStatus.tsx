import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Shield, ShieldAlert } from 'lucide-react';

export type SecurityStatusTone = 'verified' | 'checking' | 'attention' | 'unknown';

interface SecurityStatusProps {
  title: string;
  status: SecurityStatusTone;
  description: string;
  lastChecked?: string;
  detailLinkLabel?: string;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  title,
  status,
  description,
  lastChecked,
  detailLinkLabel = 'View details',
}) => {
  const statusMap = {
    verified: {
      label: 'Connection Checked',
      icon: CheckCircle2,
      className: 'security-status verified',
      accent: 'text-emerald-300',
      badge: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30',
    },
    checking: {
      label: 'Checking your connection',
      icon: Shield,
      className: 'security-status checking',
      accent: 'text-sky-300',
      badge: 'bg-sky-500/15 text-sky-200 border border-sky-400/30',
    },
    attention: {
      label: 'Attention Required',
      icon: AlertTriangle,
      className: 'security-status attention',
      accent: 'text-amber-300',
      badge: 'bg-amber-500/15 text-amber-200 border border-amber-400/30',
    },
    unknown: {
      label: 'Unable to Verify',
      icon: ShieldAlert,
      className: 'security-status unknown',
      accent: 'text-slate-300',
      badge: 'bg-slate-500/15 text-slate-200 border border-slate-400/30',
    },
  } as const;

  const current = statusMap[status];
  const Icon = current.icon;

  return (
    <div className={current.className}>
      <div className="security-status-header">
        <div className="security-status-icon-wrap">
          <Shield className="w-4 h-4" />
        </div>
        <div className="security-status-copy">
          <span className="security-status-eyebrow">Connection & Privacy Status</span>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="security-status-body">
        <div className={`security-status-badge ${current.badge}`}>
          <Icon className={`w-4 h-4 ${current.accent}`} />
          <span>{current.label}</span>
        </div>

        <p>{description}</p>

        {lastChecked && (
          <div className="security-status-meta">
            <Info className="w-3.5 h-3.5" />
            <span>Last checked: {lastChecked}</span>
          </div>
        )}

        <button type="button" className="security-status-link">
          {detailLinkLabel}
        </button>
      </div>
    </div>
  );
};
