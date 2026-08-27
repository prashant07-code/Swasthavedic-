import React from 'react';
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
import { t } from '../../constants/languages';

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
  const { currentStep } = useKiosk();
  const { language, highContrast } = useAccessibility();

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercent = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'WELCOME':
        return <WelcomeStep />;
      case 'LANGUAGE':
        return <LanguageStep />;
      case 'IDENTITY':
        return <IdentityStep />;
      case 'CONSENT':
        return <ConsentStep />;
      case 'PROFILE':
        return <ProfileStep />;
      case 'PREVIOUS_HISTORY':
        return <PreviousHistoryReuseStep />;
      case 'CHIEF_COMPLAINT':
        return <ChiefComplaintStep />;
      case 'CLINICAL_HISTORY':
        return <ClinicalHistoryStep />;
      case 'DOCUMENT_SCAN':
        return <DocumentScanStep />;
      case 'VERIFICATION':
        return <VerificationStep />;
      case 'COMPLETION':
        return <CompletionStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] flex flex-col relative pb-20 ${highContrast ? 'bg-slate-950 text-amber-50' : 'bg-sky-50 text-slate-900'}`} id="kiosk-app-root">
      {/* Top Accessibility Bar */}
      <AccessibilityBar />

      {/* Progress Bar (visible after Welcome and before Completion) */}
      {currentStep !== 'WELCOME' && currentStep !== 'COMPLETION' && (
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
      {currentStep !== 'COMPLETION' && <HelpButton />}
    </div>
  );
};
