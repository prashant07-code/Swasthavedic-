import {
  Patient,
  PatientIdentity,
  PatientSession,
  ClinicalHistoryData,
  MedicalDocument,
  TriageAlert,
  AssistanceRequest,
  ConsultationRecord,
  TimelineEvent,
  DoctorUser,
} from '../src/types';

export class InMemoryHospitalDatabase {
  public patients: Map<string, Patient> = new Map();
  public identities: Map<string, PatientIdentity[]> = new Map();
  public sessions: Map<string, PatientSession> = new Map();
  public clinicalHistories: Map<string, ClinicalHistoryData> = new Map(); // key = visitId
  public documents: Map<string, MedicalDocument[]> = new Map(); // key = patientId
  public triageAlerts: Map<string, TriageAlert[]> = new Map(); // key = visitId
  public assistanceRequests: AssistanceRequest[] = [];
  public consultations: Map<string, ConsultationRecord> = new Map(); // key = visitId
  public timelines: Map<string, TimelineEvent[]> = new Map(); // key = patientId
  public doctors: DoctorUser[] = [];
  public queue: Array<{
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
  }> = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Doctor Accounts
    this.doctors = [
      {
        id: 'doc-1',
        doctorId: 'DOC-AIIMS-409',
        name: 'Dr. Rajesh Sharma, MD (Medicine)',
        specialization: 'Internal Medicine & Integrative Health',
        department: 'General OPD Room 04',
        email: 'dr.sharma@hospital.gov.in',
        role: 'DOCTOR',
        tokenCountToday: 24,
      },
      {
        id: 'doc-2',
        doctorId: 'DOC-AYUSH-102',
        name: 'Vaidya Ananya Bhattacharya, BAMS, MD (Ayurveda)',
        specialization: 'Ayurvedic Kayachikitsa & Panchakarma',
        department: 'AYUSH Integrative Wing',
        email: 'vaidya.ananya@hospital.gov.in',
        role: 'DOCTOR',
        tokenCountToday: 18,
      },
    ];

    // Seed Patient 1: Smt. Shanti Devi (Elderly, Chronic Hypertension & Diabetes, Joint Pain)
    const p1: Patient = {
      id: 'pat-101',
      patientCode: 'SV-2026-1081',
      name: 'Smt. Shanti Devi',
      age: 64,
      dateOfBirth: '1962-04-12',
      gender: 'FEMALE',
      mobile: '9876543210',
      abhaId: '91-4589-2041-8930',
      preferredLanguage: 'hi',
      address: 'Ward 4, Govindpur, Varanasi (UP)',
      isExistingPatient: true,
      createdAt: '2025-11-10T09:00:00.000Z',
      updatedAt: '2026-08-20T10:00:00.000Z',
    };
    this.patients.set(p1.id, p1);

    // Patient 1 Past History & Timeline
    this.clinicalHistories.set('visit-prev-101', {
      chiefComplaints: [
        {
          id: 'c1',
          symptom: 'Knee Joint Pain',
          symptomHindi: 'घुटनों में दर्द (जानुशूल)',
          duration: '3',
          durationUnit: 'months',
          severity: 'moderate',
        },
      ],
      hpi: '64-year-old female known diabetic and hypertensive presents with persistent bilateral knee osteoarthritic stiffness and morning ache.',
      pastMedicalHistory: {
        diabetes: true,
        hypertension: true,
        asthma: false,
        heartDisease: false,
        thyroid: false,
        kidneyDisease: false,
        tuberculosis: false,
        otherConditions: ['Osteoarthritis'],
        details: 'Type 2 Diabetes for 8 years, Hypertension for 5 years on regular oral medications.',
      },
      pastSurgicalHistory: {
        hadSurgery: true,
        surgeries: [{ name: 'Cataract Surgery (Left Eye)', year: '2023' }],
      },
      currentMedications: [
        { name: 'Tab Metformin 500mg', dosage: '500mg', frequency: '1-0-1', isAyurvedic: false, source: 'doctor_prescribed' },
        { name: 'Tab Telmisartan 40mg', dosage: '40mg', frequency: '1-0-0', isAyurvedic: false, source: 'doctor_prescribed' },
        { name: 'Yograj Guggulu', dosage: '2 tablets', frequency: '1-0-1', isAyurvedic: true, source: 'patient_reported' },
      ],
      allergyHistory: {
        hasAllergies: true,
        allergies: ['Penicillin', 'Sulfa drugs'],
        details: 'Mild skin rash experienced with Penicillin injection in 2018.',
      },
      familyHistory: {
        diabetes: true,
        hypertension: true,
        heartDisease: false,
        cancer: false,
        details: 'Mother had diabetes and hypertension.',
      },
      personalHistory: {
        smoking: false,
        alcohol: false,
        tobacco: false,
        diet: 'vegetarian',
        sleepQuality: 'disturbed',
        appetite: 'normal',
        bowelHabit: 'constipated',
      },
      ayushHistory: {
        prakritiSelfReported: 'Vata-Kapha',
        agniType: 'Manda (Sluggish)',
        previousAyushTreatment: 'Taking warm sesame oil massage (Abhyanga) for knees.',
      },
      reviewOfSystems: {
        fever: false,
        chestPain: false,
        breathlessness: false,
        dizziness: false,
        vomiting: false,
        unexplainedWeightLoss: false,
        jointPain: true,
        skinRash: false,
      },
      previousHistoryReused: true,
      patientConfirmed: true,
      verifiedAt: '2026-08-27T08:30:00.000Z',
    });

