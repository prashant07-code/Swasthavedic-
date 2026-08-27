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
  FileText,
} from 'lucide-react';

interface IdentityStepProps {
  onOpenReports?: (tokenOrMobile?: string) => void;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({ onOpenReports }) => {
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
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">{t('existingPatient', language)}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {language === 'hi'
              ? 'पहले से अस्पताल का पर्चा या मोबाइल नंबर दर्ज है।'
              : 'Returning visitor with previous hospital registration.'}
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
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">{t('newPatient', language)}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {language === 'hi'
              ? 'पहली बार ओपीडी में आ रहे हैं, नया पंजीकरण करना है।'
              : 'First-time hospital visitor creating a fresh clinical record.'}
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
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">{t('abhaScan', language)}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {language === 'hi'
              ? 'आयुष्मान भारत स्वास्थ्य खाता (ABHA QR / 14 अंक) से त्वरित लॉगिन।'
              : 'Instant ABDM check-in via 14-digit ABHA ID or QR.'}
          </p>
        </button>
      </div>

      {/* Existing Patient Search Form */}
      {patientType === 'EXISTING' && (
        <div className="bg-white p-8 rounded-[32px] border-4 border-emerald-100 shadow-xl max-w-xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <Search className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-black text-slate-900">
              {language === 'hi' ? 'पुराना रिकॉर्ड खोजें' : 'Locate Existing Patient Profile'}
            </h3>
          </div>

          <div className="space-y-4 mb-6 text-left">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase">
                {language === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'}
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="identity-mobile-input"
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase">
                {language === 'hi' ? 'या अस्पताल कोड (वैकल्पिक)' : 'Or Patient Code (Optional)'}
              </label>
              <input
                id="identity-code-input"
                type="text"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="e.g. SV-2026-1081"
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden uppercase font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-center gap-3 text-xs font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              id="identity-search-btn"
              onClick={handleExistingSearch}
              disabled={isSearching}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-lg shadow-xl flex items-center justify-center gap-2.5 cursor-pointer border-b-4 border-emerald-700 transition-all"
            >
              <Search className="w-5 h-5" />
              <span>{isSearching ? 'खोज रहे हैं...' : language === 'hi' ? 'रिकॉर्ड खोजें' : 'Search Record'}</span>
            </button>

            {onOpenReports && (
              <button
                type="button"
                onClick={() => onOpenReports(mobile)}
                className="w-full py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-sky-200"
              >
                <FileText className="w-4 h-4 text-sky-600" />
                <span>{language === 'hi' ? 'सीधे डॉक्टर पर्ची / रिपोर्ट देखें (View Prescriptions)' : 'Directly View Past Prescriptions'}</span>
              </button>
            )}
          </div>
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
