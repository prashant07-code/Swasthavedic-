import { MedicalDocument, ExtractedEntity } from '../src/types';

export interface OCRProcessorAdapter {
  name: string;
  process(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{
    rawText: string;
    entities: ExtractedEntity[];
    overallConfidence: number;
  }>;
}

/**
 * MockOCRService with realistic clinical NLP parser for Indian OPD prescriptions and lab reports
 */
export class MockOCRProcessorAdapter implements OCRProcessorAdapter {
  name = 'mock_engine';

  async process(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const isLabReport = fileName.toLowerCase().includes('lab') || fileName.toLowerCase().includes('report') || fileName.toLowerCase().includes('blood');
    const isAyurvedicDoc = fileName.toLowerCase().includes('ayush') || fileName.toLowerCase().includes('ayur') || fileName.toLowerCase().includes('churna');

    const sourceDocId = `doc-ocr-${Date.now()}`;
    const entities: ExtractedEntity[] = [];

    if (isLabReport) {
      entities.push(
        {
          id: `ent-1`,
          category: 'LAB_TEST',
          fieldName: 'Fasting Blood Glucose',
          value: '142 mg/dL (Ref: 70-100 mg/dL - High)',
          confidence: 0.96,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-2`,
          category: 'LAB_TEST',
          fieldName: 'HbA1c (Glycated Hemoglobin)',
          value: '7.4% (Sub-optimal control)',
          confidence: 0.94,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-3`,
          category: 'LAB_TEST',
          fieldName: 'Serum Creatinine',
          value: '0.95 mg/dL (Ref: 0.6-1.2 mg/dL)',
          confidence: 0.98,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-4`,
          category: 'DATE',
          fieldName: 'Sample Collection Date',
          value: '14-Aug-2026',
          confidence: 0.91,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        }
      );

      return {
        rawText: `DISTRICT HOSPITAL CENTRAL DIAGNOSTIC LAB
PATIENT NAME: CONFIRMED BY OPD
TEST REPORT:
- Fasting Blood Sugar: 142 mg/dL
- HbA1c: 7.4%
- Serum Creatinine: 0.95 mg/dL
- Total Cholesterol: 198 mg/dL
Verified by Lab Incharge / Pathologist`,
        entities,
        overallConfidence: 0.95,
      };
    } else if (isAyurvedicDoc) {
      entities.push(
        {
          id: `ent-1`,
          category: 'DIAGNOSIS',
          fieldName: 'Ayurvedic Diagnosis',
          value: 'Sandhivata (Osteoarthritis) & Amlapitta',
          confidence: 0.92,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-2`,
          category: 'MEDICINE',
          fieldName: 'Ayurvedic Formulation',
          value: 'Yograj Guggulu - 2 tabs twice daily with warm water',
          confidence: 0.89,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-3`,
          category: 'MEDICINE',
          fieldName: 'Decoction / Kwath',
          value: 'Maharasnadi Kwath 20ml with equal water after food',
          confidence: 0.78,
          needsVerification: true, // Needs verification due to lower handwriting clarity
          sourceDocumentId: sourceDocId,
        }
      );

      return {
        rawText: `AYUSH DISPENSARY OPD PRESCRIPTION
CLINICAL FINDING: Sandhivata (Joint Stiffness), Vata Prakop
Rx:
1. Yograj Guggulu 2 tab BD
2. Maharasnadi Kwath 20ml BD
3. Mahanarayan Taila local application
Pathya: Avoid heavy stale food, take warm freshly cooked meals`,
        entities,
        overallConfidence: 0.88,
      };
    } else {
      // Default standard OPD Prescription slip
      entities.push(
        {
          id: `ent-1`,
          category: 'DIAGNOSIS',
          fieldName: 'Clinical Assessment',
          value: 'Type 2 Diabetes Mellitus with Essential Hypertension',
          confidence: 0.95,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-2`,
          category: 'MEDICINE',
          fieldName: 'Antidiabetic Medicine',
          value: 'Tab. Metformin 500 mg - 1 Tab twice daily after food',
          confidence: 0.96,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-3`,
          category: 'MEDICINE',
          fieldName: 'Antihypertensive Medicine',
          value: 'Tab. Telmisartan 40 mg - 1 Tab morning after breakfast',
          confidence: 0.92,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-4`,
          category: 'VITALS',
          fieldName: 'Recorded Blood Pressure',
          value: '136/86 mmHg',
          confidence: 0.87,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        },
        {
          id: `ent-5`,
          category: 'DATE',
          fieldName: 'Prescription Date',
          value: '12-Jul-2026',
          confidence: 0.91,
          needsVerification: false,
          sourceDocumentId: sourceDocId,
        }
      );

      return {
        rawText: `GOVT. DISTRICT CIVIL HOSPITAL — OPD SLIP
DEPARTMENT OF GENERAL MEDICINE
Rx:
1. Tab. Metformin 500mg (1-0-1) x 30 days
2. Tab. Telmisartan 40mg (1-0-0) x 30 days
3. Dietary counseling: Low salt, low glycemic index.
Follow-up in 1 month with Fasting Blood Sugar.`,
        entities,
        overallConfidence: 0.93,
      };
    }
  }
}

export class OCRService {
  private adapter: OCRProcessorAdapter;

  constructor(adapter?: OCRProcessorAdapter) {
    this.adapter = adapter || new MockOCRProcessorAdapter();
  }

  setAdapter(newAdapter: OCRProcessorAdapter) {
    this.adapter = newAdapter;
  }

  async extractDocument(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    patientId: string,
    visitId: string
  ): Promise<MedicalDocument> {
    const { rawText, entities, overallConfidence } = await this.adapter.process(
      fileBuffer,
      fileName,
      mimeType
    );

    const doc: MedicalDocument = {
      id: `doc-${Date.now()}`,
      patientId,
      visitId,
      title: fileName || 'Uploaded Medical Document',
      fileName,
      fileType: mimeType as any,
      fileSize: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
      extractedText: rawText,
      entities,
      ocrConfidence: overallConfidence,
      ocrProvider: this.adapter.name as any,
    };

    return doc;
  }
}

export const ocrService = new OCRService();
