import React from 'react';
import { Mic, MicOff, Volume2, RotateCcw, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../../../context/AccessibilityContext';

interface VoiceWaveProps {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onListenAgain?: () => void;
  onResetTranscript?: () => void;
  error?: string | null;
  placeholderPrompt?: string;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  isListening,
  isSpeaking,
  transcript,
  onStartListening,
  onStopListening,
  onListenAgain,
  onResetTranscript,
  error,
  placeholderPrompt,
}) => {
  const { language, highContrast } = useAccessibility();

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      highContrast
        ? 'bg-slate-900 border-amber-400/60'
        : 'bg-gradient-to-b from-emerald-50/70 to-slate-50 border-emerald-200 shadow-sm'
    }`} id="kiosk-voice-wave-container">
      <div className="flex flex-col items-center text-center">
        {/* Main Microphone Button */}
        <div className="relative mb-4">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40 scale-125" />
          )}
          <button
            id="voice-mic-main-btn"
            onClick={isListening ? onStopListening : onStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-xl relative z-10 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isListening ? 'रोकने के लिए दबाएं (Tap to Stop)' : 'बोलने के लिए दबाएं (Tap to Speak)'}
          >
            {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
          </button>
        </div>

        {/* Status text */}
        <h4 className="text-base font-bold text-slate-800 dark:text-amber-300 mb-1">
          {isListening
            ? language === 'hi'
              ? 'सुन रहे हैं... कृपया स्पष्ट बोलें'
              : 'Listening... Please speak clearly'
            : isSpeaking
            ? language === 'hi'
              ? 'निर्देश पढ़े जा रहे हैं...'
              : 'Playing audio instructions...'
            : language === 'hi'
            ? 'बोलने के लिए हरा माइक बटन दबाएं'
            : 'Tap the green mic button to speak'}
        </h4>

        {placeholderPrompt && !transcript && !isListening && (
          <p className="text-xs text-slate-500 italic max-w-sm mb-3">
            "{placeholderPrompt}"
          </p>
        )}

        {/* Live / recorded transcript box */}
        {transcript ? (
          <div className="w-full mt-3 p-3.5 rounded-xl bg-white border border-emerald-200 text-left shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              {language === 'hi' ? 'आपने जो कहा (Captured Voice):' : 'Captured Transcript:'}
            </span>
            <p className="text-slate-800 text-sm md:text-base font-medium">"{transcript}"</p>

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 justify-end">
              {onResetTranscript && (
                <button
                  id="voice-retry-btn"
                  onClick={onResetTranscript}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100"
                >
                  <RotateCcw className="w-3 h-3" />
                  {language === 'hi' ? 'दोबारा बोलें' : 'Clear & Speak Again'}
                </button>
              )}
              {onListenAgain && (
                <button
                  id="voice-readout-btn"
                  onClick={onListenAgain}
                  className="text-xs text-emerald-800 hover:text-emerald-950 flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 font-medium"
                >
                  <Volume2 className="w-3 h-3" />
                  {language === 'hi' ? 'सुनें' : 'Listen Back'}
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mt-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
