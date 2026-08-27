import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityMode, LanguageCode } from '../types';

interface AccessibilityContextType {
  mode: AccessibilityMode;
  setMode: (mode: AccessibilityMode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  fontSizeMultiplier: number;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  isAttendantAssisting: boolean;
  setIsAttendantAssisting: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AccessibilityMode>('NORMAL');
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [audioSpeed, setAudioSpeed] = useState(0.9);
  const [isAttendantAssisting, setIsAttendantAssisting] = useState(false);

  const setMode = (newMode: AccessibilityMode) => {
    setModeState(newMode);
    switch (newMode) {
      case 'ELDERLY':
        setFontSizeMultiplier(1.25);
        setHighContrast(true);
        setAudioSpeed(0.75);
        break;
      case 'LOW_LITERACY':
        setFontSizeMultiplier(1.15);
        setHighContrast(false);
        setAudioSpeed(0.85);
        break;
      case 'VOICE_FIRST':
        setFontSizeMultiplier(1.05);
        setHighContrast(false);
        setAudioSpeed(0.9);
        break;
      case 'ASSISTED':
        setIsAttendantAssisting(true);
        setFontSizeMultiplier(1.0);
        break;
      case 'NORMAL':
      default:
        setFontSizeMultiplier(1.0);
        setHighContrast(false);
        setAudioSpeed(0.9);
        break;
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        mode,
        setMode,
        language,
        setLanguage,
        fontSizeMultiplier,
        highContrast,
        setHighContrast,
        audioSpeed,
        setAudioSpeed,
        isAttendantAssisting,
        setIsAttendantAssisting,
      }}
    >
      <div
        className={`min-h-screen transition-colors duration-200 ${
          highContrast ? 'bg-slate-950 text-amber-50 contrast-125' : 'bg-slate-50 text-slate-900'
        }`}
        style={{ fontSize: `${fontSizeMultiplier * 100}%` }}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};
