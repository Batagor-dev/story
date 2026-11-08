'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelButton } from './PixelButton';
import { soundFx } from '@/utils/audio';
import { PaperOption, RibbonOption } from './StationeryShop';

interface CraftFlower {
  id: number;
  name: string;
  sprite: string;
  placed: boolean;
}

interface BouquetCraftingProps {
  paper: PaperOption;
  ribbon: RibbonOption;
  hasBlueTulip: boolean;
  onCraftFinished: () => void;
}

export const BouquetCrafting: React.FC<BouquetCraftingProps> = ({
  paper,
  ribbon,
  hasBlueTulip,
  onCraftFinished,
}) => {
  const [flowersToPlace, setFlowersToPlace] = useState<CraftFlower[]>([
    { id: 1, name: 'Mawar Merah', sprite: '/assets/sprites/flower_red.png', placed: false },
    { id: 2, name: 'Daisy Putih', sprite: '/assets/sprites/flower_white.png', placed: false },
    { id: 3, name: 'Bunga Pink', sprite: '/assets/sprites/flower_pink.png', placed: false },
    { id: 4, name: 'Bunga Matahari', sprite: '/assets/sprites/flower_yellow.png', placed: false },
    { id: 5, name: 'Lavender', sprite: '/assets/sprites/flower_blooming.png', placed: false },
    ...(hasBlueTulip
      ? [{ id: 6, name: 'Tulip Biru Langka', sprite: '/assets/sprites/flower_blue_tulip.png', placed: false }]
      : []),
  ]);

  const [isTied, setIsTied] = useState(false);
  const [showSunsetTransition, setShowSunsetTransition] = useState(false);

  const placedCount = flowersToPlace.filter((f) => f.placed).length;
  const allPlaced = placedCount === flowersToPlace.length;

  const handlePlaceFlower = (id: number) => {
    soundFx.playPlace();
    setFlowersToPlace((prev) =>
      prev.map((f) => (f.id === id ? { ...f, placed: true } : f))
    );
  };

  const handleTieRibbon = () => {
    setIsTied(true);
    soundFx.playFanfare();
    setTimeout(() => {
      setShowSunsetTransition(true);
      setTimeout(() => {
        onCraftFinished();
      }, 2600);
    }, 1800);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-3 sm:p-5 bg-[#172013] select-none overflow-hidden">
      {/* Background Pixel Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3c7d28 15%, transparent 16%)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 text-center">
        <div className="inline-block bg-[#111318] border-2 border-amber-500 px-6 py-1.5 shadow-lg">
          <h2 className="font-pixel text-xs sm:text-sm text-amber-300 uppercase tracking-widest">
            BANGKU TAMAN: MERANGKAI BUKET
          </h2>
        </div>
        <p className="font-retro text-xl sm:text-2xl text-slate-200 mt-1 italic">
          [Batin] Arel: &ldquo;Yang tinggi di tengah, yang kecil di pinggir...&rdquo;
        </p>
      </div>

      {/* Workspace */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 my-auto max-w-4xl w-full">
        {/* Flower Tray on Left (Rendered with real pixel flower sprites!) */}
        <div className="bg-[#181920] border-4 border-[#475569] p-3 max-w-xs w-full shadow-2xl">
          <div className="font-pixel text-[10px] text-amber-400 uppercase mb-2 flex items-center justify-between border-b-2 border-slate-700 pb-1">
            <span>BUNGA DI KERANJANG:</span>
            <span>{flowersToPlace.length - placedCount} SISA</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {flowersToPlace.map((flower) => (
              <button
                key={flower.id}
                disabled={flower.placed}
                onClick={() => handlePlaceFlower(flower.id)}
                className={`p-2 border-2 flex flex-col items-center justify-center transition cursor-pointer ${
                  flower.placed
                    ? 'opacity-25 bg-slate-900 border-slate-800 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 active:scale-95 border-slate-700 hover:border-amber-400 shadow-md'
                }`}
              >
                <div className="relative w-12 h-14">
                  <Image
                    src={flower.sprite}
                    alt={flower.name}
                    fill
                    className="pixelated object-contain"
                  />
                </div>
                <span className="font-pixel text-[9px] text-slate-200 mt-1 text-center font-bold">
                  {flower.name}
                </span>
                {!flower.placed && (
                  <span className="font-pixel text-[8px] text-amber-400 mt-0.5">
                    [RANGKAI]
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Wrapping Paper Canvas */}
        <div className="relative w-72 h-80 sm:w-88 sm:h-96 flex items-center justify-center">
          <div
            className="relative w-64 h-72 sm:w-80 sm:h-88 border-4 border-[#09090b] shadow-2xl flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: paper.color,
              borderColor: paper.borderColor,
            }}
          >
            {/* Paper Texture Lines */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 16px)',
              }}
            />

            {/* Placed Flowers inside Bouquet */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {placedCount === 0 ? (
                <div className="text-center p-4">
                  <p className="font-pixel text-xs text-slate-900 font-bold">
                    KLIK BUNGA DI SEBELAH KIRI
                  </p>
                  <p className="font-retro text-base text-slate-800 mt-1">
                    Susun di atas {paper.name}
                  </p>
                </div>
              ) : isTied ? (
                // Tied Bouquet Display with Custom Crafted Paper & Ribbon Choice
                <motion.div
                  initial={{ scale: 0.8, rotate: -4 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative w-56 h-56 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] flex items-center justify-center"
                >
                  <Image
                    src={`/assets/sprites/bouquet_${paper.id}_${ribbon.id}.png`}
                    alt="Buket Cantik"
                    fill
                    className="pixelated object-contain"
                  />
                  <div
                    className="absolute bottom-4 flex items-center gap-2 px-3 py-1 font-pixel text-[9px] text-white shadow-xl border-2 border-white/60 font-bold bg-[#111318]"
                  >
                    <Image
                      src={ribbon.sprite}
                      alt={ribbon.name}
                      width={20}
                      height={20}
                      className="pixelated object-contain"
                    />
                    <span style={{ color: ribbon.hex }}>{ribbon.name}</span>
                  </div>
                </motion.div>
              ) : (
                // Flowers placed onto paper
                <div className="relative w-full h-full p-4 flex flex-wrap items-center justify-center gap-2">
                  {flowersToPlace
                    .filter((f) => f.placed)
                    .map((flower, idx) => (
                      <motion.div
                        key={flower.id}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="relative w-16 h-20"
                        style={{
                          transform: `rotate(${(idx - 2) * 9}deg)`,
                        }}
                      >
                        <Image
                          src={flower.sprite}
                          alt={flower.name}
                          fill
                          className="pixelated object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                        />
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="relative z-10 max-w-md w-full text-center">
        {allPlaced && !isTied && (
          <PixelButton
            variant="pink"
            size="lg"
            onClick={handleTieRibbon}
            className="w-full shadow-2xl animate-pulse"
          >
            IKAT DENGAN {ribbon.name}
          </PixelButton>
        )}

        {isTied && (
          <div className="bg-[#181920] border-2 border-emerald-400 p-2.5 text-emerald-300 font-pixel text-xs font-bold animate-pulse">
            ★ SELESAI! BUKET TERANGKAI CANTIK... MEMBAWA KE TAMAN...
          </div>
        )}
      </div>

      {/* Dramatic Sunset Transition Overlay */}
      <AnimatePresence>
        {showSunsetTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#180d19] text-center p-6 select-none overflow-hidden"
          >
            {/* User's Sunset Cloud Sky Image */}
            <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
              <Image
                src="/assets/sprites/sunset_sky.png"
                alt="Sunset Sky"
                fill
                className="pixelated object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#180d19] via-transparent to-[#180d19]/60" />
            </div>

            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="relative z-10 bg-[#181920]/90 border-4 border-amber-400 p-6 sm:p-8 max-w-lg shadow-[0_0_50px_rgba(245,158,11,0.5)]"
            >
              <h1 className="font-pixel text-2xl sm:text-3xl text-amber-300 uppercase tracking-widest mb-3 drop-shadow-[0_2px_8px_#f59e0b]">
                🌅 SORE HARI
              </h1>
              <p className="font-retro text-2xl sm:text-3xl text-pink-100 leading-relaxed">
                Langit berganti jingga keemasan... Arel kembali ke taman untuk menemui Ara.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
