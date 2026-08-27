import React, { useState } from 'react';
import { ClinicalHistoryData, MedicalDocument } from '../../types';
import {
  Activity,
  Sparkles,
  AlertCircle,
  Pill,
  Leaf,
  Clock,
  Edit3,
  Check,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ClinicalHistoryViewProps {
  history: ClinicalHistoryData;
  documents?: MedicalDocument[];
  initialAiSummary?: string;
}

export const ClinicalHistoryView: React.FC<ClinicalHistoryViewProps> = ({
  history,
  documents = [],
  initialAiSummary,
}) => {
  const [isEditingAiSummary, setIsEditingAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(
    initialAiSummary ||
      `[AI-ASSISTED CLINICAL SUMMARY — DOCTOR REVIEW REQUIRED]
• Chief Complaints: ${history.chiefComplaints.map((c) => `${c.symptom} (${c.duration} ${c.durationUnit}, severity: ${c.severity})`).join(', ') || 'Routine Consultation'}
• Past Medical History: ${Object.entries(history.pastMedicalHistory || {})
        .filter(([k, v]) => v === true)
        .map(([k]) => k.toUpperCase())
        .join(', ') || 'No chronic conditions reported'}
• Known Allergies: ${history.allergyHistory?.allergies?.join(', ') || 'NKDA (No Known Drug Allergies)'}
• Active Medications: ${history.currentMedications?.map((m) => m.name).join(', ') || 'None reported'}
• AYUSH Constitution: Prakriti - ${history.ayushHistory?.prakritiSelfReported || 'Not assessed'}, Agni - ${history.ayushHistory?.agniType || 'Balanced'}

CLINICAL SAFETY NOTES:
1. Verify symptom duration and red flags directly during physical examination.
2. Cross-verify potential drug-drug or drug-herb interactions with active medications.
3. Attending doctor holds sole clinical authority for diagnostic decisions and final prescriptions.`
  );

  return (
    <div className="space-y-4" id="doctor-clinical-history-view">
      {/* AI-Assisted Clinical Summary Box with Strict Safety Badge */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-300 shadow-xs relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-sm text-emerald-950">
              AI-Generated Clinical Summary & Pre-Consultation Synthesis
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
              AI ASSISTED • DOCTOR VERIFICATION REQUIRED
            </span>
          </div>

          <button
            onClick={() => setIsEditingAiSummary(!isEditingAiSummary)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs"
          >
            {isEditingAiSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingAiSummary ? 'Done Editing' : 'Edit Summary'}</span>
          </button>
        </div>

        {isEditingAiSummary ? (
          <textarea
            rows={6}
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            className="w-full p-3 text-xs md:text-sm bg-white border border-emerald-300 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        ) : (
          <div className="text-xs md:text-sm text-slate-800 font-sans whitespace-pre-line bg-white/70 p-3.5 rounded-xl border border-emerald-200/60 leading-relaxed">
            {aiSummary}
          </div>
        )}
      </div>

      {/* Chief Complaints Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-700" />
          Patient-Reported Chief Complaints (Voice & Touch Captured)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.chiefComplaints.map((c) => (
            <div
              key={c.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">{c.symptom}</span>
                <span className="text-xs text-slate-500">{c.symptomHindi}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-emerald-700" />
                  {c.duration} {c.durationUnit}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.severity === 'severe'
                      ? 'bg-red-100 text-red-800'
                      : c.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {c.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comorbidities, Allergies, and Active Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chronic Conditions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
            Chronic Comorbidities
          </h5>
          <ul className="text-xs space-y-1.5">
            <li className="flex items-center justify-between">
              <span className="text-slate-700">Diabetes Mellitus</span>
              <span className={`font-bold ${history.pastMedicalHistory?.diabetes ? 'text-red-600' : 'text-slate-400'}`}>
                {history.pastMedicalHistory?.diabetes ? 'YES' : 'NO'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700">Hypertension (BP)</span>
              <span className={`font-bold ${history.pastMedicalHistory?.hypertension ? 'text-red-600' : 'text-slate-400'}`}>
                {history.pastMedicalHistory?.hypertension ? 'YES' : 'NO'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700">Asthma / Respiratory</span>
              <span className={`font-bold ${history.pastMedicalHistory?.asthma ? 'text-red-600' : 'text-slate-400'}`}>
                {history.pastMedicalHistory?.asthma ? 'YES' : 'NO'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700">Heart Disease</span>
              <span className={`font-bold ${history.pastMedicalHistory?.heartDisease ? 'text-red-600' : 'text-slate-400'}`}>
                {history.pastMedicalHistory?.heartDisease ? 'YES' : 'NO'}
              </span>
            </li>
          </ul>
        </div>

        {/* Drug Allergies */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Drug & Substance Allergies
          </h5>
          {history.allergyHistory?.allergies && history.allergyHistory.allergies.length > 0 ? (
            <div className="space-y-1.5">
              {history.allergyHistory.allergies.map((alg, idx) => (
                <div key={idx} className="p-2 bg-red-50 text-red-800 font-bold text-xs rounded-lg border border-red-200">
                  ⚠️ {alg}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">No known drug allergies reported (NKDA)</p>
          )}
        </div>

        {/* Active Medications & OCR Meds */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <Pill className="w-3.5 h-3.5 text-emerald-700" />
            Current Active Medications
          </h5>
          {history.currentMedications && history.currentMedications.length > 0 ? (
            <div className="space-y-1.5">
              {history.currentMedications.map((med, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">{med.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {med.dosage || 'Standard'} • {med.isAyurvedic ? 'AYUSH Formulation' : 'Allopathic'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">No active medications reported</p>
          )}
        </div>
      </div>
    </div>
  );
};
