
import React, { useState } from 'react';
import { ThemeColor } from '../types';

interface Props {
  onSuccess: () => void;
  theme: ThemeColor;
  isNightMode?: boolean;
}

export const PasswordGate: React.FC<Props> = ({ onSuccess, theme, isNightMode = false }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const CORRECT_PASSWORD = 'pasam';

  const handlePointerEnter = () => {
    if (escapeCount < 5) {
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 150;
      setBtnPos({ x: randomX, y: randomY });
      setEscapeCount(prev => prev + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === CORRECT_PASSWORD) {
      onSuccess();
    } else {
      setError(`Yanlış şifre! Göt lalesi seni... 😜`);
      setPassword('');
      setEscapeCount(0);
      setBtnPos({ x: 0, y: 0 });
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-6 overflow-hidden z-[100] transition-colors duration-500 ${isNightMode ? 'bg-[#064e3b]' : 'bg-[#dcfce7]'}`}>
      {/* Süslemeler */}
      <div className="absolute top-10 left-10 text-5xl animate-bounce">🌿</div>
      <div className="absolute bottom-20 right-10 text-5xl animate-pulse">🌱</div>
      <div className="absolute top-1/4 right-20 text-4xl opacity-20">🐸</div>

      <div className={`${isNightMode ? 'bg-slate-900 border-green-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-white/95 border-green-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'} backdrop-blur-md p-10 rounded-[50px] w-full max-w-sm text-center transform transition-all border-8 relative z-10`}>
        <div className="text-7xl mb-6 animate-bounce">🔐</div>
        
        <h2 className={`text-3xl font-black mb-2 uppercase tracking-tighter italic ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>BALLI ÇÖREĞİM?</h2>
        <p className={`${isNightMode ? 'text-gray-200' : 'text-green-700'} text-2xl mb-8 font-black uppercase tracking-tighter leading-tight drop-shadow-sm`}>
          GİRİŞ YAPMAK İÇİN ŞİFRE AŞAĞIDA...
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreyi yaz..."
              className={`w-full px-6 py-5 rounded-[2.5rem] border-4 outline-none transition-all text-center text-xl font-black shadow-inner ${isNightMode ? 'bg-slate-800 border-green-900 text-green-400 focus:border-green-500' : 'bg-green-50/20 border-green-50 focus:border-green-300 text-green-600'}`}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl opacity-50 hover:opacity-100 transition-opacity"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="text-red-500 font-black text-xs uppercase animate-bounce">{error}</p>}
          
          <div className="relative pt-2">
            <button
              onPointerEnter={handlePointerEnter}
              style={{
                transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                transition: escapeCount < 6 ? 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
              }}
              className="w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-xl transition-all transform active:scale-95 bg-green-500 hover:bg-green-600 uppercase italic tracking-widest"
            >
              GİRİŞ YAP
            </button>
          </div>
        </form>

        <div className="mt-12">
          <button 
            onClick={() => setShowHint(!showHint)}
            className={`w-full py-5 text-sm font-black uppercase px-6 rounded-2xl transition-all tracking-tighter shadow-md border-2 ${isNightMode ? 'bg-green-900 text-green-200 border-green-800 hover:bg-green-800' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'}`}
          >
            ŞİFRE İÇİN TIKLA VE BANA SORMA 🤫
          </button>
          
          {showHint && (
            <div className="mt-6 relative animate-stamp">
              <div className={`p-8 rounded-2xl border-4 border-dashed shadow-2xl relative overflow-hidden ${isNightMode ? 'bg-slate-800 border-green-800' : 'bg-[#fff9e6] border-orange-200'}`}>
                <div className={`absolute top-0 left-0 w-full h-2 ${isNightMode ? 'bg-green-900' : 'bg-orange-100'}`}></div>
                <div className={`font-black text-sm leading-relaxed uppercase italic ${isNightMode ? 'text-green-300' : 'text-orange-900'}`}>
                  "şifre yanlız bana düğmeyi attıktan sonra söylerim!" 😜
                </div>
                <div className="text-5xl mt-4 opacity-30 flex justify-center">✉️</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
