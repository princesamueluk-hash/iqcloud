import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useIpResult } from '../../context/IpResultContext';
import { IpRiskAssessment } from '../../utils/networkService';

interface IpRiskSummaryProps {
  assessment?: IpRiskAssessment | null;
  className?: string;
}

export const IpRiskSummary: React.FC<IpRiskSummaryProps> = ({
  assessment: propAssessment,
  className = '',
}) => {
  const context = useIpResult();
  const assessment = propAssessment !== undefined ? propAssessment : context.riskAssessment;
  const loading = context.loading;

  if (loading) {
    return (
      <div className={`border-2 border-black bg-neutral-100 p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-neutral-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!assessment || !assessment.available || !assessment.riskLevel) {
    return null;
  }

  const getRiskStyles = (level: string) => {
    switch (level) {
      case 'LOW RISK':
        return {
          bg: 'bg-emerald-50 border-emerald-800 text-emerald-950',
          badge: 'bg-emerald-800 text-white',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />,
        };
      case 'MODERATE RISK':
        return {
          bg: 'bg-amber-50 border-amber-800 text-amber-950',
          badge: 'bg-amber-800 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />,
        };
      case 'ELEVATED RISK':
      case 'HIGH RISK':
      case 'VERY HIGH RISK':
        return {
          bg: 'bg-rose-50 border-rose-800 text-rose-950',
          badge: 'bg-rose-800 text-white',
          icon: <ShieldAlert className="w-5 h-5 text-rose-800 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-neutral-50 border-black text-black',
          badge: 'bg-black text-white',
          icon: <Shield className="w-5 h-5 text-black shrink-0" />,
        };
    }
  };

  const style = getRiskStyles(assessment.riskLevel);

  return (
    <div
      id="ip-risk-summary-widget"
      className={`border-2 p-5 sm:p-6 transition-all ${style.bg} ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/20 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          {style.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider ${style.badge}`}>
                {assessment.riskLevel}
              </span>
              <span className="font-mono text-xs font-bold text-neutral-700">
                Score: {assessment.score}/100
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              Confidence Rating: <strong>{assessment.confidence}</strong> ({assessment.factors.length} factors evaluated)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="w-24 bg-neutral-200 h-3 border border-black overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                (assessment.score || 0) < 30
                  ? 'bg-emerald-600'
                  : (assessment.score || 0) < 60
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, assessment.score || 0))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 block">
          Evaluation Factors:
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-neutral-800">
          {assessment.factors.map((factor, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <span className="text-black font-bold">•</span>
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
