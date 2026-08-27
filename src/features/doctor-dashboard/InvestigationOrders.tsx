import React, { useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { InvestigationOrder } from '../../types';
import { FlaskConical, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const COMMON_LAB_TESTS = [
  { testName: 'Complete Blood Count (CBC)', category: 'PATHOLOGY', urgency: 'ROUTINE' },
  { testName: 'Fasting Blood Sugar (FBS) & HbA1c', category: 'BIOCHEMISTRY', urgency: 'ROUTINE' },
  { testName: 'Lipid Profile', category: 'BIOCHEMISTRY', urgency: 'ROUTINE' },
  { testName: 'Kidney Function Test (KFT / Creatinine)', category: 'BIOCHEMISTRY', urgency: 'ROUTINE' },
  { testName: 'Liver Function Test (LFT)', category: 'BIOCHEMISTRY', urgency: 'ROUTINE' },
  { testName: '12-Lead Electrocardiogram (ECG)', category: 'CARDIOLOGY', urgency: 'URGENT' },
  { testName: 'Chest X-Ray (PA View)', category: 'RADIOLOGY', urgency: 'ROUTINE' },
  { testName: 'Ultrasound Whole Abdomen (USG)', category: 'RADIOLOGY', urgency: 'ROUTINE' },
];

export const InvestigationOrders: React.FC = () => {
  const { investigations, addInvestigation, removeInvestigation } = useDoctor();

  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState<'PATHOLOGY' | 'RADIOLOGY' | 'BIOCHEMISTRY' | 'CARDIOLOGY' | 'OTHER'>('PATHOLOGY');
  const [urgency, setUrgency] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [instructions, setInstructions] = useState('10-12 hours overnight fasting required');

  const handleAdd = () => {
    if (!testName.trim()) return;

    const newItem: InvestigationOrder = {
      id: `inv-${Date.now()}`,
      testName: testName.trim(),
      category,
      urgency,
      instructions,
      orderedAt: new Date().toISOString(),
    };

    addInvestigation(newItem);
    setTestName('');
  };

  const handleQuickAdd = (test: typeof COMMON_LAB_TESTS[0]) => {
    const newItem: InvestigationOrder = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      testName: test.testName,
      category: test.category as any,
      urgency: test.urgency as any,
      orderedAt: new Date().toISOString(),
    };
    addInvestigation(newItem);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-4 text-left" id="doctor-investigation-orders">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-emerald-700" />
          <span>Diagnostic & Laboratory Investigation Orders</span>
        </h4>
        <span className="text-xs text-slate-500 font-medium">
          {investigations.length} Test(s) Ordered
        </span>
      </div>

      {/* Quick click shortcuts */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Common Hospital Lab Panels:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_LAB_TESTS.map((test, idx) => {
            const isAlreadyAdded = investigations.some((i) => i.testName === test.testName);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isAlreadyAdded && handleQuickAdd(test)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  isAlreadyAdded
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isAlreadyAdded ? '✓ ' : '+ '}
                {test.testName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Test Input Form */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          placeholder="Custom test name (e.g., Serum Electrolytes, 2D Echo)"
          className="flex-1 min-w-[200px] p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-hidden"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="p-2 text-xs bg-white border border-slate-300 rounded-lg"
        >
          <option value="PATHOLOGY">Pathology</option>
          <option value="BIOCHEMISTRY">Biochemistry</option>
          <option value="RADIOLOGY">Radiology / Imaging</option>
          <option value="CARDIOLOGY">Cardiology</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as any)}
          className="p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
        >
          <option value="ROUTINE">Routine</option>
          <option value="URGENT">Urgent (Today)</option>
          <option value="STAT">STAT / Emergency</option>
        </select>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!testName.trim()}
          className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Test</span>
        </button>
      </div>

      {/* Ordered investigations list */}
      {investigations.length > 0 && (
        <div className="space-y-1.5">
          {investigations.map((inv) => (
            <div
              key={inv.id}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    inv.urgency === 'STAT'
                      ? 'bg-red-600 text-white'
                      : inv.urgency === 'URGENT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {inv.urgency}
                </span>
                <span className="font-bold text-slate-900">{inv.testName}</span>
                <span className="text-slate-500 text-[11px]">({inv.category})</span>
              </div>
              <button
                onClick={() => removeInvestigation(inv.id)}
                className="text-slate-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
