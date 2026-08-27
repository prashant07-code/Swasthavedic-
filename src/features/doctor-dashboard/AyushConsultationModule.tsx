import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { Leaf, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

export const AyushConsultationModule: React.FC = () => {
  const { ayushAssessment, setAyushAssessment } = useDoctor();
  const [newPathya, setNewPathya] = useState('');
  const [newApathya, setNewApathya] = useState('');

  const handleDoshaChange = (dosha: 'vata' | 'pitta' | 'kapha', state: 'Aggravated' | 'Normal' | 'Depleted') => {
    setAyushAssessment((prev) => ({
      ...prev,
      doshaImbalance: {
        ...prev.doshaImbalance,
        [dosha]: state,
      },
    }));
  };

  const handleAddPathya = () => {
    if (!newPathya.trim()) return;
    setAyushAssessment((prev) => ({
      ...prev,
      pathyaAdvice: [...prev.pathyaAdvice, newPathya.trim()],
    }));
    setNewPathya('');
  };

  const handleRemovePathya = (idx: number) => {
    setAyushAssessment((prev) => ({
      ...prev,
      pathyaAdvice: prev.pathyaAdvice.filter((_, i) => i !== idx),
    }));
  };

  const handleAddApathya = () => {
    if (!newApathya.trim()) return;
    setAyushAssessment((prev) => ({
      ...prev,
      apathyaAdvice: [...prev.apathyaAdvice, newApathya.trim()],
    }));
    setNewApathya('');
  };

  const handleRemoveApathya = (idx: number) => {
    setAyushAssessment((prev) => ({
      ...prev,
      apathyaAdvice: prev.apathyaAdvice.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs mb-4 text-left" id="doctor-ayush-module">
      <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Integrative AYUSH & Ayurvedic Clinical Assessment
            </h4>
            <p className="text-[11px] text-slate-500">
              Traditional diagnostic parameters, Dosha balance, Nadi Pariksha, and Pathya-Apathya regimen
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-amber-50 border border-amber-300 text-amber-900 font-bold px-2 py-0.5 rounded-md">
          AYURVEDA & INTEGRATIVE MEDICINE
        </span>
      </div>

      {/* Dosha Imbalance Matrix */}
      <div className="mb-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
          Tridosha Status (त्रिदोष परीक्षण):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['vata', 'pitta', 'kapha'] as const).map((dosha) => {
            const current = ayushAssessment.doshaImbalance[dosha];
            return (
              <div key={dosha} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase text-slate-800 tracking-wide">
                    {dosha} Dosha
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      current === 'Aggravated'
                        ? 'bg-red-100 text-red-800'
                        : current === 'Depleted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {current}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {(['Normal', 'Aggravated', 'Depleted'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleDoshaChange(dosha, st)}
                      className={`text-[10px] py-1 font-semibold rounded-md border text-center transition-all ${
                        current === st
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nadi Pariksha & Pulse Notes */}
      <div className="mb-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
          Nadi Pariksha & Agni Assessment Notes (नाड़ी व अग्नि परीक्षण):
        </label>
        <input
          type="text"
          value={ayushAssessment.nadiParikshaNotes || ''}
          onChange={(e) =>
            setAyushAssessment((prev) => ({
              ...prev,
              nadiParikshaNotes: e.target.value,
            }))
          }
          placeholder="e.g., Vata-Pitta Pradhan, Mandagni with Sama Lakshana"
          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
        />
      </div>

      {/* Pathya (Wholesome Diet) and Apathya (Unwholesome Diet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pathya */}
        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
          <h5 className="font-bold text-xs text-emerald-950 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Pathya (Recommended Diet & Lifestyle / पथ्य)
          </h5>

          <div className="flex gap-1.5 mb-2">
            <input
              type="text"
              value={newPathya}
              onChange={(e) => setNewPathya(e.target.value)}
              placeholder="e.g., Warm boiled water, light Khichdi"
              className="flex-1 p-1.5 text-xs bg-white border border-emerald-200 rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddPathya}
              className="p-1.5 bg-emerald-700 text-white rounded-lg text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {ayushAssessment.pathyaAdvice.map((item, idx) => (
              <div
                key={idx}
                className="p-1.5 bg-white rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between"
              >
                <span>• {item}</span>
                <button onClick={() => handleRemovePathya(idx)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Apathya */}
        <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200">
          <h5 className="font-bold text-xs text-red-950 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            Apathya (Strict Restrictions & Avoid / अपथ्य)
          </h5>

          <div className="flex gap-1.5 mb-2">
            <input
              type="text"
              value={newApathya}
              onChange={(e) => setNewApathya(e.target.value)}
              placeholder="e.g., Curd at night, heavy fried food"
              className="flex-1 p-1.5 text-xs bg-white border border-red-200 rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddApathya}
              className="p-1.5 bg-red-700 text-white rounded-lg text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {ayushAssessment.apathyaAdvice.map((item, idx) => (
              <div
                key={idx}
                className="p-1.5 bg-white rounded-lg border border-red-100 text-[11px] text-red-900 flex items-center justify-between"
              >
                <span>• {item}</span>
                <button onClick={() => handleRemoveApathya(idx)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
