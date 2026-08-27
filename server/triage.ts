import { ClinicalHistoryData, TriageAlert, TriageSeverity } from '../src/types';

export interface TriageRule {
  ruleCode: string;
  name: string;
  severity: TriageSeverity;
  evaluate: (history: ClinicalHistoryData) => {
    isTriggered: boolean;
    factors: string[];
    message: string;
    messageHindi: string;
  };
}

export const TRIAGE_RULES: TriageRule[] = [
  {
    ruleCode: 'CARDIO_RESP_RED_FLAG_01',
    name: 'Acute Cardiopulmonary Discomfort',
    severity: 'HIGH',
    evaluate: (history) => {
      const hasChestPain =
        history.chiefComplaints.some(
          (c) =>
            c.symptom.toLowerCase().includes('chest') ||
            c.symptom.toLowerCase().includes('heart') ||
            c.symptomHindi.includes('सीना')
        ) || history.reviewOfSystems?.chestPain;

      const hasBreathlessness =
        history.chiefComplaints.some(
          (c) =>
            c.symptom.toLowerCase().includes('breath') ||
            c.symptom.toLowerCase().includes('suffocation') ||
            c.symptomHindi.includes('सांस')
        ) || history.reviewOfSystems?.breathlessness;

      if (hasChestPain && hasBreathlessness) {
        return {
          isTriggered: true,
          factors: ['Chest pain reported', 'Breathlessness reported', 'High priority symptom cluster'],
          message:
            'Potential acute cardiopulmonary emergency symptoms reported (Chest Pain + Breathlessness). Immediate ECG and physician assessment recommended.',
          messageHindi:
            'सावधानी: सीने में भारीपन व सांस फूलने के गंभीर लक्षण पाए गए हैं। तुरंत आपातकालीन डॉक्टर व ईसीजी जांच की सिफारिश की जाती है।',
        };
      }

      if (hasChestPain) {
        return {
          isTriggered: true,
          factors: ['Chest discomfort reported'],
          message: 'Chest discomfort reported. Priority OPD triage recommended.',
          messageHindi: 'सीने में दर्द या भारीपन दर्ज किया गया है। प्राथमिकता के आधार पर जांच आवश्यक है।',
        };
      }

      return { isTriggered: false, factors: [], message: '', messageHindi: '' };
    },
  },
  {
    ruleCode: 'HIGH_FEVER_RESP_02',
    name: 'Acute Respiratory Distress with Fever',
    severity: 'MEDIUM',
    evaluate: (history) => {
      const hasFever =
        history.chiefComplaints.some(
          (c) =>
            c.symptom.toLowerCase().includes('fever') ||
            c.symptomHindi.includes('बुखार')
        ) || history.reviewOfSystems?.fever;

      const hasBreathlessness =
        history.chiefComplaints.some((c) =>
          c.symptom.toLowerCase().includes('breath') || c.symptomHindi.includes('सांस')
        ) || history.reviewOfSystems?.breathlessness;

      if (hasFever && hasBreathlessness) {
        return {
          isTriggered: true,
          factors: ['Fever reported', 'Breathlessness reported'],
          message:
            'Fever with respiratory symptoms noted. Pulse oximetry (SpO2) and priority respiratory assessment recommended.',
          messageHindi:
            'बुखार के साथ सांस में तकलीफ नोट की गई है। ऑक्सीजन स्तर (SpO2) और डॉक्टर द्वारा जांच आवश्यक है।',
        };
      }

      return { isTriggered: false, factors: [], message: '', messageHindi: '' };
    },
  },
  {
    ruleCode: 'ALLERGY_ALERT_03',
    name: 'High-Risk Drug Allergy Alert',
    severity: 'MEDIUM',
    evaluate: (history) => {
      if (history.allergyHistory?.hasAllergies && history.allergyHistory.allergies.length > 0) {
        return {
          isTriggered: true,
          factors: [`Known allergies: ${history.allergyHistory.allergies.join(', ')}`],
          message: `Drug/Substance Allergy Alert: Patient reports allergy to ${history.allergyHistory.allergies.join(', ')}. Verify cross-reactivity before prescribing.`,
          messageHindi: `दवा एलर्जी चेतावनी: मरीज़ को ${history.allergyHistory.allergies.join(', ')} से एलर्जी है। दवा लिखने से पहले जांचें।`,
        };
      }
      return { isTriggered: false, factors: [], message: '', messageHindi: '' };
    },
  },
];

export function evaluateTriage(
  patientId: string,
  visitId: string,
  tokenNumber: string,
  history: ClinicalHistoryData
): TriageAlert[] {
  const alerts: TriageAlert[] = [];

  for (const rule of TRIAGE_RULES) {
    const result = rule.evaluate(history);
    if (result.isTriggered) {
      alerts.push({
        id: `triage-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        patientId,
        visitId,
        tokenNumber,
        severity: rule.severity,
        ruleCode: rule.ruleCode,
        message: result.message,
        messageHindi: result.messageHindi,
        triggerFactors: result.factors,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return alerts;
}
