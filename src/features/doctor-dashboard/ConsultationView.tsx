import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { PatientOverviewCard } from './PatientOverviewCard';
import { TriageAlertBanner } from './TriageAlertBanner';
import { ClinicalHistoryView } from './ClinicalHistoryView';
import { AyushConsultationModule } from './AyushConsultationModule';
import { PrescriptionEditor } from './PrescriptionEditor';
import { InvestigationOrders } from './InvestigationOrders';
import { MedicalTimelineView } from './MedicalTimelineView';
import { DocumentViewer } from './DocumentViewer';
import { PrescriptionPrintModal } from './PrescriptionPrintModal';
import {
  FileText,
  Activity,
  Leaf,
  Pill,
  Clock,
  Save,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';

export const ConsultationView: React.FC = () => {
  const {
    activePatientBundle,
    closePatientConsultation,
    provisionalDiagnosis,
    setProvisionalDiagnosis,
    finalDiagnosis,
    setFinalDiagnosis,
    systemicExamination,
    setSystemicExamination,
    generalAdvice,
    setGeneralAdvice,
    followUpDays,
    setFollowUpDays,
    isEmergencyReferral,
    setIsEmergencyReferral,
    saveConsultation,
    isSaving,
    finalizedRecordToPrint,
    setFinalizedRecordToPrint,
  } = useDoctor();

  const [activeTab, setActiveTab] = useState<'HISTORY' | 'AYUSH' | 'RX' | 'DOCS_TIMELINE'>('HISTORY');

  if (!activePatientBundle || !activePatientBundle.patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active patient consultation selected. Please select a patient from the queue.
      </div>
    );
  }

  const { patient, queueItem, clinicalHistory, triageAlerts, documents, timeline } = activePatientBundle;

  const handleSaveDraft = async () => {
    await saveConsultation('DRAFT');
  };

  const handleFinalize = async () => {
    await saveConsultation('FINALIZED');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-left" id="doctor-consultation-view">
      {/* Top Bar with Back to Queue button */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="consultation-back-queue-btn"
          onClick={closePatientConsultation}
          className="py-3 px-6 rounded-2xl border-2 border-sky-200 bg-white hover:bg-sky-50 text-sky-950 font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>Back to Live OPD Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <span className="text-xs font-black bg-amber-100 text-amber-950 border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider">
            In Active Consultation
          </span>
        </div>
      </div>

      {/* Patient Demographic Card */}
      <PatientOverviewCard patient={patient} tokenNumber={queueItem?.tokenNumber || '#OPD-101'} />

      {/* Red-Flag Triage Banner */}
      <TriageAlertBanner alerts={triageAlerts} />

      {/* Consultation Tab Navigators */}
      <div className="flex flex-wrap gap-2 border-b-2 border-sky-200 mb-8">
        <button
          id="tab-btn-history"
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3.5 px-5 text-xs font-black transition-all border-b-4 flex items-center gap-2 cursor-pointer ${
            activeTab === 'HISTORY'
              ? 'border-sky-600 text-sky-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-sky-600" />
          <span>1. History & AI Synthesis</span>
        </button>

        <button
          id="tab-btn-ayush"
          onClick={() => setActiveTab('AYUSH')}
          className={`pb-3.5 px-5 text-xs font-black transition-all border-b-4 flex items-center gap-2 cursor-pointer ${
            activeTab === 'AYUSH'
              ? 'border-emerald-500 text-emerald-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>2. Integrative AYUSH Module</span>
        </button>

        <button
          id="tab-btn-rx"
          onClick={() => setActiveTab('RX')}
          className={`pb-3.5 px-5 text-xs font-black transition-all border-b-4 flex items-center gap-2 cursor-pointer ${
            activeTab === 'RX'
              ? 'border-sky-600 text-sky-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4 text-sky-600" />
          <span>3. Prescriptions & Lab Orders</span>
        </button>

        <button
          id="tab-btn-docs"
          onClick={() => setActiveTab('DOCS_TIMELINE')}
          className={`pb-3.5 px-5 text-xs font-black transition-all border-b-4 flex items-center gap-2 cursor-pointer ${
            activeTab === 'DOCS_TIMELINE'
              ? 'border-sky-600 text-sky-950'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-600" />
          <span>4. Timeline & Scanned Documents ({documents.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mb-8">
        {activeTab === 'HISTORY' && (
          <ClinicalHistoryView history={clinicalHistory} documents={documents} />
        )}

        {activeTab === 'AYUSH' && <AyushConsultationModule />}

        {activeTab === 'RX' && (
          <div>
            <PrescriptionEditor />
            <InvestigationOrders />
          </div>
        )}

        {activeTab === 'DOCS_TIMELINE' && (
          <div>
            <DocumentViewer documents={documents} />
            <MedicalTimelineView timeline={timeline} />
          </div>
        )}
      </div>

      {/* Doctor Assessment, Diagnosis & Finalization Tray */}
      <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl text-left mb-12">
        <h4 className="font-black text-lg text-sky-950 mb-5 flex items-center gap-2.5 border-b-2 border-sky-100 pb-4">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <span>Doctor Diagnostic Findings & Finalization</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
              Provisional Clinical Diagnosis
            </label>
            <input
              type="text"
              value={provisionalDiagnosis}
              onChange={(e) => setProvisionalDiagnosis(e.target.value)}
              placeholder="e.g., Acute Febrile Illness / Sandhivata (Osteoarthritis)"
              className="w-full p-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
              Final Diagnosis / ICD-10 Code
            </label>
            <input
              type="text"
              value={finalDiagnosis}
              onChange={(e) => setFinalDiagnosis(e.target.value)}
              placeholder="e.g., Bilateral Knee Osteoarthritis (M17.0)"
              className="w-full p-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
            />
          </div>
        </div>

        {/* Systemic Examination Notes */}
        <div className="mb-4">
          <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
            Systemic Physical Examination Findings (CVS, RS, P/A, CNS)
          </label>
          <input
            type="text"
            value={systemicExamination}
            onChange={(e) => setSystemicExamination(e.target.value)}
            placeholder="Chest: Bilateral clear, CVS: S1 S2 heard, P/A: Soft"
            className="w-full p-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
              General Clinical Advice / Dietary Instructions
            </label>
            <input
              type="text"
              value={generalAdvice}
              onChange={(e) => setGeneralAdvice(e.target.value)}
              placeholder="e.g., Avoid strenuous bending, continue regular walking"
              className="w-full p-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-1.5">
              Follow-Up Review (Days)
            </label>
            <select
              value={followUpDays}
              onChange={(e) => setFollowUpDays(Number(e.target.value))}
              className="w-full p-3 bg-sky-50/60 border-2 border-sky-100 rounded-2xl text-xs font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-hidden"
            >
              <option value={3}>After 3 Days (Urgent Review)</option>
              <option value={7}>After 7 Days (Standard 1 Week)</option>
              <option value={15}>After 15 Days</option>
              <option value={30}>After 1 Month (Chronic Follow-Up)</option>
              <option value={0}>SOS / As needed only</option>
            </select>
          </div>
        </div>

        {/* Emergency Referral Checkbox */}
        <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200 mb-6 flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isEmergencyReferral}
              onChange={(e) => setIsEmergencyReferral(e.target.checked)}
              className="w-5 h-5 text-rose-600 rounded-md"
            />
            <span className="text-xs font-black text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Flag as Emergency / Tertiary Hospital Referral (आपातकालीन रेफरल)
            </span>
          </label>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t-2 border-sky-100">
          <button
            id="consultation-save-draft-btn"
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="py-3 px-6 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-950 font-black text-xs rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4 text-sky-600" />
            <span>{isSaving ? 'Saving...' : 'Save Draft Record'}</span>
          </button>

          <button
            id="consultation-finalize-btn"
            type="button"
            onClick={handleFinalize}
            disabled={isSaving}
            className="py-4 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2.5 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isSaving ? 'Finalizing...' : 'Finalize & Generate Official Prescription'}</span>
          </button>
        </div>
      </div>

      {/* Official Prescription Print Modal */}
      {finalizedRecordToPrint && (
        <PrescriptionPrintModal
          consultation={finalizedRecordToPrint}
          patient={patient}
          onClose={() => {
            setFinalizedRecordToPrint(null);
            closePatientConsultation();
          }}
        />
      )}
    </div>
  );
};
