import React from 'react';
import { TriageAlert } from '../../types';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface TriageAlertBannerProps {
  alerts: TriageAlert[];
}

export const TriageAlertBanner: React.FC<TriageAlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4" id="doctor-triage-alerts-container">
      {alerts.map((alert) => {
        const isHigh = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';
        const isMedium = alert.severity === 'MEDIUM';

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-xs ${
              isHigh
                ? 'bg-red-50/90 border-red-300 text-red-950'
                : isMedium
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-blue-50/90 border-blue-300 text-blue-950'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                isHigh ? 'bg-red-100 text-red-700' : isMedium ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isHigh ? <ShieldAlert className="w-5 h-5" /> : isMedium ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isHigh
                      ? 'bg-red-600 text-white'
                      : isMedium
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.severity} PRIORITY TRIAGE ALERT
                </span>
                <span className="text-xs font-mono text-slate-500">{alert.ruleCode}</span>
              </div>

              <h4 className="font-bold text-sm leading-snug">{alert.message}</h4>

              {alert.triggerFactors && alert.triggerFactors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {alert.triggerFactors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white/80 border border-slate-300 px-2 py-0.5 rounded-md font-medium text-slate-700"
                    >
                      • {factor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
