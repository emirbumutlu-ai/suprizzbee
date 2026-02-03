
import React, { useRef, useState, useEffect } from 'react';

interface Props {
  accentColor: string;
  isNightMode: boolean;
}

export const FriendshipContract: React.FC<Props> = ({ accentColor, isNightMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [isStamping, setIsStamping] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
      }
    }
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isStamped) return;
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isStamped) return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#BE185D';
      ctx.stroke();
      setHasSigned(true);
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (isStamped) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    setHasSigned(false);
  };

  const handleStamp = () => {
    if (isStamping || isStamped) return;
    setIsStamping(true);
    
    setTimeout(() => {
      (window as any).confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#ff0000', '#be185d']
      });
    }, 400);

    setTimeout(() => {
      setIsStamping(false);
      setIsStamped(true);
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      className={`p-10 rounded-[4rem] shadow-2xl transition-all ${isNightMode ? 'bg-slate-800 text-pink-100' : 'bg-white text-gray-800'} border-8 border-dashed border-pink-200 relative overflow-hidden`}
    >
      <div className="absolute -top-10 -right-10 text-9xl opacity-10 rotate-12">
         📜
      </div>

      <h2 className="text-3xl font-black mb-6 text-center tracking-tighter uppercase italic text-pink-600">Sözleşme Vakti 🖋️</h2>
      <p className="text-center mb-8 leading-relaxed font-bold text-lg italic">
        "Bu siteyi açan ballı çörek, Berke'yi ömür boyu çekmek zorundadır. Berke'nin otistik kafa yapısını kabul eder ve onu her gün bolca öpmeyi taahhüt eder."
      </p>
      
      <div className="relative group overflow-visible">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className={`w-full border-4 border-pink-100 rounded-[2.5rem] cursor-crosshair transition-all touch-none bg-pink-50/30 shadow-inner ${isStamped ? 'opacity-50' : ''}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {!hasSigned && !isStamped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 font-black text-xl uppercase tracking-widest text-pink-400">
            Buraya İmza At
          </div>
        )}

        {(isStamping || isStamped) && (
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 text-9xl ${isStamping ? 'animate-stamp' : ''}`}>
             ✅
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {!isStamped && (
          <button
            onClick={clearCanvas}
            className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-pink-500 transition-colors"
          >
            İmzayı Temizle
          </button>
        )}
        
        {hasSigned && !isStamped && (
          <button
            className={`w-full py-6 rounded-[2.5rem] text-white font-black text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 bg-pink-500 ${isStamping ? 'opacity-50' : 'animate-bounce'}`}
            onClick={handleStamp}
            disabled={isStamping}
          >
            MÜHÜRÜ BAS! ❤️
          </button>
        )}

        {isStamped && (
          <div className="text-center py-5 bg-green-50 rounded-[2rem] border-4 border-green-500 text-green-600 font-black uppercase tracking-widest animate-stamp">
            ✅ RESMİ OLARAK ONAYLANDI
          </div>
        )}
      </div>
    </div>
  );
};
