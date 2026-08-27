import React from 'react';
import { Leaf, Users, Stethoscope, BellRing, Sparkles } from 'lucide-react';

export type AppView = 'KIOSK' | 'DOCTOR' | 'STAFF';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="bg-white border-b-4 border-sky-100 text-slate-900 shadow-sm sticky top-0 z-40" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Leaf className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-sky-900 tracking-tight">
                SWASTHAVEDIC <span className="text-emerald-500">AI</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full tracking-wider uppercase border border-emerald-300">
                AI OPD
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-none mt-0.5">
              आयुष एवं आधुनिक ओपीडी मंच • Integrative Health Platform
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
          <button
            id="nav-tab-kiosk"
            onClick={() => setCurrentView('KIOSK')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              currentView === 'KIOSK'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>मरीज़ कियोस्क (Kiosk)</span>
          </button>

          <button
            id="nav-tab-doctor"
            onClick={() => setCurrentView('DOCTOR')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              currentView === 'DOCTOR'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>डॉक्टर कक्ष (Doctor OPD)</span>
          </button>

          <button
            id="nav-tab-staff"
            onClick={() => setCurrentView('STAFF')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              currentView === 'STAFF'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>सहायक डेस्क (Staff)</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
