import React, { createContext, useContext, useState } from 'react';
import {
  Patient,
  PatientSession,
  ClinicalHistoryData,
  MedicalDocument,
  TriageAlert,
  LanguageCode,
  AccessibilityMode,
  ChiefComplaintItem,
} from '../types';
import { apiService } from '../services/api';

export type KioskStep =
  | 'WELCOME'
  | 'LANGUAGE'
  | 'IDENTITY'
  | 'CONSENT'
  | 'PROFILE'
  | 'CHIEF_COMPLAINT'
  | 'PREVIOUS_HISTORY'
  | 'CLINICAL_HISTORY'
  | 'DOCUMENT_SCAN'
  | 'VERIFICATION'
  | 'COMPLETION';

const INITIAL_HISTORY: ClinicalHistoryData = {
  chiefComplaints: [],
  hpi: '',
  pastMedicalHistory: {
    diabetes: false,
    hypertension: false,
    asthma: false,
    heartDisease: false,
    thyroid: false,
    kidneyDisease: false,
    tuberculosis: false,
    otherConditions: [],
    details: '',
  },
  pastSurgicalHistory: {
    hadSurgery: false,
    surgeries: [],
  },
  currentMedications: [],
  allergyHistory: {
    hasAllergies: false,
    allergies: [],
    details: '',
  },
  familyHistory: {
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    cancer: false,
    details: '',
  },
  personalHistory: {
    smoking: false,
    alcohol: false,
    tobacco: false,
    diet: 'vegetarian',
    sleepQuality: 'good',
    appetite: 'normal',
    bowelHabit: 'regular',
  },
  ayushHistory: {
    prakritiSelfReported: undefined,
    agniType: undefined,
    previousAyushTreatment: '',
  },
  reviewOfSystems: {
    fever: false,
    chestPain: false,
    breathlessness: false,
    dizziness: false,
    vomiting: false,
    unexplainedWeightLoss: false,
    jointPain: false,
    skinRash: false,
  },
  previousHistoryReused: false,
  patientConfirmed: false,
};

interface KioskContextType {
  currentStep: KioskStep;
  goToStep: (step: KioskStep) => void;
  patient: Patient | null;
  setPatient: (patient: Patient | null) => void;
  session: PatientSession | null;
  setSession: (session: PatientSession | null) => void;
  clinicalHistory: ClinicalHistoryData;
  updateClinicalHistory: (updater: (prev: ClinicalHistoryData) => ClinicalHistoryData) => void;
  addChiefComplaint: (item: ChiefComplaintItem) => void;
  removeChiefComplaint: (id: string) => void;
  scannedDocuments: MedicalDocument[];
  addScannedDocument: (doc: MedicalDocument) => void;
  triageAlerts: TriageAlert[];
  setTriageAlerts: (alerts: TriageAlert[]) => void;
  aiSummary: string;
  isSubmitting: boolean;
  submitKioskData: () => Promise<boolean>;
  resetKioskSession: () => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<KioskStep>('WELCOME');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [session, setSession] = useState<PatientSession | null>(null);
  const [clinicalHistory, setClinicalHistory] = useState<ClinicalHistoryData>(INITIAL_HISTORY);
  const [scannedDocuments, setScannedDocuments] = useState<MedicalDocument[]>([]);
  const [triageAlerts, setTriageAlerts] = useState<TriageAlert[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const goToStep = (step: KioskStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateClinicalHistory = (updater: (prev: ClinicalHistoryData) => ClinicalHistoryData) => {
    setClinicalHistory((prev) => updater(prev));
  };

  const addChiefComplaint = (item: ChiefComplaintItem) => {
    setClinicalHistory((prev) => ({
      ...prev,
      chiefComplaints: [...prev.chiefComplaints, item],
      reviewOfSystems: {
        ...prev.reviewOfSystems,
        fever: prev.reviewOfSystems.fever || item.symptom.toLowerCase().includes('fever'),
        chestPain: prev.reviewOfSystems.chestPain || item.symptom.toLowerCase().includes('chest'),
        breathlessness:
          prev.reviewOfSystems.breathlessness || item.symptom.toLowerCase().includes('breath'),
        jointPain: prev.reviewOfSystems.jointPain || item.symptom.toLowerCase().includes('joint'),
      },
    }));
  };

  const removeChiefComplaint = (id: string) => {
    setClinicalHistory((prev) => ({
      ...prev,
      chiefComplaints: prev.chiefComplaints.filter((c) => c.id !== id),
    }));
  };

  const addScannedDocument = (doc: MedicalDocument) => {
    setScannedDocuments((prev) => [...prev, doc]);
    // Also parse any extracted medicines into currentMedications
    const extractedMeds = doc.entities
      .filter((e) => e.category === 'MEDICINE')
      .map((e) => ({
        name: e.value,
        dosage: '',
        frequency: '',
        isAyurvedic: e.fieldName.toLowerCase().includes('ayurvedic'),
        source: 'ocr_extracted' as const,
      }));

    if (extractedMeds.length > 0) {
      setClinicalHistory((prev) => ({
        ...prev,
        currentMedications: [...prev.currentMedications, ...extractedMeds],
      }));
    }
  };

  const submitKioskData = async (): Promise<boolean> => {
    if (!patient || !session) return false;
    setIsSubmitting(true);

    try {
      const response = await apiService.submitClinicalHistory({
        sessionId: session.sessionId,
        patientId: patient.id,
        visitId: session.visitId,
        clinicalHistory: {
          ...clinicalHistory,
          patientConfirmed: true,
          verifiedAt: new Date().toISOString(),
        },
      });

      if (response.success) {
        if (response.triageAlerts) {
          setTriageAlerts(response.triageAlerts);
        }
        if (response.aiSummary) {
          setAiSummary(response.aiSummary);
        }
        goToStep('COMPLETION');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Submission failed', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetKioskSession = () => {
    // STRICT DATA ISOLATION: The next patient must never see previous patient's state
    setPatient(null);
    setSession(null);
    setClinicalHistory(INITIAL_HISTORY);
    setScannedDocuments([]);
    setTriageAlerts([]);
    setAiSummary('');
    setCurrentStep('WELCOME');
  };

  return (
    <KioskContext.Provider
      value={{
        currentStep,
        goToStep,
        patient,
        setPatient,
        session,
        setSession,
        clinicalHistory,
        updateClinicalHistory,
        addChiefComplaint,
        removeChiefComplaint,
        scannedDocuments,
        addScannedDocument,
        triageAlerts,
        setTriageAlerts,
        aiSummary,
        isSubmitting,
        submitKioskData,
        resetKioskSession,
        isHelpModalOpen,
        setIsHelpModalOpen,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) throw new Error('useKiosk must be used within KioskProvider');
  return context;
};
