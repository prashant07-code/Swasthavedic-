import { LanguageCode } from '../types';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  description: string;
  isAvailable: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    description: 'आवाज और स्पर्श दोनों में उपलब्ध',
    isAvailable: true,
  },
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    description: 'Voice & Touch supported',
    isAvailable: true,
  },
  {
    code: 'aw',
    label: 'Awadhi',
    nativeLabel: 'अवधी',
    description: 'भविष्य में उपलब्ध (Coming Soon)',
    isAvailable: false,
  },
  {
    code: 'bho',
    label: 'Bhojpuri',
    nativeLabel: 'भोजपुरी',
    description: 'भविष्य में उपलब्ध (Coming Soon)',
    isAvailable: false,
  },
  {
    code: 'mai',
    label: 'Maithili',
    nativeLabel: 'मैथिली',
    description: 'भविष्य में उपलब्ध (Coming Soon)',
    isAvailable: false,
  },
];

export const TRANSLATIONS: Record<string, Record<'hi' | 'en', string>> = {
  // App Header & Branding
  appName: {
    hi: 'स्वस्थवैदिक एआई (SwasthaVedic AI)',
    en: 'SwasthaVedic AI',
  },
  tagline: {
    hi: 'आयुष एवं आधुनिक स्वास्थ्य सेवा सहायिका',
    en: 'Ayurvedic & Modern Clinical History & OPD Assistant',
  },

  // Navigation & General Buttons
  next: {
    hi: 'आगे बढ़ें',
    en: 'Continue / Next',
  },
  back: {
    hi: 'पीछे जाएं',
    en: 'Go Back',
  },
  confirm: {
    hi: 'पुष्टि करें (सही है)',
    en: 'Confirm & Proceed',
  },
  edit: {
    hi: 'बदलें / सुधारें',
    en: 'Edit / Modify',
  },
  cancel: {
    hi: 'रद्द करें',
    en: 'Cancel',
  },
  needHelp: {
    hi: 'मदद चाहिए? (सहायक बुलाएं)',
    en: 'Need Help? (Call Staff)',
  },
  speakAgain: {
    hi: 'दोबारा बोलें',
    en: 'Speak Again',
  },
  listenAgain: {
    hi: 'दोबारा सुनें',
    en: 'Listen Again',
  },
  iDontKnow: {
    hi: 'मुझे नहीं पता',
    en: "I don't know / Not sure",
  },
  skip: {
    hi: 'छोड़ें',
    en: 'Skip this question',
  },

  // Welcome Step
  welcomeTitle: {
    hi: 'नमस्ते! अस्पताल में आपका स्वागत है',
    en: 'Namaste! Welcome to the Hospital OPD',
  },
  welcomeSubtitle: {
    hi: 'डॉक्टर से मिलने से पहले, कृपया अपनी परेशानी आसानी से बताएं। हम कदम-दर-कदम आपकी मदद करेंगे।',
    en: 'Before meeting the doctor, please share your symptoms easily. We will guide you step by step.',
  },
  welcomeVoicePrompt: {
    hi: 'नमस्ते। अस्पताल में आपका स्वागत है। डॉक्टर साहब से मिलने से पहले, हम आपकी परेशानी नोट करेंगे। शुरू करने के लिए नीचे हरा बटन दबाएं।',
    en: 'Welcome to the hospital. To help the doctor understand your health better, we will record your symptoms. Tap the green button to start.',
  },
  startKiosk: {
    hi: 'शुरू करें (आसान आवाज / स्पर्श)',
    en: 'Start Check-In (Voice & Touch)',
  },

  // Language Step
  chooseLanguage: {
    hi: 'अपनी पसंदीदा भाषा चुनें',
    en: 'Select Your Preferred Language',
  },
  languageVoicePrompt: {
    hi: 'कृपया वह भाषा चुनें जिसमें आप बातचीत करना चाहते हैं।',
    en: 'Please choose the language in which you feel most comfortable.',
  },

  // Identity Step
  patientTypeQuestion: {
    hi: 'आप अस्पताल में पहले आ चुके हैं या पहली बार आए हैं?',
    en: 'Are you an existing patient or visiting for the first time?',
  },
  existingPatient: {
    hi: 'पुराना मरीज़ (पहले आ चुका हूँ)',
    en: 'Existing Patient (Have Visited Before)',
  },
  newPatient: {
    hi: 'नया मरीज़ (पहली बार आया हूँ)',
    en: 'New Patient (First Visit)',
  },
  abhaOption: {
    hi: 'आयुष्मान भारत (ABHA ID) से जारी रखें',
    en: 'Continue with ABHA ID (ABDM Ready)',
  },
  mobileLabel: {
    hi: 'अपना 10 अंकों का मोबाइल नंबर दर्ज करें',
    en: 'Enter Your 10-Digit Mobile Number',
  },
  otpLabel: {
    hi: 'ओटीपी (सुरक्षा कोड) दर्ज करें',
    en: 'Enter OTP (Verification Code)',
  },
  patientCodeLabel: {
    hi: 'अस्पताल पर्ची नंबर / पेशेंट कोड',
    en: 'Hospital Slip / Patient ID Code',
  },

  // Consent Step
  consentTitle: {
    hi: 'आपकी सहमति (Consent)',
    en: 'Patient Information Consent',
  },
  consentText: {
    hi: 'मैं अपनी स्वास्थ्य जानकारी और पुराने पर्चे डॉक्टर साहब के उपचार और रिकॉर्ड के लिए साझा करने की सहमति देता/देती हूँ। यह जानकारी सुरक्षित रहेगी।',
    en: 'I give consent to share my health history and old medical records solely for clinical care and hospital OPD records under doctor supervision.',
  },
  consentAgree: {
    hi: 'हाँ, मैं सहमत हूँ',
    en: 'Yes, I Agree & Consent',
  },
  attendantAssisted: {
    hi: 'क्या आपके साथ कोई सहायक/परिवारजन मदद कर रहे हैं?',
    en: 'Is a family member or attendant assisting you today?',
  },

  // Profile Step
  profileTitle: {
    hi: 'मरीज़ की बुनियादी जानकारी',
    en: 'Patient Basic Profile',
  },
  nameLabel: {
    hi: 'पूरा नाम',
    en: 'Full Name',
  },
  ageLabel: {
    hi: 'उम्र (वर्ष)',
    en: 'Age (in Years)',
  },
  genderLabel: {
    hi: 'लिंग',
    en: 'Gender',
  },
  male: {
    hi: 'पुरुष',
    en: 'Male',
  },
  female: {
    hi: 'महिला',
    en: 'Female',
  },
  other: {
    hi: 'अन्य',
    en: 'Other',
  },

  // Chief Complaint Step
  chiefComplaintTitle: {
    hi: 'आज आपको क्या मुख्य परेशानी है?',
    en: 'What is your main health problem today?',
  },
  chiefComplaintVoicePrompt: {
    hi: 'माइक का बटन दबाकर बोलें — जैसे कि "मुझे दो दिन से बुखार और खाँसी है" या नीचे दिए गए चित्रों पर छुएं।',
    en: 'Tap the mic button and speak — e.g. "I have had fever and cough for two days" or tap the cards below.',
  },
  listeningNow: {
    hi: 'सुन रहे हैं... कृपया बोलें...',
    en: 'Listening... Please speak now...',
  },
  tapToSpeak: {
    hi: 'बोलने के लिए माइक दबाएं',
    en: 'Tap Mic to Speak',
  },
  durationQuestion: {
    hi: 'यह परेशानी कितने समय से है?',
    en: 'How long have you had this problem?',
  },
  severityQuestion: {
    hi: 'तकलीफ कितनी ज्यादा है?',
    en: 'How severe is the discomfort?',
  },
  mild: {
    hi: 'हल्की',
    en: 'Mild',
  },
  moderate: {
    hi: 'मध्यम (सामान्य से ज्यादा)',
    en: 'Moderate',
  },
  severe: {
    hi: 'बहुत तेज़ / असहनीय',
    en: 'Severe',
  },

  // Previous History Reuse Step
  historyReuseTitle: {
    hi: 'आपकी पिछली स्वास्थ्य जानकारी उपलब्ध है',
    en: 'Your Previous Medical History Is Available',
  },
  historyReuseQuestion: {
    hi: 'क्या आपकी पुरानी बीमारियों या दवाओं में कोई बदलाव हुआ है?',
    en: 'Has anything changed in your chronic conditions or medications?',
  },
  noChange: {
    hi: 'कोई बदलाव नहीं (सब पहले जैसा है)',
    en: 'No Change (Everything is unchanged)',
  },
  updateHistory: {
    hi: 'हाँ, कुछ बदलाव हुआ है (नया जोड़ें)',
    en: 'Yes, Something Changed (Update Info)',
  },

  // Document Scan Step
  documentScanTitle: {
    hi: 'क्या आपके पास कोई पुरानी पर्ची, रिपोर्ट या दवा का पर्चा है?',
    en: 'Do you have any old prescription, lab report, or document?',
  },
  documentScanPrompt: {
    hi: 'यदि हाँ, तो कैमरा से फोटो खींचें या फाइल अपलोड करें। हमारा ओसीआर सिस्टम दवाओं व जांचों को अपने आप पढ़ लेगा।',
    en: 'If yes, take a photo with camera or upload. Our OCR will extract medicines, labs, and previous diagnoses for doctor review.',
  },
  uploadOrCapture: {
    hi: 'दस्तावेज़ स्कैन / फोटो अपलोड करें',
    en: 'Scan Document / Upload Photo',
  },
  noDocuments: {
    hi: 'मेरे पास कोई पुराना पर्चा नहीं है',
    en: 'No, I have no old documents today',
  },
  ocrProcessing: {
    hi: 'ओसीआर दस्तावेज़ पढ़ रहा है...',
    en: 'OCR System reading document...',
  },

  // Verification Step
  verificationTitle: {
    hi: 'कृपया अपनी दर्ज जानकारी की जांच करें',
    en: 'Please verify the recorded information',
  },
  verificationVoicePrompt: {
    hi: 'हमने आपकी ये जानकारी दर्ज की है। यदि सब ठीक है, तो नीचे दिए गए हरे बटन को दबाकर डॉक्टर साहब के पास भेजें।',
    en: 'Here is the summary of what you reported. If accurate, tap confirm to send it to the doctor dashboard.',
  },
  submitToDoctor: {
    hi: 'डॉक्टर साहब को भेजें (पर्ची टोकन प्राप्त करें)',
    en: 'Send to Doctor (Get OPD Token)',
  },

  // Completion Step
  completionTitle: {
    hi: 'आपकी जानकारी सफलतापूर्वक डॉक्टर साहब को भेज दी गई है!',
    en: 'Your information has been sent to the Doctor successfully!',
  },
  tokenNumberText: {
    hi: 'आपका ओपीडी टोकन नंबर',
    en: 'Your OPD Token Number',
  },
  estimatedWait: {
    hi: 'अनुमानित प्रतीक्षा समय: लगभग 10-15 मिनट',
    en: 'Estimated wait time: Approx. 10-15 minutes',
  },
  pleaseSitInWaitingRoom: {
    hi: 'कृपया ओपीडी कमरा नं. 04 के बाहर प्रतीक्षा करें। जब आपका टोकन नंबर पुकारा जाएगा, तब अंदर आएं।',
    en: 'Please wait outside OPD Room No. 04. Proceed inside when your token number is called.',
  },
  startNextPatient: {
    hi: 'नया मरीज़ सत्र शुरू करें (डेटा सुरक्षित रीसेट)',
    en: 'Start Next Patient Session (Secure Reset)',
  },

  // Safety & Triage
  emergencyWarning: {
    hi: 'सावधानी: गंभीर लक्षण पाए गए हैं। तुरंत आपातकालीन वार्ड या नर्स सहायता से संपर्क करें।',
    en: 'Alert: High-priority symptoms detected. Please alert the OPD emergency nurse/doctor immediately.',
  },
  aiAssistedDisclaimer: {
    hi: 'यह सारांश कृत्रिम बुद्धिमत्ता (AI) द्वारा तैयार किया गया है। अंतिम निर्णय केवल डॉक्टर का होगा।',
    en: 'AI GENERATED / AI ASSISTED: For clinical documentation and decision support only. The doctor retains final clinical authority.',
  },
};

export function t(key: string, lang: LanguageCode = 'hi'): string {
  const selectedLang = lang === 'en' ? 'en' : 'hi';
  if (TRANSLATIONS[key] && TRANSLATIONS[key][selectedLang]) {
    return TRANSLATIONS[key][selectedLang];
  }
  return key;
}
