import React from 'react';
import { MedicalDocument } from '../../types';
import { FileText, CheckCircle, AlertTriangle, Sparkles, Eye, Download } from 'lucide-react';

interface DocumentViewerProps {
  documents: MedicalDocument[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
        No digitized old prescription slips or lab reports uploaded for this visit.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-4 text-left" id="doctor-document-viewer">
      <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>Patient-Uploaded Historical Prescriptions & Lab Documents (OCR Processed)</span>
        </span>
        <span className="text-xs text-slate-500 font-medium">{documents.length} File(s)</span>
      </h4>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 rounded-xl border border-emerald-200/80 bg-slate-50/50">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h5 className="font-bold text-sm text-slate-900">{doc.title}</h5>
                <p className="text-[11px] text-slate-500">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} • OCR Engine: {doc.ocrProvider}
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                {(doc.ocrConfidence * 100).toFixed(0)}% Confidence Score
              </span>
            </div>

            {/* Extracted Entities */}
            <div className="mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Extracted Clinical Entities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doc.entities.map((ent) => (
                  <div
                    key={ent.id}
                    className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-[10px] text-slate-500 uppercase block">
                        {ent.fieldName}
                      </span>
                      <span className="font-semibold text-slate-800">{ent.value}</span>
                    </div>
                    {ent.needsVerification ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shrink-0">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Verify
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shrink-0">
                        <CheckCircle className="w-2.5 h-2.5" />
                        Valid
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* OCR Raw Text Transcript accordion */}
            <details className="mt-2 text-xs">
              <summary className="text-emerald-800 font-semibold cursor-pointer hover:underline">
                View Raw OCR Transcript Text
              </summary>
              <pre className="mt-2 p-3 bg-slate-100 rounded-lg text-slate-700 font-mono text-[11px] whitespace-pre-line border border-slate-200">
                {doc.extractedText}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};
