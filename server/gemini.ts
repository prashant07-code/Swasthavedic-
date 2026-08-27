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

function buildDeterministicSummary(payload: {
  chiefComplaints?: any[];
  clinicalHistory?: any;
  ocrDocuments?: any[];
  ayushNotes?: any;
}): string {
  const complaintsStr =
    payload.chiefComplaints
      ?.map(
        (c: any) =>
          `${c.symptom || c.symptomHindi || 'Symptom'} (${c.duration || '1'} ${c.durationUnit || 'days'}, severity: ${c.severity || 'mild'})`
      )
      .join(', ') || 'General OPD Health Review';

  const pastConditions: string[] = [];
  if (payload.clinicalHistory?.pastMedicalHistory?.diabetes) pastConditions.push('Diabetes Mellitus (Type 2)');
  if (payload.clinicalHistory?.pastMedicalHistory?.hypertension) pastConditions.push('Essential Hypertension');
  if (payload.clinicalHistory?.pastMedicalHistory?.asthma) pastConditions.push('Asthma / Chronic Bronchitis');
  if (payload.clinicalHistory?.pastMedicalHistory?.heartDisease) pastConditions.push('Coronary Artery Disease');

  const allergies =
    payload.clinicalHistory?.allergyHistory?.allergies &&
    payload.clinicalHistory.allergyHistory.allergies.length > 0
      ? payload.clinicalHistory.allergyHistory.allergies.join(', ')
      : 'NKDA (No Known Drug Allergies)';

  const meds =
    payload.clinicalHistory?.currentMedications &&
    payload.clinicalHistory.currentMedications.length > 0
      ? payload.clinicalHistory.currentMedications.map((m: any) => m.name).join(', ')
      : 'None reported';

  const prakriti = payload.clinicalHistory?.ayushHistory?.prakritiSelfReported || 'Vata-Pitta (Mixed)';
  const agni = payload.clinicalHistory?.ayushHistory?.agniType || 'Sama Agni (Balanced)';
  const koshtha = payload.clinicalHistory?.ayushHistory?.koshthaType || 'Madhyama';

  const docCount = payload.ocrDocuments?.length || 0;

  return `[AI-ASSISTED CLINICAL SUMMARY — DOCTOR REVIEW REQUIRED]
• Chief Complaints: ${complaintsStr}
• Documented Comorbidities: ${pastConditions.length > 0 ? pastConditions.join(', ') : 'None documented'}
• Active Medications: ${meds}
• Known Allergies: ${allergies}
• AYUSH Constitution: Prakriti: ${prakriti} | Agni: ${agni} | Koshtha: ${koshtha}
• Digitized Records: ${docCount > 0 ? `${docCount} previous record(s) processed by OCR` : 'No attached past documents'}

CLINICAL DECISION SUPPORT & SAFETY NOTES:
1. Verify vital signs (BP, Pulse, SpO2, Temperature) and examine primary symptom sites.
2. Cross-verify potential drug-drug or drug-herb interactions with active formulations.
3. Attending doctor holds sole clinical authority for diagnostic decisions and official prescriptions.`;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateClinicalSummary(payload: {
  chiefComplaints?: any[];
  clinicalHistory?: any;
  ocrDocuments?: any[];
  ayushNotes?: any;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key is provided, produce a structured, high-quality rule-grounded clinical summary
  if (!apiKey || apiKey.trim() === '') {
    return buildDeterministicSummary(payload);
  }

  const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest'];

  const prompt = `You are a clinical documentation assistant for an Indian Government Hospital OPD.
Given the following patient-reported history and digitized documents, generate a concise, professional, structured clinical summary for the attending doctor.

CRITICAL SAFETY BOUNDARIES:
- Never diagnose the patient autonomously.
- Never prescribe medicines or alter dosages.
- Always include the label: "[AI-ASSISTED CLINICAL SUMMARY — DOCTOR REVIEW REQUIRED]".
- Highlight any red flags, drug allergies, or chronic comorbidities.
- Include Ayurvedic/AYUSH context (Dosha, Prakriti, Agni) if present.

Patient Data:
${JSON.stringify(payload, null, 2)}
`;

  for (const modelName of modelsToTry) {
    try {
      const ai = getGemini();

      // Guard with a 4-second timeout per attempt
      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            'You are SwasthaVedic AI, a clinical documentation and decision support assistant for Indian OPDs. Adhere strictly to clinical safety guidelines.',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out')), 4000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (response?.text && response.text.trim().length > 0) {
        return response.text.trim();
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.warn(
        `Gemini attempt for model ${modelName} encountered: ${errorMessage.substring(0, 120)}`
      );
      // Brief pause before trying fallback model
      await delay(200);
    }
  }

  // Graceful fallback to deterministic clinical synthesis if all Gemini API attempts are unavailable or timeout
  return buildDeterministicSummary(payload);
}
