import React, { useState } from 'react';
import { COMMON_SYMPTOMS, SymptomTile } from '../../../constants/questions';
import { ChiefComplaintItem } from '../../../types';
import { useAccessibility } from '../../../context/AccessibilityContext';
import {
  Thermometer,
  HeartPulse,
  Wind,
  Activity,
  Flame,
  Bone,
  ZapOff,
  Sparkles,
  Leaf,
  FileCheck,
  Plus,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SymptomPickerProps {
  onSelectSymptom: (item: ChiefComplaintItem) => void;
  selectedSymptoms: ChiefComplaintItem[];
}

const ICON_MAP: Record<string, any> = {
  Thermometer,
  HeartPulse,
  Wind,
  Activity,
  Flame,
  Bone,
  ZapOff,
  Sparkles,
  Leaf,
  FileCheck,
};

export const SymptomPicker: React.FC<SymptomPickerProps> = ({
  onSelectSymptom,
  selectedSymptoms,
}) => {
  const { language, highContrast, mode } = useAccessibility();
  const [activeTile, setActiveTile] = useState<SymptomTile | null>(null);
  const [duration, setDuration] = useState('2');
  const [durationUnit, setDurationUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

  const isLowLiteracy = mode === 'LOW_LITERACY' || mode === 'ELDERLY';

  const handleTileClick = (tile: SymptomTile) => {
    setActiveTile(tile);
  };

  const handleAddConfirmed = () => {
    if (!activeTile) return;

    const newItem: ChiefComplaintItem = {
      id: `sym-${Date.now()}`,
      symptom: activeTile.name,
      symptomHindi: activeTile.nameHindi,
      duration,
      durationUnit,
      severity,
    };

    onSelectSymptom(newItem);
    setActiveTile(null);
    setDuration('2');
  };

  return (
    <div className="w-full" id="symptom-picker-root">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-6">
        {COMMON_SYMPTOMS.map((tile) => {
          const Icon = ICON_MAP[tile.icon] || Activity;
          const isSelected = selectedSymptoms.some((s) => s.symptom === tile.name);

          return (
            <button
              key={tile.id}
              id={`symptom-tile-${tile.id}`}
              onClick={() => handleTileClick(tile)}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300/40 shadow-lg'
                  : highContrast
                  ? 'bg-slate-900 border-amber-400 text-amber-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-md'
              }`}
            >
              {tile.isRedFlag && (
                <span className="absolute top-2 right-2 text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs border border-rose-200">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  {language === 'hi' ? 'महत्वपूर्ण' : 'Red Flag'}
                </span>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-xs ${
                  isSelected
                    ? 'bg-emerald-500 text-white'
                    : tile.isRedFlag
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-sky-100 text-sky-700 group-hover:scale-105 transition-transform'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <h5 className="font-black text-sm text-sky-950 leading-tight mb-0.5">
                  {language === 'hi' ? tile.nameHindi.split('(')[0] : tile.name}
                </h5>
                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  {language === 'hi' ? tile.name : tile.nameHindi}
                </p>
              </div>

              {isSelected && (
                <span className="mt-2 text-xs text-emerald-700 font-black flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'जोड़ा गया' : 'Added'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Duration & Severity Dialog for the active symptom */}
      {activeTile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-7 shadow-2xl border-4 border-sky-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-black text-sky-950 mb-1 flex items-center gap-2">
              <Plus className="w-6 h-6 text-sky-600" />
              {language === 'hi'
                ? `${activeTile.nameHindi.split('(')[0]} का विवरण जोड़ें`
                : `Add details for ${activeTile.name}`}
            </h3>
            <p className="text-xs text-slate-600 mb-5 font-medium">
              {language === 'hi'
                ? 'कृपया बताएं कि यह परेशानी कितने दिनों से है और कितनी तेज है:'
                : 'Please specify how long you have had this and its severity:'}
            </p>

            {/* Duration Selector */}
            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2">
                {language === 'hi' ? 'समय अवधि (Duration):' : 'How long?'}
              </label>
              <div className="flex gap-2.5">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-20 p-2.5 text-lg font-black bg-sky-50/50 border-2 border-slate-200 rounded-xl text-center text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
                />
                <div className="flex gap-1.5 flex-1">
                  {(['days', 'weeks', 'months'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setDurationUnit(unit)}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl border-2 cursor-pointer transition-all ${
                        durationUnit === unit
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                          : 'bg-sky-50/50 text-slate-700 border-slate-200 hover:bg-sky-100'
                      }`}
                    >
                      {language === 'hi'
                        ? unit === 'days'
                          ? 'दिन'
                          : unit === 'weeks'
                          ? 'सप्ताह'
                          : 'महीने'
                        : unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Severity Selector */}
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-wider text-sky-950 mb-2">
                {language === 'hi' ? 'तकलीफ कितनी ज्यादा है (Severity)?' : 'Severity:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['mild', 'moderate', 'severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`py-3 px-1 text-xs font-black rounded-xl border-2 text-center cursor-pointer transition-all ${
                      severity === sev
                        ? sev === 'severe'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                          : 'bg-sky-600 text-white border-sky-600 shadow-md'
                        : 'bg-sky-50/50 text-slate-700 border-slate-200 hover:bg-sky-100'
                    }`}
                  >
                    {language === 'hi'
                      ? sev === 'mild'
                        ? 'हल्की (Mild)'
                        : sev === 'moderate'
                        ? 'मध्यम (Mod)'
                        : 'तेज़ (Severe)'
                      : sev.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveTile(null)}
                className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleAddConfirmed}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black shadow-xl cursor-pointer border-b-4 border-emerald-700 active:scale-98 transition-all"
              >
                {language === 'hi' ? 'लक्षण जोड़ें' : 'Add Symptom'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
