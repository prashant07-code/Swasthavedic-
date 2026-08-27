import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Patient,
  ConsultationRecord,
  PrescriptionItem,
  InvestigationOrder,
  AyushClinicalAssessment,
  TriageAlert,
  MedicalDocument,
  TimelineEvent,
  DoctorUser,
} from '../types';
import { apiService } from '../services/api';

interface QueueItem {
  tokenNumber: string;
  visitId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  severity: 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'WAITING' | 'READY' | 'IN_CONSULTATION' | 'COMPLETED';
  arrivalTime: string;
}

interface DoctorContextType {
  currentDoctor: DoctorUser;
  queue: QueueItem[];
  refreshQueue: () => Promise<void>;
  activeVisitId: string | null;
  activePatientBundle: {
    patient: Patient | null;
    queueItem: QueueItem | null;
    clinicalHistory: any | null;
    triageAlerts: TriageAlert[];
    documents: MedicalDocument[];
    timeline: TimelineEvent[];
    previousConsultations: ConsultationRecord[];
  } | null;
  openPatientConsultation: (visitId: string) => Promise<void>;
  closePatientConsultation: () => void;
  // Active Consultation State
  provisionalDiagnosis: string;
  setProvisionalDiagnosis: (v: string) => void;
  finalDiagnosis: string;
  setFinalDiagnosis: (v: string) => void;
  systemicExamination: string;
  setSystemicExamination: (v: string) => void;
  prescriptions: PrescriptionItem[];
  addPrescription: (item: PrescriptionItem) => void;
  removePrescription: (id: string) => void;
  investigations: InvestigationOrder[];
  addInvestigation: (item: InvestigationOrder) => void;
  removeInvestigation: (id: string) => void;
  generalAdvice: string;
  setGeneralAdvice: (v: string) => void;
  ayushAssessment: AyushClinicalAssessment;
  setAyushAssessment: React.Dispatch<React.SetStateAction<AyushClinicalAssessment>>;
  followUpDays: number;
  setFollowUpDays: (d: number) => void;
  isEmergencyReferral: boolean;
  setIsEmergencyReferral: (v: boolean) => void;
  saveConsultation: (status: 'DRAFT' | 'FINALIZED') => Promise<ConsultationRecord | null>;
  isSaving: boolean;
  finalizedRecordToPrint: ConsultationRecord | null;
  setFinalizedRecordToPrint: (rec: ConsultationRecord | null) => void;
}

const DEFAULT_DOCTOR: DoctorUser = {
  id: 'doc-1',
  doctorId: 'DOC-AIIMS-409',
  name: 'Dr. Rajesh Sharma, MD (Medicine)',
  specialization: 'Internal Medicine & Integrative AYUSH Health',
  department: 'General OPD Room 04',
  email: 'dr.sharma@hospital.gov.in',
  role: 'DOCTOR',
  tokenCountToday: 24,
};

