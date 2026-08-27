import React, { useEffect } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import {
  CheckCircle2,
  Volume2,
  AlertTriangle,
  FileCheck,
  User,
  Activity,
  Pill,
  Send,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const VerificationStep: React.FC = () => {
  const { goToStep, patient, clinicalHistory, scannedDocuments, submitKioskData, isSubmitting } =
    useKiosk();
  const { language, audioSpeed } = useAccessibility();
  const { speak, isSpeaking } = useVoice({ language, speechRate: audioSpeed });

  const complaints = clinicalHistory.chiefComplaints;
  const pastConditions: string[] = [];
  if (clinicalHistory.pastMedicalHistory?.diabetes) pastConditions.push('Diabetes');
  if (clinicalHistory.pastMedicalHistory?.hypertension) pastConditions.push('Hypertension');
  if (clinicalHistory.pastMedicalHistory?.asthma) pastConditions.push('Asthma');
  if (clinicalHistory.pastMedicalHistory?.heartDisease) pastConditions.push('Heart Disease');

  const summarySpeech =
    language === 'hi'
      ? `कृपया पुष्टि करें: आपका नाम ${patient?.name || 'मरीज़'} है। आपकी मुख्य शिकायत ${
          complaints.map((c) => c.symptomHindi).join(', ') || 'सामान्य जांच'
        } है। पर्ची बनाने के लिए हरा बटन दबाएं।`
      : `Please verify your details: Patient ${patient?.name || 'Self'}, chief complaints: ${
          complaints.map((c) => c.symptom).join(', ') || 'General checkup'
        }. Tap the green button to submit.`;

  useEffect(() => {
    speak(summarySpeech);
  }, [language, speak]);

  const handleFinalSubmit = async () => {
    const success = await submitKioskData();
    if (success) {
      speak(
        language === 'hi'
          ? 'आपकी जानकारी सफलतापूर्वक डॉक्टर साहब के कक्ष में भेज दी गई है। आपका टोकन तैयार है।'
          : 'Your details have been submitted to the OPD Doctor. Your token slip is ready.'
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10" id="kiosk-verification-step">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <FileCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('summaryVerificationTitle', language)}
        </h2>
        <p className="text-base text-slate-600 font-medium">
          {t('summaryVerificationSubtitle', language)}
        </p>
      </div>

      {/* Audio Playback of Summary */}
      <div className="flex justify-center mb-8">
        <button
          id="verify-listen-summary-btn"
          onClick={() => speak(summarySpeech)}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-sky-100/90 hover:bg-sky-200 text-sky-950 text-sm font-black border-2 border-sky-200 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Volume2 className={`w-5 h-5 text-sky-600 ${isSpeaking ? 'animate-bounce text-emerald-600' : ''}`} />
          <span>{language === 'hi' ? 'यह सारांश आवाज में सुनें' : 'Listen to Spoken Summary'}</span>
        </button>
      </div>

      {/* Verification Card */}
      <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left space-y-4">
        {/* Patient Profile info */}
        <div className="p-4 bg-sky-50/60 border-2 border-sky-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center shadow-xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-lg text-sky-950">{patient?.name || 'Anonymous Patient'}</h4>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {patient?.age} वर्ष • {patient?.gender} • {patient?.mobile || 'No Mobile'}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-black bg-white text-sky-900 border-2 border-sky-200 px-3 py-1.5 rounded-xl shadow-2xs">
            {patient?.patientCode || 'SV-2026-NEW'}
          </span>
        </div>

        {/* Chief Complaints */}
        <div className="p-4 bg-sky-50/40 border-2 border-sky-100 rounded-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-sky-950 block mb-2">
            {language === 'hi' ? 'आज की मुख्य शिकायतें (Chief Complaints):' : 'Today\'s Complaints:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {complaints.map((c) => (
              <span
                key={c.id}
                className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 shadow-2xs"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                {language === 'hi' ? c.symptomHindi : c.symptom} ({c.duration} {c.durationUnit})
              </span>
            ))}
          </div>
        </div>

        {/* Chronic Conditions & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-sky-50/40 border-2 border-sky-100 rounded-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-950 block mb-1.5">
              {language === 'hi' ? 'पुरानी बीमारियां:' : 'Chronic Illnesses:'}
            </span>
            <p className="text-xs font-bold text-slate-800">
              {pastConditions.length > 0 ? pastConditions.join(', ') : 'None documented'}
            </p>
          </div>

          <div className="p-4 bg-rose-50/40 border-2 border-rose-100 rounded-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-rose-950 block mb-1.5">
              {language === 'hi' ? 'दवा एलर्जी:' : 'Known Allergies:'}
            </span>
            <p className="text-xs font-bold text-rose-700">
              {clinicalHistory.allergyHistory.allergies.length > 0
                ? clinicalHistory.allergyHistory.allergies.join(', ')
                : 'None (NKDA)'}
            </p>
          </div>
        </div>

        {/* Scanned Documents Count */}
        {scannedDocuments.length > 0 && (
          <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl text-xs text-emerald-950 font-bold flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {scannedDocuments.length} पुराना पर्चा/लैब रिपोर्ट डिजिटल ओसीआर द्वारा संलग्न किया गया है।
            </span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          id="verify-back-btn"
          onClick={() => goToStep('DOCUMENT_SCAN')}
          disabled={isSubmitting}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="verify-final-confirm-btn"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-3 active:scale-98 disabled:opacity-50 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{language === 'hi' ? 'पर्ची बनाई जा रही है...' : 'Submitting to Doctor...'}</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{t('submitAndGetSlip', language)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
