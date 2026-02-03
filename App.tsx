
import React, { useState, useEffect } from 'react';
import { PasswordGate } from './components/PasswordGate';
import { PhotoGallery } from './components/PhotoGallery';
import { ThemePicker } from './components/ThemePicker';
import { SurpriseInteractions } from './components/SurpriseInteractions';
import { FriendshipContract } from './components/FriendshipContract';
import { HugEffect } from './components/HugEffect';
import { CompatibilityMeter } from './components/CompatibilityMeter';
import { StarRain } from './components/StarRain';
import { SurprisePopups } from './components/SurprisePopups';
import { LovePopup } from './components/LovePopup';
import { Photo, ThemeColor } from './types';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [isFullyEntered, setIsFullyEntered] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('pink');
  const [isNightMode, setIsNightMode] = useState(false);
  const [showHug, setShowHug] = useState(false);
  const [popups, setPopups] = useState({ tax: false, error31: false, autism: false });

  const photos: Photo[] = [
    { id: 1, url: 'https://i.imgur.com/Qy30PnT.jpeg', emoji: '🍑', caption: 'GOTUME BENZİYON BİRAZ' },
    { id: 2, url: 'https://i.imgur.com/voKD5Vv.jpeg', emoji: '🤨', caption: 'HMM İŞTE YA GUZELSİN HM' },
    { id: 3, url: 'https://i.imgur.com/TjBwKaB.jpeg', emoji: '💅', caption: 'GELDİ BENİM FAV FAMBOYY' },
    { id: 4, url: 'https://i.imgur.com/ZvMwIfW.jpeg', emoji: '✨', caption: 'MÜKEMMELLİYETTTCİ YARRAKK' },
    { id: 5, url: 'https://i.imgur.com/8kLAGYK.jpeg', emoji: '🔥', caption: 'BAK BU FOTO GUZELLLMİSSS' },
    { id: 6, url: 'https://i.imgur.com/ejbEFW5.jpeg', emoji: '🎨', caption: 'AYNI FOTONUN RENKİSİ AMK SALAK BU' },
  ];

  useEffect(() => {
    if (isFullyEntered) {
      const interval = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.4) {
          setPopups(prev => ({ ...prev, autism: true }));
        } else if (rand < 0.7) {
          setPopups(prev => ({ ...prev, tax: true }));
        } else {
          setPopups(prev => ({ ...prev, error31: true }));
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isFullyEntered]);

  const triggerHug = () => {
    setShowHug(true);
    setTimeout(() => setShowHug(false), 2000);
  };

  const getAccentColor = () => {
    switch (currentTheme) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-emerald-500';
      case 'yellow': return 'bg-amber-500';
      default: return 'bg-pink-500';
    }
  };

  const getBgColor = () => {
    if (isNightMode) return 'bg-slate-900';
    switch (currentTheme) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-emerald-50';
      case 'yellow': return 'bg-amber-50';
      default: return 'bg-pink-50';
    }
  };

  if (!isAuthorized) {
    return <PasswordGate onSuccess={() => { setIsAuthorized(true); setShowLovePopup(true); }} theme={currentTheme} isNightMode={isNightMode} />;
  }
  
  if (showLovePopup) {
    return <LovePopup onComplete={() => { setShowLovePopup(false); setIsFullyEntered(true); }} />;
  }

  const mainMessage = "KISA OLCAK VE ÖZ OLCAK BEN SENİ ÇOK SEVİYORUM EN SEVDİĞİM BACİMSİN SEN NE KADWR UZAKTA OLSANDA KALBİMDE BİR YUVARLAK GOTSN SEN SENİ SEVİYOMMM FISTIK AMA SEN GOTSUN BUNU BİL VE VE VE SENİ ÇOK SEVİYOM HE BU ARADA AŞAĞIDAKİ YERLERE RESSAM BERKE OLAN YERE İSTEDİĞİN BİŞİ YAZ MESELA ÖRNEK VERİYOM HAMBURGER YİYEN AYI MESELA OLUŞTUR SONRA HATA ALABİLİRSİN YAPAY ZEKA BİRAZ MAL TEKRAR TEKRAR DENE O EN SONDA YAPACAK VE İÇİNDE KALMASIN SÖYLE OLAN KISMA İSTEDİĞİN BİŞİ YAZ VE ORADA YANIT GELECEK AŞAĞIDA MİKROFON İŞARETİ VAR KNA BAS EĞERKİ SES GELMEZEE 2 Cİ KEZ 3 CU KEZ BAS EN SONDA SES GELCEKKKKK SENİ SEVİYOMMM BALLLLL 😍😍🤍";

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBgColor()} pb-20 overflow-x-hidden ${showHug ? 'hug-active' : ''} antialiased`}>
      {isNightMode && <StarRain />}
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <ThemePicker 
            currentTheme={currentTheme} 
            setTheme={setCurrentTheme} 
            isNightMode={isNightMode} 
            toggleNight={() => setIsNightMode(!isNightMode)} 
          />
        </div>
      </div>

      <main className="flex flex-col items-center pt-28 px-4 space-y-12 hug-target transition-transform duration-700 will-change-transform">
        <header className="text-center">
          <h1 className={`text-4xl font-black mb-4 uppercase tracking-tighter animate-bounce ${isNightMode ? 'text-pink-300' : 'text-pink-600'}`}>
            SENİN İÇİN <br/> KÜÇÜK BİR SÜRPRİZ!
          </h1>
          <p className="text-gray-400 font-bold italic tracking-widest uppercase text-[10px]">Sadece goteleklere özel... 🤍</p>
        </header>

        <PhotoGallery photos={photos} accentColor={getAccentColor()} />

        <div className="w-full max-w-md bg-white/60 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl border-4 border-white transform translate-z-0">
          <p className="text-pink-700 font-bold leading-relaxed text-sm italic text-center whitespace-pre-wrap uppercase tracking-tight">
            {mainMessage}
          </p>
        </div>

        <CompatibilityMeter theme={currentTheme} />
        
        <SurpriseInteractions theme={currentTheme} accentColor={getAccentColor()} />

        <button 
          onClick={triggerHug}
          className={`px-12 py-6 rounded-full text-white font-black text-2xl shadow-2xl transition-all transform active:scale-90 animate-pulse ${getAccentColor()} translate-z-0`}
        >
          BERKE'YE SARIL 🤗
        </button>

        <FriendshipContract accentColor={getAccentColor()} isNightMode={isNightMode} />

        <footer className="text-center py-10">
          <p className="text-pink-400 font-black text-[10px] tracking-widest uppercase">
            BERKE TARAFINDAN ÖZENLE KODLANDI 🫶🏻🤍
          </p>
        </footer>
      </main>

      <HugEffect />
      
      <SurprisePopups 
        showTax={popups.tax} 
        closeTax={() => setPopups(prev => ({ ...prev, tax: false }))}
        showError31={popups.error31}
        closeError31={() => setPopups(prev => ({ ...prev, error31: false }))}
        showAutism={popups.autism}
        closeAutism={() => setPopups(prev => ({ ...prev, autism: false }))}
        triggerHug={triggerHug}
      />
    </div>
  );
};

export default App;
