
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const LovePopup: React.FC<Props> = ({ onComplete }) => {
  const [hayirPos, setHayirPos] = useState({ top: '60%', left: '70%' });
  const [hayirCount, setHayirCount] = useState(0);
  const [message, setMessage] = useState('Beni seviyon mu lan gotelek');
  const [isFinished, setIsFinished] = useState(false);

  const moveHayir = () => {
    if (hayirCount >= 2) {
      setHayirCount(3);
      setMessage("BAK SIMDI KACAMAZSIN LAN IT");
      return;
    }
    
    const randomTop = Math.floor(Math.random() * 40 + 30) + '%';
    const randomLeft = Math.floor(Math.random() * 40 + 30) + '%';
    setHayirPos({ top: randomTop, left: randomLeft });
    setHayirCount(prev => prev + 1);

    const sitemler = [
      "NASIL LAN BENI SEVMIYON MU KOPEK",
      "DALGA MI GECIYON GOT LALESI",
      "BIR DAHA DENE BAKAYIM YEMEZLER IT"
    ];
    setMessage(sitemler[hayirCount] || "Beni seviyon mu lan gotelek");
  };

  const handleEvet = () => {
    setMessage("BILIYODUM ZATEN INEK MO MOOO");
    setIsFinished(true);
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/40 backdrop-blur-xl p-6 overflow-hidden">
      <div className={`bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center border-8 border-pink-500 animate-stamp transition-all duration-500 ${isFinished ? 'scale-110' : ''}`}>
        
        <div className={`text-2xl font-black text-pink-700 text-center mb-10 leading-tight uppercase`}>
          {message}
        </div>

        <div className="relative w-full h-[200px] flex items-center justify-center">
          <button
            onClick={handleEvet}
            className={`transition-all duration-700 bg-green-500 text-white font-black px-10 py-5 rounded-[2rem] shadow-xl text-xl active:scale-95 z-10
              ${hayirCount >= 3 || isFinished ? 'scale-125 shadow-[0_15px_30px_rgba(34,197,94,0.4)]' : ''}`}
          >
            EVET
          </button>

          {hayirCount < 3 && !isFinished && (
            <button
              onMouseEnter={moveHayir}
              onClick={moveHayir}
              onTouchStart={moveHayir}
              style={{ position: 'absolute', top: hayirPos.top, left: hayirPos.left }}
              className="transition-all duration-200 bg-red-500 text-white font-black px-8 py-4 rounded-[1.5rem] shadow-lg text-lg -translate-x-1/2 -translate-y-1/2 whitespace-nowrap z-20"
            >
              HAYIR
            </button>
          )}
        </div>

        {!isFinished && (
          <div className="mt-8 text-pink-400 font-black text-[10px] uppercase tracking-widest opacity-50 animate-pulse">
            Secimini yapmadan asla cikamazsin inek
          </div>
        )}
      </div>
    </div>
  );
};
