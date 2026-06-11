/**
 * Voice-to-text using Web Speech API.
 * Falls back gracefully if not supported.
 */

export interface VoiceInputOptions {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  lang?: string;
}

let currentRecognition: any = null;

export function isVoiceSupported(): boolean {
  return typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );
}

export function startVoiceInput(options: VoiceInputOptions): () => void {
  if (!isVoiceSupported()) {
    options.onError?.('Voice input not supported on this device');
    return () => {};
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  currentRecognition = recognition;

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = options.lang || 'en-GB';

  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results as any[])
      .map((r: any) => r[0].transcript)
      .join('');
    if (event.results[event.results.length - 1].isFinal) {
      options.onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    options.onError?.(event.error);
  };

  recognition.onend = () => {
    options.onEnd?.();
    currentRecognition = null;
  };

  recognition.start();

  return () => {
    recognition.stop();
    currentRecognition = null;
  };
}

export function stopVoiceInput() {
  if (currentRecognition) {
    currentRecognition.stop();
    currentRecognition = null;
  }
}
