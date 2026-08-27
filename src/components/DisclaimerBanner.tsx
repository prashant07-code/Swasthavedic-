import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-3 px-4 text-center text-xs border-t border-slate-800" id="safety-disclaimer-banner">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>चिकित्सकीय सुरक्षा अस्वीकरण (Clinical Safety & AI Boundary):</span>
        </div>
        <p className="text-[11px] text-slate-400">
          SwasthaVedic AI is a clinical documentation & decision-support assistant for OPDs. It is <strong className="text-white">NOT an autonomous doctor</strong>. All final diagnoses, prescriptions, and medical decisions are solely made and authorized by the licensed attending physician.
        </p>
      </div>
    </footer>
  );
};
