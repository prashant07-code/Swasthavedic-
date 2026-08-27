export type LanguageCode = 'hi' | 'en' | 'aw' | 'bho' | 'mai';

export type AppView = 'KIOSK' | 'DOCTOR' | 'STAFF';

export type AccessibilityMode = 'NORMAL' | 'VOICE_FIRST' | 'ELDERLY' | 'LOW_LITERACY' | 'ASSISTED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type IdentityType = 'MOBILE' | 'HOSPITAL_ID' | 'ABHA';

export type QueueStatus = 'WAITING' | 'READY' | 'IN_CONSULTATION' | 'COMPLETED';

export type TriageSeverity = 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'ADMIN' | 'SUPER_ADMIN';

export interface Patient {
  id: string;
  patientCode: string; // e.g. "SV-2026-8942"
  name: string;
  age: number;
  dateOfBirth?: string;
  gender: Gender;
  mobile: string;
  abhaId?: string;
  preferredLanguage: LanguageCode;
  address?: string;
  emergencyContact?: string;
  isExistingPatient: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientIdentity {
  id: string;
  patientId: string;
  identityType: IdentityType;
  identityValue: string;
  verified: boolean;
  verifiedAt: string;
}

export interface PatientSession {
  sessionId: string;
  patientId: string;
  visitId: string;
  tokenNumber: string;
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  isAttendantPresent: boolean;
  attendantName?: string;
  attendantRelation?: string;
  consentGiven: boolean;
  consentTimestamp?: string;
  createdAt: string;
  expiresAt: string;
}

export interface ChiefComplaintItem {
  id: string;
  symptom: string;
  symptomHindi: string;
  duration: string;
  durationUnit: 'hours' | 'days' | 'weeks' | 'months' | 'years';
  severity: 'mild' | 'moderate' | 'severe';
  bodyLocation?: string;
  voiceTranscript?: string;
}

export interface ClinicalHistoryData {
  chiefComplaints: ChiefComplaintItem[];
  hpi: string; // History of Present Illness
  pastMedicalHistory: {
    diabetes: boolean;
    hypertension: boolean;
    asthma: boolean;
    heartDisease: boolean;
    thyroid: boolean;
    kidneyDisease: boolean;
    tuberculosis: boolean;
    otherConditions: string[];
    details: string;
  };
  pastSurgicalHistory: {
    hadSurgery: boolean;
    surgeries: Array<{ name: string; year?: string }>;
  };
  currentMedications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    isAyurvedic?: boolean;
    source: 'patient_reported' | 'ocr_extracted' | 'doctor_prescribed';
  }>;
  allergyHistory: {
    hasAllergies: boolean;
    allergies: string[];
    details: string;
  };
  familyHistory: {
    diabetes: boolean;
    hypertension: boolean;
    heartDisease: boolean;
    cancer: boolean;
    details: string;
  };
  personalHistory: {
    smoking: boolean;
    alcohol: boolean;
    tobacco: boolean;
    diet: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'sattvic';
    sleepQuality: 'good' | 'disturbed' | 'insomnia';
    appetite: 'normal' | 'reduced' | 'increased';
    bowelHabit: 'regular' | 'constipated' | 'irregular';
  };
  ayushHistory?: {
    prakritiSelfReported?: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
    agniType?: 'Sama (Balanced)' | 'Tikshna (Intense)' | 'Manda (Sluggish)' | 'Vishama (Irregular)';
    previousAyushTreatment?: string;
  };
  reviewOfSystems: {
    fever: boolean;
    chestPain: boolean;
    breathlessness: boolean;
    dizziness: boolean;
    vomiting: boolean;
    unexplainedWeightLoss: boolean;
    jointPain: boolean;
    skinRash: boolean;
  };
  previousHistoryReused: boolean;
  patientConfirmed: boolean;
  verifiedAt?: string;
}

