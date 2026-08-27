import React from 'react';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { AccessibilityMode, LanguageCode } from '../../../types';
import { SUPPORTED_LANGUAGES } from '../../../constants/languages';
import { Volume2, Eye, Users, Mic, Sliders, Globe } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const {
    mode,
    setMode,
    language,
    setLanguage,
    highContrast,
    setHighContrast,
    fontSizeMultiplier,
    audioSpeed,
    setAudioSpeed,
  } = useAccessibility();

  const modes: Array<{ id: AccessibilityMode; label: string; icon: any }> = [
    { id: 'NORMAL', label: 'सामान्य (Normal)', icon: Sliders },
    { id: 'VOICE_FIRST', label: 'आवाज-प्रधान (Voice-First)', icon: Mic },
    { id: 'ELDERLY', label: 'वरिष्ठ नागरिक (Elderly Mode)', icon: Eye },
    { id: 'LOW_LITERACY', label: 'चित्रमय / सरल (Visual Mode)', icon: Volume2 },
    { id: 'ASSISTED', label: 'सहायक मोड (Attendant)', icon: Users },
  ];

  return (
    <header className="bg-white border-b-2 border-sky-100 shadow-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30" id="kiosk-accessibility-bar">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-600" />
          सुगमता (Accessibility):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                id={`mode-btn-${m.id.toLowerCase()}`}
                onClick={() => setMode(m.id)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <select
            id="accessibility-language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-xs font-bold text-sky-900 outline-hidden cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} disabled={!lang.isAvailable}>
                {lang.nativeLabel} ({lang.label}) {!lang.isAvailable ? '- जल्द ही' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* High contrast quick toggle */}
        <button
          id="contrast-toggle-btn"
          onClick={() => setHighContrast(!highContrast)}
          className={`text-xs px-3 py-1 rounded-full border-2 font-bold flex items-center gap-1 cursor-pointer transition-all ${
            highContrast
              ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="उच्च कंट्रास्ट (High Contrast Mode for low vision)"
        >
          <Eye className="w-3.5 h-3.5" />
          {highContrast ? 'हाई कंट्रास्ट ON' : 'कंट्रास्ट'}
        </button>

        {/* Slower Audio badge if active */}
        {audioSpeed < 0.9 && (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            धीमी आवाज ({audioSpeed}x)
          </span>
        )}
      </div>
    </header>
  );
};
