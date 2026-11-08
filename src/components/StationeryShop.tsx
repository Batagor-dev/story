'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PixelButton } from './PixelButton';
import { soundFx } from '@/utils/audio';

export interface PaperOption {
  id: string;
  name: string;
  desc: string;
  color: string;
  borderColor: string;
  sprite: string;
}

export interface RibbonOption {
  id: string;
  name: string;
  desc: string;
  hex: string;
  sprite: string;
}

interface StationeryShopProps {
  onPurchased: (paper: PaperOption, ribbon: RibbonOption, synergy: boolean) => void;
}

const PAPERS: PaperOption[] = [
  {
    id: 'kraft',
    name: 'KERTAS KRAFT',
    desc: 'Alami dan sederhana',
    color: '#b88c5e',
    borderColor: '#78532f',
    sprite: '/assets/sprites/item_paper_kraft.png',
  },
  {
    id: 'pink',
    name: 'PINK PASTEL',
    desc: 'Manis dan lembut',
    color: '#f472b6',
    borderColor: '#be185d',
    sprite: '/assets/sprites/item_paper_pink.png',
  },
  {
    id: 'white',
    name: 'PUTIH TRANSPARAN',
    desc: 'Elegan dan anggun',
    color: '#e2e8f0',
    borderColor: '#94a3b8',
    sprite: '/assets/sprites/item_paper_white.png',
  },
];

const RIBBONS: RibbonOption[] = [
  {
    id: 'red',
    name: 'PITA MERAH',
    desc: 'Romantis',
    hex: '#ef4444',
    sprite: '/assets/sprites/item_ribbon_red.png',
  },
  {
    id: 'yellow',
    name: 'PITA KUNING',
    desc: 'Ceria',
    hex: '#f59e0b',
    sprite: '/assets/sprites/item_ribbon_yellow.png',
  },
  {
    id: 'blue',
    name: 'PITA BIRU MUDA',
    desc: 'Tenang dan segar',
    hex: '#38bdf8',
    sprite: '/assets/sprites/item_ribbon_blue.png',
  },
];

export const StationeryShop: React.FC<StationeryShopProps> = ({ onPurchased }) => {
  const [selectedPaper, setSelectedPaper] = useState<PaperOption>(PAPERS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOption>(RIBBONS[0]);

  // Check synergy
  const isSynergy =
    (selectedPaper.id === 'kraft' && selectedRibbon.id === 'red') ||
    (selectedPaper.id === 'pink' && selectedRibbon.id === 'yellow') ||
    (selectedPaper.id === 'white' && selectedRibbon.id === 'blue');

  const handleConfirm = () => {
    soundFx.playBell();
    onPurchased(selectedPaper, selectedRibbon, isSynergy);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-3 sm:p-5 bg-[#1e1b18] select-none overflow-hidden">
      {/* Pixel Store Wall with wooden shelf pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #78350f 2px, transparent 2px), linear-gradient(to bottom, #78350f 2px, transparent 2px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mt-1">
        <div className="inline-block bg-[#111318] border-2 border-[#d97706] px-6 py-2 shadow-lg">
          <h2 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase tracking-widest">
            TOKO ALAT TULIS BU RINI
          </h2>
        </div>
        <p className="font-retro text-lg sm:text-xl text-slate-300 mt-1">
          Pilih 1 kertas pembungkus dan 1 pita untuk buket bungamu
        </p>
      </div>

      {/* Choices Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full my-auto">
        {/* Kertas */}
        <div className="bg-[#181920] border-4 border-[#475569] p-3.5 shadow-2xl">
          <div className="font-pixel text-[11px] text-amber-400 uppercase mb-3 border-b-2 border-slate-700 pb-1">
            1. PILIH KERTAS BUKET
          </div>
          <div className="space-y-2.5">
            {PAPERS.map((paper) => {
              const isSelected = selectedPaper.id === paper.id;
              return (
                <button
                  key={paper.id}
                  onClick={() => {
                    setSelectedPaper(paper);
                    soundFx.playPick();
                  }}
                  className={`w-full p-2.5 border-2 text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Pixel Art Paper Item */}
                    <div className="relative w-11 h-11 bg-[#12141c] border-2 border-slate-700 shadow-md flex items-center justify-center p-1 group-hover:border-slate-500">
                      <Image
                        src={paper.sprite}
                        alt={paper.name}
                        width={36}
                        height={36}
                        className="pixelated object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                    <div>
                      <div className="font-pixel text-xs text-slate-100 font-bold">
                        {paper.name}
                      </div>
                      <div className="font-retro text-base text-slate-400">
                        {paper.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="font-pixel text-xs text-amber-400 font-bold">
                      [PILIH]
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pita */}
        <div className="bg-[#181920] border-4 border-[#475569] p-3.5 shadow-2xl">
          <div className="font-pixel text-[11px] text-pink-400 uppercase mb-3 border-b-2 border-slate-700 pb-1">
            2. PILIH PITA PENGIKAT
          </div>
          <div className="space-y-2.5">
            {RIBBONS.map((ribbon) => {
              const isSelected = selectedRibbon.id === ribbon.id;
              return (
                <button
                  key={ribbon.id}
                  onClick={() => {
                    setSelectedRibbon(ribbon);
                    soundFx.playPick();
                  }}
                  className={`w-full p-2.5 border-2 text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-pink-950/60 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Pixel Art Ribbon Item */}
                    <div className="relative w-11 h-11 bg-[#12141c] border-2 border-slate-700 shadow-md flex items-center justify-center p-1 group-hover:border-slate-500">
                      <Image
                        src={ribbon.sprite}
                        alt={ribbon.name}
                        width={36}
                        height={36}
                        className="pixelated object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                      />
                    </div>
                    <div>
                      <div className="font-pixel text-xs text-slate-100 font-bold">
                        {ribbon.name}
                      </div>
                      <div className="font-retro text-base text-slate-400">
                        Kesan: {ribbon.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="font-pixel text-xs text-pink-400 font-bold">
                      [PILIH]
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 max-w-xl w-full flex items-center justify-between gap-3 bg-[#111318] border-2 border-slate-700 p-3 shadow-2xl">
        <div className="font-retro text-lg text-slate-300">
          {isSynergy ? (
            <span className="text-emerald-400 font-bold">
              ★ KOMBINASI SERASI! (+1 POIN KESAN)
            </span>
          ) : (
            <span>Kombinasi buket terlihat manis.</span>
          )}
        </div>

        <PixelButton variant="amber" size="md" onClick={handleConfirm}>
          BELI & BUNGKUS [Rp10.000]
        </PixelButton>
      </div>
    </div>
  );
};
