import React, { useState, useEffect, useRef } from 'react';
import { Category, ReadingPhase, DrawnCard, TarotCard } from './types';
import { MAJOR_ARCANA, CATEGORY_CONFIG } from './constants';
import { getTarotReading } from './services/geminiService';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Sparkles, ArrowLeft, RefreshCw, Stars } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Helper to generate stars
const generateStars = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.8 ? 'w-1 h-1' : 'w-0.5 h-0.5'
  }));
};

// Loading messages to cycle through
const LOADING_MESSAGES = [
  "正在連結星象能量...",
  "解讀古老的符號...",
  "感應正逆位的啟示...",
  "傾聽命運的低語...",
  "正在撰寫你的預言..."
];

export default function App() {
  const [phase, setPhase] = useState<ReadingPhase>(ReadingPhase.WELCOME);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [readingText, setReadingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [stars, setStars] = useState<any[]>([]);
  const [availableDeckIndices, setAvailableDeckIndices] = useState<number[]>([]);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  
  const readingContentRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the promise of the API call (Pre-fetching)
  const readingStreamPromiseRef = useRef<Promise<ReadableStream<string>> | null>(null);

  useEffect(() => {
    setStars(generateStars(50));
  }, []);

  useEffect(() => {
    if (phase === ReadingPhase.CARD_SELECTION) {
      // Initialize available indices for the deck visualization
      setAvailableDeckIndices(Array.from({ length: 22 }, (_, i) => i));
    }
  }, [phase]);

  // Cycle loading messages
  useEffect(() => {
    let interval: number;
    if (phase === ReadingPhase.REVEAL && isStreaming && !readingText) {
      interval = window.setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [phase, isStreaming, readingText]);

  // Scroll to bottom of reading when streaming
  useEffect(() => {
    if (readingContentRef.current) {
        readingContentRef.current.scrollTop = readingContentRef.current.scrollHeight;
    }
  }, [readingText]);

  const handleStart = () => setPhase(ReadingPhase.CATEGORY_SELECT);

  const selectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setPhase(ReadingPhase.QUESTION_INPUT);
  };

  const submitQuestion = () => {
    setPhase(ReadingPhase.SHUFFLE);
    // Simulate shuffle time then go to card selection
    setTimeout(() => {
      setPhase(ReadingPhase.CARD_SELECTION);
    }, 2000);
  };

  const handleCardClick = (deckIndex: number) => {
    if (selectedCards.length >= 3) return;

    // Remove this specific visual card from available deck
    setAvailableDeckIndices(prev => prev.filter(i => i !== deckIndex));

    // Logic to pick a random REAL card that hasn't been picked yet
    const remainingDeck = MAJOR_ARCANA.filter(
      card => !selectedCards.some(c => c.card.id === card.id)
    );
    
    const randomIndex = Math.floor(Math.random() * remainingDeck.length);
    const card = remainingDeck[randomIndex];
    
    const positions: Array<'Past' | 'Present' | 'Future'> = ['Past', 'Present', 'Future'];
    const currentPosition = positions[selectedCards.length];

    // Randomize Upright/Reversed (30% chance reversed)
    const isReversed = Math.random() > 0.7;

    const newDrawnCard: DrawnCard = {
      card,
      position: currentPosition,
      isReversed: isReversed
    };

    const newCards = [...selectedCards, newDrawnCard];
    setSelectedCards(newCards);

    // Check if this was the last card (3rd card)
    if (newCards.length === 3) {
      // --- CRITICAL OPTIMIZATION: PRE-FETCH ---
      // Start the API call IMMEDIATELY, do not wait for animation
      if (selectedCategory) {
        readingStreamPromiseRef.current = getTarotReading(selectedCategory, question, newCards);
      }
      
      // Wait for visual animation to finish before switching screens
      setTimeout(() => startReadingTransition(), 1200);
    }
  };

  const startReadingTransition = async () => {
    setPhase(ReadingPhase.REVEAL);
    setIsStreaming(true);
    setLoadingMsgIndex(0);
    
    try {
      // Wait for the pre-fetched promise to resolve
      if (!readingStreamPromiseRef.current) {
         throw new Error("Reading stream not initialized");
      }
      
      const stream = await readingStreamPromiseRef.current;
      const reader = stream.getReader();
      
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += value;
        setReadingText(fullText);
      }
    } catch (error) {
      console.error(error);
      setReadingText("星象混亂，請稍後重試...");
    } finally {
      setIsStreaming(false);
      readingStreamPromiseRef.current = null; // Reset
    }
  };

  const resetApp = () => {
    setPhase(ReadingPhase.WELCOME);
    setSelectedCategory(null);
    setQuestion('');
    setSelectedCards([]);
    setReadingText('');
    setIsStreaming(false);
    readingStreamPromiseRef.current = null;
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 relative overflow-x-hidden text-amber-50 font-serif selection:bg-amber-900/50">
      {/* Starry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star absolute bg-white rounded-full opacity-70 ${star.size}`}
            style={{ left: star.left, top: star.top, animationDelay: star.delay }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0)_0%,rgba(15,23,42,1)_100%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        {/* Header / Nav */}
        {phase !== ReadingPhase.WELCOME && (
          <div className="absolute top-6 left-4 sm:left-8 z-20">
             <button onClick={resetApp} className="flex items-center gap-2 text-amber-400/60 hover:text-amber-300 transition-colors">
                <ArrowLeft size={20} /> <span className="hidden sm:inline">重置占卜</span>
             </button>
          </div>
        )}

        {/* --- PHASE: WELCOME --- */}
        {phase === ReadingPhase.WELCOME && (
          <div className="text-center space-y-8 animate-[fadeIn_1s_ease-out]">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
               <Sparkles className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold bg-gradient-to-b from-amber-100 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
              塔羅占卜
            </h1>
            <p className="text-lg md:text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
              在命運的星空下，尋找你心中的答案。<br/>
              專注於你的問題，讓古老的智慧為你指引方向。
            </p>
            <div className="pt-8">
              <Button onClick={handleStart}>開始占卜</Button>
            </div>
          </div>
        )}

        {/* --- PHASE: CATEGORY SELECT --- */}
        {phase === ReadingPhase.CATEGORY_SELECT && (
          <div className="w-full max-w-4xl animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl md:text-4xl font-cinzel text-center mb-12 text-amber-100">選擇占卜面向</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                 const Icon = config.icon;
                 return (
                   <button 
                    key={key}
                    onClick={() => selectCategory(key as Category)}
                    className="group relative p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                   >
                     <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-lg bg-slate-900/50 ${config.color}`}>
                          <Icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold tracking-wide text-slate-200 group-hover:text-white">{key}</h3>
                     </div>
                     <p className="text-left text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{config.desc}</p>
                   </button>
                 )
              })}
            </div>
          </div>
        )}

        {/* --- PHASE: QUESTION INPUT --- */}
        {phase === ReadingPhase.QUESTION_INPUT && (
          <div className="w-full max-w-2xl text-center animate-[fadeIn_0.5s_ease-out]">
             <h2 className="text-3xl font-cinzel mb-8">
               心中默念你的問題
               <span className="block text-base font-serif mt-2 text-amber-400/70">({selectedCategory})</span>
             </h2>
             <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={selectedCategory ? CATEGORY_CONFIG[selectedCategory].placeholder : "例如：我最近的運勢如何？（若留空則為整體運勢）"}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-lg text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all min-h-[120px] resize-none"
                />
                <div className="mt-8 flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setPhase(ReadingPhase.CATEGORY_SELECT)}>返回</Button>
                  <Button onClick={submitQuestion}>
                     <span className="flex items-center gap-2">確認並洗牌 <Sparkles size={16} /></span>
                  </Button>
                </div>
             </div>
          </div>
        )}

        {/* --- PHASE: SHUFFLE --- */}
        {phase === ReadingPhase.SHUFFLE && (
          <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <div className="relative w-48 h-80">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div 
                    key={i} 
                    className="absolute inset-0 rounded-lg bg-[#1e1b4b] border-[6px] border-white/10 shadow-2xl"
                    style={{
                      animation: `shuffle 1.5s infinite ease-in-out ${i * 0.1}s`,
                      backgroundImage: 'repeating-linear-gradient(45deg, #3e3b6b 0px, #3e3b6b 2px, transparent 2px, transparent 8px)'
                    }}
                 >
                    {/* Simplified back for shuffle animation */}
                    <div className="absolute inset-0 border-2 border-[#c2985b] rounded opacity-50 m-2"></div>
                 </div>
               ))}
               <div className="absolute inset-0 flex items-center justify-center z-10">
                 <RefreshCw className="w-12 h-12 text-[#c2985b] animate-spin" />
               </div>
            </div>
            <p className="mt-8 text-xl font-cinzel tracking-widest animate-pulse">正在洗牌...</p>
            <style>{`
              @keyframes shuffle {
                0%, 100% { transform: translateX(0) rotate(0); }
                25% { transform: translateX(-30px) rotate(-5deg); }
                75% { transform: translateX(30px) rotate(5deg); }
              }
            `}</style>
          </div>
        )}

        {/* --- PHASE: CARD SELECTION (HORIZONTAL SCROLL) --- */}
        {phase === ReadingPhase.CARD_SELECTION && (
          <div className="w-full flex flex-col items-center justify-start min-h-[70vh] animate-[fadeIn_1s_ease-out] pt-10">
            
            <div className="text-center mb-8">
               <h2 className="text-2xl font-cinzel mb-2 text-amber-100">
                  請依直覺抽取三張牌
               </h2>
               <p className="text-slate-400 text-sm">
                  {selectedCards.length === 0 && "第一張：過去的根源"}
                  {selectedCards.length === 1 && "第二張：現在的處境"}
                  {selectedCards.length === 2 && "第三張：未來的指引"}
               </p>
            </div>

            {/* Selected Cards Slots (Top) */}
            <div className="flex justify-center gap-4 sm:gap-8 mb-12 w-full px-4 min-h-[224px] sm:min-h-[320px]">
               {[0, 1, 2].map((idx) => {
                 const drawn = selectedCards[idx];
                 return (
                   <div key={idx} className="relative group">
                     {drawn ? (
                       <div className="animate-[flyIn_0.6s_ease-out_forwards]">
                          <Card 
                            card={drawn.card} 
                            isFlipped={false} 
                            disabled 
                            className="shadow-[0_0_20px_rgba(194,152,91,0.3)]"
                          />
                          <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 animate-[fadeIn_0.5s_delay-500ms_forwards]">
                             <span className="text-xs font-cinzel text-amber-400 uppercase tracking-widest">{drawn.position}</span>
                          </div>
                       </div>
                     ) : (
                       <div className="w-32 h-56 sm:w-48 sm:h-80 border-2 border-dashed border-slate-800/60 rounded-lg flex items-center justify-center bg-slate-900/20 transition-colors duration-300">
                         <span className="text-slate-700/50 font-cinzel text-3xl">{['I', 'II', 'III'][idx]}</span>
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>

            {/* Horizontal Scroll Deck (Bottom) */}
            {selectedCards.length < 3 && (
              <div className="w-full max-w-5xl mt-auto mb-10">
                 <div className="flex overflow-x-auto pb-12 pt-4 px-12 justify-start sm:justify-center items-end gap-[-3rem] sm:gap-[-4rem] scrollbar-hide mask-fade-sides">
                    {Array.from({ length: 22 }).map((_, i) => {
                       // Only render if it hasn't been picked (visual state)
                       if (!availableDeckIndices.includes(i)) return null;
                       
                       return (
                         <div 
                            key={i}
                            onClick={() => handleCardClick(i)}
                            className="relative flex-shrink-0 w-24 h-40 sm:w-32 sm:h-56 -ml-12 first:ml-0 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-6 hover:z-10 z-0 hover:scale-105"
                         >
                           {/* Simplified card back for deck view to improve performance */}
                            <div className="w-full h-full rounded-lg bg-[#1e1b4b] border-[3px] border-slate-200 shadow-lg flex items-center justify-center overflow-hidden group">
                                <div className="absolute inset-0 opacity-30" style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, #3e3b6b 0px, #3e3b6b 2px, transparent 2px, transparent 8px)'
                                }}></div>
                                <div className="absolute inset-1 border border-[#c2985b] rounded opacity-60"></div>
                                <div className="w-8 h-8 border border-[#c2985b] rotate-45 rounded-sm opacity-80 bg-[#1e1b4b]"></div>
                            </div>
                         </div>
                       );
                    })}
                 </div>
              </div>
            )}
            
            <style>{`
               @keyframes flyIn {
                 0% { opacity: 0; transform: translateY(100px) scale(0.8); }
                 100% { opacity: 1; transform: translateY(0) scale(1); }
               }
               /* Hide scrollbar for clean look */
               .scrollbar-hide::-webkit-scrollbar {
                   display: none;
               }
               .scrollbar-hide {
                   -ms-overflow-style: none;
                   scrollbar-width: none;
               }
            `}</style>
          </div>
        )}

        {/* --- PHASE: REVEAL & READING --- */}
        {phase === ReadingPhase.REVEAL && (
          <div className="w-full max-w-6xl flex flex-col items-center animate-[fadeIn_1s_ease-out] pb-20">
            
            {/* The Spread */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16 w-full justify-center items-center perspective-1000">
              {selectedCards.map((drawn, idx) => (
                <div key={idx} className="flex flex-col items-center animate-[slideInUp_0.5s_ease-out]" style={{ animationDelay: `${idx * 0.3}s` }}>
                  <p className="text-amber-400/60 text-sm font-cinzel tracking-widest mb-3 uppercase">{drawn.position}</p>
                  <Card 
                    card={drawn.card} 
                    isFlipped={true}
                    isReversed={drawn.isReversed}
                    className="shadow-[0_0_25px_rgba(0,0,0,0.6)]"
                    disabled
                  />
                  <div className="mt-5 text-center">
                     <h4 className="text-lg font-bold text-amber-100">
                       {drawn.card.name}
                       <span className={`text-sm ml-2 px-2 py-0.5 rounded ${drawn.isReversed ? 'bg-rose-900/50 text-rose-200' : 'bg-emerald-900/50 text-emerald-200'}`}>
                         {drawn.isReversed ? '逆位' : '正位'}
                       </span>
                     </h4>
                     <p className="text-xs text-slate-400 mt-2 max-w-[180px] mx-auto">
                        {drawn.isReversed ? drawn.card.meaningReversed : drawn.card.meaningUpright}
                     </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Reading */}
            <div className="w-full max-w-3xl bg-slate-900/60 border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
               
               <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                 <Stars className={`text-amber-400 ${isStreaming ? 'animate-pulse' : ''}`} />
                 <h3 className="text-2xl font-cinzel text-amber-100">命運的啟示</h3>
               </div>

               <div 
                 ref={readingContentRef}
                 className="prose prose-invert prose-amber max-w-none font-serif leading-relaxed text-slate-200/90 h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-900/50 scrollbar-track-transparent"
               >
                  {readingText ? (
                    <ReactMarkdown 
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold text-amber-200 mt-6 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-amber-300 mt-5 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-bold text-amber-400 mt-4 mb-2" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-amber-200 font-bold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 my-4" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-8" {...props} />,
                      }}
                    >
                      {readingText}
                    </ReactMarkdown>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 animate-pulse">
                      <div className="w-16 h-16 rounded-full border-4 border-t-amber-500 border-slate-700 animate-spin mb-4"></div>
                      <p className="text-lg font-cinzel text-amber-400/80 tracking-widest">
                        {LOADING_MESSAGES[loadingMsgIndex]}
                      </p>
                    </div>
                  )}
               </div>

               {!isStreaming && readingText && (
                 <div className="mt-8 text-center pt-4 border-t border-slate-800">
                    <Button onClick={resetApp} className="mx-auto">
                      再次占卜
                    </Button>
                 </div>
               )}
            </div>

          </div>
        )}

      </div>
      
      {/* CSS for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}