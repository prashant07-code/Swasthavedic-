import React, { useEffect } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import { Play, Volume2, ShieldCheck, FileText, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

interface WelcomeStepProps {
  onOpenReports?: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onOpenReports }) => {
  const { goToStep } = useKiosk();
  const { language, mode, setMode, audioSpeed } = useAccessibility();
  const { speak, isSpeaking } = useVoice({ language, speechRate: audioSpeed });

  useEffect(() => {
    // Gentle auto voice prompt on landing if voice-first or elderly mode is preferred
    const timer = setTimeout(() => {
      speak(t('welcomeVoicePrompt', language));
    }, 600);
    return () => clearTimeout(timer);
  }, [language, speak]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-center" id="kiosk-welcome-step">
      {/* Top hospital & Vedic health emblem */}
      <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-sky-200">
        <Sparkles className="w-12 h-12 text-sky-600 animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs md:text-sm font-black uppercase tracking-wider mb-6 shadow-2xs border-2 border-emerald-300">
        <Sparkles className="w-4 h-4 text-emerald-700" />
        <span>आयुष एवं आधुनिक ओपीडी सेवा • Smart AI OPD Kiosk</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-950 tracking-tight mb-4">
        {t('welcomeTitle', language)}
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-slate-700 max-w-2xl mx-auto mb-8 font-semibold leading-relaxed">
        {t('welcomeSubtitle', language)}
      </p>

      {/* Audio readout button */}
      <div className="flex justify-center mb-8">
        <button
          id="welcome-listen-btn"
          onClick={() => speak(t('welcomeVoicePrompt', language))}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 text-sm font-bold border-2 border-sky-200 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-sky-600' : 'text-sky-600'}`} />
          <span>{language === 'hi' ? 'आवाज में निर्देश सुनें' : 'Listen to Audio Guidance'}</span>
        </button>
      </div>

      {/* Primary & Secondary Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-10">
        {/* Main Start Check-In Button */}
        <button
          id="welcome-start-btn"
          onClick={() => goToStep('LANGUAGE')}
          className="w-full py-5 px-8 rounded-3xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white text-lg sm:text-xl font-black shadow-xl flex items-center justify-center gap-3 border-b-4 border-emerald-700 transition-all cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>{t('startKiosk', language)}</span>
        </button>

        {/* View Doctor Prescriptions / Reports Button */}
        {onOpenReports && (
          <button
            id="welcome-view-reports-btn"
            onClick={onOpenReports}
            className="w-full py-5 px-6 rounded-3xl bg-white hover:bg-sky-50 active:scale-98 text-sky-950 text-base sm:text-lg font-black shadow-lg border-2 border-sky-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <FileText className="w-5 h-5 text-sky-600" />
            <span>{language === 'hi' ? 'मेरी डॉक्टर रिपोर्ट / पर्ची देखें' : 'View My Finalized Report'}</span>
          </button>
        )}
      </div>

      {/* Feature Highlights for Patient Comfort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
        <div className="p-5 rounded-[24px] bg-white border-2 border-sky-100 shadow-md flex items-start gap-3.5">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl shrink-0">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-sky-950 mb-0.5">
              {language === 'hi' ? 'आवाज-प्रधान व सरल' : 'Voice-First & Simple'}
            </h4>
            <p className="text-xs text-slate-600 leading-normal font-medium">
              {language === 'hi'
                ? 'टाइप करने की जरूरत नहीं, बस अपनी भाषा में बोलें।'
                : 'Speak in your mother tongue without typing.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-white border-2 border-sky-100 shadow-md flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-sky-950 mb-0.5">
              {language === 'hi' ? 'वरिष्ठ नागरिक सुलभ' : 'Elderly & Attendant Mode'}
            </h4>
            <p className="text-xs text-slate-600 leading-normal font-medium">
              {language === 'hi'
                ? 'बड़े अक्षर, उच्च कंट्रास्ट और सहायक की मदद का विकल्प।'
                : 'Large touch buttons, slower voice and family assistance.'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-white border-2 border-sky-100 shadow-md flex items-start gap-3.5">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-sm text-sky-950 mb-0.5">
              {language === 'hi' ? 'सुरक्षित व गोपनीय' : 'Private & Secure'}
            </h4>
            <p className="text-xs text-slate-600 leading-normal font-medium">
              {language === 'hi'
                ? 'आपकी जानकारी सीधे डॉक्टर साहब के कमरे में पहुंचेगी।'
                : 'Data sent securely only to attending OPD physician.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
