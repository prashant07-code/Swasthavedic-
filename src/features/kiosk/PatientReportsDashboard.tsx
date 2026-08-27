import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useVoice } from '../../hooks/useVoice';
import { apiService } from '../../services/api';
import { Patient, ConsultationRecord } from '../../types';
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  User,
  Phone,
  ShieldCheck,
  Stethoscope,
  Pill,
  Sparkles,
  QrCode,
  ArrowLeft,
  Volume2,
  AlertCircle,
  Activity,
  Calendar,
  Building2,
  RotateCcw,
} from 'lucide-react';

interface PatientReportsDashboardProps {
  onBackToKiosk: () => void;
  initialTokenOrMobile?: string;
}

export const PatientReportsDashboard: React.FC<PatientReportsDashboardProps> = ({
  onBackToKiosk,
  initialTokenOrMobile = '',
}) => {
  const { language, audioSpeed, highContrast } = useAccessibility();
  const { speak, isSpeaking } = useVoice({ language, speechRate: audioSpeed });

  const [searchQuery, setSearchQuery] = useState(initialTokenOrMobile);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(null);
  const [queueItem, setQueueItem] = useState<any | null>(null);
  const [reports, setReports] = useState<ConsultationRecord[]>([]);
  const [selectedReport, setSelectedReport] = useState<ConsultationRecord | null>(null);

  // Auto-search if initial search string is provided
  useEffect(() => {
    if (initialTokenOrMobile) {
      handleSearch(initialTokenOrMobile);
    }
  }, [initialTokenOrMobile]);

  const handleSearch = async (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim();
    if (!q) {
      setSearchError(
        language === 'hi'
          ? 'कृपया अपना टोकन नंबर (जैसे #OPD-101) या 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter your Token Number or 10-digit Mobile number.'
      );
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await apiService.searchPatientReports({ query: q });
      if (res.found && res.patient) {
        setMatchedPatient(res.patient);
        setQueueItem(res.queueItem || null);
        setReports(res.reports || []);

        if (res.reports && res.reports.length > 0) {
          setSelectedReport(res.reports[res.reports.length - 1]);
          speak(
            language === 'hi'
              ? `${res.patient.name} जी, आपकी डॉक्टर रिपोर्ट और पर्ची मिल गई है। आप इसे नीचे देख और प्रिंट कर सकते हैं।`
              : `Found finalized prescription report for ${res.patient.name}. You can view and print it below.`
          );
        } else {
          setSelectedReport(null);
          speak(
            language === 'hi'
              ? `${res.patient.name} जी, आपकी पर्ची अभी डॉक्टर के पास कतार में है। डॉक्टर द्वारा फाइनल होते ही यह यहाँ दिखेगी।`
              : `Your visit is currently in queue. Report will appear once finalized by the physician.`
          );
        }
      } else {
        setMatchedPatient(null);
        setQueueItem(null);
        setReports([]);
        setSelectedReport(null);
        setSearchError(
          language === 'hi'
            ? 'इस विवरण के साथ कोई पर्ची या मरीज रिकॉर्ड नहीं मिला। कृपया टोकन या मोबाइल नंबर पुनः जांचें।'
            : 'No records found for this Token / Mobile number. Please verify and try again.'
        );
      }
    } catch (err) {
      setSearchError('Connection error. Please check server or retry.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const speakReportSummary = () => {
    if (!selectedReport) return;
    const medCount = selectedReport.prescriptions.length;
    const diag = selectedReport.finalDiagnosis || selectedReport.provisionalDiagnosis || 'जांच पूर्ण';
    const text =
      language === 'hi'
        ? `मरीज का नाम ${matchedPatient?.name}। डॉक्टर ${selectedReport.doctorName} द्वारा निदान: ${diag}। कुल ${medCount} दवाएं लिखी गई हैं। फॉलो-अप ${selectedReport.followUpDays} दिनों बाद है।`
        : `Patient ${matchedPatient?.name}. Doctor ${selectedReport.doctorName}. Diagnosis: ${diag}. Prescribed ${medCount} medications. Follow-up after ${selectedReport.followUpDays} days.`;
    speak(text);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10" id="patient-reports-dashboard">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
        <button
          id="back-to-kiosk-btn"
          type="button"
          onClick={onBackToKiosk}
          className="py-3 px-5 bg-white hover:bg-sky-50 border-2 border-sky-200 text-sky-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>{language === 'hi' ? '← नया कियोस्क चेक-इन (New Check-in)' : '← Back to Kiosk Check-in'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>मरीज़ रिपोर्ट पोर्टल (Patient Portal)</span>
          </span>
        </div>
      </div>

      {/* Main Title & Search Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left print:hidden">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center font-black shadow-inner border-2 border-sky-200 shrink-0">
            <FileText className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-sky-950">
              {language === 'hi' ? 'अपनी डॉक्टर पर्ची व अंतिम रिपोर्ट देखें' : 'View My Finalized OPD Prescription & Report'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              {language === 'hi'
                ? 'डॉक्टर द्वारा फाइनल की गई दवा पर्ची, आयुष आहार व जांच रिपोर्ट तुरंत देखें व प्रिंट करें'
                : 'Instantly view, download & print official digital prescriptions & AYUSH regimens'}
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="patient-report-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={
                language === 'hi'
                  ? 'टोकन नंबर (उदा. #OPD-101), मोबाइल नंबर या पेशेंट कोड दर्ज करें...'
                  : 'Enter Token Number (e.g. #OPD-101), Mobile, or Patient Code...'
              }
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-sky-50/70 border-2 border-sky-200 text-slate-900 font-bold text-sm sm:text-base focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-hidden transition-all shadow-inner"
            />
          </div>

          <button
            id="patient-report-search-btn"
            type="button"
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="py-4 px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border-b-4 border-sky-800 shrink-0"
          >
            <Search className="w-5 h-5" />
            <span>{isSearching ? 'खोज रहे हैं...' : language === 'hi' ? 'रिपोर्ट खोजें (Search)' : 'Search Report'}</span>
          </button>
        </div>

        {/* Quick Demo Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400">
            {language === 'hi' ? 'त्वरित खोज (Quick Search):' : 'Quick Search:'}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('9876543210');
              handleSearch('9876543210');
            }}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            Smt. Shanti Devi (9876543210)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('#OPD-101');
              handleSearch('#OPD-101');
            }}
            className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            Token #OPD-101 (Shri Ramesh)
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('#OPD-102');
              handleSearch('#OPD-102');
            }}
            className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold px-3 py-1 rounded-xl transition-all cursor-pointer"
          >
            Token #OPD-102
          </button>
        </div>

        {/* Error message */}
        {searchError && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-center gap-3 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Patient Found & Queue Status Banner */}
      {matchedPatient && (
        <div className="bg-white p-6 rounded-[32px] border-4 border-emerald-100 shadow-xl mb-8 text-left print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md">
                {matchedPatient.name.charAt(0) || 'P'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{matchedPatient.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {matchedPatient.patientCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {matchedPatient.age} Yrs • {matchedPatient.gender} • Mobile: {matchedPatient.mobile || 'N/A'} • ABHA: {matchedPatient.abhaId || 'N/A'}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {selectedReport ? (
                <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-right">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                    OPD STATUS
                  </span>
                  <div className="text-sm font-black text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>परामर्श संपन्न (Report Ready)</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-2xl text-right">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">
                    OPD STATUS
                  </span>
                  <div className="text-sm font-black text-amber-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>कतार में प्रतीक्षा (In Queue / Reviewing)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* If there are multiple consultation reports for this patient */}
          {reports.length > 1 && (
            <div className="mt-4 pt-2">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Available Reports ({reports.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {reports.map((rep, idx) => (
                  <button
                    key={rep.id || idx}
                    onClick={() => setSelectedReport(rep)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedReport?.id === rep.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Report #{idx + 1} • {new Date(rep.consultationDate).toLocaleDateString('en-IN')} ({rep.doctorName})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* When Consultation Report is Available */}
      {selectedReport && matchedPatient ? (
        <div className="space-y-6">
          {/* Audio voice readout & Print bar for patient */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-950 text-white p-4 sm:p-5 rounded-2xl shadow-xl print:hidden">
            <div className="flex items-center gap-3">
              <button
                id="listen-report-voice-btn"
                type="button"
                onClick={speakReportSummary}
                className="py-2.5 px-4 bg-sky-800 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-emerald-400' : 'text-emerald-400'}`} />
                <span>{language === 'hi' ? 'दवाएं व रिपोर्ट बोलकर सुनें' : 'Listen to Prescription Voice'}</span>
              </button>
              <span className="text-xs text-sky-200 hidden sm:inline">
                {language === 'hi' ? 'डॉक्टर द्वारा फाइनल की गई वैध डिजिटल पर्ची' : 'Official ABDM-Verified e-Prescription'}
              </span>
            </div>

            <button
              id="patient-print-prescription-btn"
              type="button"
              onClick={handlePrint}
              className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer border-b-2 border-emerald-700 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>पर्ची प्रिंट करें (Print Slip)</span>
            </button>
          </div>

          {/* Official Printable Prescription Sheet */}
          <div
            id="patient-printable-prescription"
            className="bg-white p-6 sm:p-10 rounded-[32px] border-4 border-slate-300 shadow-2xl text-slate-900 relative print:border-none print:p-0 print:m-0"
          >
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                GOVERNMENT DISTRICT CIVIL HOSPITAL & AYUSH OPD
              </h2>
              <p className="text-xs text-slate-600 font-semibold">
                Department of Integrated Medicine • National Health Mission
              </p>
              <p className="text-[11px] text-slate-500">
                Vedic & Allopathic Clinical OPD • Registration: AIIMS/GOV/2026/OPD • ABDM e-Prescription
              </p>
            </div>

            {/* Doctor & Patient Metadata Row */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="font-bold text-[10px] text-slate-500 uppercase block">ATTENDING PHYSICIAN</span>
                <p className="font-black text-sm text-slate-900">{selectedReport.doctorName}</p>
                <p className="text-slate-600 font-semibold">{selectedReport.department}</p>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-0.5 inline-block">
                  Registration ID: {selectedReport.doctorId}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[10px] text-slate-500 uppercase block">CONSULTATION DATE & TIME</span>
                <p className="font-bold text-sm text-slate-900">
                  {new Date(selectedReport.consultationDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-slate-600 font-semibold">Visit Token: {selectedReport.visitId}</p>
              </div>
            </div>

            {/* Patient Details Card */}
            <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5 border border-slate-200">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
                <strong className="text-slate-900 text-sm">{matchedPatient.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
                <strong className="text-slate-900">{matchedPatient.age} Yrs / {matchedPatient.gender}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Code</span>
                <strong className="text-slate-900 font-mono">{matchedPatient.patientCode}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Mobile / ABHA</span>
                <strong className="text-slate-900">{matchedPatient.mobile || matchedPatient.abhaId || 'N/A'}</strong>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                CLINICAL DIAGNOSIS & ASSESSMENT:
              </span>
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-sm font-black text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                <span>{selectedReport.finalDiagnosis || selectedReport.provisionalDiagnosis || 'OPD Evaluation Completed'}</span>
                {selectedReport.icdCode && (
                  <span className="text-xs bg-white text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300 font-mono font-bold">
                    ICD-10: {selectedReport.icdCode}
                  </span>
                )}
              </div>
            </div>

            {/* Systemic Examination findings */}
            {selectedReport.systemicExamination && (
              <div className="mb-5 text-xs">
                <span className="font-bold text-slate-500 uppercase block mb-1">Clinical Findings & Vitals:</span>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                  {selectedReport.systemicExamination}
                </p>
              </div>
            )}

            {/* Prescribed Medications Table */}
            <div className="mb-5">
              <span className="text-base font-black text-slate-900 font-serif italic block mb-2">
                ℞ Prescribed Medications (दवाओं का विवरण):
              </span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Medicine / Formulation</th>
                      <th className="p-3">Dosage & Frequency</th>
                      <th className="p-3">Timing</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {selectedReport.prescriptions.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-slate-50/70">
                        <td className="p-3 font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900">
                          {p.medicineName}
                          <span className={`ml-1.5 text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                            p.system === 'AYUSH' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-sky-100 text-sky-900 border border-sky-300'
                          }`}>
                            {p.system}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{p.dosage} • {p.frequency}</td>
                        <td className="p-3 text-slate-700 font-semibold">{p.timing.replace('_', ' ')}</td>
                        <td className="p-3 font-bold text-slate-900">{p.duration}</td>
                        <td className="p-3 text-slate-600 italic">{p.instructions || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Diagnostic Investigations */}
            {selectedReport.investigations && selectedReport.investigations.length > 0 && (
              <div className="mb-5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Diagnostic Investigations Advised (जांच निर्देश):
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.investigations.map((inv, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-xl font-bold text-slate-800">
                      • {inv.testName} ({inv.urgency})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AYUSH Pathya / Apathya Regimen */}
            {selectedReport.ayushAssessment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-amber-50/60 border-2 border-amber-200 rounded-2xl text-xs">
                <div>
                  <strong className="text-emerald-900 block mb-1.5 font-black text-sm">
                    Pathya (पथ्य - क्या खाएं व क्या करें):
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                    {selectedReport.ayushAssessment.pathyaAdvice.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-rose-900 block mb-1.5 font-black text-sm">
                    Apathya (अपथ्य - क्या न खाएं व परहेज):
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
                    {selectedReport.ayushAssessment.apathyaAdvice.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* General Advice & Follow-Up */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <strong className="text-slate-900 block font-black text-sm">Doctor's Advice / परामर्श:</strong>
                <span className="text-slate-700 font-semibold">{selectedReport.generalAdvice || 'Maintain regular hydration and follow medication schedule.'}</span>
              </div>
              <div className="text-right">
                <strong className="text-emerald-800 block font-black text-sm">Follow-Up Review (पुनः जांच):</strong>
                <span className="font-black text-slate-900 text-sm">
                  After {selectedReport.followUpDays} Days ({selectedReport.followUpDate || 'As advised'})
                </span>
              </div>
            </div>

            {/* Signature & Digital ABDM QR Footer */}
            <div className="flex items-end justify-between pt-6 border-t-2 border-slate-200 text-xs">
              <div className="flex items-center gap-3">
                <QrCode className="w-12 h-12 text-slate-900" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Digital OPD Verification</p>
                  <p className="font-mono text-xs font-bold text-slate-800">ABDM-COMPLIANT-EHR-VALIDATED</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">Digitally Signed & Validated</p>
                </div>
              </div>

              <div className="text-right">
                <div className="h-10 border-b-2 border-slate-400 w-52 mb-1" />
                <p className="font-black text-sm text-slate-950">{selectedReport.doctorName}</p>
                <p className="text-[11px] text-slate-600 font-semibold">{selectedReport.department}</p>
                <p className="text-[10px] text-slate-400">Authorized Medical Officer / OPD Physician</p>
              </div>
            </div>
          </div>
        </div>
      ) : matchedPatient ? (
        /* Patient found, but consultation not yet finalized */
        <div className="bg-white p-8 rounded-[32px] border-4 border-amber-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">
            {language === 'hi' ? 'परामर्श प्रक्रिया में है' : 'Consultation in Progress'}
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto font-semibold mb-6">
            {language === 'hi'
              ? `${matchedPatient.name} जी, आपका टोकन नंबर दर्ज है। डॉक्टर द्वारा कंसल्टेशन पूरा करने के बाद आपकी फाइनल रिपोर्ट व पर्ची तुरंत यहाँ उपलब्ध हो जाएगी।`
              : `Your token is active in the OPD queue. Once the physician finalizes the consultation, your official prescription will appear right here.`}
          </p>
          <button
            type="button"
            onClick={() => handleSearch(searchQuery)}
            className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्थिति पुनः जांचें (Refresh Status)' : 'Check Status Again'}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
