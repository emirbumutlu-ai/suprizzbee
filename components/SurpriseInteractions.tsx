
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { ThemeColor } from '../types';

interface Props { theme: ThemeColor; accentColor: string; }
interface Petal { id: number; rotation: number; isDropped: boolean; }
interface ScratchItem { id: number; value: string; isRevealed: boolean; }

export const SurpriseInteractions: React.FC<Props> = ({ theme, accentColor }) => {
  const [ventText, setVentText] = useState('');
  const [ventResponse, setVentResponse] = useState('');
  const [isLoding, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Kazı Kazan Ayarları
  const winImage = "https://i.imgur.com/IsiqHFL.jpeg";
  const [scratchItems, setScratchItems] = useState<ScratchItem[]>([]);
  const [isWinPopupVisible, setIsWinPopupVisible] = useState(false);

  useEffect(() => {
    initializeScratch();
  }, []);

  const initializeScratch = () => {
    const pool = [
      '500.000 TL', '200.000 TL', '100.000 TL', '50.000 TL', 
      '10.000 TL', '5.000 TL', '1.000 TL', '500 TL', 
      '200 TL', '100 TL', '50 TL', '20 TL', '10 TL', 
      '5 TL', '1 TL', 'Sakız', 'Göt Lalesi Ödülü', 'Boş Yok İt'
    ];
    
    const randomOthers = pool.sort(() => Math.random() - 0.5).slice(0, 4);
    const values = ['1.000.000 TL', '1.000.000 TL', ...randomOthers];
    const shuffled = values.sort(() => Math.random() - 0.5);
    setScratchItems(shuffled.map((v, i) => ({ id: i, value: v, isRevealed: false })));
    setIsWinPopupVisible(false);
  };

  const handleScratch = (id: number) => {
    setScratchItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isRevealed: true } : item);
      const revealedMillions = updated.filter(item => item.isRevealed && item.value === '1.000.000 TL').length;
      if (revealedMillions === 2) {
        setTimeout(() => setIsWinPopupVisible(true), 500);
      }
      return updated;
    });
  };

  // Papatya Ayarları
  const INITIAL_PETALS = 9;
  const [petals, setPetals] = useState<Petal[]>(Array.from({ length: INITIAL_PETALS }).map((_, i) => ({ id: i, rotation: (360 / INITIAL_PETALS) * i, isDropped: false })));
  const [fallingPetals, setFallingPetals] = useState<{ id: number; rotation: number; x: number }[]>([]);
  const [daisyStep, setDaisyStep] = useState(0);
  const daisyWords = ["Sevmiyor", "Sevmiyor", "Seviyor", "Sevmiyor", "Sevmiyor", "Seviyor", "Sevmiyor", "Sevmiyor", "SEVİYORRR! ❤️"];

  const pullPetal = () => {
    const available = petals.filter(p => !p.isDropped);
    if (available.length > 0) {
      const petal = available[0];
      setPetals(prev => prev.map(p => p.id === petal.id ? { ...p, isDropped: true } : p));
      const dropId = Date.now();
      setFallingPetals(prev => [...prev, { id: dropId, rotation: petal.rotation, x: (Math.random() - 0.5) * 100 }]);
      setDaisyStep(prev => prev + 1);
      setTimeout(() => setFallingPetals(prev => prev.filter(p => p.id !== dropId)), 1500);
    }
  };

  const base64ToUint8 = (b64: string) => {
    const bin = atob(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    // Audio verisi 2 byte katı olmalı (Int16Array için)
    const bufferData = data.length % 2 === 0 ? data.buffer : data.buffer.slice(0, data.length - 1);
    const d16 = new Int16Array(bufferData);
    const buf = ctx.createBuffer(1, d16.length, 24000);
    const c = buf.getChannelData(0);
    for (let i = 0; i < d16.length; i++) {
      c[i] = d16[i] / 32768.0;
    }
    return buf;
  };

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: { 
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const buffer = await decodeAudioData(base64ToUint8(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  const handleVent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim() || isLoding) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: ventText }] }],
        config: { systemInstruction: 'Sen Berke isimli, samimi, esprili ve biraz serseri bir karaktersin. Esma için moral verici, kanka ruhlu, bazen söven ama hep seven bir dost gibi kısa cevap yaz.' }
      });
      const reply = response.text || "Seni seviyom ballı çörek!";
      setVentResponse(reply); 
      setVentText(''); 
      speakText(reply);
    } catch (err) {
      console.error(err);
      setVentResponse("Berke her zaman yanında kraliçem!"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const generateAIImage = async () => {
    if (!imagePrompt.trim() || isImageLoading) return;
    setIsImageLoading(true); setGeneratedImage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High quality digital art: ${imagePrompt}` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setGeneratedImage(`data:image/png;base64,${imagePart.inlineData.data}`);
      }
    } catch (err) {
      console.error(err);
    } finally { 
      setIsImageLoading(false); 
    }
  };

  return (
    <div className="w-full max-w-md px-4 space-y-12 mt-12">
      <div className="bg-white/80 p-10 rounded-[3.5rem] shadow-2xl text-center border-4 border-pink-400">
        <h3 className="font-black text-pink-600 mb-6 uppercase text-sm tracking-widest italic">✨ KAZI KAZAN ✨</h3>
        <div className="grid grid-cols-2 gap-4">
          {scratchItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleScratch(item.id)}
              className={`relative h-24 rounded-3xl overflow-hidden cursor-pointer shadow-inner border-4 transition-all ${item.isRevealed ? 'border-pink-200 bg-pink-50 scale-95' : 'border-gray-200 bg-gray-300 active:scale-90'}`}
            >
              {item.isRevealed ? (
                <div className="w-full h-full flex items-center justify-center font-black text-pink-600 animate-stamp italic text-[12px] p-2 leading-tight">
                  {item.value}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🪙</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={initializeScratch} className="mt-8 text-[10px] font-black uppercase tracking-widest text-pink-300 hover:text-pink-500 transition-colors">
          YENİDEN DENE / SIFIRLA
        </button>
      </div>

      {isWinPopupVisible && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-2xl p-6">
          <div className="bg-white p-10 rounded-[4rem] shadow-2xl max-w-sm w-full text-center border-8 border-yellow-400 animate-stamp relative overflow-hidden">
            <h2 className="text-3xl font-black text-yellow-600 mb-4 uppercase italic tracking-tighter">TEBRİKLER GOTELEK!</h2>
            <p className="text-sm font-black text-gray-500 mb-6 uppercase italic">KAZANDINIZ! ÖDÜL AŞAĞIDAKİ:</p>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-yellow-400 mb-8 animate-bounce">
              <img src={winImage} className="w-full h-auto" />
            </div>
            <button onClick={() => setIsWinPopupVisible(false)} className="w-full py-5 bg-yellow-500 text-white font-black rounded-[2rem] shadow-xl hover:bg-yellow-600 transition-all uppercase tracking-widest text-xs">
              TEŞEKKÜR ET KÖPEK
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/70 p-8 rounded-[3rem] shadow-xl border-2 border-white">
        <h3 className="font-black text-gray-700 mb-6 text-center uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">🎨 RESSAM BERKE</h3>
        <div className="space-y-4">
          <div className="relative">
            <input type="text" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="Hayal et kraliçem..." className="w-full p-5 rounded-3xl border-2 border-pink-50 focus:border-pink-200 outline-none text-sm font-bold bg-white/50" />
            <button onClick={generateAIImage} disabled={isImageLoading} className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-2xl text-white text-[10px] font-black shadow-md ${accentColor} disabled:opacity-50`}>{isImageLoading ? '...' : 'ÇİZ'}</button>
          </div>
          {generatedImage && <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white animate-stamp"><img src={generatedImage} className="w-full h-auto" /></div>}
        </div>
      </div>

      <div className="bg-white/70 p-10 rounded-[3.5rem] shadow-xl text-center border-2 border-white relative overflow-hidden">
        <h3 className="font-black text-gray-700 mb-10 uppercase text-[10px] tracking-widest">Beni Seviyor mu? 🌼</h3>
        <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-20" onClick={pullPetal}>
            {petals.map((p) => (
              <div key={p.id} className={`absolute w-14 h-24 bg-white border-2 border-pink-50 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] origin-bottom transition-all duration-300 ${p.isDropped ? 'opacity-0 scale-0' : 'opacity-100'}`} style={{ transform: `rotate(${p.rotation}deg) translateY(-40px)`, boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }} />
            ))}
            <div className="relative w-16 h-16 bg-yellow-400 rounded-full z-30 shadow-lg border-4 border-yellow-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#ca8a04_20%)] bg-[length:8px_8px] opacity-20" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {fallingPetals.map(p => (
              <div key={p.id} className="absolute w-14 h-24 bg-white border-2 border-pink-50 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] animate-petal-fall" style={{ transform: `rotate(${p.rotation}deg) translateY(-40px)`, left: `${50 + p.x}%` } as any} />
            ))}
          </div>
        </div>
        <p className={`font-black text-3xl transition-all ${daisyStep > 0 ? 'scale-110' : ''} ${daisyWords[daisyStep-1]?.includes('SEVİYOR') ? 'text-green-500' : 'text-pink-500'}`}>{daisyStep > 0 ? daisyWords[daisyStep - 1] : 'Dokun ve Kopar...'}</p>
      </div>

      <div className="bg-white/70 p-8 rounded-[3rem] shadow-xl border-2 border-white">
        <h3 className="font-black text-gray-700 mb-6 text-center uppercase text-[10px] tracking-widest">İçinde Kalmasın 💭</h3>
        <form onSubmit={handleVent} className="space-y-4">
          <textarea value={ventText} onChange={(e) => setVentText(e.target.value)} placeholder="Bana ne söylemek istersin?" className="w-full p-5 rounded-3xl border-2 border-pink-50 outline-none text-sm font-bold bg-white/50" rows={3} />
          <button type="submit" disabled={isLoding} className={`w-full py-4 rounded-2xl text-white font-black shadow-md ${accentColor} disabled:opacity-50 transition-all uppercase tracking-widest text-[11px]`}>{isLoding ? '...' : 'GÖNDER GELSİN'}</button>
        </form>
        {ventResponse && (
          <div className="mt-8 p-6 bg-pink-50 rounded-[2rem] border-2 border-white shadow-inner animate-stamp">
            <p className="text-center text-pink-700 font-bold text-sm italic leading-relaxed">"{ventResponse}"</p>
            <div className="mt-4 flex justify-center">
              <button onClick={() => speakText(ventResponse)} className={`p-3 rounded-full ${isSpeaking ? 'bg-pink-400 animate-pulse' : 'bg-pink-200'} text-white shadow-md text-xl`}>
                {isSpeaking ? '🔊' : '🔈'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
