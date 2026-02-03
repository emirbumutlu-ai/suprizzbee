
import React, { useState } from 'react';
import { ThemeColor } from '../types';

interface Props {
  theme: ThemeColor;
}

export const CompatibilityMeter: React.FC<Props> = ({ theme }) => {
  const [percentage, setPercentage] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [hasTested, setHasTested] = useState(false);

  // Kullanıcı tarafından sağlanan gerçek fotoğraflar
  const berkeImg = "https://i.imgur.com/XuX7UPw.jpeg"; 
  const esmaImg = "https://i.imgur.com/1ILcfph.jpeg";   

  const runTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    setHasTested(true);
    let cycles = 0;
    const interval = setInterval(() => {
      setPercentage(Math.floor(Math.random() * 100));
      cycles++;
      if (cycles > 15) {
        clearInterval(interval);
        const finalTarget = Math.floor(Math.random() * 8) + 93;
        let current = percentage;
        const finalStep = setInterval(() => {
          if (current < finalTarget) current++; else if (current > finalTarget) current--; else {
            clearInterval(finalStep);
            setIsTesting(false);
          }
          setPercentage(current);
        }, 30);
      }
    }, 100);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-10 rounded-[4rem] shadow-2xl text-center border-4 border-pink-100 w-full max-w-md">
      <h3 className="text-2xl font-black text-pink-600 mb-8 uppercase tracking-widest italic">UYUM TESTİ</h3>
      
      <div className="flex items-center justify-around mb-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-blue-400 bg-blue-50 overflow-hidden animate-bounce shadow-lg">
            <img src={berkeImg} alt="Berke" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-blue-500 text-xs uppercase tracking-widest mt-3">BERKE</span>
        </div>
        
        <div className="text-5xl animate-pulse">❤️</div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-pink-400 bg-pink-50 overflow-hidden animate-bounce shadow-lg" style={{animationDelay: '0.5s'}}>
            <img src={esmaImg} alt="Esma" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-pink-500 text-xs uppercase tracking-widest mt-3">Esma</span>
        </div>
      </div>
      
      <div className="w-full h-14 bg-gray-100 rounded-full overflow-hidden relative shadow-inner p-1.5 mb-8 border-2 border-white">
        <div 
          className="h-full transition-all duration-150 ease-out rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="font-black text-white text-lg drop-shadow-md">%{percentage}</span>
          )}
        </div>
      </div>

      {!isTesting && !hasTested ? (
        <button 
          onClick={runTest}
          className="w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-xl transform transition-all active:scale-95 bg-pink-500 uppercase tracking-tighter italic"
        >
          KADERİMİZİ ÇİZ ✍️
        </button>
      ) : isTesting ? (
        <div className="py-5 text-pink-500 font-black animate-pulse uppercase text-sm tracking-widest flex items-center justify-center gap-2">
          <span>✨</span> YILDIZLAR HESAPLANIYOR... <span>✨</span>
        </div>
      ) : (
        <div className="space-y-4 animate-stamp">
          <p className="text-xl text-pink-700 font-black italic leading-tight uppercase">
            "Sonsuza Kadar Beraber!" ❤️✨
          </p>
          <div className="text-5xl">🎆🎉</div>
        </div>
      )}
    </div>
  );
};
