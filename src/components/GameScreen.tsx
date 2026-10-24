import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX, Flame } from 'lucide-react';
import { TargetItem, FloatingText, GameMode, TargetType } from '../types';
import { TargetItemView } from './TargetItemView';
import { ParticleCanvas, ParticleCanvasHandle } from './ParticleCanvas';
import { sound } from '../utils/audio';

interface GameScreenProps {
  mode: GameMode;
  highScore: number;
  onFinishGame: (finalScore: number, stats: { starsPopped: number; goldenPopped: number; maxCombo: number; accuracy: number; totalClicks: number; successfulHits: number }) => void;
  onReturnHome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  highScore,
  onFinishGame,
  onReturnHome,
  isMuted,
  onToggleMute,
}) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? 30 : 0);
  const [isPaused, setIsPaused] = useState(false);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [scoreBump, setScoreBump] = useState(false);

  // Statistics counters
  const statsRef = useRef({
    starsPopped: 0,
    goldenPopped: 0,
    totalClicks: 0,
    successfulHits: 0,
    maxCombo: 1,
  });

  const particleRef = useRef<ParticleCanvasHandle | null>(null);
  const playAreaRef = useRef<HTMLDivElement | null>(null);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn a target
  const spawnTarget = useCallback(() => {
    if (isPaused) return;

    // Pick target type
    const rand = Math.random();
    let type: TargetType = 'star';
    let points = 10;
    let size = 68;
    let duration = 2800; // time before disappearing

    if (rand < 0.12) {
      // Golden star (12% chance)
      type = 'golden';
      points = 30;
      size = 76;
      duration = 2400;
    } else if (mode === 'timed' && rand >= 0.12 && rand < 0.22) {
      // Clock bonus (10% chance)
      type = 'time';
      points = 5;
      size = 64;
      duration = 2500;
    } else if (rand >= 0.22 && rand < 0.34) {
      // Meteor danger (12% chance)
      type = 'meteor';
      points = -20;
      size = 66;
      duration = 3200;
    } else if (rand >= 0.34 && rand < 0.39) {
      // Rainbow star (5% chance)
      type = 'rainbow';
      points = 50;
      size = 80;
      duration = 2200;
    }

    const newItem: TargetItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: Math.floor(Math.random() * 70) + 15, // between 15% and 85%
      y: Math.floor(Math.random() * 65) + 15, // between 15% and 80%
      size,
      points,
      duration,
      createdAt: Date.now(),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    };

    setTargets((prev) => {
      // Limit simultaneous targets to 5
      const current = prev.slice(-4);
      return [...current, newItem];
    });
  }, [isPaused, mode]);

  // Game loop: Timer countdown & spawning
  useEffect(() => {
    if (isPaused) return;

    // Timer countdown (for timed mode)
    let timer: NodeJS.Timeout | null = null;
    if (mode === 'timed') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            // Trigger game over
            const total = statsRef.current.totalClicks || 1;
            const accuracy = Math.round((statsRef.current.successfulHits / total) * 100);
            onFinishGame(score, {
              starsPopped: statsRef.current.starsPopped,
              goldenPopped: statsRef.current.goldenPopped,
              maxCombo: statsRef.current.maxCombo,
              accuracy: Math.min(100, Math.max(0, accuracy)),
              totalClicks: statsRef.current.totalClicks,
              successfulHits: statsRef.current.successfulHits,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Target spawning interval (every 750ms - 1100ms)
    const scheduleNextSpawn = () => {
      const delay = Math.random() * 350 + 750;
      spawnTimerRef.current = setTimeout(() => {
        spawnTarget();
        scheduleNextSpawn();
      }, delay);
    };

    scheduleNextSpawn();

    return () => {
      if (timer) clearInterval(timer);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [isPaused, mode, onFinishGame, score, spawnTarget]);

  // Clean expired targets
  useEffect(() => {
    if (isPaused) return;
    const cleaner = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => prev.filter((item) => now - item.createdAt < item.duration));
    }, 400);

    return () => clearInterval(cleaner);
  }, [isPaused]);

  // Clean floating texts after 1.2s
  useEffect(() => {
    const cleaner = setInterval(() => {
      const now = Date.now();
      setFloatingTexts((prev) => prev.filter((f) => now - f.createdAt < 1200));
    }, 300);

    return () => clearInterval(cleaner);
  }, []);

  // Handle Target Pop
  const handleTargetPop = (item: TargetItem, event: React.PointerEvent<HTMLButtonElement>) => {
    if (isPaused) return;
    statsRef.current.totalClicks += 1;

    // Vibration feedback on Android
    if ('vibrate' in navigator) {
      if (item.type === 'meteor') {
        navigator.vibrate([60, 40, 60]);
      } else {
        navigator.vibrate(25);
      }
    }

    // Trigger particles
    if (particleRef.current) {
      particleRef.current.burst(event.clientX, event.clientY, item.type, item.type === 'rainbow' ? 26 : 16);
    }

    // Screen Shake for meteor
    if (item.type === 'meteor') {
      sound.playBomb();
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      setCombo(1);

      setScore((s) => Math.max(0, s - 20));

      // Floating text
      addFloatingText(item.x, item.y, '-20 💥', '#EF4444');
    } else {
      // Normal or bonus item
      statsRef.current.successfulHits += 1;
      if (item.type === 'golden') {
        statsRef.current.goldenPopped += 1;
        sound.playGoldenSparkle();
      } else if (item.type === 'time') {
        sound.playClockBonus();
        setTimeLeft((t) => t + 3);
        addFloatingText(item.x, item.y, '+3s ⏰', '#06B6D4');
      } else {
        statsRef.current.starsPopped += 1;
        sound.playStarChime(combo);
      }

      // Combo update
      const newCombo = Math.min(combo + 1, 5);
      setCombo(newCombo);
      if (newCombo > statsRef.current.maxCombo) {
        statsRef.current.maxCombo = newCombo;
        setMaxCombo(newCombo);
      }

      // Reset combo if no star tapped within 1.8s
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setCombo(1);
      }, 1800);

      const addedPoints = item.points * combo;
      setScore((s) => s + addedPoints);

      // Score bump animation
      setScoreBump(true);
      setTimeout(() => setScoreBump(false), 150);

      // Floating text
      const textLabel = combo > 1 ? `+${addedPoints} (x${combo})` : `+${addedPoints}`;
      const color = item.type === 'golden' ? '#F59E0B' : item.type === 'rainbow' ? '#EC4899' : '#FBBF24';
      addFloatingText(item.x, item.y, textLabel, color);
    }

    // Remove popped target
    setTargets((prev) => prev.filter((t) => t.id !== item.id));
  };

  // Add floating text
  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [
      ...prev,
      {
        id,
        text,
        x,
        y,
        color,
        createdAt: Date.now(),
      },
    ]);
  };

  // Miss click on empty space
  const handlePlayAreaClick = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only count if clicked directly on background
    if (e.target === playAreaRef.current) {
      statsRef.current.totalClicks += 1;
      setCombo(1);
    }
  };

  return (
    <div
      className={`relative flex-1 flex flex-col w-full h-full select-none overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* Particle Canvas */}
      <ParticleCanvas ref={particleRef} />

      {/* Top Game Bar */}
      <div className="w-full px-4 py-3 flex items-center justify-between z-20 bg-slate-950/60 backdrop-blur-md border-b border-indigo-900/40">
        {/* Score Readout */}
        <div className="flex items-center gap-2">
          <div
            className={`flex flex-col transition-transform duration-100 ${
              scoreBump ? 'scale-125 text-amber-300' : 'scale-100 text-white'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Score</span>
            <span className="text-2xl font-black tabular-nums tracking-tight text-amber-300">{score}</span>
          </div>

          {/* Combo Multiplier badge */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black shadow-md animate-bounce-gentle">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Timer (if timed mode) or High Score (if zen) */}
        {mode === 'timed' ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Temps</span>
            <div
              className={`text-2xl font-black tabular-nums ${
                timeLeft <= 5 ? 'text-red-400 animate-pulse scale-110' : 'text-emerald-400'
              }`}
            >
              {timeLeft}s
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Zen</span>
            <span className="text-xs font-semibold text-emerald-400">Infini ✨</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label="Son"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsPaused(true);
            }}
            aria-label="Pause"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Progress Bar */}
      {mode === 'timed' && (
        <div className="w-full h-1.5 bg-slate-800 relative z-20">
          <div
            className={`h-full transition-all duration-300 ${
              timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      )}

      {/* Interactive Playfield Area */}
      <div
        ref={playAreaRef}
        onPointerDown={handlePlayAreaClick}
        className="relative flex-1 w-full h-full overflow-hidden touch-none cursor-crosshair"
      >
        {/* Subtle decorative background stars */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-8 text-xs text-white">✨</div>
          <div className="absolute top-40 right-12 text-sm text-yellow-200">⭐</div>
          <div className="absolute bottom-20 left-16 text-xs text-white">✨</div>
          <div className="absolute top-1/2 left-1/3 text-xs text-purple-200">✨</div>
          <div className="absolute bottom-32 right-10 text-xs text-white">✨</div>
        </div>

        {/* Active Target Items */}
        {targets.map((item) => (
          <TargetItemView key={item.id} item={item} onPop={handleTargetPop} />
        ))}

        {/* Floating animated points */}
        {floatingTexts.map((f) => (
          <div
            key={f.id}
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              color: f.color,
            }}
            className="absolute pointer-events-none font-black text-sm sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-float-fade z-40 transform -translate-x-1/2 -translate-y-1/2"
          >
            {f.text}
          </div>
        ))}

        {/* Hint when playfield is empty */}
        {targets.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <span className="text-xs text-purple-200 font-semibold tracking-wide animate-pulse">
              Prépare-toi...
            </span>
          </div>
        )}
      </div>

      {/* Pause Overlay Modal */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl space-y-4">
            <h3 className="text-2xl font-black text-white">Pause</h3>
            <p className="text-xs text-slate-400">La partie est en pause</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Reprendre</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setScore(0);
                  setTimeLeft(mode === 'timed' ? 30 : 0);
                  setTargets([]);
                  setCombo(1);
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onReturnHome();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Menu Principal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