export interface ExtractedEntity {
  id: string;
  category: 'DIAGNOSIS' | 'MEDICINE' | 'LAB_TEST' | 'PROCEDURE' | 'DATE' | 'VITALS';
  fieldName: string;
  value: string;
  confidence: number; // 0 to 1
  needsVerification: boolean;
  sourceDocumentId: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  visitId: string;
  title: string;
  fileName: string;
  fileType: 'image/jpeg' | 'image/png' | 'application/pdf';
  fileSize: number;
  uploadedAt: string;
  extractedText?: string;
  entities: ExtractedEntity[];
  ocrConfidence: number;
  ocrProvider: 'mock_engine' | 'paddle_ocr' | 'tesseract' | 'gemini_vision';
  previewUrl?: string;
}

export interface TriageAlert {
  id: string;
  patientId: string;
  visitId: string;
  tokenNumber: string;
  severity: TriageSeverity;
  ruleCode: string;
  message: string;
  messageHindi: string;
  triggerFactors: string[];
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface AssistanceRequest {
  id: string;
  kioskId: string;
  patientName?: string;
  tokenNumber?: string;
  language: LanguageCode;
  reason: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type MedicineTiming = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'EMPTY_STOMACH' | 'AT_BEDTIME' | 'BEDTIME';

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName?: string;
  system: 'ALLOPATHY' | 'AYURVEDA' | 'HOMEOPATHY' | 'UNANI' | 'SIDDHA';
  form: string;
  dosage: string; // e.g. "500 mg" or "2 spoons (10ml)"
  frequency: string; // e.g. "1-0-1" or "Twice daily"
  timing: MedicineTiming;
  duration: string; // e.g. "5 days", "1 month"
  instructions: string; // e.g. "Take with lukewarm water"
}

export interface InvestigationOrder {
  id: string;
  testName: string;
  category: 'BIOCHEMISTRY' | 'HEMATOLOGY' | 'RADIOLOGY' | 'MICROBIOLOGY' | 'AYURVEDIC_EXAM' | 'PATHOLOGY' | 'CARDIOLOGY' | 'OTHER';
  instructions?: string;
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  orderedAt?: string;
}

export interface AyushClinicalAssessment {
  doshaImbalance: {
    vata: 'Normal' | 'Mild Aggravation' | 'Severe Aggravation' | 'Aggravated' | 'Depleted';
    pitta: 'Normal' | 'Mild Aggravation' | 'Severe Aggravation' | 'Aggravated' | 'Depleted';
    kapha: 'Normal' | 'Mild Aggravation' | 'Severe Aggravation' | 'Aggravated' | 'Depleted';
  };
  nadiParikshaNotes?: string;
  dhatuInvolved?: string[];
  pathyaAdvice: string[]; // Recommended foods/lifestyle
  apathyaAdvice: string[]; // Prohibited foods/habits
  panchakarmaRecommended?: string[];
}

export interface ConsultationRecord {
  id: string;
  visitId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  consultationDate: string;
  symptomsSummary: string;
  aiClinicalSummary?: string;
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icdCode?: string;
  systemicExamination: string;
  ayushAssessment?: AyushClinicalAssessment;
  prescriptions: PrescriptionItem[];
  investigations: InvestigationOrder[];
  generalAdvice: string;
  followUpDays?: number;
  followUpDate?: string;
  isEmergencyReferral: boolean;
  status: 'DRAFT' | 'FINALIZED';
  finalizedAt?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  eventType: 'CONSULTATION' | 'PRESCRIPTION' | 'LAB_REPORT' | 'DOCUMENT_UPLOAD' | 'TRIAGE_ALERT' | 'HOSPITAL_ADMISSION';
  title: string;
  description: string;
  department?: string;
  doctorName?: string;
  metadata?: Record<string, any>;
}

export interface DoctorUser {
  id: string;
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
  email: string;
  role: UserRole;
  tokenCountToday: number;
}
