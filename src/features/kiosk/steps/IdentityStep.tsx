import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { apiService } from '../../../services/api';
import { t } from '../../../constants/languages';
import { Patient } from '../../../types';
import {
  UserCheck,
  UserPlus,
  CreditCard,
  Phone,
  Search,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const IdentityStep: React.FC = () => {
  const { goToStep, setPatient, setSession, updateClinicalHistory } = useKiosk();
  const { language, mode, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  const [patientType, setPatientType] = useState<'EXISTING' | 'NEW' | 'ABHA'>('EXISTING');
  const [mobile, setMobile] = useState('9876543210'); // Pre-fill with Smt. Shanti Devi demo
  const [patientCode, setPatientCode] = useState('');
  const [otp, setOtp] = useState('1234');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExistingSearch = async () => {
    setError(null);
    setIsSearching(true);

    try {
      const res = await apiService.searchPatient({
        mobile: mobile.trim(),
        patientCode: patientCode.trim(),
      });

      if (res.found && res.patient) {
        setPatient(res.patient);

        // Preload past history if exists for reuse
        if (res.pastHistory) {
          updateClinicalHistory(() => ({
            ...res.pastHistory,
            previousHistoryReused: true,
          }));
        }

        // Create temporary session
        const sessionRes = await apiService.createSession({
          patientId: res.patient.id,
          language,
          accessibilityMode: mode,
          isAttendantPresent: mode === 'ASSISTED',
        });

        if (sessionRes.success) {
          setSession(sessionRes.session);
          speak(
            language === 'hi'
              ? `नमस्ते ${res.patient.name} जी! आपकी पुरानी पर्ची मिल गई है। आगे बढ़ते हैं।`
              : `Welcome back ${res.patient.name}! Your previous records have been located.`
          );
          goToStep('CONSENT');
        }
      } else {
        setError(
          language === 'hi'
            ? 'इस नंबर पर कोई पुराना रिकॉर्ड नहीं मिला। आप "नया मरीज़" विकल्प चुन सकते हैं।'
            : 'No existing patient found with this number. Please choose "New Patient".'
        );
      }
    } catch (err) {
      setError('Connection error. Please try again or tap Need Help.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewPatientChoice = () => {
    goToStep('CONSENT');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10" id="kiosk-identity-step">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-3">
          {t('patientTypeQuestion', language)}
        </h2>
        <p className="text-base text-slate-600 font-medium max-w-xl mx-auto">
          {language === 'hi'
            ? 'कृपया बताएं कि आप पहले अस्पताल आ चुके हैं या पहली बार आए हैं:'
            : 'Please indicate if you are a returning or first-time patient:'}
        </p>
      </div>

      {/* Choice Big Vibrant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <button
          id="identity-existing-btn"
          onClick={() => setPatientType('EXISTING')}
          className={`p-6 rounded-[32px] border-4 text-left transition-all cursor-pointer ${
            patientType === 'EXISTING'
              ? 'bg-emerald-50 border-emerald-500 shadow-xl ring-4 ring-emerald-300/40'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
            <UserCheck className="w-8 h-8" />
          </div>
          <h4 className="font-black text-xl text-sky-950 mb-1">
            {language === 'hi' ? 'पुराना मरीज़' : 'Returning Patient'}
          </h4>
          <p className="text-xs text-slate-600 font-semibold">
            {language === 'hi' ? 'पहले आ चुका हूँ (मोबाइल नंबर द्वारा)' : 'Previously registered with mobile number'}
          </p>
        </button>

        <button
          id="identity-new-btn"
          onClick={() => setPatientType('NEW')}
          className={`p-6 rounded-[32px] border-4 text-left transition-all cursor-pointer ${
            patientType === 'NEW'
              ? 'bg-sky-50 border-sky-500 shadow-xl ring-4 ring-sky-300/40'
              : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-lg'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4 shadow-xs">
            <UserPlus className="w-8 h-8" />
          </div>
          <h4 className="font-black text-xl text-sky-950 mb-1">
            {language === 'hi' ? 'नया पंजीकरण' : 'New Registration'}
          </h4>
          <p className="text-xs text-slate-600 font-semibold">
            {language === 'hi' ? 'पहली बार अस्पताल आया हूँ' : 'First-time hospital visit check-in'}
          </p>
        </button>

        <button
          id="identity-abha-btn"
          onClick={() => setPatientType('ABHA')}
          className={`p-6 rounded-[32px] border-4 text-left transition-all cursor-pointer ${
            patientType === 'ABHA'
              ? 'bg-amber-50 border-amber-500 shadow-xl ring-4 ring-amber-300/40'
              : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-lg'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-xs">
            <CreditCard className="w-8 h-8" />
          </div>
          <h4 className="font-black text-xl text-sky-950 mb-1">
            {language === 'hi' ? 'आयुष्मान (ABHA)' : 'ABHA / ABDM ID'}
          </h4>
          <p className="text-xs text-slate-600 font-semibold">
            {language === 'hi' ? '14 अंकों का आभा नंबर' : 'National Digital Health ID ready'}
          </p>
        </button>
      </div>

      {/* Existing Patient Search Form */}
      {patientType === 'EXISTING' && (
        <div className="bg-white p-8 rounded-[32px] border-4 border-emerald-100 shadow-xl max-w-xl mx-auto mb-8">
          <div className="mb-5">
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2">
              {t('mobileLabel', language)}
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                id="existing-mobile-input"
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-3.5 text-lg font-black bg-sky-50/50 border-2 border-slate-200 rounded-2xl tracking-wider text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-hidden"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              (सुझाव: परीक्षण के लिए <span className="font-black text-emerald-700">9876543210</span> श्रीमती शांति देवी दर्ज है)
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2">
              {t('otpLabel', language)}
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              <input
                id="existing-otp-input"
                type="password"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full pl-12 pr-4 py-3.5 text-lg font-black bg-sky-50/50 border-2 border-slate-200 rounded-2xl tracking-widest text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-hidden"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              (सुरक्षा के लिए डेमो पिन: 1234)
            </p>
          </div>

          {error && (
            <div className="p-4 mb-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            id="identity-verify-btn"
            onClick={handleExistingSearch}
            disabled={isSearching || mobile.length < 10}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
          >
            <Search className="w-5 h-5" />
            <span>{isSearching ? 'पहचान सत्यापित हो रही है...' : 'रिकॉर्ड खोजें व जारी रखें'}</span>
          </button>
        </div>
      )}

      {/* New Patient Flow */}
      {patientType === 'NEW' && (
        <div className="bg-white p-8 rounded-[32px] border-4 border-sky-100 shadow-xl text-center max-w-xl mx-auto mb-8">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UserPlus className="w-8 h-8 text-sky-600" />
          </div>
          <h3 className="text-2xl font-black text-sky-950 mb-2">
            {language === 'hi' ? 'नए मरीज़ का स्वागत है' : 'Welcome New Patient'}
          </h3>
          <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
            {language === 'hi'
              ? 'हम आपका एक नया स्वस्थवैदिक पेशेंट कोड (जैसे SV-2026-XXXX) बनाएंगे जो भविष्य की सभी यात्राओं में काम आएगा।'
              : 'A secure SwasthaVedic patient record ID will be generated for your current and all future hospital visits.'}
          </p>
          <button
            id="new-patient-continue-btn"
            onClick={handleNewPatientChoice}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-lg shadow-xl flex items-center justify-center gap-2.5 cursor-pointer border-b-4 border-sky-800 transition-all"
          >
            <span>{language === 'hi' ? 'सहमति दें व आगे बढ़ें' : 'Proceed to Consent & Profile'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ABHA Integration Flow */}
      {patientType === 'ABHA' && (
        <div className="bg-white p-8 rounded-[32px] border-4 border-amber-100 shadow-xl max-w-xl mx-auto mb-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CreditCard className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black text-sky-950 mb-2">
            {language === 'hi' ? 'आयुष्मान भारत स्वास्थ्य खाता (ABHA)' : 'ABDM / ABHA Integration Ready'}
          </h3>
          <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
            {language === 'hi'
              ? 'हमारा सिस्टम राष्ट्रीय डिजिटल स्वास्थ्य मिशन (ABDM M1/M2/M3) के मानकों के अनुरूप तैयार है।'
              : 'SwasthaVedic AI architecture maintains dedicated schema compliance for official ABDM sandbox and production gateways.'}
          </p>
          <div className="text-left bg-sky-50/50 p-4 rounded-2xl border-2 border-slate-200 mb-5">
            <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase">14-Digit ABHA ID / Number</label>
            <input
              type="text"
              placeholder="91-4589-2041-8930"
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-900"
            />
          </div>
          <button
            onClick={handleNewPatientChoice}
            className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-lg shadow-xl cursor-pointer border-b-4 border-amber-700 transition-all"
          >
            {language === 'hi' ? 'आभा विवरण के साथ जारी रखें' : 'Continue with ABHA Profile'}
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-start max-w-xl mx-auto">
        <button
          id="identity-back-btn"
          onClick={() => goToStep('LANGUAGE')}
          className="py-3 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>
      </div>
    </div>
  );
};
