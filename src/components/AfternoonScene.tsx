'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelButton } from './PixelButton';
import { DialogueBox, DialogueLine, DialogueChoice } from './DialogueBox';
import { soundFx } from '@/utils/audio';
import confetti from 'canvas-confetti';
import { PaperOption, RibbonOption } from './StationeryShop';

interface AfternoonSceneProps {
  synergyBonus: boolean;
  hasBlueTulip: boolean;
  paper?: PaperOption | null;
  ribbon?: RibbonOption | null;
  onRestart: () => void;
}

export const AfternoonScene: React.FC<AfternoonSceneProps> = ({
  synergyBonus,
  hasBlueTulip,
  paper,
  ribbon,
  onRestart,
}) => {
  // Cutscene phases:
  // 'walking': Arel walks towards Ara on bench
  // 'standing_up': Ara turns and stands up from bench
  // 'dialogue': Dialogue active
  // 'ending': Ending result card
  const [phase, setPhase] = useState<'walking' | 'standing_up' | 'dialogue' | 'ending'>('walking');
  const [arelWalkX, setArelWalkX] = useState(100);
  const [walkFrame, setWalkFrame] = useState(1);
  const [isAraStanding, setIsAraStanding] = useState(false);
  const [isArelGivingBouquet, setIsArelGivingBouquet] = useState(false);
  const [isAraHoldingBouquet, setIsAraHoldingBouquet] = useState(false);
  const [isAraRejecting, setIsAraRejecting] = useState(false);

  // Dynamic bouquet variant keys
  const paperKey = paper?.id || 'pink';
  const ribbonKey = ribbon?.id || 'red';

  // Animation frame states for giving & receiving sequences
  const [arelGiveFrame, setArelGiveFrame] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [araHappyFrame, setAraHappyFrame] = useState<1 | 2 | 3 | 4>(1);

  // Score & dialogue tracking
  const [score, setScore] = useState(0);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [endingType, setEndingType] = useState<'A' | 'B' | 'C'>('A');
  const scoreRef = useRef(0);

  // Initial bonus points
  useEffect(() => {
    let initial = 0;
    if (synergyBonus) initial += 1;
    if (hasBlueTulip) initial += 1;
    scoreRef.current = initial;
    setScore(initial);
    soundFx.playRomance();
  }, [synergyBonus, hasBlueTulip]);

  // Phase 1: Arel walks to Ara
  useEffect(() => {
    if (phase !== 'walking') return;

    const interval = setInterval(() => {
      setArelWalkX((prev) => {
        if (prev >= 550) {
          clearInterval(interval);
          // Arel reached bench! Trigger Ara standing up!
          setPhase('standing_up');
          setTimeout(() => {
            setIsAraStanding(true);
            setTimeout(() => {
              setPhase('dialogue');
            }, 800);
          }, 600);
          return 550;
        }
        return prev + 5;
      });
      setWalkFrame((f) => (f % 4) + 1);
      soundFx.playStep();
    }, 90);

    return () => clearInterval(interval);
  }, [phase]);

  // Dialogue script
  const dialogueScript: DialogueLine[] = [
    {
      speaker: 'Arel',
      speakerType: 'thought',
      portrait: '/assets/sprites/cowo_bust_scratch.png',
      text: 'Tenang, Arel. Ini cuma kenalan...',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Permisi... boleh ganggu sebentar?',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_smiling.png',
      text: 'Iya? Ada apa ya?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Tadi pagi aku lihat kamu di sini. Terus kepikiran terus.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_talking.png',
      text: 'Kepikiran? Memangnya aku ngapain?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Nggak ngapa-ngapain. Cuma duduk baca buku. Tapi entah kenapa, itu yang paling indah dari seluruh taman ini.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_winking.png',
      text: 'Kamu gombal ya?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Enggak kok, aku jujur. Buktinya, aku bawa sesuatu.',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Aku melihat bunga-bunga ini di taman, dan mereka begitu indah. Menurutku, bunga ini cocok sama kamu yang juga indah.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_smiling.png',
      text: 'Ya ampun... ini buat aku?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Iya, hadiah perkenalan. Tapi sebenarnya bunganya minder, soalnya kalah cantik sama yang megang.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_cheering.png',
      text: 'Hahaha! Dapat gombalan dari mana sih?',
    },
    // Choice 1
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_talking.png',
      text: 'Kamu belum kenalan lho. Siapa namamu?',
      choices: [
        {
          label: 'A',
          text: 'Namaku Arel. Kamu? Biar aku tahu nama orang yang bikin aku nggak fokus seharian.',
          points: 3,
        },
        {
          label: 'B',
          text: 'Arel. Kamu pasti Ara, kan? ...Eh, itu aku lihat dari buku kamu.',
          points: 2,
        },
        {
          label: 'C',
          text: "Namaku Arel, tapi panggil aja 'Yang'.",
          points: 1,
        },
      ],
      onChoiceSelected: (c: DialogueChoice) => {
        scoreRef.current += c.points;
        setScore(scoreRef.current);
        soundFx.playHeartChime();
      },
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_smiling.png',
      text: 'Aku Ara. Senang kenalan sama kamu, Arel.',
    },
    // Choice 2
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_talking.png',
      text: 'Bunganya wangi banget. Kamu sendiri yang rangkai?',
      choices: [
        {
          label: 'A',
          text: 'Iya, aku petik dan rangkai sendiri. Pilih yang cocok sama kamu satu-satu.',
          points: 3,
        },
        {
          label: 'B',
          text: 'Iya, tapi tadi sempat berantakan. Ini percobaan kedua.',
          points: 2,
        },
        {
          label: 'C',
          text: 'Bukan, aku beli di toko.',
          points: 0,
        },
      ],
      onChoiceSelected: (c: DialogueChoice) => {
        scoreRef.current += c.points;
        setScore(scoreRef.current);
        soundFx.playHeartChime();
      },
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_smiling.png',
      text: 'Aku suka yang kuning ini, bunga matahari kan?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Iya. Kayak kamu, bikin suasana taman jadi lebih hangat.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_winking.png',
      text: 'Stop! Pipiku sakit senyum terus!',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Berarti misiku berhasil.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_talking.png',
      text: 'Misi apa?',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Bikin kamu senyum. Sepertinya aku dapat nilai A.',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_winking.png',
      text: 'Hmm, tergantung. Kamu masih harus ngajak aku ngobrol lebih lama.',
    },
    {
      speaker: 'Arel',
      speakerType: 'arel',
      portrait: '/assets/sprites/cowo_bust_talking.png',
      text: 'Boleh! Jalan keliling taman sambil lihat bunga lain?',
    },
    {
      speaker: 'Ara',
      speakerType: 'ara',
      portrait: '/assets/sprites/cewe_bust_cheering.png',
      text: 'Boleh. Yuk!',
    },
  ];

  // Synchronized giving & happy receiving animation sequence
  useEffect(() => {
    // Line 7: "Enggak kok, aku jujur. Buktinya, aku bawa sesuatu."
    if (dialogueIdx === 7) {
      setIsArelGivingBouquet(true);
      setArelGiveFrame(2); // pulls out bouquet
      const t1 = setTimeout(() => setArelGiveFrame(3), 350); // extends forward
      const t2 = setTimeout(() => setArelGiveFrame(4), 700); // presents forward
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    // Line 8: "Aku melihat bunga-bunga ini di taman..."
    if (dialogueIdx === 8) {
      setIsArelGivingBouquet(true);
      setArelGiveFrame(4);
    }

    // Line 9: Ara: "Ya ampun... ini buat aku?"
    if (dialogueIdx === 9) {
      setIsArelGivingBouquet(true);
      setArelGiveFrame(5); // Arel scratches head shyly
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(1); // Ara looks at bouquet in wonder
    }

    // Line 10: Arel: "Iya, hadiah perkenalan..."
    if (dialogueIdx === 10) {
      setArelGiveFrame(5);
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(2); // Ara smiles warmly
    }

    // Line 11: Ara: "Hahaha! Dapat gombalan dari mana sih?"
    if (dialogueIdx === 11) {
      setArelGiveFrame(5);
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(2);
    }

    // Line 14: Ara: "Bunganya wangi banget. Kamu sendiri yang rangkai?"
    if (dialogueIdx === 14) {
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(3); // Ara smells the flowers happily
    }

    // Line 17: Ara: "Stop! Pipiku sakit senyum terus!"
    if (dialogueIdx === 17) {
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(4); // Ara hands to cheeks overjoyed!
    }

    // Line 18 onwards:
    if (dialogueIdx >= 18) {
      setIsAraHoldingBouquet(true);
      setAraHappyFrame(2);
      setArelGiveFrame(5);
    }
  }, [dialogueIdx]);

  // Ending celebration animation
  useEffect(() => {
    if (phase === 'ending' && (endingType === 'A' || endingType === 'B')) {
      setIsAraHoldingBouquet(true);
      setIsArelGivingBouquet(true);
      setArelGiveFrame(5);
      const interval = setInterval(() => {
        setAraHappyFrame((prev) => (prev === 2 ? 3 : prev === 3 ? 4 : 2));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [phase, endingType]);

  const getArelSprite = () => {
    if (phase === 'walking') {
      return `/assets/sprites/cowo_walk_${walkFrame}.png`;
    }
    if (isArelGivingBouquet) {
      if (arelGiveFrame === 1) return '/assets/sprites/cowo_give_1.png';
      if (arelGiveFrame === 5) return '/assets/sprites/cowo_give_5.png';
      return `/assets/sprites/cowo_give_${arelGiveFrame}_${paperKey}_${ribbonKey}.png`;
    }
    return '/assets/sprites/cowo_idle_1.png';
  };

  const getArelWidth = () => {
    if (phase === 'walking') return 80;
    if (isArelGivingBouquet) {
      if (arelGiveFrame === 1) return 60;
      if (arelGiveFrame === 2) return 76;
      if (arelGiveFrame === 3) return 114;
      if (arelGiveFrame === 4) return 126;
      if (arelGiveFrame === 5) return 74;
    }
    return 80;
  };

  const getAraSprite = () => {
    if (isAraRejecting) {
      return '/assets/sprites/cewe_awkward_reject.png';
    }
    if (isAraHoldingBouquet) {
      if (araHappyFrame === 4) return '/assets/sprites/cewe_happy_4.png';
      return `/assets/sprites/cewe_happy_${araHappyFrame}_${paperKey}_${ribbonKey}.png`;
    }
    if (isAraStanding) {
      return '/assets/sprites/cewe_idle_1.png';
    }
    return '/assets/sprites/cewe_sitting.png';
  };

  const getAraWidth = () => {
    if (isAraRejecting) return 72;
    if (isAraHoldingBouquet) {
      if (araHappyFrame === 1) return 75;
      if (araHappyFrame === 2) return 79;
      if (araHappyFrame === 3) return 68;
      if (araHappyFrame === 4) return 60;
    }
    return 72;
  };

  const handleNextDialogue = () => {
    if (dialogueIdx < dialogueScript.length - 1) {
      setDialogueIdx((prev) => prev + 1);
    } else {
      // Calculate final ending
      const final = scoreRef.current;
      if (final >= 5) {
        setEndingType('A');
        setIsAraHoldingBouquet(true);
      } else if (final >= 3) {
        setEndingType('B');
        setIsAraHoldingBouquet(true);
      } else {
        setEndingType('C');
        setIsAraRejecting(true);
      }

      setPhase('ending');

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#f59e0b', '#38bdf8', '#ffffff'],
        });
      } catch {}
    }
  };

  const currentLine = dialogueScript[dialogueIdx];

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between select-none overflow-hidden bg-[#24131e]">
      {/* ================= USER'S AUTHENTIC PIXEL SUNSET CLOUD SKY ================= */}
      <div className="absolute inset-x-0 top-0 h-[62%] z-0 pointer-events-none overflow-hidden">
        <Image
          src="/assets/sprites/sunset_sky.png"
          alt="Pixel Sunset Clouds"
          fill
          className="pixelated object-cover object-bottom"
          priority
        />
        {/* Warm Horizon Twilight Glow */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#c2410c]/40 via-[#9a3412]/20 to-transparent" />
      </div>

      {/* ================= PIXEL PARK ENVIRONMENT ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Ground: Pixel Grass with sunset warm tint */}
        <div
          className="absolute bottom-0 inset-x-0 h-[48%] bg-[#5c8a32] shadow-inner"
          style={{
            backgroundImage: 'url(/assets/sprites/tile_grass.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '140px 76px',
          }}
        >
          {/* Sunset Warm Amber Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#c2410c]/40 via-[#e11d48]/25 to-transparent" />
        </div>

        {/* Authentic RPG Dirt Path in Sunset */}
        <div
          className="absolute bottom-8 inset-x-0 h-[66px]"
          style={{
            backgroundImage: 'url(/assets/sprites/path_straight_h.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '129px 66px',
          }}
        />

        {/* Trees in the background */}
        <div className="absolute bottom-[35%] left-4 w-60 h-72">
          <Image src="/assets/sprites/tree_1.png" alt="Tree" fill className="pixelated object-contain" />
        </div>
        <div className="absolute bottom-[38%] right-8 w-44 h-56">
          <Image src="/assets/sprites/tree_2.png" alt="Tree" fill className="pixelated object-contain" />
        </div>

        {/* Pixel Street Lamp */}
        <div className="absolute bottom-[28%] left-[340px] w-8 h-24">
          <Image src="/assets/sprites/pixel_lamp.png" alt="Lamp" fill className="pixelated object-contain" />
        </div>

        {/* Pixel Vintage Wooden Park Bench (Matching Babak 1 Ara Bench) */}
        <div className="absolute bottom-[22%] left-[690px] w-[180px] h-[119px] z-15 filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]">
          <Image src="/assets/sprites/pixel_bench.png" alt="Bench" fill className="pixelated object-contain" />
        </div>

        {/* Pixel Bushes */}
        <div className="absolute bottom-[26%] right-[80px] w-36 h-28 z-15">
          <Image src="/assets/sprites/bush_1.png" alt="Bush" fill className="pixelated object-contain" />
        </div>
      </div>

      {/* ================= CHARACTERS IN WORLD ================= */}
      <div className="absolute inset-0 z-20 pointer-events-none select-none">
        {/* Arel (Boy) */}
        <div
          className="absolute transition-transform z-25"
          style={{
            left: arelWalkX,
            bottom: '22%',
          }}
        >
          <div
            className="relative h-40 filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
            style={{ width: `${getArelWidth()}px` }}
          >
            <Image
              src={getArelSprite()}
              alt="Arel"
              fill
              className="pixelated object-contain"
              priority
            />
          </div>
        </div>

        {/* Ara (Girl) */}
        <div
          className="absolute z-20"
          style={{
            left: 728,
            bottom: isAraStanding ? '21%' : '24.5%',
          }}
        >
          <div
            className="relative h-36 filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
            style={{ width: `${getAraWidth()}px` }}
          >
            <Image
              src={getAraSprite()}
              alt="Ara"
              fill
              className="pixelated object-contain"
              priority
            />
          </div>

          {/* Action indicator when Ara notices Arel */}
          {phase === 'standing_up' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#181920] border-2 border-pink-400 px-2 py-0.5 rounded font-pixel text-[9px] text-pink-300"
            >
              [ Ara Berdiri! ]
            </motion.div>
          )}
        </div>
      </div>

      {/* Top Banner Status */}
      <div className="relative z-30 w-full p-3 sm:p-5 flex justify-between items-center pointer-events-none">
        <div className="bg-[#181920]/95 border-2 border-[#ea580c] px-4 py-1.5 shadow-lg flex items-center gap-2">
          <span className="font-pixel text-xs text-amber-300 uppercase">
            BABAK 5: PERKENALAN DI SENJA
          </span>
        </div>

        <div className="bg-[#181920]/95 border-2 border-[#db2777] px-4 py-1.5 shadow-lg flex items-center gap-2">
          <span className="font-pixel text-xs text-pink-300">
            SKOR KESAN: {score} POIN
          </span>
        </div>
      </div>

      {/* Dialogue Box (Only active during dialogue phase) */}
      {phase === 'dialogue' && (
        <DialogueBox
          dialogue={currentLine}
          onNext={handleNextDialogue}
          isOpen={true}
        />
      )}

      {/* ================= FINAL ENDING CARD ================= */}
      <AnimatePresence>
        {phase === 'ending' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
          >
            <div className="relative max-w-lg w-full bg-[#181920] border-4 border-[#f59e0b] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.5)]">
              {/* Ending Title */}
              <div className="font-pixel text-sm sm:text-base text-amber-300 uppercase tracking-widest mb-2">
                {endingType === 'A'
                  ? 'ENDING A: AWAL YANG INDAH'
                  : endingType === 'B'
                  ? 'ENDING B: TEMAN BARU'
                  : 'ENDING C: CANGGUNG'}
              </div>

              {/* Score Badge */}
              <div className="inline-block bg-[#0f172a] border-2 border-amber-500/70 px-4 py-1 font-pixel text-xs text-amber-400 mb-4">
                TOTAL SKOR KESAN: {score} POIN
              </div>

              {/* Ending Artwork Icon */}
              <div className="relative w-24 h-24 mx-auto my-3">
                <Image
                  src={
                    endingType === 'C'
                      ? '/assets/sprites/flower_wilting.png'
                      : paper && ribbon
                      ? `/assets/sprites/bouquet_${paper.id}_${ribbon.id}.png`
                      : '/assets/sprites/bouquet_full.png'
                  }
                  alt="Ending Result"
                  fill
                  className="pixelated object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Ending Script */}
              {endingType === 'A' && (
                <div className="space-y-3 font-retro text-xl sm:text-2xl text-slate-100">
                  <p className="text-pink-300 italic">
                    Ara: &ldquo;Besok pagi aku di bangku yang sama lagi. Jangan lupa bawa bunga yang lain ya.&rdquo;
                  </p>
                  <p className="text-amber-300 italic">
                    Arel: &ldquo;Siap! Kali ini lebih banyak.&rdquo;
                  </p>
                  <p className="text-base sm:text-lg text-slate-300 pt-3 border-t-2 border-slate-700">
                    <strong>Hasil:</strong> Mereka bertukar nomor dan memulai kisah baru yang hangat di taman kota.
                  </p>
                </div>
              )}

              {endingType === 'B' && (
                <div className="space-y-3 font-retro text-xl sm:text-2xl text-slate-100">
                  <p className="text-pink-300 italic">
                    Ara: &ldquo;Makasih bunganya. Mungkin kita bisa ngobrol lagi lain kali.&rdquo;
                  </p>
                  <p className="text-base sm:text-lg text-slate-300 pt-3 border-t-2 border-slate-700">
                    <strong>Hasil:</strong> Mereka menjadi teman baik dan saling menyapa saat bertemu di taman.
                  </p>
                </div>
              )}

              {endingType === 'C' && (
                <div className="space-y-3 font-retro text-xl sm:text-2xl text-slate-100">
                  <p className="text-pink-300 italic">
                    Ara: &ldquo;Makasih bunganya... aku harus pulang dulu ya.&rdquo;
                  </p>
                  <p className="text-base sm:text-lg text-slate-300 pt-3 border-t-2 border-slate-700">
                    <strong>Hasil:</strong> Arel belajar untuk lebih santai, jujur, dan natural saat berkenalan.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <PixelButton variant="amber" size="lg" onClick={onRestart} className="w-full">
                  MAIN LAGI
                </PixelButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
