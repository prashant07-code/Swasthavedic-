import React from 'react';
import { Leaf, Users, Stethoscope, BellRing } from 'lucide-react';
import { AppView } from '../types';

export type { AppView };

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

interface NavTabItem {
  id: AppView;
  labelHindi: string;
  labelEnglish: string;
  icon: React.ElementType;
  elementId: string;
}

const NAV_ITEMS: NavTabItem[] = [
  {
    id: 'KIOSK',
    labelHindi: 'मरीज़ कियोस्क',
    labelEnglish: 'Kiosk',
    icon: Users,
    elementId: 'nav-tab-kiosk',
  },
  {
    id: 'DOCTOR',
    labelHindi: 'डॉक्टर कक्ष',
    labelEnglish: 'Doctor OPD',
    icon: Stethoscope,
    elementId: 'nav-tab-doctor',
  },
  {
    id: 'STAFF',
    labelHindi: 'सहायक डेस्क',
    labelEnglish: 'Staff',
    icon: BellRing,
    elementId: 'nav-tab-staff',
  },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-white border-b-4 border-sky-100 text-slate-900 shadow-sm sticky top-0 z-40 w-full" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Emblem */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white shadow-md border border-sky-400/30">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight">
                SWASTHAVEDIC <span className="text-emerald-500">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full tracking-wider uppercase border border-emerald-300">
                AI OPD
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none mt-0.5">
              आयुष एवं आधुनिक ओपीडी मंच • Integrative Health Platform
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav
          role="tablist"
          aria-label="Workspace views"
          className="flex items-center gap-1 sm:gap-1.5 bg-sky-50 p-1.5 rounded-2xl border-2 border-sky-100 shrink-0"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={item.elementId}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentView(item.id)}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-600/20'
                    : 'text-slate-600 hover:text-sky-950 hover:bg-sky-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                <span className="hidden md:inline">{item.labelHindi} ({item.labelEnglish})</span>
                <span className="inline md:hidden">{item.labelEnglish}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
