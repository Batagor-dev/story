'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface VirtualControlsProps {
  onMoveStart: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onMoveEnd: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onInteract: () => void;
  interactLabel?: string;
  canInteract?: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMoveStart,
  onMoveEnd,
  onInteract,
  interactLabel = 'AKSI',
  canInteract = false,
}) => {
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Detect touch device or small screen
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth <= 1024;
    setShowControls(isTouch);
  }, []);

  if (!showControls) return null;

  return (
    <div className="absolute inset-x-0 bottom-2 sm:bottom-4 z-40 pointer-events-none px-2 sm:px-6 flex justify-between items-end select-none">
      {/* Retro D-Pad using Pixel Buttons (Anchored bottom-left) */}
      <div className="pointer-events-auto bg-[#181920]/95 border-2 border-slate-700 p-1.5 sm:p-2 shadow-2xl flex flex-col items-center gap-1">
        {/* Up */}
        <button
          onTouchStart={() => onMoveStart('up')}
          onTouchEnd={() => onMoveEnd('up')}
          onMouseDown={() => onMoveStart('up')}
          onMouseUp={() => onMoveEnd('up')}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#15803d] border-t-2 border-l-2 border-[#86efac] border-b-4 border-r-4 border-[#14532d] active:translate-y-0.5 flex items-center justify-center text-white font-pixel text-xs active:bg-[#166534] cursor-pointer"
        >
          ▲
        </button>

        {/* Left & Right with Real Pixel Arrow Sprites */}
        <div className="flex items-center gap-1">
          <button
            onTouchStart={() => onMoveStart('left')}
            onTouchEnd={() => onMoveEnd('left')}
            onMouseDown={() => onMoveStart('left')}
            onMouseUp={() => onMoveEnd('left')}
            className="w-10 h-10 sm:w-12 sm:h-12 relative bg-[#15803d] border-t-2 border-l-2 border-[#86efac] border-b-4 border-r-4 border-[#14532d] active:translate-y-0.5 flex items-center justify-center p-1 active:bg-[#166534] cursor-pointer"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7">
              <Image
                src="/assets/sprites/btn_arrow_left.png"
                alt="Left"
                fill
                className="pixelated object-contain"
              />
            </div>
          </button>

          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 font-pixel text-[8px]">
            +
          </div>

          <button
            onTouchStart={() => onMoveStart('right')}
            onTouchEnd={() => onMoveEnd('right')}
            onMouseDown={() => onMoveStart('right')}
            onMouseUp={() => onMoveEnd('right')}
            className="w-10 h-10 sm:w-12 sm:h-12 relative bg-[#15803d] border-t-2 border-l-2 border-[#86efac] border-b-4 border-r-4 border-[#14532d] active:translate-y-0.5 flex items-center justify-center p-1 active:bg-[#166534] cursor-pointer"
          >
            <div className="relative w-6 h-6 sm:w-7 sm:h-7">
              <Image
                src="/assets/sprites/btn_arrow_right.png"
                alt="Right"
                fill
                className="pixelated object-contain"
              />
            </div>
          </button>
        </div>

        {/* Down */}
        <button
          onTouchStart={() => onMoveStart('down')}
          onTouchEnd={() => onMoveEnd('down')}
          onMouseDown={() => onMoveStart('down')}
          onMouseUp={() => onMoveEnd('down')}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#15803d] border-t-2 border-l-2 border-[#86efac] border-b-4 border-r-4 border-[#14532d] active:translate-y-0.5 flex items-center justify-center text-white font-pixel text-xs active:bg-[#166534] cursor-pointer"
        >
          ▼
        </button>
      </div>

      {/* Action [E] Button (Anchored bottom-right) */}
      <div className="pointer-events-auto">
        <button
          onClick={onInteract}
          className={`w-16 h-16 sm:w-20 sm:h-20 border-t-2 border-l-2 border-b-4 border-r-4 font-pixel text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
            canInteract
              ? 'bg-[#d97706] text-amber-50 border-[#fde68a] border-b-[#78350f] border-r-[#78350f] animate-pulse shadow-[0_4px_0_#451a03]'
              : 'bg-[#334155] text-slate-300 border-[#94a3b8] border-b-[#0f172a] border-r-[#0f172a] shadow-[0_4px_0_#020617]'
          }`}
        >
          <span className="text-sm sm:text-base font-bold">[E]</span>
          <span className="text-[7px] sm:text-[8px] mt-1 uppercase">{interactLabel}</span>
        </button>
      </div>
    </div>
  );
};
