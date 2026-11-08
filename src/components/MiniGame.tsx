'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Clock, Sparkles } from 'lucide-react';
import { DialogueBox, DialogueLine } from './DialogueBox';
import { VirtualControls } from './VirtualControls';
import { OrientationLock } from './OrientationLock';
import { StationeryShop, PaperOption, RibbonOption } from './StationeryShop';
import { BouquetCrafting } from './BouquetCrafting';
import { AfternoonScene } from './AfternoonScene';
import { soundFx } from '@/utils/audio';

const MOVE_SPEED = 4.4;

interface FlowerSpot {
  id: number;
  name: string;
  locationName: string;
  x: number;
  y: number;
  sprite: string;
  collected: boolean;
  dialogueText: string;
}

export default function MiniGame() {
  const [currentAct, setCurrentAct] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Player position & movement
  const [playerPos, setPlayerPos] = useState({ x: 140, y: 400 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(1);
  const [araBenchFrame, setAraBenchFrame] = useState<1 | 2>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // 5 Collectible flowers in the park (Using real pixel sprites, zero emojis!)
  const [flowers, setFlowers] = useState<FlowerSpot[]>([
    {
      id: 1,
      name: 'Mawar Merah',
      locationName: 'Dekat pintu masuk',
      x: 170,
      y: 480,
      sprite: '/assets/sprites/flower_red.png',
      collected: false,
      dialogueText: 'Mawar merah, simbol cinta. Jangan berlebihan dulu, kan belum kenal.',
    },
    {
      id: 2,
      name: 'Daisy',
      locationName: 'Pinggir air mancur',
      x: 430,
      y: 390,
      sprite: '/assets/sprites/flower_white.png',
      collected: false,
      dialogueText: 'Polos dan manis, mekar di dekat air mancur. Cocok banget.',
    },
    {
      id: 3,
      name: 'Bunga Pink',
      locationName: 'Bawah pohon besar',
      x: 290,
      y: 220,
      sprite: '/assets/sprites/flower_pink.png',
      collected: false,
      dialogueText: 'Warnanya lembut, mirip suasana hatiku pagi ini.',
    },
    {
      id: 4,
      name: 'Bunga Matahari',
      locationName: 'Dekat jalan setapak',
      x: 750,
      y: 260,
      sprite: '/assets/sprites/flower_yellow.png',
      collected: false,
      dialogueText: 'Cerah dan hangat, kayak senyum orang tadi.',
    },
    {
      id: 5,
      name: 'Lavender',
      locationName: 'Semak belakang taman',
      x: 940,
      y: 440,
      sprite: '/assets/sprites/flower_blooming.png',
      collected: false,
      dialogueText: 'Wanginya menenangkan. Ini yang terakhir!',
    },
  ]);

  // Timer & rare blue tulip
  const [huntTimer, setHuntTimer] = useState(0);
  const [hasBlueTulip, setHasBlueTulip] = useState(false);
  const [showBlueTulipBanner, setShowBlueTulipBanner] = useState(false);

  // Shop choices
  const [selectedPaper, setSelectedPaper] = useState<PaperOption | null>(null);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOption | null>(null);
  const [synergyBonus, setSynergyBonus] = useState(false);

  // Dialogue system state
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[]>([]);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState(0);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const onDialogueCompleteRef = useRef<(() => void) | null>(null);

  // Active interaction near player
  const [nearbyTarget, setNearbyTarget] = useState<
    | { type: 'flower'; flower: FlowerSpot }
    | { type: 'ara' }
    | { type: 'shopGate' }
    | null
  >(null);

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number | null>(null);
  const lastStepSoundRef = useRef<number>(0);

  const collectedCount = flowers.filter((f) => f.collected).length;

  const startDialogue = useCallback((lines: DialogueLine[], onComplete?: () => void) => {
    setDialogueQueue(lines);
    setCurrentDialogueIdx(0);
    setIsDialogueOpen(true);
    onDialogueCompleteRef.current = onComplete || null;
  }, []);

  const handleNextDialogue = useCallback(() => {
    if (currentDialogueIdx < dialogueQueue.length - 1) {
      setCurrentDialogueIdx((prev) => prev + 1);
    } else {
      setIsDialogueOpen(false);
      if (onDialogueCompleteRef.current) {
        onDialogueCompleteRef.current();
        onDialogueCompleteRef.current = null;
      }
    }
  }, [currentDialogueIdx, dialogueQueue.length]);

  // Babak 1 Intro
  useEffect(() => {
    if (currentAct === 1) {
      const timer = setTimeout(() => {
        soundFx.playHeartbeat();
        startDialogue(
          [
            {
              speaker: 'Arel',
              speakerType: 'thought',
              portrait: '/assets/sprites/cowo_bust_scratch.png',
              text: 'Wah... siapa dia? Kok rasanya waktu berhenti sebentar ya...',
            },
            {
              speaker: 'Arel',
              speakerType: 'thought',
              portrait: '/assets/sprites/cowo_bust_talking.png',
              text: 'Aku harus kenalan. Tapi masa datang dengan tangan kosong?',
            },
            {
              speaker: 'Arel',
              speakerType: 'thought',
              portrait: '/assets/sprites/cowo_bust_talking.png',
              text: 'Di taman ini kan banyak bunga. Kasih bunga aja sebagai hadiah perkenalan!',
            },
          ],
          () => {
            setCurrentAct(2);
          }
        );
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentAct, startDialogue]);

  // Timer for Babak 2
  useEffect(() => {
    if (currentAct !== 2 || isDialogueOpen || isPortrait) return;
    const interval = setInterval(() => {
      setHuntTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentAct, isDialogueOpen, isPortrait]);

  // Walk sprite animation
  useEffect(() => {
    if (!isMoving) {
      setWalkFrame(1);
      return;
    }
    const interval = setInterval(() => {
      setWalkFrame((prev) => (prev % 4) + 1);
    }, 115);
    return () => clearInterval(interval);
  }, [isMoving]);

  // Ara seated on bench reading & blinking idle animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const cycle = () => {
      setAraBenchFrame(1);
      timer = setTimeout(() => {
        setAraBenchFrame(2);
        timer = setTimeout(cycle, 450);
      }, 2500);
    };
    cycle();
    return () => clearTimeout(timer);
  }, []);

  // Proximity detection
  useEffect(() => {
    if (currentAct !== 2) return;

    if (collectedCount >= 5) {
      const distToGate = Math.hypot(playerPos.x - 1040, playerPos.y - 360);
      if (distToGate < 95) {
        setNearbyTarget({ type: 'shopGate' });
        return;
      }
    }

    const distToAra = Math.hypot(playerPos.x - 960, playerPos.y - 150);
    if (distToAra < 95) {
      setNearbyTarget({ type: 'ara' });
      return;
    }

    let nearestFlower: FlowerSpot | null = null;
    let minDistance = 75;

    for (const f of flowers) {
      if (!f.collected) {
        const d = Math.hypot(playerPos.x - f.x, playerPos.y - f.y);
        if (d < minDistance) {
          minDistance = d;
          nearestFlower = f;
        }
      }
    }

    if (nearestFlower) {
      setNearbyTarget({ type: 'flower', flower: nearestFlower });
    } else {
      setNearbyTarget(null);
    }
  }, [playerPos, flowers, collectedCount, currentAct]);

  // Handle interaction
  const handleInteract = useCallback(() => {
    if (isDialogueOpen) {
      handleNextDialogue();
      return;
    }

    if (!nearbyTarget) return;

    if (nearbyTarget.type === 'flower') {
      const flower = nearbyTarget.flower;
      soundFx.playPick();

      setFlowers((prev) =>
        prev.map((f) => (f.id === flower.id ? { ...f, collected: true } : f))
      );

      const nextCount = collectedCount + 1;

      if (nextCount === 5 && huntTimer <= 40) {
        setHasBlueTulip(true);
        setShowBlueTulipBanner(true);
      }

      const lines: DialogueLine[] = [
        {
          speaker: 'Arel',
          speakerType: 'thought',
          portrait: '/assets/sprites/cowo_bust_talking.png',
          text: flower.dialogueText,
        },
      ];

      if (nextCount === 5) {
        lines.push({
          speaker: 'Arel',
          speakerType: 'thought',
          portrait: '/assets/sprites/cowo_bust_scratch.png',
          text: 'Masa dikasih gitu aja? Aku butuh kertas dan pita. Toko alat tulis dekat sini ada.',
        });
      }

      startDialogue(lines);
    } else if (nearbyTarget.type === 'ara') {
      startDialogue([
        {
          speaker: 'Ara',
          speakerType: 'ara',
          portrait: '/assets/sprites/cewe_bust_smiling.png',
          text: 'Hmm? Ada apa ya?',
        },
        {
          speaker: 'Arel',
          speakerType: 'thought',
          portrait: '/assets/sprites/cowo_bust_scratch.png',
          text: '(Tunggu sebentar... aku harus merangkai buket bunga dulu sebelum mengajak kenalan!)',
        },
      ]);
    } else if (nearbyTarget.type === 'shopGate') {
      soundFx.playBell();
      setCurrentAct(3);
    }
  }, [
    isDialogueOpen,
    handleNextDialogue,
    nearbyTarget,
    collectedCount,
    huntTimer,
    startDialogue,
  ]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogueOpen && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) {
        e.preventDefault();
        // Handled cleanly by DialogueBox's own advance listener
        return;
      }

      if (e.code === 'KeyE' || (e.code === 'Space' && !isDialogueOpen)) {
        e.preventDefault();
        handleInteract();
        return;
      }

      if (['ArrowUp', 'KeyW', 'ArrowDown', 'KeyS', 'ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        keysPressed.current[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDialogueOpen, handleNextDialogue, handleInteract]);

  // Movement loop
  useEffect(() => {
    const update = () => {
      if (isDialogueOpen || currentAct !== 2 || isPortrait) {
        setIsMoving(false);
        gameLoopRef.current = requestAnimationFrame(update);
        return;
      }

      let dx = 0;
      let dy = 0;

      if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) dy -= 1;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) dy += 1;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) dx -= 1;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);
        if (dx < 0) setFacing('left');
        else if (dx > 0) setFacing('right');

        setPlayerPos((prev) => {
          let nextX = prev.x + dx * MOVE_SPEED;
          let nextY = prev.y + dy * MOVE_SPEED;

          // Park bounds
          nextX = Math.max(60, Math.min(1140, nextX));
          nextY = Math.max(130, Math.min(640, nextY));

          // Collision with water fountain (centered at 543, 388; radius X: 80, Y: 58)
          const fountainDist = Math.hypot((nextX - 543) / 80, (nextY - 388) / 58);
          if (fountainDist < 1.0) {
            // Push out from fountain basin
            nextX = prev.x;
            nextY = prev.y;
          }

          // Collision with Ara bench area (left: 880..1010, top: 95..180)
          if (nextX > 880 && nextX < 1010 && nextY > 95 && nextY < 180) {
            nextX = prev.x;
            nextY = prev.y;
          }

          return { x: nextX, y: nextY };
        });

        // Footstep audio throttle
        const now = Date.now();
        if (now - lastStepSoundRef.current > 250) {
          soundFx.playStep();
          lastStepSoundRef.current = now;
        }
      } else {
        setIsMoving(false);
      }

      gameLoopRef.current = requestAnimationFrame(update);
    };

    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isDialogueOpen, currentAct, isPortrait]);

  // Virtual control inputs for mobile
  const handleVirtualMoveStart = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (dir === 'up') keysPressed.current['ArrowUp'] = true;
    if (dir === 'down') keysPressed.current['ArrowDown'] = true;
    if (dir === 'left') keysPressed.current['ArrowLeft'] = true;
    if (dir === 'right') keysPressed.current['ArrowRight'] = true;
  };

  const handleVirtualMoveEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (dir === 'up') keysPressed.current['ArrowUp'] = false;
    if (dir === 'down') keysPressed.current['ArrowDown'] = false;
    if (dir === 'left') keysPressed.current['ArrowLeft'] = false;
    if (dir === 'right') keysPressed.current['ArrowRight'] = false;
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const handleRestart = () => {
    setFlowers((prev) => prev.map((f) => ({ ...f, collected: false })));
    setHuntTimer(0);
    setHasBlueTulip(false);
    setSelectedPaper(null);
    setSelectedRibbon(null);
    setSynergyBonus(false);
    setPlayerPos({ x: 140, y: 400 });
    setCurrentAct(1);
  };

  const playerSprite = isMoving
    ? `/assets/sprites/cowo_walk_${walkFrame}.png`
    : '/assets/sprites/cowo_idle_1.png';

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-[#07090e] font-retro">
      <OrientationLock onOrientationChange={setIsPortrait} />

      {/* Main Game Screen Frame */}
      <div className="relative w-full h-full max-w-[1200px] max-h-[100dvh] sm:max-h-[750px] overflow-hidden z-10 shadow-2xl border-0 sm:border-4 border-[#2b3345] rounded-none sm:rounded-lg bg-[#469632] flex flex-col">
        {/* ================= DEDICATED RETRO HUD BAR (Zero Prop Collision!) ================= */}
        {(currentAct === 1 || currentAct === 2) && (
          <div className="relative w-full h-12 bg-[#12141c] border-b-2 border-[#2e3440] px-3 sm:px-6 flex items-center justify-between z-40 select-none shadow-md">
            {/* Left: Act Badge */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-amber-400 rotate-45" />
              <span className="font-pixel text-[10px] sm:text-xs text-amber-400 uppercase tracking-wider">
                {currentAct === 1 ? 'BABAK 1: PAGI DI TAMAN' : 'BABAK 2: CARI 5 BUNGA'}
              </span>
            </div>

            {/* Center: Retro 5-Flower Inventory Slot Bar */}
            <div className="flex items-center gap-2 sm:gap-3 bg-[#181a22] border border-[#2b303c] px-3 py-1">
              <div className="flex items-center gap-1.5">
                {flowers.map((fl) => (
                  <div
                    key={fl.id}
                    title={fl.name}
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 border transition-all flex items-center justify-center ${
                      fl.collected
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : 'border-slate-700 bg-slate-900/60 opacity-35'
                    }`}
                  >
                    <Image
                      src={fl.sprite}
                      alt={fl.name}
                      width={22}
                      height={22}
                      className="pixelated object-contain"
                    />
                  </div>
                ))}

                {/* Rare Blue Tulip Slot */}
                {hasBlueTulip && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    title="Tulip Biru Langka"
                    className="relative w-7 h-7 sm:w-8 sm:h-8 border-2 border-cyan-400 bg-cyan-950/60 shadow-[0_0_10px_#38bdf8] flex items-center justify-center"
                  >
                    <Image
                      src="/assets/sprites/flower_blue_tulip.png"
                      alt="Tulip Biru"
                      width={22}
                      height={22}
                      className="pixelated object-contain"
                    />
                  </motion.div>
                )}
              </div>

              <div className="border-l border-slate-700 pl-2">
                <span className="font-pixel text-[10px] sm:text-xs text-slate-100 font-bold">
                  {collectedCount}/5
                </span>
              </div>
            </div>

            {/* Right: Timer & Audio */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-pixel text-[11px] text-slate-200 bg-[#181a22] border border-slate-700 px-2.5 py-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{huntTimer}s</span>
              </div>

              <button
                onClick={handleToggleMute}
                className="bg-[#181a22] hover:bg-[#252a36] border border-slate-700 p-1.5 text-slate-200 cursor-pointer transition"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= BABAK 1 & 2: PIXEL WORLD VIEWPORT ================= */}
        {(currentAct === 1 || currentAct === 2) && (
          <div className="relative flex-1 bg-[#4ca036] overflow-hidden select-none">
            {/* Morning Sky Backdrop */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd] z-0 pointer-events-none">
              <div className="absolute top-3 left-1/4 w-36 h-12 opacity-80">
                <Image src="/assets/sprites/pixel_cloud.png" alt="Cloud" fill className="pixelated object-contain" />
              </div>
              <div className="absolute top-5 right-1/3 w-44 h-14 opacity-75">
                <Image src="/assets/sprites/pixel_cloud.png" alt="Cloud" fill className="pixelated object-contain" />
              </div>
              <div className="absolute top-3 right-16 w-16 h-16 rounded-full bg-yellow-200 shadow-[0_0_40px_#fde047]" />
            </div>

            {/* Pixel Grass Ground Texture (User's authentic grass) */}
            <div
              className="absolute inset-0 z-5"
              style={{
                backgroundImage: 'url(/assets/sprites/tile_grass.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: '140px 76px',
              }}
            />

            {/* Authentic RPG Dirt Path Network (100% Seamless, Zero Gaps, Perfectly Aligned, Reaches Edges) */}
            {/* 1. West Entrance Path: Starts from left screen edge (left: 0) to crossroad */}
            <div
              className="absolute top-[354px] left-0 w-[462px] h-[65px] z-6 pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/sprites/path_straight_h.png)',
                backgroundRepeat: 'repeat-x',
                backgroundSize: '96px 65px',
              }}
            />

            {/* 2. Central 4-Way Crossroad (Flawlessly Aligned with Horizontal & Vertical Roads) */}
            <div className="absolute top-[282px] left-[459px] w-[171px] h-[194px] z-6 pointer-events-none">
              <Image
                src="/assets/sprites/path_crossroad.png"
                alt="Persimpangan Jalan"
                fill
                className="pixelated object-contain"
                priority
              />
            </div>

            {/* 3. East Path to Stationery Shop: Parallel to West Path, Reaches Screen Edge (Pojok Kanan) */}
            <div
              className="absolute top-[354px] left-[627px] right-0 h-[65px] z-6 pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/sprites/path_straight_h.png)',
                backgroundRepeat: 'repeat-x',
                backgroundSize: '96px 65px',
              }}
            />

            {/* 4. North Path to Ara Gazebo */}
            <div
              className="absolute top-[215px] left-[512px] w-[65px] h-[70px] z-6 pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/sprites/path_straight_v.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '65px 96px',
              }}
            />

            {/* Clean 90-Degree L-Corner Turn to Ara bench */}
            <div className="absolute top-[148px] left-[512px] w-[101px] h-[101px] z-6 pointer-events-none">
              <Image
                src="/assets/sprites/path_corner_L.png"
                alt="Tikungan Jalan L"
                fill
                className="pixelated object-contain"
              />
            </div>

            {/* Upper horizontal path in front of Ara bench: Extends All The Way to Edge (Pojok Kanan) */}
            <div
              className="absolute top-[148px] left-[611px] right-0 h-[65px] z-6 pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/sprites/path_straight_h.png)',
                backgroundRepeat: 'repeat-x',
                backgroundSize: '96px 65px',
              }}
            />

            {/* 5. South Path towards meadow: Extends to bottom edge */}
            <div
              className="absolute top-[474px] bottom-0 left-[512px] w-[65px] z-6 pointer-events-none"
              style={{
                backgroundImage: 'url(/assets/sprites/path_straight_v.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '65px 96px',
              }}
            />

            {/* ================= PIXEL WATER FOUNTAIN (Symmetrically Centered on Crossroad) ================= */}
            <div
              className="absolute top-[309px] left-[461px] z-8 filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.4)] pointer-events-none"
              style={{ width: '160px', height: '150px' }}
            >
              <Image
                src="/assets/sprites/fountain.png"
                alt="Air Mancur Taman"
                fill
                className="pixelated object-contain"
                priority
              />
            </div>

            {/* Wooden Garden Fence (Positioned neatly on lawn north of road) */}
            <div className="absolute top-[102px] left-[640px] w-48 h-8 z-8">
              <Image src="/assets/sprites/pixel_fence.png" alt="Fence" fill className="pixelated object-contain" />
            </div>

            {/* Tree 1: Lush Oak with Vines (Extracted Individually from User Asset) */}
            <div className="absolute top-2 left-6 z-10 pointer-events-none">
              <div className="relative w-56 h-64 filter drop-shadow-[0_16px_12px_rgba(0,0,0,0.4)]">
                <Image src="/assets/sprites/tree_1.png" alt="Pohon Rindang" fill className="pixelated object-contain" priority />
              </div>
            </div>

            {/* Tree 2: Taller Tree with Falling Leaves (Extracted Individually from User Asset) */}
            <div className="absolute top-2 left-[690px] z-10 pointer-events-none">
              <div className="relative w-44 h-60 filter drop-shadow-[0_14px_8px_rgba(0,0,0,0.35)]">
                <Image src="/assets/sprites/tree_2.png" alt="Pohon Gugur" fill className="pixelated object-contain" />
              </div>
            </div>

            {/* Bush 1: Round Green Bush (Extracted Individually from User Asset) */}
            <div className="absolute top-[490px] left-[30px] z-10 pointer-events-none">
              <div className="relative w-32 h-32 filter drop-shadow-[0_10px_6px_rgba(0,0,0,0.3)]">
                <Image src="/assets/sprites/bush_1.png" alt="Semak Rimbun" fill className="pixelated object-contain" />
              </div>
            </div>

            {/* Bush 2: Lush Bush with Leafy Shoots (Extracted Individually from User Asset) */}
            <div className="absolute top-[480px] left-[980px] z-10 pointer-events-none">
              <div className="relative w-36 h-32 filter drop-shadow-[0_8px_6px_rgba(0,0,0,0.3)]">
                <Image src="/assets/sprites/bush_2.png" alt="Semak Daun" fill className="pixelated object-contain" />
              </div>
            </div>

            {/* Street Lamp */}
            <div className="absolute top-[280px] left-[340px] w-8 h-22 z-10 pointer-events-none">
              <Image src="/assets/sprites/pixel_lamp.png" alt="Lamp" fill className="pixelated object-contain" />
            </div>

            {/* ================= ARA SEATED NATURALLY ON PARK BENCH (Proportional Scale & Animated Reading) ================= */}
            <div
              className="absolute top-[96px] left-[895px] z-15 pointer-events-none filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]"
              style={{ width: '128px', height: '113px' }}
            >
              <Image
                src={`/assets/sprites/ara_bench_${araBenchFrame}.png`}
                alt="Ara Duduk Membaca di Bangku"
                fill
                className="pixelated object-contain"
                priority
              />

              {/* Status Badge (Scaled to fit Ara's compact size) */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#181920] border-2 border-pink-400 px-2 py-0.5 font-pixel text-[8px] text-pink-300 shadow flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
                <span>[ 🌸 ARA SEDANG MEMBACA ]</span>
              </div>
            </div>

            {/* ================= 5 COLLECTIBLE FLOWER SPOTS ================= */}
            {flowers.map((flower) => {
              if (flower.collected) return null;
              const isNear = nearbyTarget?.type === 'flower' && nearbyTarget.flower.id === flower.id;

              return (
                <div
                  key={flower.id}
                  className="absolute z-15 select-none"
                  style={{ left: flower.x - 24, top: flower.y - 32 }}
                >
                  {/* Subtle earth patch beneath flower */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#2e1d0f]/35 rounded-full blur-[1px] pointer-events-none" />

                  {/* Pulsing selection aura when player is nearby */}
                  {isNear && (
                    <motion.div
                      initial={{ y: 4, opacity: 0 }}
                      animate={{ y: [0, -4, 0], opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 0.9 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#181920] text-amber-300 font-pixel text-[9px] px-2.5 py-1 border-2 border-amber-400 shadow-xl whitespace-nowrap z-30 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>[E] PETIK {flower.name.toUpperCase()}</span>
                    </motion.div>
                  )}

                  {/* Flower Sprite */}
                  <div className="relative w-14 h-16 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] cursor-pointer group">
                    <Image
                      src={flower.sprite}
                      alt={flower.name}
                      fill
                      className="pixelated object-contain transition-transform group-hover:scale-110"
                    />
                  </div>
                </div>
              );
            })}

            {/* Stationery Shop Exit Gate */}
            {collectedCount >= 5 && (
              <div className="absolute z-20 cursor-pointer select-none" style={{ left: 1010, top: 310 }}>
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="bg-[#181920] border-3 border-amber-400 text-amber-300 font-pixel text-xs px-4 py-2 shadow-2xl flex flex-col items-center"
                >
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    🏪 TOKO ALAT TULIS →
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1">
                    {nearbyTarget?.type === 'shopGate' ? '[E] MASUK SEKARANG' : 'GERBANG TERBUKA'}
                  </span>
                </motion.div>
              </div>
            )}

            {/* Player Character (Arel) */}
            <div
              className="absolute z-25 select-none transition-transform"
              style={{
                left: playerPos.x - 24,
                top: playerPos.y - 68,
                transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              {/* Player foot shadow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/40 rounded-full blur-[1px]" />

              <div className="relative w-16 h-32 filter drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)]">
                <Image
                  src={playerSprite}
                  alt="Arel"
                  width={75}
                  height={150}
                  className="pixelated w-auto h-full object-contain"
                  priority
                />
              </div>
            </div>

            {/* Rare Blue Tulip Banner Notification */}
            <AnimatePresence>
              {showBlueTulipBanner && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-[#0c4a6e] text-white font-pixel text-xs px-5 py-2.5 border-2 border-cyan-400 shadow-2xl flex items-center gap-3"
                >
                  <div className="relative w-6 h-6">
                    <Image src="/assets/sprites/flower_blue_tulip.png" alt="Tulip" fill className="pixelated object-contain" />
                  </div>
                  <span>KAMU MENDAPATKAN TULIP BIRU LANGKA! (+1 POIN BONUS)</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Virtual Controls for Mobile Touch Devices (Only active when dialogue is closed) */}
            {!isDialogueOpen && (
              <VirtualControls
                onMoveStart={handleVirtualMoveStart}
                onMoveEnd={handleVirtualMoveEnd}
                onInteract={handleInteract}
                interactLabel={
                  nearbyTarget?.type === 'shopGate'
                    ? 'TOKO'
                    : nearbyTarget?.type === 'flower'
                    ? 'PETIK'
                    : 'AKSI'
                }
                canInteract={Boolean(nearbyTarget)}
              />
            )}
          </div>
        )}

        {/* ================= BABAK 3: TOKO ALAT TULIS ================= */}
        {currentAct === 3 && (
          <StationeryShop
            onPurchased={(paper, ribbon, synergy) => {
              setSelectedPaper(paper);
              setSelectedRibbon(ribbon);
              setSynergyBonus(synergy);
              setCurrentAct(4);
            }}
          />
        )}

        {/* ================= BABAK 4: MERANGKAI BUKET ================= */}
        {currentAct === 4 && selectedPaper && selectedRibbon && (
          <BouquetCrafting
            paper={selectedPaper}
            ribbon={selectedRibbon}
            hasBlueTulip={hasBlueTulip}
            onCraftFinished={() => {
              setCurrentAct(5);
            }}
          />
        )}

        {/* ================= BABAK 5: SORE HARI DI SENJA ================= */}
        {currentAct === 5 && (
          <AfternoonScene
            synergyBonus={synergyBonus}
            hasBlueTulip={hasBlueTulip}
            paper={selectedPaper}
            ribbon={selectedRibbon}
            onRestart={handleRestart}
          />
        )}

        {/* Dialogue Box for Babak 1 & 2 */}
        {(currentAct === 1 || currentAct === 2) && (
          <DialogueBox
            dialogue={dialogueQueue[currentDialogueIdx] || null}
            onNext={handleNextDialogue}
            isOpen={isDialogueOpen}
          />
        )}
      </div>

      {/* Footer controls hint bar */}
      <div className="hidden sm:flex items-center gap-6 text-slate-400 font-retro text-base mt-2 z-10 select-none">
        <span>🎮 Kontrol: <strong>WASD / Tombol Panah</strong> untuk bergerak</span>
        <span>•</span>
        <span>🌸 Interaksi: <strong>[E] / Space</strong> untuk memetik & bicara</span>
        <span>•</span>
        <span>📖 Cerita: <strong>Bunga untuk Perkenalan</strong></span>
      </div>
    </div>
  );
}
