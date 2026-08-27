export interface SymptomTile {
  id: string;
  name: string;
  nameHindi: string;
  category: 'GENERAL' | 'RESPIRATORY' | 'CARDIO' | 'GI' | 'MUSCULOSKELETAL' | 'AYUSH' | 'DERM';
  icon: string;
  isRedFlag: boolean;
  commonQuestions: string[];
}

export const COMMON_SYMPTOMS: SymptomTile[] = [
  {
    id: 'fever',
    name: 'Fever / Chills',
    nameHindi: 'बुखार / ठंड लगना (Jwar)',
    category: 'GENERAL',
    icon: 'Thermometer',
    isRedFlag: false,
    commonQuestions: ['कितने दिन से बुखार है?', 'क्या ठंड लगकर बुखार आता है?'],
  },
  {
    id: 'chest_pain',
    name: 'Chest Pain / Pressure',
    nameHindi: 'सीने में दर्द / भारीपन (Hridshoola)',
    category: 'CARDIO',
    icon: 'HeartPulse',
    isRedFlag: true,
    commonQuestions: ['क्या दर्द बाएं हाथ या जबड़े की तरफ जाता है?', 'क्या पसीना आ रहा है?'],
  },
  {
    id: 'breathlessness',
    name: 'Breathlessness / Wheezing',
    nameHindi: 'सांस फूलना / सांस लेने में तकलीफ (Shwasa)',
    category: 'RESPIRATORY',
    icon: 'Wind',
    isRedFlag: true,
    commonQuestions: ['क्या लेटने पर सांस ज्यादा फूलती है?', 'क्या पहले से दमा या अस्थमा है?'],
  },
  {
    id: 'cough_cold',
    name: 'Cough / Sore Throat',
    nameHindi: 'खांसी / गले में खराश (Kasa)',
    category: 'RESPIRATORY',
    icon: 'Activity',
    isRedFlag: false,
    commonQuestions: ['क्या सूखी खांसी है या बलगम आ रहा है?', 'क्या बलगम में खून आया है?'],
  },
  {
    id: 'abdominal_pain',
    name: 'Stomach Pain / Acidity',
    nameHindi: 'पेट दर्द / गैस / जलन (Udarshoola/Amlapitta)',
    category: 'GI',
    icon: 'Flame',
    isRedFlag: false,
    commonQuestions: ['दर्द पेट के किस हिस्से में है?', 'क्या खाना खाने के बाद दर्द बढ़ता है?'],
  },
  {
    id: 'joint_pain',
    name: 'Joint Pain / Stiffness',
    nameHindi: 'जोड़ों व घुटनों में दर्द (Sandhivata)',
    category: 'MUSCULOSKELETAL',
    icon: 'Bone',
    isRedFlag: false,
    commonQuestions: ['क्या सुबह उठने पर जोड़ों में जकड़न रहती है?', 'क्या सूजन है?'],
  },
  {
    id: 'dizziness_weakness',
    name: 'Dizziness / Extreme Weakness',
    nameHindi: 'चक्कर आना / अत्यधिक कमजोरी (Bhrama/Dourbalya)',
    category: 'GENERAL',
    icon: 'ZapOff',
    isRedFlag: false,
    commonQuestions: ['क्या खड़े होने पर चक्कर आते हैं?', 'क्या आंखों के आगे अंधेरा छा जाता है?'],
  },
  {
    id: 'skin_rash',
    name: 'Skin Rash / Itching',
    nameHindi: 'त्वचा में खुजली / दाने (Kandu/Kushtha)',
    category: 'DERM',
    icon: 'Sparkles',
    isRedFlag: false,
    commonQuestions: ['क्या कोई नई दवा लेने के बाद दाने निकले?', 'क्या खुजली रात में ज्यादा होती है?'],
  },
  {
    id: 'ayush_digestion',
    name: 'Indigestion / Sluggish Agni',
    nameHindi: 'कब्ज / भूख न लगना / भारीपन (Ajeerna/Mandaagni)',
    category: 'AYUSH',
    icon: 'Leaf',
    isRedFlag: false,
    commonQuestions: ['क्या पेट हमेशा फूला हुआ महसूस होता है?', 'मल त्याग साफ होता है या नहीं?'],
  },
  {
    id: 'diabetes_hypertension_routine',
    name: 'Blood Sugar / BP Checkup',
    nameHindi: 'शुगर / बीपी की नियमित जांच (Madhumeha/Raktachapa)',
    category: 'GENERAL',
    icon: 'FileCheck',
    isRedFlag: false,
    commonQuestions: ['क्या नियमित दवा ले रहे हैं?', 'क्या पेशाब बार-बार आता है?'],
  },
];

export interface ClinicalQuestion {
  id: string;
  category: string;
  promptHindi: string;
  promptEnglish: string;
  type: 'boolean' | 'multiple_choice' | 'text' | 'voice_prompt';
  options?: Array<{ value: string; labelHindi: string; labelEnglish: string }>;
}

