import React from 'react';
import { TimelineEvent } from '../../types';
import { Calendar, FileText, Activity, Pill, CheckCircle, Clock } from 'lucide-react';

interface MedicalTimelineViewProps {
  timeline: TimelineEvent[];
}

export const MedicalTimelineView: React.FC<MedicalTimelineViewProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
        No previous longitudinal history events recorded for this patient.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-4 text-left" id="doctor-medical-timeline-view">
      <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Calendar className="w-4 h-4 text-emerald-700" />
        <span>Longitudinal Medical Timeline & Historical Encounters</span>
      </h4>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>

            <div className="bg-slate-50 hover:bg-emerald-50/50 transition-colors p-3.5 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm text-slate-900">{event.title}</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {event.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

              {(event.doctorName || event.department) && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-3">
                  {event.doctorName && <span>Doctor: <strong className="text-slate-700">{event.doctorName}</strong></span>}
                  {event.department && <span>Dept: <strong className="text-slate-700">{event.department}</strong></span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
