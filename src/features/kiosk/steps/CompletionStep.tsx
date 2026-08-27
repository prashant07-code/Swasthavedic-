import React, { useEffect, useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import {
  CheckCircle,
  QrCode,
  Printer,
  RotateCcw,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
  Volume2,
} from 'lucide-react';

export const CompletionStep: React.FC = () => {
  const { session, patient, triageAlerts, resetKioskSession } = useKiosk();
  const { language, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  const [countdown, setCountdown] = useState(60);

  const hasHighTriage = triageAlerts.some((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL');

  useEffect(() => {
    const msg =
      language === 'hi'
        ? `बधाई हो! आपकी पर्ची संख्या ${session?.tokenNumber || '#OPD-101'} है। कृपया ओपीडी कक्ष संख्या 04 के बाहर प्रतीक्षा करें।`
        : `Your OPD token is ${session?.tokenNumber || '#OPD-101'}. Please proceed to Room 04.`;
    speak(msg);
  }, [language, session, speak]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetKioskSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resetKioskSession]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-10 text-center" id="kiosk-completion-step">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-emerald-300">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-1">
        {t('completionTitle', language)}
      </h2>
      <p className="text-base text-slate-600 mb-8 font-medium">
        {t('completionSubtitle', language)}
      </p>

      {/* Red-Flag Triage Priority Banner if triggered */}
      {hasHighTriage && (
        <div className="p-5 mb-8 rounded-3xl bg-rose-50 border-4 border-rose-300 text-left flex items-start gap-3.5 shadow-md">
          <AlertTriangle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-base text-rose-950">
              {language === 'hi' ? 'प्राथमिकता ओपीडी अलर्ट (Priority Triage)' : 'Priority Triage Alert'}
            </h4>
            <p className="text-xs text-rose-800 mt-1 font-medium">
              {language === 'hi'
                ? 'आपके लक्षणों के आधार पर आपको कतार में प्राथमिकता दी गई है। कृपया तुरंत रूम 04 के नर्सिंग स्टाफ को सूचित करें।'
                : 'Based on reported symptoms, your token has been flagged for priority physician evaluation.'}
            </p>
          </div>
        </div>
      )}

      {/* Printable OPD Physical Token Slip */}
      <div
        id="printable-opd-slip"
        className="bg-white p-7 sm:p-9 rounded-[32px] border-4 border-sky-200 shadow-2xl text-left relative overflow-hidden mb-8"
      >
        {/* Slip Watermark / Header */}
        <div className="border-b-2 border-dashed border-sky-200 pb-4 mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-sky-950 tracking-tight">
              SWASTHAVEDIC AI OPD SLIP
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              District Civil Hospital & Integrative AYUSH Center
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">DATE & TIME</span>
            <span className="text-xs font-bold text-slate-700">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} •{' '}
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Large Token Badge */}
        <div className="bg-sky-600 text-white p-6 rounded-3xl text-center mb-6 shadow-xl border-b-4 border-sky-800">
          <span className="text-xs font-black uppercase tracking-widest text-sky-200 block mb-1">
            {language === 'hi' ? 'आपका ओपीडी टोकन नंबर' : 'YOUR OPD TOKEN NUMBER'}
          </span>
          <div className="text-5xl sm:text-6xl font-black tracking-tight my-2">
            {session?.tokenNumber || '#OPD-102'}
          </div>
          <span className="inline-block text-xs bg-sky-900/40 border border-sky-400/30 px-4 py-1 rounded-full font-black mt-1">
            {hasHighTriage ? '🔴 EMERGENCY / PRIORITY QUEUE' : '🟢 REGULAR OPD QUEUE'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              PATIENT NAME & CODE
            </span>
            <p className="font-black text-base text-slate-900">{patient?.name || 'Self Check-in'}</p>
            <p className="text-xs text-slate-500 font-mono font-bold mt-0.5">{patient?.patientCode || 'SV-2026-9041'}</p>
          </div>

          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              OPD ROOM & DOCTOR
            </span>
            <p className="font-black text-base text-slate-900 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-sky-600" />
              Room 04 (General)
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Dr. Rajesh Sharma, MD</p>
          </div>

          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              ESTIMATED WAIT TIME
            </span>
            <p className="font-black text-base text-emerald-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~ 10 - 15 Mins
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">2 Patients ahead of you</p>
          </div>

          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                DIGITAL ABHA / QR
              </span>
              <p className="text-xs text-slate-600 font-bold">Scan at Desk</p>
            </div>
            <QrCode className="w-9 h-9 text-slate-800" />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 text-center">
          <p className="text-xs text-slate-500 font-medium">
            {language === 'hi'
              ? 'कृपया अपना नंबर पुकारे जाने पर डॉक्टर कक्ष में प्रवेश करें।'
              : 'Please take a seat in the OPD waiting lobby until your token is called.'}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <button
          id="completion-print-btn"
          onClick={handlePrint}
          className="py-4 px-8 rounded-2xl bg-sky-950 hover:bg-slate-900 text-white text-base font-black shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-98"
        >
          <Printer className="w-5 h-5" />
          <span>{language === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
        </button>

        <button
          id="completion-next-patient-btn"
          onClick={resetKioskSession}
          className="py-4 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-base font-black shadow-xl flex items-center gap-2.5 cursor-pointer border-b-4 border-emerald-700 active:scale-98 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{language === 'hi' ? 'अगला मरीज़ (Next Patient)' : 'Next Patient Check-in'}</span>
        </button>
      </div>

      {/* Session auto-reset countdown */}
      <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
        <RotateCcw className="w-3.5 h-3.5" />
        <span>
          {language === 'hi'
            ? `डेटा सुरक्षा के लिए स्क्रीन ${countdown} सेकंड में रीसेट हो जाएगी`
            : `Screen will securely reset for the next patient in ${countdown}s`}
        </span>
      </p>
    </div>
  );
};