export const QUESTION_BANK: ClinicalQuestion[] = [
  {
    id: 'past_diabetes',
    category: 'Past Medical History',
    promptHindi: 'क्या आपको पहले से शुगर (डायबिटीज) की बीमारी है?',
    promptEnglish: 'Do you have a pre-existing history of Diabetes Mellitus?',
    type: 'boolean',
  },
  {
    id: 'past_hypertension',
    category: 'Past Medical History',
    promptHindi: 'क्या आपको हाई ब्लड प्रेशर (उच्च रक्तचाप) है?',
    promptEnglish: 'Do you have Hypertension (High Blood Pressure)?',
    type: 'boolean',
  },
  {
    id: 'past_allergies',
    category: 'Allergies',
    promptHindi: 'क्या आपको किसी दवा (जैसे पेनिसिलिन, सल्फा) या खाद्य पदार्थ से एलर्जी है?',
    promptEnglish: 'Do you have any drug or food allergies (e.g. Penicillin, Sulfa)?',
    type: 'boolean',
  },
  {
    id: 'ayush_prakriti',
    category: 'AYUSH Prakriti',
    promptHindi: 'आपकी शारीरिक तासीर कैसी रहती है?',
    promptEnglish: 'What is your dominant constitutional tendency (Prakriti)?',
    type: 'multiple_choice',
    options: [
      { value: 'Vata', labelHindi: 'वात (सूखापन, बेचैनी, ठंड ज्यादा लगना)', labelEnglish: 'Vata (Dryness, light sleep, cold sensitive)' },
      { value: 'Pitta', labelHindi: 'पित्त (गर्मी न सहना, एसिडिटी, पसीना)', labelEnglish: 'Pitta (Heat sensitive, acidity, sharp appetite)' },
      { value: 'Kapha', labelHindi: 'कफ (भारीपन, सुस्ती, वजन बढ़ना)', labelEnglish: 'Kapha (Heaviness, calm, slow digestion)' },
      { value: 'Not_Sure', labelHindi: 'मुझे निश्चित नहीं पता', labelEnglish: 'Not sure / Doctor should assess' },
    ],
  },
];

export const COMMON_ALLERGIES = [
  {
    id: 'penicillin',
    name: 'Penicillin / Amoxicillin',
    nameHindi: 'पेनिसिलिन / एमोक्सीसिलिन (Penicillin)',
    description: 'Rash, hives, breathing trouble after antibiotics',
  },
  {
    id: 'sulfa',
    name: 'Sulfa Drugs (Septran)',
    nameHindi: 'सल्फा दवाएं (Sulfa Antibiotics)',
    description: 'Severe skin peeling, blisters, fever',
  },
  {
    id: 'nsaids',
    name: 'Painkillers (Aspirin / Brufen / Diclofenac)',
    nameHindi: 'दर्द निवारक गोलियां (Painkillers/Aspirin)',
    description: 'Stomach irritation, asthma exacerbation',
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol / Crocin',
    nameHindi: 'पैरासिटामोल (Paracetamol)',
    description: 'Facial swelling, itching',
  },
  {
    id: 'food_pollen',
    name: 'Dust / Pollen / Food Allergens (Peanut/Egg)',
    nameHindi: 'धूल / परागकण / भोजन एलर्जी (Food/Dust)',
    description: 'Allergic rhinitis, sneezing, throat tightness',
  },
];

export const PRAKRITI_TYPES = [
  {
    type: 'Vata',
    name: 'Vata Dominant (वात प्रधान)',
    nameHindi: 'वात प्रधान (Vata - हल्कापन, सूखापन, चंचलता)',
    traits: 'Dry skin, light/broken sleep, sensitive to cold breezes, joint cracking',
  },
  {
    type: 'Pitta',
    name: 'Pitta Dominant (पित्त प्रधान)',
    nameHindi: 'पित्त प्रधान (Pitta - तीक्ष्णता, एसिडिटी, पसीना)',
    traits: 'Heat intolerance, strong appetite/thirst, prone to acidity & skin flushing',
  },
  {
    type: 'Kapha',
    name: 'Kapha Dominant (कफ प्रधान)',
    nameHindi: 'कफ प्रधान (Kapha - स्थिरता, भारीपन, शांत स्वभाव)',
    traits: 'Heaviness, slow metabolism, calm mind, prone to cold congestion',
  },
  {
    type: 'Vata-Pitta',
    name: 'Vata-Pitta (वात-पित्त)',
    nameHindi: 'द्विदोषज वात-पित्त (Vata-Pitta)',
    traits: 'Quick mind, low heat tolerance with intermittent joint stiffness',
  },
  {
    type: 'Pitta-Kapha',
    name: 'Pitta-Kapha (पित्त-कफ)',
    nameHindi: 'द्विदोषज पित्त-कफ (Pitta-Kapha)',
    traits: 'Strong physique, moderate digestion with oily skin tendencies',
  },
  {
    type: 'Tridoshic',
    name: 'Tridoshic / Sama (सम त्रिदोष)',
    nameHindi: 'सम त्रिदोष (Sama Prakriti - संतुलित)',
    traits: 'Equally balanced physiological factors across all seasons',
  },
];

