import React, { useState } from 'react';
import { useKiosk } from '../../../context/KioskContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { useVoice } from '../../../hooks/useVoice';
import { t } from '../../../constants/languages';
import { COMMON_ALLERGIES, PRAKRITI_TYPES } from '../../../constants/questions';
import {
  HeartHandshake,
  AlertCircle,
  Pill,
  Leaf,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export const ClinicalHistoryStep: React.FC = () => {
  const { goToStep, clinicalHistory, updateClinicalHistory } = useKiosk();
  const { language, audioSpeed } = useAccessibility();
  const { speak } = useVoice({ language, speechRate: audioSpeed });

  const [activeSection, setActiveSection] = useState<'CONDITIONS' | 'ALLERGIES' | 'MEDS' | 'AYUSH'>('CONDITIONS');
  const [newMedName, setNewMedName] = useState('');
  const [isMedAyurvedic, setIsMedAyurvedic] = useState(false);

  const toggleCondition = (key: keyof typeof clinicalHistory.pastMedicalHistory) => {
    updateClinicalHistory((prev) => ({
      ...prev,
      pastMedicalHistory: {
        ...prev.pastMedicalHistory,
        [key]: !prev.pastMedicalHistory[key],
      },
    }));
  };

  const toggleAllergy = (allergyName: string) => {
    updateClinicalHistory((prev) => {
      const current = prev.allergyHistory.allergies;
      const exists = current.includes(allergyName);
      const updated = exists ? current.filter((a) => a !== allergyName) : [...current, allergyName];
      return {
        ...prev,
        allergyHistory: {
          ...prev.allergyHistory,
          hasAllergies: updated.length > 0,
          allergies: updated,
        },
      };
    });
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    updateClinicalHistory((prev) => ({
      ...prev,
      currentMedications: [
        ...prev.currentMedications,
        {
          name: newMedName.trim(),
          dosage: 'Standard dose',
          frequency: '1-0-1',
          isAyurvedic: isMedAyurvedic,
          source: 'patient_reported',
        },
      ],
    }));
    setNewMedName('');
    setIsMedAyurvedic(false);
  };

  const handleRemoveMedication = (index: number) => {
    updateClinicalHistory((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10" id="kiosk-clinical-history-step">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mb-2">
          {t('clinicalHistoryTitle', language)}
        </h2>
        <p className="text-base text-slate-600 font-medium">
          {language === 'hi'
            ? 'अपनी पुरानी बीमारियों, दवाओं और एलर्जी की जानकारी दें:'
            : 'Please indicate pre-existing conditions, drug allergies, and daily medicines:'}
        </p>
      </div>

      {/* Section navigation tabs */}
      <div className="grid grid-cols-4 gap-2 p-1.5 bg-sky-100/80 rounded-2xl mb-8 text-center text-xs md:text-sm font-black border border-sky-200">
        <button
          onClick={() => setActiveSection('CONDITIONS')}
          className={`py-3 px-2 rounded-xl transition-all cursor-pointer ${
            activeSection === 'CONDITIONS'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-sky-950 hover:bg-sky-200/60'
          }`}
        >
          {language === 'hi' ? '1. बीमारी' : '1. Illness'}
        </button>
        <button
          onClick={() => setActiveSection('ALLERGIES')}
          className={`py-3 px-2 rounded-xl transition-all cursor-pointer ${
            activeSection === 'ALLERGIES'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-sky-950 hover:bg-sky-200/60'
          }`}
        >
          {language === 'hi' ? '2. एलर्जी' : '2. Allergies'}
        </button>
        <button
          onClick={() => setActiveSection('MEDS')}
          className={`py-3 px-2 rounded-xl transition-all cursor-pointer ${
            activeSection === 'MEDS'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-sky-950 hover:bg-sky-200/60'
          }`}
        >
          {language === 'hi' ? '3. दवाएं' : '3. Daily Meds'}
        </button>
        <button
          onClick={() => setActiveSection('AYUSH')}
          className={`py-3 px-2 rounded-xl transition-all cursor-pointer ${
            activeSection === 'AYUSH'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-sky-950 hover:bg-sky-200/60'
          }`}
        >
          {language === 'hi' ? '4. प्रकृति' : '4. AYUSH'}
        </button>
      </div>

      {/* Section 1: Chronic Conditions */}
      {activeSection === 'CONDITIONS' && (
        <div className="bg-white p-7 rounded-[32px] border-4 border-sky-100 shadow-xl mb-8 text-left">
          <h4 className="font-black text-base text-sky-950 mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            {language === 'hi'
              ? 'क्या आपको इनमें से कोई पुरानी बीमारी है? (छूकर चुनें)'
              : 'Do you have any of these long-term conditions?'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'diabetes', titleHi: 'मधुमेह / शुगर (Diabetes)', titleEn: 'Diabetes Mellitus' },
              { key: 'hypertension', titleHi: 'उच्च रक्तचाप / बीपी (BP / Hypertension)', titleEn: 'High Blood Pressure' },
              { key: 'asthma', titleHi: 'दमा / सांस रोग (Asthma / COPD)', titleEn: 'Asthma / Respiratory' },
              { key: 'heartDisease', titleHi: 'हृदय रोग (Heart Disease)', titleEn: 'Heart Disease' },
              { key: 'thyroid', titleHi: 'थायराइड (Thyroid Disorder)', titleEn: 'Thyroid Problem' },
              { key: 'kidneyDisease', titleHi: 'गुर्दे की बीमारी (Kidney Disease)', titleEn: 'Kidney Disease' },
            ].map((c) => {
              const isChecked = !!(clinicalHistory.pastMedicalHistory as any)[c.key];
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCondition(c.key as any)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300/40 shadow-sm'
                      : 'bg-sky-50/40 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? c.titleHi : c.titleEn}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'bg-white border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Allergies */}
      {activeSection === 'ALLERGIES' && (
        <div className="bg-white p-7 rounded-[32px] border-4 border-rose-100 shadow-xl mb-8 text-left">
          <h4 className="font-black text-base text-rose-950 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            {language === 'hi' ? 'दवा या भोजन से एलर्जी (Allergy Alerts):' : 'Drug Allergies:'}
          </h4>
          <p className="text-xs text-slate-600 mb-5 font-medium">
            {language === 'hi'
              ? 'यदि किसी दवा से शरीर में खुजली, दाने या सांस फूलने की समस्या हुई हो:'
              : 'Please highlight any drug that has caused an adverse allergic reaction:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {COMMON_ALLERGIES.map((alg) => {
              const isSelected = clinicalHistory.allergyHistory.allergies.includes(alg.name);
              return (
                <button
                  key={alg.id}
                  type="button"
                  onClick={() => toggleAllergy(alg.name)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-300/40 shadow-sm'
                      : 'bg-sky-50/40 border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div>
                    <span className="text-sm font-black text-slate-900 block">
                      {language === 'hi' ? alg.nameHindi : alg.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{alg.description}</span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 ${
                      isSelected ? 'bg-rose-600 border-rose-600 text-white shadow-xs' : 'bg-white border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Daily Medications */}
      {activeSection === 'MEDS' && (
        <div className="bg-white p-7 rounded-[32px] border-4 border-emerald-100 shadow-xl mb-8 text-left">
          <h4 className="font-black text-base text-emerald-950 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            {language === 'hi' ? 'रोज खाई जाने वाली दवाएं (Active Medications):' : 'Current Medications:'}
          </h4>

          <div className="flex gap-2.5 mb-4">
            <input
              type="text"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              placeholder="उदा. Metformin 500mg / त्रिफला चूर्ण / Telmisartan"
              className="flex-1 p-3.5 bg-sky-50/50 border-2 border-slate-200 rounded-2xl text-sm font-bold outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddMedication}
              className="py-3.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer border-b-4 border-emerald-700 active:scale-98"
            >
              <Plus className="w-5 h-5" />
              <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
            </button>
          </div>

          <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={isMedAyurvedic}
              onChange={(e) => setIsMedAyurvedic(e.target.checked)}
              className="w-4 h-4 rounded-md text-emerald-600 accent-emerald-600 cursor-pointer"
            />
            <span>{language === 'hi' ? 'यह आयुर्वेदिक / देशी औषधि है' : 'This is an Ayurvedic / AYUSH medicine'}</span>
          </label>

          {/* List of current medications */}
          <div className="space-y-2.5">
            {clinicalHistory.currentMedications.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  {m.isAyurvedic ? (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">आयुष</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-sky-100 text-sky-900 text-xs font-black border border-sky-300">Rx</span>
                  )}
                  <span className="text-sm font-bold text-slate-900">{m.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveMedication(idx)}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: AYUSH Constitutional Profile */}
      {activeSection === 'AYUSH' && (
        <div className="bg-white p-7 rounded-[32px] border-4 border-amber-100 shadow-xl mb-8 text-left">
          <h4 className="font-black text-base text-sky-950 mb-2 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            {language === 'hi' ? 'प्रकृति / दोष रुझान (AYUSH Prakriti Context):' : 'Ayurvedic Prakriti / Body Type:'}
          </h4>
          <p className="text-xs text-slate-600 mb-5 font-medium">
            {language === 'hi'
              ? 'यदि आपको अपनी प्रकृति पता है, तो चुनें (वैकल्पिक):'
              : 'Optional self-reported constitutional inclination:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {PRAKRITI_TYPES.map((p) => {
              const isSelected = clinicalHistory.ayushHistory?.prakritiSelfReported === p.type;
              return (
                <button
                  key={p.type}
                  type="button"
                  onClick={() =>
                    updateClinicalHistory((prev) => ({
                      ...prev,
                      ayushHistory: {
                        ...prev.ayushHistory,
                        prakritiSelfReported: p.type as any,
                      },
                    }))
                  }
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-300/40 shadow-sm'
                      : 'bg-sky-50/40 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <h5 className="font-black text-base text-sky-950">
                    {language === 'hi' ? p.nameHindi : p.name}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{p.traits}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="clinical-back-btn"
          onClick={() => goToStep('CHIEF_COMPLAINT')}
          className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2 text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back', language)}</span>
        </button>

        <button
          id="clinical-continue-btn"
          onClick={() => goToStep('DOCUMENT_SCAN')}
          className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl flex items-center gap-2.5 active:scale-98 cursor-pointer border-b-4 border-emerald-700 transition-all"
        >
          <span>{language === 'hi' ? 'दस्तावेज़ स्कैन पर जाएं' : 'Proceed to Document Scan'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
