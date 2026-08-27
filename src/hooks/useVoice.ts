import { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageCode } from '../types';

interface UseVoiceProps {
  language: LanguageCode;
  speechRate?: number; // 0.7 for elderly mode, 1.0 normal
  onTranscriptComplete?: (transcript: string) => void;
}

export function useVoice({ language, speechRate = 0.9, onTranscriptComplete }: UseVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSupported(false);
      }
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback(
    (text: string, overrideRate?: number) => {
      if (!synthRef.current) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      if (!text || text.trim() === '') return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = overrideRate || speechRate || 0.9;
      utterance.pitch = 1.0;

      // Map language
      const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = langCode;

      // Try to find matching voice
      const voices = synthRef.current.getVoices();
      const match = voices.find(
        (v) => v.lang === langCode || v.lang.startsWith(language === 'hi' ? 'hi' : 'en')
      );
      if (match) {
        utterance.voice = match;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [language, speechRate]
  );

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use touch input.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setError(
            language === 'hi'
              ? 'आवाज स्पष्ट नहीं सुनाई दी। कृपया दोबारा बोलें या स्क्रीन पर विकल्प चुनें।'
              : 'Could not catch that clearly. Please speak again or tap options.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (onTranscriptComplete && transcript) {
          onTranscriptComplete(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setError('Could not access microphone.');
    }
  }, [language, onTranscriptComplete, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    setTranscript,
    resetTranscript,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    error,
    supported,
  };
}
