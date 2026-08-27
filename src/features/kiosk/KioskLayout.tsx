import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AccessibilityBar } from './components/AccessibilityBar';
import { HelpButton } from './components/HelpButton';
import { WelcomeStep } from './steps/WelcomeStep';
import { LanguageStep } from './steps/LanguageStep';
import { IdentityStep } from './steps/IdentityStep';
import { ConsentStep } from './steps/ConsentStep';
import { ProfileStep } from './steps/ProfileStep';
import { PreviousHistoryReuseStep } from './steps/PreviousHistoryReuseStep';
import { ChiefComplaintStep } from './steps/ChiefComplaintStep';
import { ClinicalHistoryStep } from './steps/ClinicalHistoryStep';
import { DocumentScanStep } from './steps/DocumentScanStep';
import { VerificationStep } from './steps/VerificationStep';
import { CompletionStep } from './steps/CompletionStep';
import { PatientReportsDashboard } from './PatientReportsDashboard';
import { t } from '../../constants/languages';
import { UserPlus, FileText, Sparkles } from 'lucide-react';

const STEP_ORDER = [
  'WELCOME',
  'LANGUAGE',
  'IDENTITY',
  'CONSENT',
  'PROFILE',
  'PREVIOUS_HISTORY',
  'CHIEF_COMPLAINT',
  'CLINICAL_HISTORY',
  'DOCUMENT_SCAN',
  'VERIFICATION',
  'COMPLETION',
];

export const KioskLayout: React.FC = () => {
  const { currentStep, session, patient } = useKiosk();
  const { language, highContrast } = useAccessibility();

  // Mode: 'CHECK_IN' (Kiosk Workflow) or 'REPORTS' (Patient Finalized Prescription Portal)
  const [activeKioskMode, setActiveKioskMode] = useState<'CHECK_IN' | 'REPORTS'>('CHECK_IN');
  const [reportSearchToken, setReportSearchToken] = useState<string>('');

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

  const handleOpenReports = (tokenOrMobile?: string) => {
    if (tokenOrMobile) {
      setReportSearchToken(tokenOrMobile);
    } else if (session?.tokenNumber) {
      setReportSearchToken(session.tokenNumber);
    } else if (patient?.mobile) {
      setReportSearchToken(patient.mobile);
    }
    setActiveKioskMode('REPORTS');
  };

  const renderStepContent = () => {
    if (activeKioskMode === 'REPORTS') {
      return (
        <PatientReportsDashboard
          onBackToKiosk={() => setActiveKioskMode('CHECK_IN')}
          initialTokenOrMobile={reportSearchToken}
        />
      );
    }

    switch (currentStep) {
      case 'WELCOME':
        return <WelcomeStep onOpenReports={() => handleOpenReports()} />;
      case 'LANGUAGE':
        return <LanguageStep />;
      case 'IDENTITY':
        return <IdentityStep onOpenReports={(tokenOrMobile) => handleOpenReports(tokenOrMobile)} />;
      case 'CONSENT':
        return <ConsentStep />;
      case 'PROFILE':
        return <ProfileStep />;
      case 'PREVIOUS_HISTORY':
        return <PreviousHistoryReuseStep onOpenReports={(tokenOrMobile) => handleOpenReports(tokenOrMobile)} />;
      case 'CHIEF_COMPLAINT':
        return <ChiefComplaintStep />;
      case 'CLINICAL_HISTORY':
        return <ClinicalHistoryStep />;
      case 'DOCUMENT_SCAN':
        return <DocumentScanStep />;
      case 'VERIFICATION':
        return <VerificationStep />;
      case 'COMPLETION':
        return <CompletionStep onOpenReports={(token) => handleOpenReports(token)} />;
      default:
        return <WelcomeStep onOpenReports={() => handleOpenReports()} />;
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-80px)] flex flex-col relative pb-20 ${
        highContrast ? 'bg-slate-950 text-amber-50' : 'bg-sky-50 text-slate-900'
      }`}
      id="kiosk-app-root"
    >
      {/* Top Accessibility Bar */}
      <AccessibilityBar />

      {/* Patient Workspace Sub-Navigation Switcher */}
      <div className="bg-white/80 backdrop-blur-xs border-b-2 border-sky-100 py-2.5 px-4 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'मरीज़ मोड' : 'Patient Mode'}:
            </span>
            <div className="flex items-center bg-sky-50 p-1 rounded-2xl border border-sky-200">
              <button
                id="kiosk-mode-checkin-btn"
                onClick={() => setActiveKioskMode('CHECK_IN')}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeKioskMode === 'CHECK_IN'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-950'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नया चेक-इन (Kiosk Check-In)' : 'New Kiosk Check-In'}</span>
              </button>

              <button
                id="kiosk-mode-reports-btn"
                onClick={() => handleOpenReports()}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeKioskMode === 'REPORTS'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'मेरी डॉक्टर रिपोर्ट / पर्ची (My Prescriptions)' : 'My OPD Reports & Prescriptions'}</span>
              </button>
            </div>
          </div>

          {/* Quick Active Patient context indicator if registered */}
          {session?.tokenNumber && (
            <button
              onClick={() => handleOpenReports(session.tokenNumber)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Active Token: <strong className="font-mono">{session.tokenNumber}</strong>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (visible during active check-in flow) */}
      {activeKioskMode === 'CHECK_IN' && currentStep !== 'WELCOME' && currentStep !== 'COMPLETION' && (
        <div className="w-full bg-sky-100 h-2" id="kiosk-progress-bar">
          <div
            className="bg-emerald-500 h-2 transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Step Container */}
      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-8">
        {renderStepContent()}
      </main>

      {/* Persistent Help Floating Button */}
      {activeKioskMode === 'CHECK_IN' && currentStep !== 'COMPLETION' && <HelpButton />}
    </div>
  );
};
