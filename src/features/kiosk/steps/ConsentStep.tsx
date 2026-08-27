import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import { ShieldCheck, Volume2, Users, Check, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

export const ConsentStep: React.FC = () => {
  const { goToStep, patient } = useKiosk();
  const { language, mode, setMode, audioSpeed, isAttendantAssisting, setIsAttendantAssisting } =
    useAccessibility();
  const { speak, isSpeaking } = useVoice({ language, speechRate: audioSpeed });

  const [attendantName, setAttendantName] = useState('');
  const [attendantRelation, setAttendantRelation] = useState('Son / Daughter');

  const handleAgree = () => {
    if (isAttendantAssisting) {
      setMode('ASSISTED');
    }
    // If existing patient already loaded, skip to Chief Complaint or Previous History
    if (patient) {
      goToStep('PREVIOUS_HISTORY');
    } else {
      goToStep('PROFILE');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-10" id="kiosk-consent-step">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[28px] flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-sky-200">
          <ShieldCheck className="w-10 h-10 text-sky-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('consentTitle', language)}
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          {language === 'hi'
            ? 'आपकी जानकारी की सुरक्षा और गोपनीयता हमारी प्राथमिकता है'
            : 'Patient Data Privacy, Consent, and Attendant Support'}
        </p>
      </div>

      {/* Consent Box */}
      <div className="bg-white p-7 rounded-[32px] border-4 border-emerald-100 shadow-xl mb-6 text-left">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'गोपनीयता एवं सहमति पत्र' : 'Privacy & Clinical Data Consent'}</span>
          </div>
          <button
            id="consent-audio-readout-btn"
            onClick={() => speak(t('consentText', language))}
            className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 hover:bg-sky-100 text-xs font-bold flex items-center gap-1.5 border border-sky-200 cursor-pointer shadow-2xs"
          >
            <Volume2 className={`w-4 h-4 text-sky-600 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>{language === 'hi' ? 'सुनें' : 'Read Aloud'}</span>
          </button>
        </div>

        <p className="text-slate-800 text-base font-semibold leading-relaxed mb-5">
          {t('consentText', language)}
        </p>

        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 border-t-2 border-slate-100 pt-4 font-medium">
          <li>
            {language === 'hi'
              ? 'आपकी जानकारी केवल संबंधित ओपीडी डॉक्टर और स्वास्थ्य कर्मियों को दिखाई देगी।'
              : 'Your health history is strictly restricted to attending clinical staff.'}
          </li>
          <li>
            {language === 'hi'
              ? 'एआई (AI) केवल रिकॉर्ड बनाने में मदद करेगा, अंतिम उपचार डॉक्टर तय करेंगे।'
              : 'AI is purely for clinical documentation support; the doctor makes all medical decisions.'}
          </li>
        </ul>
      </div>

      {/* Attendant Assistance Toggle */}
      <div className="bg-white p-6 rounded-[28px] border-2 border-sky-200 shadow-md mb-8 text-left">
        <label className="flex items-start gap-3.5 cursor-pointer">
          <input
            id="attendant-checkbox"
            type="checkbox"
            checked={isAttendantAssisting}
            onChange={(e) => setIsAttendantAssisting(e.target.checked)}
            className="w-6 h-6 rounded-lg text-emerald-600 mt-0.5 accent-emerald-600 cursor-pointer"
          />
          <div>
            <span className="font-black text-base text-sky-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              {t('attendantAssisted', language)}
            </span>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {language === 'hi'
                ? 'यदि आप बुजुर्ग हैं या किसी परिजन/सहायक की मदद से कियोस्क भर रहे हैं, तो इसे चुनें।'
                : 'Enable this if a family member or attendant is assisting with the screen.'}
            </p>
          </div>
        </label>

        {isAttendantAssisting && (
          <div className="mt-5 pt-5 border-t-2 border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-sky-950 mb-1.5">
                {language === 'hi' ? 'सहायक का नाम' : 'Attendant Name'}
              </label>
              <input
                type="text"
                value={attendantName}
                onChange={(e) => setAttendantName(e.target.value)}
                placeholder="उदा. राहुल कुमार (बेटा)"
                className="w-full p-3 text-sm font-bold bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-sky-950 mb-1.5">
                {language === 'hi' ? 'मरीज़ से संबंध' : 'Relationship with Patient'}
              </label>
              <select
                value={attendantRelation}
                onChange={(e) => setAttendantRelation(e.target.value)}
                className="w-full p-3 text-sm font-bold bg-sky-50/50 border-2 border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
              >
                <option value="Son / Daughter">बेटा / बेटी (Son / Daughter)</option>
                <option value="Spouse">पति / पत्नी (Spouse)</option>
                <option value="Parent">माता / पिता (Parent)</option>
                <option value="Hospital Volunteer">अस्पताल सहायक (Volunteer)</option>
                <option value="Other">अन्य (Other)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          id="consent-back-btn"
          onClick={() => goToStep('IDENTITY')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="consent-agree-btn"
          onClick={handleAgree}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          <Check className="w-5 h-5" />
          <span>{t('consentAgree', language)}</span>
        </button>
      </div>
    </div>
  );
};
