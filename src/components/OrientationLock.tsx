'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Play } from 'lucide-react';

interface OrientationLockProps {
  onOrientationChange: (isPortrait: boolean) => void;
}

export const OrientationLock: React.FC<OrientationLockProps> = ({ onOrientationChange }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // In mobile/desktop: check if viewport height > width
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      onOrientationChange(portrait);
      // If rotated to landscape, reset dismissed state so it prompts next time if rotated back
      if (!portrait) {
        setDismissed(false);
      }
    };

    checkOrientation();

    // Try locking orientation if supported
    const tryLockLandscape = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (screen.orientation as any).lock('landscape');
        }
      } catch {
        // Ignored if browser requires user gesture or doesn't support lock
      }
    };
    tryLockLandscape();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [onOrientationChange]);

  if (!isPortrait || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none">
      {/* Animated Rotating Smartphone */}
      <motion.div
        animate={{
          rotate: [0, -90, -90, 0],
          scale: [1, 1.12, 1.12, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.4,
          ease: 'easeInOut',
        }}
        className="w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center text-amber-400 bg-slate-900 border-4 border-amber-400/80 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.5)]"
      >
        <Smartphone className="w-12 h-12 sm:w-14 sm:h-14" />
      </motion.div>

      <h2 className="font-pixel text-sm sm:text-base text-amber-300 uppercase tracking-wide mb-2">
        Rekomendasi: Mode Horizontal
      </h2>

      <p className="font-retro text-xl sm:text-2xl text-slate-100 max-w-xs leading-snug">
        Putar HP-mu ke samping (Landscape) untuk pandangan taman yang lebih luas 📱↔️
      </p>

      {/* Button to allow playing directly in portrait if user prefers */}
      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => setDismissed(true)}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-pixel text-xs sm:text-sm py-3 px-4 border-2 border-amber-300 shadow-[0_4px_0_#92400e] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>TETAP MAIN MODE VERTIKAL</span>
        </button>

        <span className="font-retro text-sm text-slate-400">
          (Atau cukup putar HP-mu untuk layar penuh)
        </span>
      </div>
    </div>
  );
};
