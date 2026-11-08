'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BouquetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BouquetModal: React.FC<BouquetModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981', '#ffffff'],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-md w-full bg-[#1b1c24] border-4 border-amber-400 rounded-xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.4)] overflow-hidden"
        >
          {/* Background radial glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-pink-500/10 pointer-events-none" />

          {/* Sparkle Icons */}
          <div className="flex justify-center items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            <h2 className="font-pixel text-base sm:text-lg text-amber-300 uppercase tracking-wide">
              Buket Terangkai!
            </h2>
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
          </div>

          {/* Bouquet Display with Floating Animation */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="relative my-4 flex justify-center items-center"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 filter drop-shadow-[0_10px_20px_rgba(245,158,11,0.6)]">
              <Image
                src="/assets/sprites/bouquet_full.png"
                alt="Buket Bunga"
                fill
                className="pixelated object-contain"
                priority
              />
            </div>
          </motion.div>

          <p className="font-retro text-xl sm:text-2xl text-slate-200 leading-snug mb-2">
            5 kuntum bunga taman terindah berhasil kamu kumpulkan dan rangkai menjadi satu buket istimewa.
          </p>

          <p className="font-retro text-lg sm:text-xl text-amber-200/90 mb-6 flex items-center justify-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            Langit mulai berganti senja... Bawa buket ini ke dia!
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-95 text-slate-950 font-pixel text-xs sm:text-sm py-3.5 px-6 rounded-lg border-2 border-amber-200 shadow-[0_5px_0_#92400e] transition cursor-pointer font-bold tracking-wider"
          >
            [ BAWA BUKET KE DIA ]
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
