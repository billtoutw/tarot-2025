import React from 'react';
import { TarotCard } from '../types';

interface CardProps {
  card?: TarotCard;
  isFlipped: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  index?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFlipped, 
  isReversed = false, 
  onClick, 
  index = 0, 
  disabled = false, 
  className = '',
  style = {} 
}) => {
  return (
    <div 
      className={`relative w-32 h-56 sm:w-48 sm:h-80 cursor-pointer group ${className} ${disabled ? 'cursor-default' : 'hover:scale-105'} transition-transform duration-500`}
      onClick={!disabled ? onClick : undefined}
      style={style}
    >
      <div 
        className={`w-full h-full relative transform-style-3d transition-all duration-1000 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Card Back - Traditional Mystical Design */}
        <div className="absolute w-full h-full backface-hidden rounded-lg shadow-2xl border-[8px] border-white/10 overflow-hidden bg-[#1e1b4b]">
           
           {/* Inner gold border frame */}
           <div className="absolute inset-1 border-2 border-[#c2985b] rounded opacity-80 z-10"></div>
           
           {/* Intricate Geometric Pattern Background */}
           <div className="w-full h-full opacity-30" style={{
             backgroundColor: '#1e1b4b',
             backgroundImage: `
                repeating-linear-gradient(45deg, #3e3b6b 0px, #3e3b6b 2px, transparent 2px, transparent 8px),
                repeating-linear-gradient(-45deg, #3e3b6b 0px, #3e3b6b 2px, transparent 2px, transparent 8px)
             `
           }}></div>

           {/* Central Mystical Symbol */}
           <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Circle */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-[#c2985b] rounded-full flex items-center justify-center relative bg-[#1e1b4b] shadow-[0_0_15px_rgba(194,152,91,0.3)]">
                 {/* Inner decorative elements */}
                 <div className="absolute w-full h-full border border-[#c2985b] rounded-full opacity-50 scale-90"></div>
                 
                 {/* Star / Eye motif */}
                 <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                    <div className="absolute inset-0 border border-[#c2985b] rotate-45"></div>
                    <div className="absolute inset-0 border border-[#c2985b]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#c2985b] rounded-full shadow-[0_0_10px_#c2985b]"></div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Vintage texture overlay */}
           <div className="absolute inset-0 bg-amber-900 mix-blend-overlay opacity-30 pointer-events-none"></div>
        </div>

        {/* Card Front - Traditional RWS Style */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-xl overflow-hidden bg-[#fffcf5] border-[6px] border-white">
          {card ? (
            <div className={`w-full h-full flex flex-col relative transition-transform duration-700 ${isReversed ? 'rotate-180' : ''}`}>
               {/* Image Container */}
               <div className="flex-grow relative overflow-hidden border border-slate-800/10 m-1">
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover contrast-110 sepia-[0.3] brightness-95"
                  />
                  {/* Old Paper Texture Overlay */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30 mix-blend-multiply"></div>
               </div>
               
               {/* Card Label (Bottom) */}
               <div className="h-8 flex items-center justify-center bg-[#f0eee4] border-t border-slate-300">
                 <span className="font-cinzel font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-widest">
                    {card.nameEn}
                 </span>
               </div>
               
               {/* Roman Numeral (Top) */}
               <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="bg-[#f0eee4]/90 px-2 py-0.5 rounded text-[10px] font-serif font-bold text-slate-800 border border-slate-300 shadow-sm">
                     {['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'][card.id]}
                  </span>
               </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};