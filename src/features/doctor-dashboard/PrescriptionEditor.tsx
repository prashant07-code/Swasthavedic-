import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { PrescriptionItem, MedicineTiming } from '../../types';
import { Pill, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

const COMMON_SUGGESTIONS = [
  { name: 'Tab. Paracetamol 500mg', system: 'ALLOPATHY', form: 'Tablet', dosage: '1 Tab', freq: '1-0-1', timing: 'AFTER_FOOD' },
  { name: 'Tab. Metformin 500mg', system: 'ALLOPATHY', form: 'Tablet', dosage: '1 Tab', freq: '1-0-1', timing: 'AFTER_FOOD' },
  { name: 'Tab. Telmisartan 40mg', system: 'ALLOPATHY', form: 'Tablet', dosage: '1 Tab', freq: '1-0-0', timing: 'AFTER_FOOD' },
  { name: 'Cap. Pantoprazole 40mg', system: 'ALLOPATHY', form: 'Capsule', dosage: '1 Cap', freq: '1-0-0', timing: 'EMPTY_STOMACH' },
  { name: 'Yograj Guggulu', system: 'AYURVEDA', form: 'Vati/Tablet', dosage: '2 Tabs', freq: '1-0-1', timing: 'AFTER_FOOD' },
  { name: 'Maharasnadi Kwath', system: 'AYURVEDA', form: 'Kwath/Decoction', dosage: '20 ml', freq: '1-0-1', timing: 'AFTER_FOOD' },
  { name: 'Triphala Churna', system: 'AYURVEDA', form: 'Churna/Powder', dosage: '3 grams', freq: '0-0-1', timing: 'BEDTIME' },
  { name: 'Ashwagandha Vati', system: 'AYURVEDA', form: 'Vati/Tablet', dosage: '1 Tab', freq: '1-0-1', timing: 'AFTER_FOOD' },
];

export const PrescriptionEditor: React.FC = () => {
  const { prescriptions, addPrescription, removePrescription } = useDoctor();

  const [medicineName, setMedicineName] = useState('');
  const [system, setSystem] = useState<'ALLOPATHY' | 'AYURVEDA' | 'HOMEOPATHY' | 'UNANI'>('ALLOPATHY');
  const [form, setForm] = useState('Tablet');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('1-0-1');
  const [timing, setTiming] = useState<MedicineTiming>('AFTER_FOOD');
  const [duration, setDuration] = useState('15 days');
  const [instructions, setInstructions] = useState('Take with warm water');

  const handleAdd = () => {
    if (!medicineName.trim()) return;

    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: medicineName.trim(),
      system,
      form,
      dosage,
      frequency,
      timing,
      duration,
      instructions,
    };

    addPrescription(newItem);
    setMedicineName('');
  };

  const handleSelectSuggestion = (sug: typeof COMMON_SUGGESTIONS[0]) => {
    setMedicineName(sug.name);
    setSystem(sug.system as any);
    setForm(sug.form);
    setDosage(sug.dosage);
    setFrequency(sug.freq);
    setTiming(sug.timing as any);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-4 text-left" id="doctor-prescription-editor">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-700" />
          <span>Electronic Prescription Builder (Allopathic & AYUSH Rx)</span>
        </h4>
        <span className="text-xs text-slate-500 font-medium">
          {prescriptions.length} Item(s) Prescribed
        </span>
      </div>

      {/* Quick Click Suggestions */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Quick Medicine Shortcuts:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(sug)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                sug.system === 'AYURVEDA'
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
              }`}
            >
              + {sug.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Prescription Form */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {/* Medicine Name */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Medicine / Formulation Name *
            </label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g., Tab. Metformin 500mg or Yograj Guggulu"
              className="w-full p-2 text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* System */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              System
            </label>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as any)}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
            >
              <option value="ALLOPATHY">Allopathy (Rx)</option>
              <option value="AYURVEDA">Ayurveda (AYUSH)</option>
              <option value="HOMEOPATHY">Homeopathy</option>
              <option value="UNANI">Unani</option>
            </select>
          </div>

          {/* Form */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Dosage Form
            </label>
            <input
              type="text"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              placeholder="Tablet / Churna / Syrup"
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {/* Frequency */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
            >
              <option value="1-0-1">1-0-1 (Twice daily)</option>
              <option value="1-0-0">1-0-0 (Morning only)</option>
              <option value="0-0-1">0-0-1 (Night only)</option>
              <option value="1-1-1">1-1-1 (Thrice daily)</option>
              <option value="SOS">SOS (When required)</option>
            </select>
          </div>

          {/* Timing */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Timing
            </label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value as any)}
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
            >
              <option value="AFTER_FOOD">After Food (भोजन बाद)</option>
              <option value="BEFORE_FOOD">Before Food (भोजन पूर्व)</option>
              <option value="EMPTY_STOMACH">Empty Stomach (खाली पेट)</option>
              <option value="BEDTIME">At Bedtime (सोते समय)</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="15 days / 1 month"
              className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
            />
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!medicineName.trim()}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rx Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Prescription Table */}
      {prescriptions.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
          No medicines prescribed yet. Choose from quick shortcuts above or enter custom medications.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Medicine Name</th>
                <th className="p-2.5">System</th>
                <th className="p-2.5">Dose & Frequency</th>
                <th className="p-2.5">Timing</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {prescriptions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{p.medicineName}</td>
                  <td className="p-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        p.system === 'AYURVEDA'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {p.system}
                    </span>
                  </td>
                  <td className="p-2.5">
                    {p.dosage} • <span className="font-bold text-emerald-800">{p.frequency}</span>
                  </td>
                  <td className="p-2.5 text-slate-600">{p.timing.replace('_', ' ')}</td>
                  <td className="p-2.5 font-semibold text-slate-700">{p.duration}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => removePrescription(p.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
