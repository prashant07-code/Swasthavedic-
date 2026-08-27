import React, { useEffect } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { SUPPORTED_LANGUAGES, t } from '../../../constants/languages';
import { LanguageCode } from '../../../types';
import { Globe, Check, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';

export const LanguageStep: React.FC = () => {
  const { goToStep } = useKiosk();
  const { language, setLanguage, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  useEffect(() => {
    speak(t('languageVoicePrompt', language));
  }, [language, speak]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    if (code === 'hi') {
      speak('आपने हिन्दी भाषा चुनी है। आगे बढ़ने के लिए हरा बटन दबाएं।');
    } else {
      speak('You have selected English. Tap the green button to continue.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 text-center" id="kiosk-language-step">
      <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[28px] flex items-center justify-center mx-auto mb-5 shadow-md border-4 border-sky-200">
        <Globe className="w-10 h-10 text-sky-600" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
        {t('chooseLanguage', language)}
      </h2>
      <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto font-medium">
        Please select the language you are most comfortable with.
      </p>

      {/* Language Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto mb-10 text-left">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-card-${lang.code}`}
              disabled={!lang.isAvailable}
              onClick={() => handleSelect(lang.code)}
              className={`p-6 rounded-[28px] border-4 transition-all relative cursor-pointer ${
                !lang.isAvailable
                  ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                  : isSelected
                  ? 'bg-sky-50 border-sky-500 shadow-xl ring-4 ring-sky-300/40'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-sky-950">{lang.nativeLabel}</h3>
                  <p className="text-sm font-bold text-sky-600 mb-1">{lang.label}</p>
                  <p className="text-xs text-slate-500 font-medium">{lang.description}</p>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-xl mx-auto pt-6 border-t-2 border-sky-100">
        <button
          id="lang-back-btn"
          onClick={() => goToStep('WELCOME')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="lang-next-btn"
          onClick={() => goToStep('IDENTITY')}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 active:scale-98 cursor-pointer border-b-4 border-emerald-700"
        >
          <span>{t('next', language)}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