    // Timeline for Patient 1
    this.timelines.set(p1.id, [
      {
        id: 'tl-1',
        patientId: p1.id,
        date: '2026-06-15',
        eventType: 'CONSULTATION',
        title: 'OPD Follow-up Consultation',
        description: 'Fasting Blood Sugar 132 mg/dL. BP 138/84 mmHg. Advice given for dietary moderation & Yograj Guggulu.',
        doctorName: 'Dr. Rajesh Sharma',
        department: 'General Medicine',
      },
      {
        id: 'tl-2',
        patientId: p1.id,
        date: '2026-06-15',
        eventType: 'PRESCRIPTION',
        title: 'Prescription Issued',
        description: 'Metformin 500mg (1-0-1), Telmisartan 40mg (1-0-0), Shallaki 500mg for joint support.',
        doctorName: 'Dr. Rajesh Sharma',
      },
      {
        id: 'tl-3',
        patientId: p1.id,
        date: '2026-06-12',
        eventType: 'LAB_REPORT',
        title: 'HbA1c & Lipid Profile',
        description: 'HbA1c: 7.1%, Fasting Blood Glucose: 138 mg/dL, Serum Creatinine: 0.9 mg/dL (Normal).',
      },
      {
        id: 'tl-4',
        patientId: p1.id,
        date: '2026-03-10',
        eventType: 'DOCUMENT_UPLOAD',
        title: 'Digitized Past OPD Slip (OCR)',
        description: 'Previous district hospital prescription extracted with 96% OCR confidence.',
      },
    ]);

    // Seed Patient 2: Shri Ramesh Kumar (Acute Chest Discomfort + Breathlessness - Triage Red Flag)
    const p2: Patient = {
      id: 'pat-102',
      patientCode: 'SV-2026-1082',
      name: 'Shri Ramesh Kumar',
      age: 52,
      dateOfBirth: '1974-08-19',
      gender: 'MALE',
      mobile: '9123456780',
      preferredLanguage: 'hi',
      address: 'Railway Colony, Mughalsarai',
      isExistingPatient: false,
      createdAt: '2026-08-27T08:15:00.000Z',
      updatedAt: '2026-08-27T08:15:00.000Z',
    };
    this.patients.set(p2.id, p2);

