import React, { useEffect, useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { SymptomPicker } from '../components/SymptomPicker';
import { VoiceWave } from '../components/VoiceWave';
import { t } from '../../../constants/languages';
import { ChiefComplaintItem } from '../../../types';
import {
  Activity,
  Mic,
  Trash2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ChiefComplaintStep: React.FC = () => {
  const { goToStep, clinicalHistory, addChiefComplaint, removeChiefComplaint, patient } = useKiosk();
  const { language, mode, audioSpeed } = useAccessibility();
  const {
    isListening,
    isSpeaking,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    speak,
    resetTranscript,
  } = useVoice({ language, speechRate: audioSpeed });

  const [activeTab, setActiveTab] = useState<'VOICE' | 'TILES'>('TILES');

  useEffect(() => {
    // Speak guidance
    speak(t('chiefComplaintPrompt', language));
  }, [language, speak]);

  // If speech captures recognizable symptom words, auto-structure it
  const handleVoiceAdd = () => {
    if (!transcript.trim()) return;

    const lower = transcript.toLowerCase();
    let symptomName = transcript;
    let symptomHindi = transcript;

    if (lower.includes('chest') || lower.includes('सीना') || lower.includes('छाती')) {
      symptomName = 'Chest Pain / Discomfort';
      symptomHindi = 'सीने में दर्द या भारीपन';
    } else if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('ताप')) {
      symptomName = 'Fever';
      symptomHindi = 'बुखार (Fever)';
    } else if (lower.includes('breath') || lower.includes('सांस')) {
      symptomName = 'Breathlessness';
      symptomHindi = 'सांस लेने में तकलीफ';
    } else if (lower.includes('knee') || lower.includes('joint') || lower.includes('घुटने') || lower.includes('जोड़')) {
      symptomName = 'Joint / Knee Pain';
      symptomHindi = 'घुटने या जोड़ों का दर्द (संधिवात)';
    } else if (lower.includes('headache') || lower.includes('सिर')) {
      symptomName = 'Headache';
      symptomHindi = 'सिरदर्द (Headache)';
    }

    const newItem: ChiefComplaintItem = {
      id: `sym-voice-${Date.now()}`,
      symptom: symptomName,
      symptomHindi,
      duration: '3',
      durationUnit: 'days',
      severity: 'moderate',
    };

    addChiefComplaint(newItem);
    resetTranscript();
    speak(
      language === 'hi'
        ? `${symptomHindi} को आपकी ओपीडी पर्ची में जोड़ लिया गया है।`
        : `Added ${symptomName} to your complaints list.`
    );
  };

  const handleNext = () => {
    // If patient is existing and already verified their chronic history, we can proceed directly to Document Scan or Verification
    if (clinicalHistory.previousHistoryReused) {
      goToStep('DOCUMENT_SCAN');
    } else {
      goToStep('CLINICAL_HISTORY');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-10" id="kiosk-chief-complaint-step">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('chiefComplaintTitle', language)}
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto font-medium">
          {t('chiefComplaintPrompt', language)}
        </p>
      </div>

      {/* Input Mode Selector: Touch / Tiles vs Voice-First */}
      <div className="flex justify-center mb-8">
        <div className="bg-sky-100/80 p-1.5 rounded-2xl flex gap-2 border border-sky-200">
          <button
            id="tab-symptom-tiles"
            onClick={() => setActiveTab('TILES')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'TILES'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-sky-950 hover:bg-sky-200/60'
            }`}
          >
            {language === 'hi' ? 'चित्र / लक्षण चुनें (Touch)' : 'Select Symptom Tile'}
          </button>
          <button
            id="tab-symptom-voice"
            onClick={() => setActiveTab('VOICE')}
            className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'VOICE'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-sky-950 hover:bg-sky-200/60'
            }`}
          >
            <Mic className="w-4 h-4" />
            {language === 'hi' ? 'बोलकर बताएं (Voice Input)' : 'Speak Symptoms'}
          </button>
        </div>
      </div>

      {/* Mode 1: Voice-First Screen */}
      {activeTab === 'VOICE' ? (
        <div className="max-w-xl mx-auto mb-8">
          <VoiceWave
            isListening={isListening}
            isSpeaking={isSpeaking}
            transcript={transcript}
            onStartListening={startListening}
            onStopListening={stopListening}
            onListenAgain={() => speak(transcript)}
            onResetTranscript={resetTranscript}
            error={voiceError}
            placeholderPrompt={
              language === 'hi'
                ? 'उदाहरण: "मुझे पिछले तीन दिनों से बुखार और छाती में भारीपन है..."'
                : 'Example: "I have had fever and chest heaviness for 3 days..."'
            }
          />
          {transcript && (
            <div className="mt-4 text-center">
              <button
                id="voice-add-complaint-btn"
                onClick={handleVoiceAdd}
                className="py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-xl active:scale-98 cursor-pointer border-b-4 border-emerald-700"
              >
                {language === 'hi' ? 'यह लक्षण सूची में जोड़ें' : 'Add Spoken Symptom to List'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Touch Pictorial Symptom Picker */
        <div className="mb-8">
          <SymptomPicker
            onSelectSymptom={(sym) => {
              addChiefComplaint(sym);
              speak(
                language === 'hi'
                  ? `${sym.symptomHindi} जोड़ा गया`
                  : `Added ${sym.symptom}`
              );
            }}
            selectedSymptoms={clinicalHistory.chiefComplaints}
          />
        </div>
      )}

      {/* Selected Complaints Preview List */}
      <div className="bg-white p-6 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left">
        <h4 className="text-xs font-black uppercase tracking-wider text-sky-950 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {language === 'hi' ? 'चुने गए मुख्य लक्षण (Chief Complaints):' : 'Added Chief Complaints:'}
          </span>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
            {clinicalHistory.chiefComplaints.length} लक्षण दर्ज
          </span>
        </h4>

        {clinicalHistory.chiefComplaints.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm font-semibold border-2 border-dashed border-sky-200 rounded-2xl bg-sky-50/30">
            {language === 'hi'
              ? 'अभी कोई लक्षण नहीं चुना गया। ऊपर दिए गए चित्रों में से चुनें या बोलें।'
              : 'No symptoms added yet. Tap a tile above or use voice input.'}
          </div>
        ) : (
          <div className="space-y-3">
            {clinicalHistory.chiefComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-sky-50/60 border-2 border-sky-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <h5 className="font-black text-base text-sky-950">
                    {language === 'hi' ? c.symptomHindi : c.symptom}
                  </h5>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-semibold">
                    <span className="flex items-center gap-1 text-sky-700">
                      <Clock className="w-4 h-4 text-sky-600" />
                      {c.duration} {c.durationUnit}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-sky-200 font-black text-[10px] text-slate-700 shadow-2xs">
                      {c.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeChiefComplaint(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                  title="हटाएं"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="chief-back-btn"
          onClick={() => goToStep(patient?.isExistingPatient ? 'PREVIOUS_HISTORY' : 'PROFILE')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="chief-continue-btn"
          onClick={handleNext}
          disabled={clinicalHistory.chiefComplaints.length === 0}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          <span>{t('next', language)}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
