'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '@/utils/audio';

interface EndingCutsceneProps {
  onRestart: () => void;
}

export const EndingCutscene: React.FC<EndingCutsceneProps> = ({ onRestart }) => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Play romance arpeggio
    soundFx.playRomance();

    // Trigger multiple waves of celebratory confetti
    const burst = () => {
      try {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff4d4d', '#ff9900', '#ff007f', '#ffd700', '#ffffff'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff4d4d', '#ff9900', '#ff007f', '#ffd700', '#ffffff'],
        });
      } catch {}
    };

    burst();
    const t1 = setTimeout(burst, 1200);
    const t2 = setTimeout(burst, 2500);
    const t3 = setTimeout(() => setShowCard(true), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none">
      {/* Sunset Sky Background with warm radiant sun */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065] via-[#9d174d] to-[#ea580c] z-0 animate-fade-in" />
      
      {/* Setting Sun Glow */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-t from-amber-300 via-orange-400 to-transparent blur-3xl opacity-60 pointer-events-none" />

      {/* Sun disk */}
      <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-amber-100 shadow-[0_0_80px_#f59e0b] opacity-90 pointer-events-none" />

      {/* Silhouette hills / park horizon at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 bg-gradient-to-t from-[#1a0a2a] to-[#3b0764]/70 z-10" />

      {/* Floating flower petals and hearts particles */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 5.8) % 100}vw`,
              y: '-10vh',
              opacity: 0.8,
              rotate: 0,
            }}
            animate={{
              y: '110vh',
              x: `${((i * 5.8) % 100) + (i % 2 === 0 ? 8 : -8)}vw`,
              rotate: 360,
            }}
            transition={{
              duration: 7 + (i % 5) * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: (i * 0.4) % 4,
            }}
            className="absolute text-pink-300/80"
          >
            {i % 3 === 0 ? (
              <Heart className="w-5 h-5 fill-rose-400 text-rose-400 opacity-70" />
            ) : (
              <div className="w-4 h-4 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full opacity-80 filter blur-[0.5px]" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Top Banner */}
      <div className="relative z-30 text-center mt-4">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-amber-400/40"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span className="font-pixel text-xs sm:text-sm text-amber-200 tracking-wider">
            SENJA YANG SEMPURNA
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        </motion.div>
      </div>

      {/* Characters Reunion at Sunset */}
      <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-10 my-auto w-full max-w-2xl">
        {/* Boy with hand cheering */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-36 h-64 sm:w-52 sm:h-96 flex items-end justify-center filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]"
        >
          <Image
            src="/assets/sprites/cowo_portrait_cheer.png"
            alt="Cowo Bahagia"
            width={240}
            height={380}
            className="pixelated w-auto h-full object-contain"
            priority
          />
        </motion.div>

        {/* The Bouquet Floating with Radiant Glow in between! */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center filter drop-shadow-[0_0_30px_#f59e0b] -mb-4 z-30"
        >
          <Image
            src="/assets/sprites/bouquet_full.png"
            alt="Buket Bunga"
            fill
            className="pixelated object-contain"
            priority
          />
          <div className="absolute -top-3">
            <Heart className="w-7 h-7 fill-pink-500 text-rose-300 animate-bounce" />
          </div>
        </motion.div>

        {/* Girl cheering happily */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-36 h-64 sm:w-52 sm:h-96 flex items-end justify-center filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]"
        >
          <Image
            src="/assets/sprites/cewe_portrait_cheer.png"
            alt="Cewe Bahagia"
            width={240}
            height={380}
            className="pixelated w-auto h-full object-contain"
            priority
          />
        </motion.div>
      </div>

      {/* Final Victory Card Popup */}
      {showCard && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="relative z-30 max-w-lg w-full bg-[#1c1229]/95 backdrop-blur-md border-4 border-amber-400 rounded-2xl p-5 sm:p-6 text-center shadow-[0_0_60px_rgba(234,88,12,0.5)] mb-2"
        >
          <div className="flex items-center justify-center gap-1.5 text-pink-400 mb-1">
            <Heart className="w-5 h-5 fill-pink-400" />
            <Heart className="w-6 h-6 fill-rose-500" />
            <Heart className="w-5 h-5 fill-pink-400" />
          </div>

          <h1 className="font-pixel text-sm sm:text-base text-amber-300 uppercase tracking-wider mb-2">
            Misi Selesai: Buket Bunga Untuk Dia
          </h1>

          <p className="font-retro text-xl sm:text-2xl text-slate-200 leading-snug mb-5">
            Di bawah kehangatan langit senja, senyuman bahagianya menjadi balasan terindah untuk setiap tangkai bunga yang kamu kumpulkan.
          </p>

          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:opacity-95 active:scale-95 text-slate-950 font-pixel text-xs sm:text-sm py-3.5 px-6 rounded-xl border-2 border-amber-200 shadow-[0_4px_0_#831843] transition cursor-pointer font-bold tracking-wider flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            [ MAIN LAGI ]
          </button>
        </motion.div>
      )}
    </div>
  );
};