    this.clinicalHistories.set('visit-102', {
      chiefComplaints: [
        {
          id: 'c2_1',
          symptom: 'Chest Discomfort with Heaviness',
          symptomHindi: 'सीने में भारीपन व बेचैनी',
          duration: '2',
          durationUnit: 'hours',
          severity: 'severe',
          bodyLocation: 'Retrosternal / Left chest',
        },
        {
          id: 'c2_2',
          symptom: 'Breathlessness on walking',
          symptomHindi: 'सांस फूलना व पसीना आना',
          duration: '2',
          durationUnit: 'hours',
          severity: 'severe',
        },
      ],
      hpi: '52-year-old male with sudden onset retrosternal heaviness radiating to left shoulder accompanied by diaphoresis and acute shortness of breath.',
      pastMedicalHistory: {
        diabetes: false,
        hypertension: true,
        asthma: false,
        heartDisease: false,
        thyroid: false,
        kidneyDisease: false,
        tuberculosis: false,
        otherConditions: ['Smoking history 15 pack-years'],
        details: 'Irregular medication adherence.',
      },
      pastSurgicalHistory: { hadSurgery: false, surgeries: [] },
      currentMedications: [{ name: 'Tab Amlodipine 5mg', dosage: '5mg', frequency: '1-0-0', source: 'patient_reported' }],
      allergyHistory: { hasAllergies: false, allergies: [], details: 'NKDA (No known drug allergies)' },
      familyHistory: { diabetes: false, hypertension: true, heartDisease: true, cancer: false, details: 'Father had CAD.' },
      personalHistory: {
        smoking: true,
        alcohol: false,
        tobacco: true,
        diet: 'non_vegetarian',
        sleepQuality: 'disturbed',
        appetite: 'reduced',
        bowelHabit: 'regular',
      },
      reviewOfSystems: {
        fever: false,
        chestPain: true,
        breathlessness: true,
        dizziness: true,
        vomiting: false,
        unexplainedWeightLoss: false,
        jointPain: false,
        skinRash: false,
      },
      previousHistoryReused: false,
      patientConfirmed: true,
      verifiedAt: '2026-08-27T08:20:00.000Z',
    });

    // Triage alert for Patient 2
    this.triageAlerts.set('visit-102', [
      {
        id: 'triage-102',
        patientId: p2.id,
        visitId: 'visit-102',
        tokenNumber: '#OPD-101',
        severity: 'HIGH',
        ruleCode: 'CARDIO_RESP_RED_FLAG_01',
        message: 'Potential acute cardiac/respiratory emergency reported (Chest Pain + Breathlessness + Diaphoresis). Immediate ECG and physician assessment advised.',
        messageHindi: 'सावधानी: सीने में भारीपन व सांस फूलने के गंभीर लक्षण पाए गए हैं। तुरंत ईसीजी व डॉक्टर द्वारा जांच आवश्यक है।',
        triggerFactors: ['Chest Pain = true', 'Breathlessness = true', 'Severity = severe'],
        createdAt: '2026-08-27T08:21:00.000Z',
      },
    ]);

    // Initial Queue items
    this.queue = [
      {
        tokenNumber: '#OPD-101',
        visitId: 'visit-102',
        patientId: p2.id,
        patientName: p2.name,
        age: p2.age,
        gender: p2.gender,
        chiefComplaint: 'Chest Discomfort + Shortness of breath (TRIAGE HIGH)',
        severity: 'HIGH',
        status: 'READY',
        arrivalTime: '08:20 AM',
      },
      {
        tokenNumber: '#OPD-102',
        visitId: 'visit-101',
        patientId: p1.id,
        patientName: p1.name,
        age: p1.age,
        gender: p1.gender,
        chiefComplaint: 'Chronic Knee Joint Stiffness + Routine Sugar Review',
        severity: 'NORMAL',
        status: 'WAITING',
        arrivalTime: '08:35 AM',
      },
    ];

