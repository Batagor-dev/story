'use client';

import React from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundFx } from '@/utils/audio';

interface GameHUDProps {
  collectedCount: number;
  totalFlowers: number;
  hasBouquet: boolean;
  timeOfDay: 'day' | 'afternoon' | 'sunset';
  isMuted: boolean;
  onToggleMute: () => void;
  onShowHelp: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  collectedCount,
  totalFlowers,
  hasBouquet,
  timeOfDay,
  isMuted,
  onToggleMute,
  onShowHelp,
}) => {
  return (
    <div className="absolute top-0 inset-x-0 z-30 p-3 sm:p-5 flex items-start justify-between pointer-events-none select-none">
      {/* Left: Quest & Inventory Tracker */}
      <div className="pointer-events-auto bg-[#1b1d24]/90 backdrop-blur-sm border-2 border-[#5a6275] rounded-lg p-2.5 sm:p-3 shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-3">
        {hasBouquet ? (
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-amber-950/40 border border-amber-500/50 rounded flex items-center justify-center animate-pulse">
              <Image
                src="/assets/sprites/bouquet_icon.png"
                alt="Buket Bunga"
                width={36}
                height={36}
                className="pixelated object-contain"
              />
            </div>
            <div>
              <div className="font-pixel text-[10px] sm:text-xs text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" /> BUKET BUNGA JADI!
              </div>
              <div className="font-retro text-sm sm:text-base text-slate-200">
                Berikan ke Cewek di bukit
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-slate-800/80 border border-slate-600 rounded flex items-center justify-center">
              <Image
                src="/assets/sprites/flower_blooming.png"
                alt="Bunga"
                width={32}
                height={32}
                className="pixelated object-contain"
              />
            </div>
            <div>
              <div className="font-pixel text-[10px] sm:text-xs text-amber-400">
                KUMPULKAN BUNGA
              </div>
              <div className="font-retro text-base sm:text-lg text-slate-100 flex items-center gap-1.5 font-bold">
                <span>{collectedCount} / {totalFlowers} Bunga Terkumpul</span>
                {collectedCount >= totalFlowers && (
                  <span className="text-emerald-400 text-xs font-pixel animate-bounce">SIAP!</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Sky/Time Status & Settings */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Time of Day Indicator */}
        <div className="bg-[#1b1d24]/90 backdrop-blur-sm border-2 border-[#5a6275] rounded-lg px-3 py-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full animate-ping"
            style={{
              backgroundColor: timeOfDay === 'day' ? '#38bdf8' : timeOfDay === 'afternoon' ? '#f59e0b' : '#f43f5e'
            }}
          />
          <span className="font-pixel text-[10px] sm:text-xs uppercase"
            style={{
              color: timeOfDay === 'day' ? '#7dd3fc' : timeOfDay === 'afternoon' ? '#fde047' : '#fb7185'
            }}
          >
            {timeOfDay === 'day' ? 'Siang Cerah' : timeOfDay === 'afternoon' ? 'Sore Senja' : 'Sunset Romantis'}
          </span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleMute}
          className="bg-[#1b1d24]/90 hover:bg-[#2b2f3a] active:scale-95 transition border-2 border-[#5a6275] rounded-lg p-2 text-slate-200 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>

        {/* Help / Controls button */}
        <button
          onClick={onShowHelp}
          className="bg-[#1b1d24]/90 hover:bg-[#2b2f3a] active:scale-95 transition border-2 border-[#5a6275] rounded-lg px-2.5 py-1.5 font-pixel text-xs text-amber-300 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
        >
          ?
        </button>
      </div>
    </div>
  );
};
