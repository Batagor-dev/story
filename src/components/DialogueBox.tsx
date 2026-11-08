'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { soundFx } from '@/utils/audio';

export type SpeakerType = 'arel' | 'ara' | 'toko' | 'thought';

export interface DialogueChoice {
  text: string;
  points: number;
  label: string; // 'A', 'B', 'C'
}

export interface DialogueLine {
  speaker: string;
  speakerType: SpeakerType;
  portrait?: string; // Pixel bust (chest to head)
  text: string;
  choices?: DialogueChoice[];
  onChoiceSelected?: (choice: DialogueChoice) => void;
}

interface DialogueBoxProps {
  dialogue: DialogueLine | null;
  onNext: () => void;
  isOpen: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onNext, isOpen }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle advancing or skipping typewriter to complete
  const handleAdvance = useCallback(() => {
    if (!dialogue) return;
    if (dialogue.choices && dialogue.choices.length > 0) return;

    const fullText = dialogue.text || '';
    const isTextIncomplete = displayedText.length < fullText.length;

    if (isTyping || isTextIncomplete) {
      // First click/press: Immediately complete typing
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setDisplayedText(fullText);
      setIsTyping(false);
      setMouthOpen(false);
    } else {
      // Second click/press: Advance to next dialogue line
      onNext();
    }
  }, [dialogue, isTyping, displayedText, onNext]);

  // Keyboard navigation for dialogue (Space, Enter, E)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'KeyE'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleAdvance]);

  // Typewriter effect: Smooth and robust typing
  useEffect(() => {
    if (!dialogue || !isOpen) {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setDisplayedText('');
      setIsTyping(false);
      setMouthOpen(false);
      return;
    }

    const fullText = dialogue.text || '';
    if (!fullText) {
      setDisplayedText('');
      setIsTyping(false);
      setMouthOpen(false);
      return;
    }

    // Clear previous timer before starting new typing sequence
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setDisplayedText('');
    setIsTyping(true);

    let currentIdx = 0;
    typingIntervalRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIdx));

        // Sound blip
        if (currentIdx % 2 === 1) {
          soundFx.playBlip(dialogue.speakerType);
        }
      }

      if (currentIdx >= fullText.length) {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsTyping(false);
        setMouthOpen(false);
      }
    }, 20);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [dialogue?.text, dialogue?.speakerType, isOpen]);

  // Talking mouth animation loop while typing
  useEffect(() => {
    if (!isTyping) {
      setMouthOpen(false);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 130);

    return () => clearInterval(mouthInterval);
  }, [isTyping]);

  if (!isOpen || !dialogue) return null;

  const handleClick = () => {
    handleAdvance();
  };

  const handleChoiceClick = (choice: DialogueChoice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dialogue.onChoiceSelected) {
      dialogue.onChoiceSelected(choice);
    }
    onNext();
  };

  // Theme styling based on reference screenshot (Dark RPG window + slanted badge)
  const getTheme = () => {
    switch (dialogue.speakerType) {
      case 'thought':
        return {
          boxBg: 'bg-[#151922]',
          border: 'border-[#38bdf8]',
          innerBorder: 'border-[#0284c7]/40',
          badgeBg: 'bg-[#0f2942]',
          badgeBorder: 'border-[#38bdf8]',
          badgeText: 'text-[#38bdf8]',
          textColor: 'text-sky-50',
          promptColor: 'text-[#38bdf8]',
        };
      case 'ara':
        return {
          boxBg: 'bg-[#1c151f]',
          border: 'border-[#ec4899]',
          innerBorder: 'border-[#be185d]/40',
          badgeBg: 'bg-[#3b1228]',
          badgeBorder: 'border-[#ec4899]',
          badgeText: 'text-[#f472b6]',
          textColor: 'text-pink-50',
          promptColor: 'text-[#ec4899]',
        };
      case 'toko':
        return {
          boxBg: 'bg-[#161a22]',
          border: 'border-[#94a3b8]',
          innerBorder: 'border-[#475569]/40',
          badgeBg: 'bg-[#27303f]',
          badgeBorder: 'border-[#94a3b8]',
          badgeText: 'text-[#cbd5e1]',
          textColor: 'text-slate-100',
          promptColor: 'text-[#94a3b8]',
        };
      case 'arel':
      default:
        return {
          boxBg: 'bg-[#181920]',
          border: 'border-[#f59e0b]',
          innerBorder: 'border-[#b45309]/40',
          badgeBg: 'bg-[#2b1f13]',
          badgeBorder: 'border-[#f59e0b]',
          badgeText: 'text-[#fbbf24]',
          textColor: 'text-amber-50',
          promptColor: 'text-[#f59e0b]',
        };
    }
  };

  const theme = getTheme();
  const hasChoices = dialogue.choices && dialogue.choices.length > 0;
  const isArel = dialogue.speakerType === 'arel' || dialogue.speakerType === 'thought';
  const isAra = dialogue.speakerType === 'ara';

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-50 pointer-events-auto px-1.5 pb-1 sm:px-6 sm:pb-3 select-none w-full"
      onClick={handleClick}
    >
      <div className="relative max-w-4xl mx-auto w-full cursor-pointer">
        {/* Chamfered Name Tag Badge (Responsive for Mobile HP) */}
        <div className="relative z-30 inline-block mb-[-2px]">
          <div
            className={`font-pixel text-[10px] sm:text-xs px-3.5 sm:px-5 py-1 sm:py-1.5 border-t-2 border-l-2 border-r-2 ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText} tracking-wider uppercase font-bold shadow-md`}
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 0 100%)',
            }}
          >
            {dialogue.speakerType === 'thought' ? `[BATIN] ${dialogue.speaker}` : dialogue.speaker}
          </div>
        </div>

        {/* Dialogue Box Main Frame (Classic Retro RPG Style - Flush to Bottom) */}
        <div
          className={`relative ${theme.boxBg} border-2 sm:border-3 ${theme.border} rounded-none p-2.5 sm:p-4 md:p-5 shadow-[0_4px_0_rgba(0,0,0,0.7),inset_0_0_0_1px_#000] z-10 min-h-[82px] sm:min-h-[105px] md:min-h-[120px] flex flex-col justify-between`}
        >
          {/* Inner hairline border */}
          <div className={`absolute inset-[2px] sm:inset-[3px] border ${theme.innerBorder} pointer-events-none`} />

          {/* ================= BUST PORTRAIT ANCHORED FLUSH TO BOX ================= */}
          {/* Scaled responsively for Mobile HP (w-20 h-28 on phone, w-48 h-56 on desktop) */}
          <div className="absolute right-2 sm:right-6 md:right-10 bottom-[calc(100%-3px)] z-20 pointer-events-none">
            <motion.div
              animate={{
                y: isTyping && mouthOpen ? -2 : 0,
              }}
              transition={{ duration: 0.12 }}
              className="relative w-20 h-28 sm:w-32 sm:h-42 md:w-48 md:h-56 flex items-end justify-center filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            >
              {isArel ? (
                <>
                  {/* Talking Frame (Mouth Open) */}
                  <Image
                    src="/assets/sprites/arel_bust_talk.png"
                    alt="Arel Bicara"
                    width={220}
                    height={268}
                    className={`pixelated w-auto h-full object-contain object-bottom max-h-full ${
                      isTyping && mouthOpen ? 'block' : 'hidden'
                    }`}
                    priority
                  />
                  {/* Idle Frame (Mouth Closed Smile) */}
                  <Image
                    src="/assets/sprites/arel_bust_idle.png"
                    alt="Arel Senyum"
                    width={220}
                    height={268}
                    className={`pixelated w-auto h-full object-contain object-bottom max-h-full ${
                      isTyping && mouthOpen ? 'hidden' : 'block'
                    }`}
                    priority
                  />
                </>
              ) : isAra ? (
                <>
                  <Image
                    src="/assets/sprites/ara_bust_talk.png"
                    alt="Ara Bicara"
                    width={220}
                    height={268}
                    className={`pixelated w-auto h-full object-contain object-bottom max-h-full ${
                      isTyping && mouthOpen ? 'block' : 'hidden'
                    }`}
                    priority
                  />
                  <Image
                    src="/assets/sprites/ara_bust_smile.png"
                    alt="Ara Senyum"
                    width={220}
                    height={268}
                    className={`pixelated w-auto h-full object-contain object-bottom max-h-full ${
                      isTyping && mouthOpen ? 'hidden' : 'block'
                    }`}
                    priority
                  />
                </>
              ) : (
                <Image
                  src={
                    dialogue.portrait ||
                    (isTyping && mouthOpen
                      ? '/assets/sprites/cewe_bust_talking.png'
                      : '/assets/sprites/cewe_bust_smiling.png')
                  }
                  alt={dialogue.speaker}
                  width={220}
                  height={268}
                  className="pixelated w-auto h-full object-contain object-bottom max-h-full"
                  priority
                />
              )}
            </motion.div>
          </div>

          {/* Text Content with responsive right padding to clear character portrait */}
          <div
            className={`relative z-10 font-retro text-base sm:text-xl md:text-2xl ${theme.textColor} leading-snug tracking-wide pr-20 sm:pr-32 md:pr-52`}
          >
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-4 sm:w-2 sm:h-5 ml-1 bg-amber-400 animate-pulse align-middle" />
            )}
          </div>

          {/* Interactive Choice Options (For Act 5) - Full width, thumb-friendly on HP */}
          {hasChoices && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 mt-2 sm:mt-3 grid grid-cols-1 gap-1.5 sm:gap-2 pr-0 sm:pr-28 md:pr-48 w-full"
            >
              {dialogue.choices!.map((choice, i) => (
                <button
                  key={i}
                  onClick={(e) => handleChoiceClick(choice, e)}
                  className="w-full text-left bg-slate-900/95 hover:bg-pink-950 active:scale-[0.99] border-2 border-pink-500/70 hover:border-pink-300 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[40px] sm:min-h-[44px] font-retro text-sm sm:text-lg md:text-xl text-slate-100 flex items-center justify-between transition cursor-pointer shadow-md group active:bg-pink-900"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-pixel text-[10px] sm:text-xs text-pink-400 group-hover:text-pink-300 font-bold shrink-0">
                      [{choice.label}]
                    </span>
                    <span className="leading-tight sm:leading-snug">{choice.text}</span>
                  </span>
                  <span className="font-pixel text-[9px] sm:text-[10px] text-amber-300 opacity-90 shrink-0 ml-1.5">
                    +{choice.points} 💖
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Advance Prompt */}
          {!hasChoices && (
            <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-xs text-slate-400 font-pixel mt-1.5 sm:mt-2 pt-1 border-t border-slate-700/60">
              <span className="text-slate-400 text-[9px] sm:text-xs">
                [ SENTUH LAYAR / KLIK / SPACE UNTUK LANJUT ]
              </span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className={`${theme.promptColor} text-xs sm:text-sm font-bold`}
              >
                ▼
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
