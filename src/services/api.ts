import {
  Patient,
  PatientSession,
  ClinicalHistoryData,
  MedicalDocument,
  TriageAlert,
  AssistanceRequest,
  ConsultationRecord,
  TimelineEvent,
  DoctorUser,
} from '../types';

export const API_BASE = '/api';

export const apiService = {
  // Patient search & identification
  searchPatient: async (query: { mobile?: string; patientCode?: string; abhaId?: string }) => {
    const res = await fetch(`${API_BASE}/patients/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    return res.json();
  },

  // Register new patient
  registerPatient: async (patientData: Partial<Patient>) => {
    const res = await fetch(`${API_BASE}/patients/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    return res.json();
  },

  // Create patient kiosk session
  createSession: async (sessionPayload: {
    patientId: string;
    language: string;
    accessibilityMode: string;
    isAttendantPresent: boolean;
    attendantName?: string;
  }) => {
    const res = await fetch(`${API_BASE}/sessions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionPayload),
    });
    return res.json();
  },

  // Get patient clinical timeline & past history
  getPatientTimeline: async (patientId: string): Promise<{ timeline: TimelineEvent[]; pastHistory: any }> => {
    const res = await fetch(`${API_BASE}/patients/${patientId}/timeline`);
    return res.json();
  },

  // Submit clinical history from Kiosk
  submitClinicalHistory: async (payload: {
    sessionId: string;
    patientId: string;
    visitId: string;
    clinicalHistory: ClinicalHistoryData;
  }) => {
    const res = await fetch(`${API_BASE}/history/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Process Document with OCR
  processDocumentOcr: async (formData: FormData): Promise<{ document: MedicalDocument; extractedSummary: string }> => {
    const res = await fetch(`${API_BASE}/documents/ocr-upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Upload Document OCR with JSON payload
  uploadDocumentOCR: async (payload: {
    fileName: string;
    fileData?: string;
    mimeType?: string;
    patientId?: string;
    visitId?: string;
  }): Promise<{ success: boolean; document: MedicalDocument; summary: string }> => {
    const res = await fetch(`${API_BASE}/documents/ocr-upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Create Staff Assistance Request
  createAssistanceRequest: async (payload: {
    kioskId: string;
    patientName?: string;
    tokenNumber?: string;
    language: string;
    reason: string;
  }): Promise<{ request: AssistanceRequest }> => {
    const res = await fetch(`${API_BASE}/assistance/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Get all assistance requests for staff
  getAssistanceRequests: async (): Promise<{ requests: AssistanceRequest[] }> => {
    const res = await fetch(`${API_BASE}/assistance/list`);
    return res.json();
  },

  resolveAssistanceRequest: async (requestId: string, resolvedBy: string) => {
    const res = await fetch(`${API_BASE}/assistance/${requestId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolvedBy }),
    });
    return res.json();
  },

  // Doctor Queue
  getDoctorQueue: async () => {
    const res = await fetch(`${API_BASE}/doctor/queue`);
    return res.json();
  },

  // Update queue patient status (e.g. IN_CONSULTATION)
  updateQueueStatus: async (visitId: string, status: string) => {
    const res = await fetch(`${API_BASE}/doctor/queue/${visitId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Get full patient clinical bundle for Doctor
  getDoctorPatientView: async (visitId: string) => {
    const res = await fetch(`${API_BASE}/doctor/patient-bundle/${visitId}`);
    return res.json();
  },

  // Save Consultation (Draft or Finalize)
  saveConsultation: async (consultation: Partial<ConsultationRecord>) => {
    const res = await fetch(`${API_BASE}/consultations/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultation),
    });
    return res.json();
  },

  // AI Assistance: Generate Clinical Summary & differential guidance
  generateAiClinicalSummary: async (payload: {
    chiefComplaints: any;
    clinicalHistory: any;
    ocrDocuments?: any[];
    ayushNotes?: any;
  }) => {
    const res = await fetch(`${API_BASE}/ai/clinical-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