    // Seed a finalized consultation record for Patient 1 (Smt. Shanti Devi)
    this.consultations.set('visit-prev-101', {
      id: 'cons-prev-101',
      visitId: 'visit-prev-101',
      patientId: p1.id,
      doctorId: 'DOC-AIIMS-409',
      doctorName: 'Dr. Rajesh Sharma, MD (Medicine)',
      department: 'General OPD Room 04',
      consultationDate: '2026-08-20T10:30:00.000Z',
      symptomsSummary: 'Bilateral Knee Osteoarthritic pain with morning stiffness and type-2 diabetes mellitus.',
      provisionalDiagnosis: 'Bilateral Knee Osteoarthritis (Janu Sandhigata Vata) + Controlled T2DM',
      finalDiagnosis: 'Bilateral Knee Osteoarthritis with Type 2 Diabetes Mellitus & Essential Hypertension',
      icdCode: 'M17.0 / E11.9',
      systemicExamination: 'BP: 134/82 mmHg, Pulse: 76/min, Knee Joint: Mild crepitus, no acute effusion, Range of Motion preserved.',
      ayushAssessment: {
        doshaImbalance: {
          vata: 'Aggravated',
          pitta: 'Normal',
          kapha: 'Mild Aggravation',
        },
        nadiParikshaNotes: 'Vata-Kapha Mandagati nadi, Janu Sandhigata Vata lakshana.',
        dhatuInvolved: ['Asthi', 'Majja', 'Medas'],
        pathyaAdvice: [
          'Warm freshly cooked light food with cow ghee',
          'Regular gentle quadriceps exercises and morning sun exposure (Vitamin D)',
          'Drink warm water throughout the day',
        ],
        apathyaAdvice: [
          'Avoid cold, dry, stale and refrigerated foods',
          'Avoid excessive sour, fermented curd, and refined sugar',
          'Avoid prolonged sitting on floor or squatting',
        ],
      },
      prescriptions: [
        {
          id: 'rx-1',
          medicineName: 'Yograj Guggulu',
          form: 'Tablet',
          system: 'AYURVEDA',
          dosage: '2 Tablets (500mg)',
          frequency: '1-0-1',
          timing: 'AFTER_FOOD',
          duration: '30 Days',
          instructions: 'Take with warm water after breakfast and dinner.',
        },
        {
          id: 'rx-2',
          medicineName: 'Shallaki (Boswellia serrata) 500mg',
          form: 'Capsule',
          system: 'AYURVEDA',
          dosage: '1 Capsule',
          frequency: '1-0-1',
          timing: 'AFTER_FOOD',
          duration: '30 Days',
          instructions: 'For cartilage preservation and inflammation relief.',
        },
        {
          id: 'rx-3',
          medicineName: 'Tab Metformin 500mg (Sustained Release)',
          form: 'Tablet',
          system: 'ALLOPATHY',
          dosage: '500mg',
          frequency: '1-0-1',
          timing: 'AFTER_FOOD',
          duration: '30 Days',
          instructions: 'Continue regular diabetic oral medication.',
        },
        {
          id: 'rx-4',
          medicineName: 'Tab Telmisartan 40mg',
          form: 'Tablet',
          system: 'ALLOPATHY',
          dosage: '40mg',
          frequency: '1-0-0',
          timing: 'BEFORE_FOOD',
          duration: '30 Days',
          instructions: 'Morning after waking up with water.',
        },
      ],
      investigations: [
        {
          id: 'inv-1',
          testName: 'Fasting Blood Glucose & HbA1c',
          category: 'BIOCHEMISTRY',
          urgency: 'ROUTINE',
          instructions: '10-12 hours overnight fasting required.',
        },
        {
          id: 'inv-2',
          testName: 'Digital X-Ray Both Knees (AP & Lateral Standing)',
          category: 'RADIOLOGY',
          urgency: 'ROUTINE',
          instructions: 'Evaluate joint space narrowing.',
        },
      ],
      generalAdvice: 'Maintain healthy glycemic control. Avoid high impact knee stress. Continue prescribed Ayush joint regimen.',
      followUpDays: 15,
      followUpDate: '04 Sep 2026',
      isEmergencyReferral: false,
      status: 'FINALIZED',
      finalizedAt: '2026-08-20T10:45:00.000Z',
    });

    // Seed Staff Assistance Requests
    this.assistanceRequests = [
      {
        id: 'req-01',
        kioskId: 'Kiosk #02 (Main Hall)',
        patientName: 'Elderly Visitor (Shanti Devi)',
        tokenNumber: '#OPD-102',
        language: 'hi',
        reason: 'Patient requested slow audio playback and help scanning old district hospital prescription.',
        status: 'RESOLVED',
        createdAt: '2026-08-27T08:32:00.000Z',
        resolvedAt: '2026-08-27T08:34:00.000Z',
        resolvedBy: 'Sister Sunita (OPD Attendant)',
      },
    ];
  }
}

export const db = new InMemoryHospitalDatabase();
