
import React, { useState, useEffect } from 'react';

interface Props {
  showTax: boolean;
  closeTax: () => void;
  showError31: boolean;
  closeError31: () => void;
  showAutism: boolean;
  closeAutism: () => void;
  triggerHug: () => void;
}

export const SurprisePopups: React.FC<Props> = ({ 
  showTax, closeTax, 
  showError31, closeError31, 
  showAutism, closeAutism, 
  triggerHug 
}) => {
  const [taxPaid, setTaxPaid] = useState(false);

  const handlePayTax = () => {
    triggerHug();
    setTaxPaid(true);
    setTimeout(() => {
      setTaxPaid(false);
      closeTax();
    }, 1500);
  };

  const autismMessages = [
    "Göt müsün? Evet.",
    "Otizm seviyesi: Maksimum.",
    "Şu an neye bakıyon it?",
    "Maasın yattı mı gotelek?",
    "Naber gotelek?",
    "Sisteme inek girdi: MÖÖÖ.",
    "Göt lalesi detected!",
    "Acıktın mı gotelek?",
    "Beni özledin mi köpek?"
  ];

  const [currentAutismMsg, setCurrentAutismMsg] = useState("");

  useEffect(() => {
    if (showAutism) {
      setCurrentAutismMsg(autismMessages[Math.floor(Math.random() * autismMessages.length)]);
    }
  }, [showAutism]);

  return (
    <>
      {/* VERGİ POPUP */}
      {showTax && (
        <div className="fixed inset-0 flex items-center justify-center z-[500] p-6 bg-black/50 backdrop-blur-xl">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl max-w-sm w-full text-center border-8 border-pink-400 animate-stamp">
            {!taxPaid ? (
              <>
                <div className="text-6xl mb-6">💰</div>
                <h2 className="text-2xl font-black text-pink-600 mb-4 uppercase">GOTELEK VERGİSİ!</h2>
                <p className="text-gray-500 font-bold mb-8 text-sm uppercase">Sistemde asırı goteleklik tespit edildi. Devam etmek için sarılma borcun var it.</p>
                <button 
                  onClick={handlePayTax}
                  className="w-full py-5 bg-pink-500 text-white font-black rounded-[2rem] shadow-xl hover:bg-pink-600 transition-all uppercase tracking-widest text-xs"
                >
                  SARIL VE ÖDE
                </button>
              </>
            ) : (
              <div className="py-10">
                <div className="text-7xl mb-6">✅</div>
                <h2 className="text-3xl font-black text-green-500 uppercase italic">BORC KAPANDI IT</h2>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTİSTİK BİLDİRİM POPUP */}
      {showAutism && (
        <div className="fixed inset-0 flex items-center justify-center z-[510] p-6 bg-black/40 backdrop-blur-2xl">
          <div className="bg-indigo-600 text-white p-10 rounded-[4rem] shadow-2xl max-w-sm w-full border-8 border-white animate-stamp text-center">
            <div className="text-6xl mb-6">🤪</div>
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter italic">BİLDİRİM GELDİ!</h2>
            <p className="text-xl font-black mb-8 leading-tight uppercase italic">{currentAutismMsg}</p>
            <button 
              onClick={closeAutism}
              className="w-full py-5 bg-white text-indigo-600 font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-xs"
            >
              TAMAM GOTELEK
            </button>
          </div>
        </div>
      )}

      {/* HATA 31 POPUP */}
      {showError31 && (
        <div className="fixed inset-0 flex items-center justify-center z-[520] p-6 bg-red-900/60 backdrop-blur-3xl">
          <div className="bg-red-600 text-white p-10 rounded-[3.5rem] shadow-2xl max-w-sm w-full border-8 border-white animate-bounce text-center">
            <div className="text-7xl mb-6">🚨</div>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tighter">SİSTEM COKTU!</h2>
            <p className="text-sm font-black opacity-90 uppercase leading-tight mb-8 italic">Asırı goteleklik nedeniyle devreler yandı it. Hata kodu: 31</p>
            <button 
              onClick={closeError31}
              className="w-full py-5 bg-white text-red-600 font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-xs"
            >
              RESET AT KOPKE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
