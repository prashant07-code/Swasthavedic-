import React from 'react';
import { ConsultationRecord, Patient } from '../../types';
import { Printer, X, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';

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
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" id="prescription-print-modal-overlay">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 relative my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg text-slate-900">
              Consultation Finalized — Official OPD Prescription
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="prescription-print-btn"
              onClick={handlePrint}
              className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Prescription (Ctrl+P)</span>
            </button>
            <button
              id="prescription-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-4 sm:p-6 bg-white border-2 border-slate-300 rounded-2xl print:border-none print:p-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              GOVERNMENT DISTRICT CIVIL HOSPITAL & AYUSH OPD
            </h2>
            <p className="text-xs text-slate-600 font-semibold">
              Department of Integrated Medicine • National Health Mission
            </p>
            <p className="text-[11px] text-slate-500">
              Vedic & Allopathic Clinical OPD • Registration: AIIMS/GOV/2026/OPD
            </p>
          </div>

          {/* Doctor & Patient Metadata Row */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-3 mb-3">
            <div>
              <span className="font-bold text-[10px] text-slate-500 uppercase block">ATTENDING PHYSICIAN</span>
              <p className="font-black text-sm text-slate-900">{consultation.doctorName}</p>
              <p className="text-slate-600">{consultation.department}</p>
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
              <p className="text-slate-600">Token ID: {consultation.visitId.substring(0, 12)}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4 border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
              <strong className="text-slate-900 text-sm">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
              <strong className="text-slate-900">{patient.age} Yrs / {patient.gender}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient ID</span>
              <strong className="text-slate-900 font-mono">{patient.patientCode}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Mobile</span>
              <strong className="text-slate-900">{patient.mobile || 'N/A'}</strong>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              CLINICAL DIAGNOSIS:
            </span>
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-950">
              {consultation.finalDiagnosis || consultation.provisionalDiagnosis || 'Clinical Review Completed'}
            </div>
          </div>

          {/* Rx Medications */}
          <div className="mb-4">
            <span className="text-base font-black text-slate-900 font-serif italic block mb-2">
              ℞ Prescribed Medications:
            </span>
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Medicine / Formulation</th>
                  <th className="p-2">Dosage & Frequency</th>
                  <th className="p-2">Timing</th>
                  <th className="p-2">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {consultation.prescriptions.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td className="p-2 font-bold">{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-900">{p.medicineName} ({p.system})</td>
                    <td className="p-2">{p.dosage} • {p.frequency}</td>
                    <td className="p-2 text-slate-600">{p.timing.replace('_', ' ')}</td>
                    <td className="p-2 font-semibold text-slate-800">{p.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Investigations */}
          {consultation.investigations && consultation.investigations.length > 0 && (
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Diagnostic Investigations Advised:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {consultation.investigations.map((inv, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md font-semibold text-slate-800">
                    • {inv.testName} ({inv.urgency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AYUSH Pathya / Apathya Regimen */}
          {consultation.ayushAssessment && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs">
              <div>
                <strong className="text-emerald-900 block mb-1">Pathya (Recommended Diet & Regimen):</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {consultation.ayushAssessment.pathyaAdvice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-red-900 block mb-1">Apathya (Dietary Restrictions & Avoid):</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {consultation.ayushAssessment.apathyaAdvice.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* General Advice & Follow-Up */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="text-slate-900 block">General Advice / Instructions:</strong>
              <span className="text-slate-600">{consultation.generalAdvice || 'Maintain hydration and follow medication schedule.'}</span>
            </div>
            <div className="text-right">
              <strong className="text-emerald-800 block">Follow-Up Review:</strong>
              <span className="font-bold text-slate-900">
                After {consultation.followUpDays} Days ({consultation.followUpDate || 'As advised'})
              </span>
            </div>
          </div>

          {/* Signature & QR Footer */}
          <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-slate-800" />
              <div>
                <p className="text-[10px] text-slate-500">Digital OPD Verification</p>
                <p className="font-mono text-[11px] font-bold text-slate-700">ABDM-COMPLIANT-EHR</p>
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-48 mb-1" />
              <p className="font-bold text-slate-900">{consultation.doctorName}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Officer / OPD Physician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
