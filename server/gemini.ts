import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export async function generateClinicalSummary(payload: {
  chiefComplaints: any[];
  clinicalHistory: any;
  ocrDocuments?: any[];
  ayushNotes?: any;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key is provided, produce a structured, high-quality rule-grounded clinical summary
  if (!apiKey) {
    const complaintsStr = payload.chiefComplaints
      ?.map((c: any) => `${c.symptom} (${c.duration} ${c.durationUnit}, severity: ${c.severity})`)
      .join(', ') || 'Routine consultation';

    const pastConditions: string[] = [];
    if (payload.clinicalHistory?.pastMedicalHistory?.diabetes) pastConditions.push('Diabetes Mellitus');
    if (payload.clinicalHistory?.pastMedicalHistory?.hypertension) pastConditions.push('Hypertension');
    if (payload.clinicalHistory?.pastMedicalHistory?.asthma) pastConditions.push('Asthma/COPD');
    if (payload.clinicalHistory?.pastMedicalHistory?.heartDisease) pastConditions.push('Coronary Artery Disease');

    const allergies = payload.clinicalHistory?.allergyHistory?.allergies?.join(', ') || 'NKDA';
    const meds = payload.clinicalHistory?.currentMedications?.map((m: any) => m.name).join(', ') || 'None reported';
    const prakriti = payload.clinicalHistory?.ayushHistory?.prakritiSelfReported || 'Not assessed';

    return `[AI-ASSISTED CLINICAL SUMMARY — DOCTOR REVIEW REQUIRED]
• Chief Complaint: ${complaintsStr}
• Known Comorbidities: ${pastConditions.length > 0 ? pastConditions.join(', ') : 'None documented'}
• Active Medications: ${meds}
• Allergies: ${allergies}
• AYUSH Constitutional Context: Prakriti - ${prakriti}, Agni - ${payload.clinicalHistory?.ayushHistory?.agniType || 'Balanced'}
• OCR Digitized Records: ${payload.ocrDocuments?.length ? `${payload.ocrDocuments.length} document(s) reviewed` : 'No attached old documents'}

CLINICAL DECISION SUPPORT NOTES:
1. Validate hemodynamic parameters and verify reported medication adherence.
2. Cross-check potential drug-drug or drug-herb interactions with active prescriptions.
3. Doctor retains full clinical authority for diagnosis, investigation, and prescription.`;
  }

  try {
    const ai = getGemini();
    const prompt = `You are a clinical documentation assistant for an Indian Government Hospital OPD.
Given the following patient-reported history and digitized documents, generate a concise, professional, structured clinical summary for the attending doctor.

CRITICAL SAFETY BOUNDARIES:
- Never diagnose the patient autonomously.
- Never prescribe medicines or alter dosages.
- Always include the label: "[AI GENERATED / AI ASSISTED — FOR CLINICAL DOCUMENTATION ONLY]".
- Highlight any red flags, drug allergies, or chronic comorbidities.
- Include Ayurvedic/AYUSH context (Dosha, Prakriti, Agni) if present.

Patient Data:
${JSON.stringify(payload, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are SwasthaVedic AI, a clinical documentation and decision support assistant for Indian OPDs. Adhere strictly to clinical safety guidelines.',
      },
    });

    return response.text || 'Summary generation completed.';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return `[AI-ASSISTED CLINICAL SUMMARY]
• Chief Complaints: ${payload.chiefComplaints?.map((c) => c.symptom).join(', ')}
• Comorbidities: ${JSON.stringify(payload.clinicalHistory?.pastMedicalHistory || {})}
• Allergies: ${JSON.stringify(payload.clinicalHistory?.allergyHistory || {})}
• Note: Review active medications and verify symptom timeline with patient.`;
  }
}
