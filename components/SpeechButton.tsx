
import React from 'react';
import { playSound } from '../services/ttsService';

interface SpeechButtonProps {
  text: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
}

const SpeechButton: React.FC<SpeechButtonProps> = ({ text, label, className, icon }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        playSound(text);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 hover:brightness-110 shadow-md ${className}`}
    >
      {icon || (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      )}
      {label && <span className="font-semibold">{label}</span>}
    </button>
  );
};

export default SpeechButton;
