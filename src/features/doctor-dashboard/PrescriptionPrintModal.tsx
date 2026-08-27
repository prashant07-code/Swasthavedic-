import React, { useEffect } from 'react';
import { ConsultationRecord, Patient } from '../../types';
import { Printer, X, ShieldCheck, QrCode, CheckCircle2, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface PrescriptionPrintModalProps {
  consultation: ConsultationRecord;
  patient: Patient;
  onClose: () => void;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  consultation,
  patient,
  onClose,
}) => {
  // Support closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      id="prescription-print-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-[32px] max-w-4xl w-full p-5 sm:p-8 shadow-2xl border-4 border-emerald-100 text-slate-900 relative my-6 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Top Sync Success Banner */}
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 p-3.5 rounded-2xl mb-4 flex items-center justify-between gap-3 text-xs font-bold print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>परामर्श संपन्न (Consultation Finalized):</strong> यह अंतिम पर्ची डॉक्टर सिस्टम में सुरक्षित हो गई है और <strong>मरीज़ के डैशबोर्ड (Patient Portal)</strong> पर भी उपलब्ध करा दी गई है।
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Live Synced
          </span>
        </div>

        {/* Modal Controls Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b-2 border-slate-100 gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-950">
                Official OPD Prescription & Report
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Token ID: {consultation.visitId} • Patient: {patient.name}
              </p>
            </div>
          </div>

          {/* Action Buttons: Close / Cut & Print */}
          <div className="flex items-center gap-2">
            <button
              id="prescription-print-btn"
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border-b-2 border-emerald-800"
            >
              <Printer className="w-4 h-4" />
              <span>पर्ची प्रिंट करें (Print)</span>
            </button>

            <button
              id="prescription-close-btn"
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-900 border-2 border-rose-200 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Close and return to OPD Queue (Esc)"
            >
              <X className="w-4 h-4 text-rose-600" />
              <span>कट करें / बंद करें (Close)</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-white border border-rose-200 px-1.5 py-0.5 rounded text-rose-700 font-mono">
                Esc
              </kbd>
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-4 sm:p-8 bg-white border-2 border-slate-300 rounded-3xl print:border-none print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              GOVERNMENT DISTRICT CIVIL HOSPITAL & AYUSH OPD
            </h2>
            <p className="text-xs text-slate-600 font-semibold">
              Department of Integrated Medicine • National Health Mission
            </p>
            <p className="text-[11px] text-slate-500">
              Vedic & Allopathic Clinical OPD • Registration: AIIMS/GOV/2026/OPD • ABDM Integrated
            </p>
          </div>

          {/* Doctor & Patient Metadata Row */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-3 mb-3">
            <div>
              <span className="font-bold text-[10px] text-slate-500 uppercase block">ATTENDING PHYSICIAN</span>
              <p className="font-black text-sm text-slate-900">{consultation.doctorName}</p>
              <p className="text-slate-600 font-semibold">{consultation.department}</p>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 inline-block">
                ID: {consultation.doctorId}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[10px] text-slate-500 uppercase block">DATE & TIME</span>
              <p className="font-bold text-sm text-slate-900">
                {new Date(consultation.consultationDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-slate-600 font-semibold">Token ID: {consultation.visitId.substring(0, 16)}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="p-3.5 bg-slate-50 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4 border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
              <strong className="text-slate-900 text-sm">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
              <strong className="text-slate-900">{patient.age} Yrs / {patient.gender}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient ID / Code</span>
              <strong className="text-slate-900 font-mono">{patient.patientCode}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Mobile / ABHA</span>
              <strong className="text-slate-900">{patient.mobile || patient.abhaId || 'N/A'}</strong>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              CLINICAL DIAGNOSIS:
            </span>
            <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-sm font-black text-emerald-950 flex items-center justify-between">
              <span>{consultation.finalDiagnosis || consultation.provisionalDiagnosis || 'Clinical Review Completed'}</span>
              {consultation.icdCode && (
                <span className="text-xs bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold">
                  ICD: {consultation.icdCode}
                </span>
              )}
            </div>
          </div>

          {/* Systemic Examination findings if any */}
          {consultation.systemicExamination && (
            <div className="mb-4 text-xs">
              <span className="font-bold text-slate-500 uppercase block mb-1">Clinical Findings & Vitals:</span>
              <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {consultation.systemicExamination}
              </p>
            </div>
          )}

          {/* Rx Medications */}
          <div className="mb-4">
            <span className="text-base font-black text-slate-900 font-serif italic block mb-2">
              ℞ Prescribed Medications:
            </span>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Medicine / Formulation</th>
                    <th className="p-2.5">Dosage & Frequency</th>
                    <th className="p-2.5">Timing</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {consultation.prescriptions.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-black text-slate-900">
                        {p.medicineName}
                        <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          p.system === 'AYUSH' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-sky-100 text-sky-900 border border-sky-300'
                        }`}>
                          {p.system}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800">{p.dosage} • {p.frequency}</td>
                      <td className="p-2.5 text-slate-600 font-semibold">{p.timing.replace('_', ' ')}</td>
                      <td className="p-2.5 font-bold text-slate-900">{p.duration}</td>
                      <td className="p-2.5 text-slate-600 italic">{p.instructions || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investigations */}
          {consultation.investigations && consultation.investigations.length > 0 && (
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Diagnostic Investigations Advised:
              </span>
              <div className="flex flex-wrap gap-2">
                {consultation.investigations.map((inv, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg font-bold text-slate-800">
                    • {inv.testName} ({inv.urgency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AYUSH Pathya / Apathya Regimen */}
          {consultation.ayushAssessment && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3.5 bg-amber-50/60 border-2 border-amber-200 rounded-2xl text-xs">
              <div>
                <strong className="text-emerald-900 block mb-1 font-black">Pathya (Recommended Diet & Daily Regimen):</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                  {consultation.ayushAssessment.pathyaAdvice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-rose-900 block mb-1 font-black">Apathya (Dietary Restrictions & Avoid):</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                  {consultation.ayushAssessment.apathyaAdvice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* General Advice & Follow-Up */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <strong className="text-slate-900 block font-black">General Advice / Instructions:</strong>
              <span className="text-slate-700 font-semibold">{consultation.generalAdvice || 'Maintain regular hydration and follow medication schedule.'}</span>
            </div>
            <div className="text-right">
              <strong className="text-emerald-800 block font-black">Follow-Up Review:</strong>
              <span className="font-black text-slate-900 text-sm">
                After {consultation.followUpDays} Days ({consultation.followUpDate || 'As advised'})
              </span>
            </div>
          </div>

          {/* Signature & QR Footer */}
          <div className="flex items-end justify-between pt-6 border-t-2 border-slate-200 text-xs">
            <div className="flex items-center gap-3">
              <QrCode className="w-12 h-12 text-slate-900" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Digital OPD Verification</p>
                <p className="font-mono text-xs font-bold text-slate-800">ABDM-COMPLIANT-EHR-VALIDATED</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Synced to National Health Exchange</p>
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 border-b-2 border-slate-400 w-52 mb-1" />
              <p className="font-black text-sm text-slate-950">{consultation.doctorName}</p>
              <p className="text-[11px] text-slate-600 font-semibold">{consultation.department}</p>
              <p className="text-[10px] text-slate-400">Authorized Medical Officer / OPD Physician</p>
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions (Print: hidden) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t-2 border-slate-100 print:hidden">
          <button
            id="prescription-bottom-close-btn"
            type="button"
            onClick={onClose}
            className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-2xl flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>पर्ची बंद करें और कतार पर लौटें (Close & Return to Queue)</span>
          </button>

          <button
            id="prescription-bottom-print-btn"
            type="button"
            onClick={handlePrint}
            className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट पर्ची (Print Prescription)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
