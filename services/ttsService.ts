
export const playSound = (text: string, rate: number = 0.95) => {
  // Cancel any ongoing speech to avoid overlaps
  window.speechSynthesis.cancel();
  
  const speakData = new SpeechSynthesisUtterance();
  speakData.text = text;
  speakData.lang = 'th-TH';
  speakData.rate = rate; // Slightly faster for academic tone
  speakData.volume = 1;
  speakData.pitch = 1; // Natural pitch
  
  // Find a high-quality Thai voice if available
  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find(v => v.lang.includes('th-TH') && v.name.includes('Google')) || 
                    voices.find(v => v.lang.includes('th'));
                    
  if (thaiVoice) {
    speakData.voice = thaiVoice;
  }

  window.speechSynthesis.speak(speakData);
};

// Handle voices loading asynchronously in some browsers
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
