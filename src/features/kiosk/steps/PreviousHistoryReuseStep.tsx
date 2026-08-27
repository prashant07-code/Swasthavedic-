import React from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import { History, CheckCircle, RefreshCw, AlertTriangle, ArrowRight, ArrowLeft, Pill, Activity, FileText } from 'lucide-react';

interface PreviousHistoryReuseStepProps {
  onOpenReports?: (tokenOrMobile?: string) => void;
}

export const PreviousHistoryReuseStep: React.FC<PreviousHistoryReuseStepProps> = ({ onOpenReports }) => {
  const { goToStep, clinicalHistory, updateClinicalHistory, patient } = useKiosk();
  const { language, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  const pastConditions: string[] = [];
  if (clinicalHistory.pastMedicalHistory?.diabetes) pastConditions.push(language === 'hi' ? 'मधुमेह (Diabetes)' : 'Diabetes');
  if (clinicalHistory.pastMedicalHistory?.hypertension) pastConditions.push(language === 'hi' ? 'उच्च रक्तचाप (Hypertension)' : 'Hypertension');
  if (clinicalHistory.pastMedicalHistory?.asthma) pastConditions.push(language === 'hi' ? 'दमा (Asthma)' : 'Asthma');
  if (clinicalHistory.pastMedicalHistory?.otherConditions) {
    pastConditions.push(...clinicalHistory.pastMedicalHistory.otherConditions);
  }

  const allergies = clinicalHistory.allergyHistory?.allergies || [];
  const medications = clinicalHistory.currentMedications || [];

  const handleNoChange = () => {
    updateClinicalHistory((prev) => ({
      ...prev,
      previousHistoryReused: true,
    }));
    speak(
      language === 'hi'
        ? 'धन्यवाद। आपका पुराना इतिहास सुरक्षित रखा गया है। अब कृपया आज की मुख्य परेशानी बताएं।'
        : 'Thank you. Your chronic history has been preserved. Now please state today’s chief complaint.'
    );
    goToStep('CHIEF_COMPLAINT');
  };

  const handleUpdate = () => {
    updateClinicalHistory((prev) => ({
      ...prev,
      previousHistoryReused: false,
    }));
    goToStep('CLINICAL_HISTORY');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10" id="kiosk-previous-history-step">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[28px] flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-sky-200">
          <History className="w-10 h-10 text-sky-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('historyReuseTitle', language)}
        </h2>
        <p className="text-base text-slate-600 font-medium">
          {patient?.name
            ? `${patient.name} जी, आपका पिछला मेडिकल रिकॉर्ड मिल गया है।`
            : t('historyReuseQuestion', language)}
        </p>
      </div>

      {/* Snapshot of recorded previous history */}
      <div className="bg-white p-7 rounded-[32px] border-4 border-emerald-100 shadow-xl mb-8 text-left">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            {language === 'hi' ? 'अस्पताल रिकॉर्ड में दर्ज पुरानी बीमारियां व दवाएं:' : 'Pre-Existing Conditions in Records:'}
          </h4>

          {onOpenReports && (
            <button
              type="button"
              onClick={() => onOpenReports(patient?.mobile || patient?.patientCode)}
              className="text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पिछली पर्ची देखें' : 'View Past Prescriptions'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-sky-50/60 rounded-2xl border-2 border-sky-100">
            <span className="text-xs font-black text-slate-500 uppercase block mb-1">
              {language === 'hi' ? 'पुरानी बीमारियां' : 'Chronic Conditions'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pastConditions.length > 0 ? (
                pastConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-100 text-emerald-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                  >
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-medium">कोई पुरानी बीमारी दर्ज नहीं</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-sky-50/60 rounded-2xl border-2 border-sky-100">
            <span className="text-xs font-black text-slate-500 uppercase block mb-1">
              {language === 'hi' ? 'एलर्जी (Allergies)' : 'Allergies'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allergies.length > 0 ? (
                allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="bg-rose-100 text-rose-950 font-bold px-2.5 py-1 rounded-lg text-xs"
                  >
                    {all}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-medium">कोई एलर्जी नहीं (NKDA)</span>
              )}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 p-4 bg-sky-50/60 rounded-2xl border-2 border-sky-100">
            <span className="text-xs font-black text-slate-500 uppercase block mb-1.5">
              {language === 'hi' ? 'पहले से चल रही दवाएं' : 'Ongoing Prescriptions'}
            </span>
            <div className="flex flex-wrap gap-2">
              {medications.length > 0 ? (
                medications.map((med, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-sky-200 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Pill className="w-3.5 h-3.5 text-sky-600" />
                    {med.name} ({med.frequency || 'Regular'})
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 font-medium">कोई नियमित दवा दर्ज नहीं</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Question Box */}
      <div className="bg-white p-8 rounded-[32px] border-4 border-sky-100 shadow-xl text-center mb-8">
        <h3 className="text-2xl font-black text-sky-950 mb-2">
          {t('historyReuseQuestion', language)}
        </h3>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto font-medium">
          {language === 'hi'
            ? 'यदि आपकी पुरानी दवाएं या बीमारियां वैसी ही हैं, तो "कोई बदलाव नहीं" दबाएं।'
            : 'If your existing illnesses and medications remain unchanged, choose "No Change".'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            id="reuse-no-change-btn"
            onClick={handleNoChange}
            className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t('noChange', language)}</span>
          </button>

          <button
            id="reuse-update-btn"
            onClick={handleUpdate}
            className="py-4 px-6 rounded-2xl bg-sky-50 border-2 border-sky-300 hover:bg-sky-100 text-sky-900 font-black text-base shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer transition-all"
          >
            <RefreshCw className="w-5 h-5 text-sky-700" />
            <span>{t('updateHistory', language)}</span>
          </button>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-start">
        <button
          id="reuse-back-btn"
          onClick={() => goToStep('CONSENT')}
          className="py-3 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>
      </div>
    </div>
  );
};
