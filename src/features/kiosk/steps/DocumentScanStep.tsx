import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { apiService } from '../../../services/api';
import { t } from '../../../constants/languages';
import { MedicalDocument } from '../../../types';
import {
  Camera,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';

export const DocumentScanStep: React.FC = () => {
  const { goToStep, addScannedDocument, scannedDocuments, patient, session } = useKiosk();
  const { language } = useAccessibility();

  const [isScanning, setIsScanning] = useState(false);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<MedicalDocument | null>(null);

  const handleSimulateScan = async (presetType: 'LAB' | 'AYURVEDIC' | 'GENERAL') => {
    setIsScanning(true);
    try {
      const fileNameMap = {
        LAB: 'District_Hospital_Lab_Report_Sugar_HbA1c.jpg',
        AYURVEDIC: 'Ayush_Dispensary_Sandhivata_Prescription.jpg',
        GENERAL: 'Govt_Civil_Hospital_OPD_Slip.jpg',
      };

      const fileName = fileNameMap[presetType];
      const res = await apiService.uploadDocumentOCR({
        fileName,
        fileData: 'data:image/jpeg;base64,mock',
        mimeType: 'image/jpeg',
        patientId: patient?.id,
        visitId: session?.visitId,
      });

      if (res.success && res.document) {
        addScannedDocument(res.document);
        setLastUploadedDoc(res.document);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const res = await apiService.uploadDocumentOCR({
        fileName: file.name,
        fileData: 'data:image/jpeg;base64,mock',
        mimeType: file.type || 'image/jpeg',
        patientId: patient?.id,
        visitId: session?.visitId,
      });

      if (res.success && res.document) {
        addScannedDocument(res.document);
        setLastUploadedDoc(res.document);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10" id="kiosk-document-scan-step">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('documentScanTitle', language)}
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
          {t('documentScanSubtitle', language)}
        </p>
      </div>

      {/* Main Upload / Camera Area */}
      <div className="bg-white p-8 rounded-[32px] border-4 border-dashed border-sky-300 shadow-xl mb-8 text-center">
        <div className="w-20 h-20 bg-sky-100 text-sky-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Camera className="w-10 h-10" />
        </div>

        <h4 className="font-black text-xl text-sky-950 mb-1">
          {language === 'hi' ? 'कैमरा से फोटो खींचें या फाइल चुनें' : 'Capture Photo or Choose File'}
        </h4>
        <p className="text-sm text-slate-500 mb-6 font-medium">
          {language === 'hi'
            ? 'पर्चे को सीधा रखें ताकि नाम, दवा और तारीख साफ पढ़ी जा सके।'
            : 'Hold the slip steady so doctor names, medicines, and dates are clear.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <label className="py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-base shadow-xl flex items-center gap-2.5 cursor-pointer transition-all active:scale-98 border-b-4 border-sky-800">
            <Camera className="w-5 h-5" />
            <span>{language === 'hi' ? 'फोटो खींचें (Camera)' : 'Take Photo'}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <label className="py-4 px-8 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 font-black text-base border-2 border-sky-200 flex items-center gap-2.5 cursor-pointer transition-all shadow-xs">
            <Upload className="w-5 h-5 text-sky-700" />
            <span>{language === 'hi' ? 'गैलरी से फाइल अपलोड' : 'Upload File'}</span>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Simulator Presets for fast testing without camera */}
        <div className="pt-6 border-t-2 border-sky-100 text-left">
          <span className="text-xs font-black uppercase tracking-wider text-sky-950 block mb-3">
            ⚡ त्वरित ओसीआर परीक्षण (One-Click OCR Sample Presets):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              id="ocr-preset-lab"
              onClick={() => handleSimulateScan('LAB')}
              disabled={isScanning}
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-xs font-bold text-emerald-950 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>ब्लड शुगर लैब रिपोर्ट</span>
            </button>
            <button
              type="button"
              id="ocr-preset-ayush"
              onClick={() => handleSimulateScan('AYURVEDIC')}
              disabled={isScanning}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-amber-700" />
              <span>आयुष संधिवात पर्ची</span>
            </button>
            <button
              type="button"
              id="ocr-preset-opd"
              onClick={() => handleSimulateScan('GENERAL')}
              disabled={isScanning}
              className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-xs font-bold text-sky-950 flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-sky-700" />
              <span>सरकारी अस्पताल ओपीडी</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isScanning && (
        <div className="p-8 rounded-[32px] bg-sky-50 border-4 border-sky-200 text-center mb-8 flex flex-col items-center shadow-lg animate-pulse">
          <RefreshCw className="w-10 h-10 text-sky-600 animate-spin mb-3" />
          <h4 className="font-black text-lg text-sky-950">
            {language === 'hi'
              ? 'दस्तावेज़ की हस्तलिपि व दवाओं का विश्लेषण हो रहा है...'
              : 'OCR Engine Extracting Clinical Entities & Doses...'}
          </h4>
          <p className="text-xs text-sky-700 font-bold mt-1">
            PaddleOCR / Tesseract Clinical Pipeline Running...
          </p>
        </div>
      )}

      {/* Extracted Structured Entities Preview */}
      {lastUploadedDoc && (
        <div className="bg-white p-7 rounded-[32px] border-4 border-emerald-100 shadow-xl mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-base text-sky-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>
                {language === 'hi' ? 'ओसीआर द्वारा पहचानी गई जानकारी:' : 'OCR Extracted Clinical Entities:'}
              </span>
            </h4>
            <span className="text-xs bg-emerald-100 text-emerald-900 font-black px-3 py-1 rounded-full border border-emerald-300">
              {(lastUploadedDoc.ocrConfidence * 100).toFixed(0)}% Confidence
            </span>
          </div>

          <div className="space-y-2.5 mb-5">
            {lastUploadedDoc.entities.map((ent) => (
              <div
                key={ent.id}
                className="p-3.5 bg-sky-50/50 border-2 border-sky-100 rounded-2xl flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-black text-sky-900 uppercase tracking-wide text-[10px] block">
                    {ent.fieldName} ({ent.category})
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{ent.value}</span>
                </div>
                {ent.needsVerification ? (
                  <span className="text-[11px] bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    जांच आवश्यक
                  </span>
                ) : (
                  <span className="text-[11px] bg-emerald-100 text-emerald-900 font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    सत्यापित
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 font-mono">
            <strong>Raw Transcript:</strong>
            <p className="mt-1 whitespace-pre-line text-slate-600">{lastUploadedDoc.extractedText}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="doc-back-btn"
          onClick={() => goToStep('CHIEF_COMPLAINT')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="doc-continue-btn"
          onClick={() => goToStep('VERIFICATION')}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          <span>
            {scannedDocuments.length > 0
              ? language === 'hi'
                ? 'सत्यापन व पुष्टि पर जाएं'
                : 'Proceed to Verification'
              : language === 'hi'
              ? 'दस्तावेज़ नहीं हैं, आगे बढ़ें'
              : 'No Documents, Skip & Continue'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
