import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { haptic } from '../../lib/haptics';
import { isVoiceSupported, startVoiceInput } from '../../lib/voiceInput';
import { captureVoiceInputUsed } from '../../lib/analytics';

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onResult, className }) => {
  const [isListening, setIsListening] = useState(false);
  const supported = isVoiceSupported();

  if (!supported) return null;

  const handleClick = () => {
    if (isListening) {
      setIsListening(false);
      haptic('light');
    } else {
      haptic('medium');
      setIsListening(true);
      startVoiceInput({
        onResult: (text) => {
          onResult(text);
          captureVoiceInputUsed();
          setIsListening(false);
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
        isListening
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'bg-brand-borderLight text-brand-mid hover:bg-brand-border active:scale-95'
      } ${className}`}
      title={isListening ? 'Stop listening' : 'Voice input'}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
};
