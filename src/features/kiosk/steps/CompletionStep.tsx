import React, { useEffect, useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { apiService } from '../../../services/api';
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
  FileText,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface CompletionStepProps {
  onOpenReports?: (tokenOrMobile?: string) => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ onOpenReports }) => {
  const { session, patient, triageAlerts, resetKioskSession } = useKiosk();
  const { language, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  const [countdown, setCountdown] = useState(120);
  const [isConsultationFinalized, setIsConsultationFinalized] = useState(false);
  const [finalizedDoctorName, setFinalizedDoctorName] = useState<string>('');

  const hasHighTriage = triageAlerts.some((a) => a.severity === 'HIGH' || a.severity === 'CRITICAL');

  useEffect(() => {
    const msg =
      language === 'hi'
        ? `बधाई हो! आपकी पर्ची संख्या ${session?.tokenNumber || '#OPD-101'} है। कृपया ओपीडी कक्ष संख्या 04 के बाहर प्रतीक्षा करें।`
        : `Your OPD token is ${session?.tokenNumber || '#OPD-101'}. Please proceed to Room 04.`;
    speak(msg);
  }, [language, session, speak]);

  // Poll backend every 3 seconds to see if doctor has finalized this patient's consultation
  useEffect(() => {
    if (!session?.visitId) return;

    const checkStatus = async () => {
      try {
        const res = await apiService.getConsultationByVisit(session.visitId);
        if (res.found && res.consultation && res.consultation.status === 'FINALIZED') {
          setIsConsultationFinalized(true);
          setFinalizedDoctorName(res.consultation.doctorName);
        }
      } catch (e) {
        // Ignore polling errors silently
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [session?.visitId]);

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
      <p className="text-base text-slate-600 mb-6 font-medium">
        {t('completionSubtitle', language)}
      </p>

      {/* Live Synced Banner if Doctor Finalized Consultation */}
      {isConsultationFinalized && (
        <div className="p-5 mb-6 rounded-3xl bg-emerald-500 text-white shadow-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 border-2 border-emerald-400">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-emerald-700 rounded-2xl shrink-0 font-black shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-lg">
                {language === 'hi' ? '🎉 डॉक्टर रिपोर्ट तैयार है!' : '🎉 Doctor Report Finalized!'}
              </h4>
              <p className="text-xs text-emerald-100 font-semibold">
                {finalizedDoctorName || 'Dr. Rajesh Sharma'} {language === 'hi' ? 'ने आपकी पर्ची फाइनल कर दी है।' : 'has finalized your prescription.'}
              </p>
            </div>
          </div>

          {onOpenReports && (
            <button
              id="view-finalized-report-now-btn"
              onClick={() => onOpenReports(session?.tokenNumber)}
              className="py-3 px-5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'फाइनल पर्ची देखें (View Report)' : 'View Prescription Report'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>
          )}
        </div>
      )}

      {/* Red-Flag Triage Priority Banner if triggered */}
      {hasHighTriage && !isConsultationFinalized && (
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
            <span className="text-[10px] font-black tracking-wider uppercase text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">
              OFFICIAL OPD VISITOR PASS
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Civil District Hospital & AYUSH Kendra
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-400">
              {new Date().toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        {/* Big OPD Token Number Display */}
        <div className="text-center py-4 bg-sky-50 rounded-2xl border-2 border-sky-200 mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-sky-700">
            {language === 'hi' ? 'आपकी टोकन संख्या' : 'YOUR TOKEN NUMBER'}
          </span>
          <div
            className="text-5xl sm:text-6xl font-black text-sky-950 font-mono tracking-tight my-1"
            id="slip-token-number"
          >
            {session?.tokenNumber || '#OPD-101'}
          </div>
          <span className="text-xs text-slate-500 font-bold">
            Patient Code: <strong className="text-slate-700">{patient?.patientCode || 'SV-2026-1081'}</strong>
          </span>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6">
          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              PATIENT NAME
            </span>
            <p className="font-black text-sm text-slate-900">{patient?.name || 'Registered Patient'}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {patient?.age} Yrs • {patient?.gender} • {patient?.mobile || 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              ASSIGNED ROOM & DOCTOR
            </span>
            <p className="font-black text-sm text-slate-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              Room 04 (General OPD)
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Dr. Rajesh Sharma, MD</p>
          </div>

          <div className="p-4 bg-sky-50/60 border-2 border-sky-100 rounded-2xl">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              ESTIMATED WAIT TIME
            </span>
            <p className="font-black text-base text-emerald-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~ 10 - 15 Mins
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">In Queue for Consultation</p>
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
              ? 'डॉक्टर से परामर्श के बाद आप इसी कियोस्क पर "मेरी डॉक्टर रिपोर्ट" से अपनी पर्ची देख व प्रिंट कर सकेंगे।'
              : 'After consulting the physician, your finalized prescription will be accessible here in "My OPD Reports".'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <button
          id="completion-print-btn"
          onClick={handlePrint}
          className="py-4 px-8 rounded-2xl bg-sky-950 hover:bg-slate-900 text-white text-base font-black shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-98"
        >
          <Printer className="w-5 h-5" />
          <span>{language === 'hi' ? 'टोकन पर्ची प्रिंट करें' : 'Print Token Slip'}</span>
        </button>

        {onOpenReports && (
          <button
            id="completion-view-report-btn"
            onClick={() => onOpenReports(session?.tokenNumber)}
            className="py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-black shadow-xl flex items-center gap-2.5 cursor-pointer border-b-4 border-emerald-800 active:scale-98 transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>{language === 'hi' ? 'डॉक्टर रिपोर्ट / पर्ची देखें' : 'View Doctor Report'}</span>
          </button>
        )}

        <button
          id="completion-next-patient-btn"
          onClick={resetKioskSession}
          className="py-4 px-8 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-base font-black shadow-md flex items-center gap-2.5 cursor-pointer active:scale-98 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{language === 'hi' ? 'अगला मरीज़ (Next Patient)' : 'Next Patient'}</span>
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