const INITIAL_AYUSH_ASSESSMENT: AyushClinicalAssessment = {
  doshaImbalance: {
    vata: 'Normal',
    pitta: 'Normal',
    kapha: 'Normal',
  },
  nadiParikshaNotes: 'Samanya Nadi (Regular, moderate force and rhythm)',
  dhatuInvolved: ['Rasa', 'Asthi'],
  pathyaAdvice: ['Warm freshly cooked meals', 'Warm water intake', 'Early light dinner before 8 PM'],
  apathyaAdvice: ['Excessive cold/refrigerated food', 'Deep fried and heavy oily items', 'Day sleeping (Diva Swapna)'],
  panchakarmaRecommended: [],
};

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDoctor] = useState<DoctorUser>(DEFAULT_DOCTOR);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);
  const [activePatientBundle, setActivePatientBundle] = useState<any | null>(null);

  // Consultation state
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [systemicExamination, setSystemicExamination] = useState('Chest: Bilateral clear, CVS: S1 S2 normal, P/A: Soft non-tender, CNS: Oriented.');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationOrder[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState('Maintain regular hydration and report back if symptoms worsen.');
  const [ayushAssessment, setAyushAssessment] = useState<AyushClinicalAssessment>(INITIAL_AYUSH_ASSESSMENT);
  const [followUpDays, setFollowUpDays] = useState<number>(7);
  const [isEmergencyReferral, setIsEmergencyReferral] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [finalizedRecordToPrint, setFinalizedRecordToPrint] = useState<ConsultationRecord | null>(null);

  const refreshQueue = useCallback(async () => {
    try {
      const res = await apiService.getDoctorQueue();
      if (res && res.queue) {
        setQueue(res.queue);
      }
    } catch (e) {
      console.error('Error refreshing queue', e);
    }
  }, []);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const openPatientConsultation = async (visitId: string) => {
    setActiveVisitId(visitId);
    try {
      await apiService.updateQueueStatus(visitId, 'IN_CONSULTATION');
      const bundle = await apiService.getDoctorPatientView(visitId);
      setActivePatientBundle(bundle);

      // Preload clinical defaults
      if (bundle?.clinicalHistory?.chiefComplaints?.length > 0) {
        const topComplaint = bundle.clinicalHistory.chiefComplaints[0];
        if (topComplaint.symptom.toLowerCase().includes('chest')) {
          setProvisionalDiagnosis('Atypical Chest Pain / CAD Evaluation');
        } else if (topComplaint.symptom.toLowerCase().includes('fever')) {
          setProvisionalDiagnosis('Acute Febrile Illness');
        } else if (topComplaint.symptom.toLowerCase().includes('joint') || topComplaint.symptom.toLowerCase().includes('knee')) {
          setProvisionalDiagnosis('Bilateral Knee Osteoarthritis / Sandhivata');
        } else {
          setProvisionalDiagnosis('Clinical Review & Symptomatic Management');
        }
      }

      // Preload existing meds from OCR or history into doctor view if available
      if (bundle?.clinicalHistory?.currentMedications?.length > 0) {
        const initialPrescs: PrescriptionItem[] = bundle.clinicalHistory.currentMedications.map(
          (m: any, idx: number) => ({
            id: `p-${idx}`,
            medicineName: m.name,
            system: m.isAyurvedic ? 'AYURVEDA' : 'ALLOPATHY',
            form: m.isAyurvedic ? 'Churna/Powder' : 'Tablet',
            dosage: m.dosage || '1 Tablet',
            frequency: m.frequency || '1-0-1',
            timing: 'AFTER_FOOD',
            duration: '15 days',
            instructions: 'Continue regular adherence',
          })
        );
        setPrescriptions(initialPrescs);
      } else {
        setPrescriptions([]);
      }

      setInvestigations([]);
      await refreshQueue();
    } catch (err) {
      console.error('Error loading patient bundle', err);
    }
  };

  const closePatientConsultation = () => {
    setActiveVisitId(null);
    setActivePatientBundle(null);
    setProvisionalDiagnosis('');
    setFinalDiagnosis('');
    setPrescriptions([]);
    setInvestigations([]);
    setAyushAssessment(INITIAL_AYUSH_ASSESSMENT);
  };

  const addPrescription = (item: PrescriptionItem) => {
    setPrescriptions((prev) => [...prev, item]);
  };

  const removePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const addInvestigation = (item: InvestigationOrder) => {
    setInvestigations((prev) => [...prev, item]);
  };

  const removeInvestigation = (id: string) => {
    setInvestigations((prev) => prev.filter((i) => i.id !== id));
  };

  const saveConsultation = async (status: 'DRAFT' | 'FINALIZED'): Promise<ConsultationRecord | null> => {
    if (!activeVisitId || !activePatientBundle?.patient) return null;
    setIsSaving(true);

    try {
      const payload: Partial<ConsultationRecord> = {
        visitId: activeVisitId,
        patientId: activePatientBundle.patient.id,
        doctorId: currentDoctor.doctorId,
        doctorName: currentDoctor.name,
        department: currentDoctor.department,
        provisionalDiagnosis,
        finalDiagnosis: finalDiagnosis || provisionalDiagnosis,
        systemicExamination,
        prescriptions,
        investigations,
        generalAdvice,
        ayushAssessment,
        followUpDays,
        followUpDate: new Date(Date.now() + followUpDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isEmergencyReferral,
        status,
        symptomsSummary: activePatientBundle.clinicalHistory?.chiefComplaints
          ? activePatientBundle.clinicalHistory.chiefComplaints.map((c: any) => c.symptom).join(', ')
          : '',
      };

      const res = await apiService.saveConsultation(payload);
      if (res && res.success) {
        if (status === 'FINALIZED') {
          setFinalizedRecordToPrint(res.consultation);
        }
        await refreshQueue();
        return res.consultation;
      }
      return null;
    } catch (e) {
      console.error('Error saving consultation', e);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        currentDoctor,
        queue,
        refreshQueue,
        activeVisitId,
        activePatientBundle,
        openPatientConsultation,
        closePatientConsultation,
        provisionalDiagnosis,
        setProvisionalDiagnosis,
        finalDiagnosis,
        setFinalDiagnosis,
        systemicExamination,
        setSystemicExamination,
        prescriptions,
        addPrescription,
        removePrescription,
        investigations,
        addInvestigation,
        removeInvestigation,
        generalAdvice,
        setGeneralAdvice,
        ayushAssessment,
        setAyushAssessment,
        followUpDays,
        setFollowUpDays,
        isEmergencyReferral,
        setIsEmergencyReferral,
        saveConsultation,
        isSaving,
        finalizedRecordToPrint,
        setFinalizedRecordToPrint,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error('useDoctor must be used within DoctorProvider');
  return context;
};
