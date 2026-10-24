import React, { useEffect, useState, useRef } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Flame, Target, Share2, Check } from 'lucide-react';
import { ParticleCanvas, ParticleCanvasHandle } from './ParticleCanvas';
import { sound } from '../utils/audio';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  stats: {
    starsPopped: number;
    goldenPopped: number;
    maxCombo: number;
    accuracy: number;
    totalClicks: number;
    successfulHits: number;
  };
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewRecord,
  stats,
  onPlayAgain,
  onReturnHome,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const particleRef = useRef<ParticleCanvasHandle | null>(null);

  useEffect(() => {
    // Sound & celebration
    if (isNewRecord) {
      sound.playVictory();
    } else {
      sound.playGameOver();
    }

    // Trigger confetti fireworks
    const timer = setTimeout(() => {
      if (particleRef.current) {
        particleRef.current.celebrate();
      }
    }, 150);

    // Number counting up animation
    let current = 0;
    const step = Math.max(1, Math.floor(score / 35));
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 25);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isNewRecord, score]);

  const handleShare = async () => {
    sound.playClick();
    const text = `⭐ J'ai obtenu ${score} points sur Tap'Étoile ! Viens battre mon record ! 🎮✨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tap'Étoile - Mon Record",
          text,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReplay = () => {
    sound.playClick();
    if ('vibrate' in navigator) {
      navigator.vibrate(35);
    }
    onPlayAgain();
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between p-6 text-white overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <ParticleCanvas ref={particleRef} />

      {/* Top Banner */}
      <div className="z-10 text-center pt-2">
        {isNewRecord ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Nouveau Record Personnel !</span>
          </div>
        ) : (
          <span className="text-xs font-bold tracking-widest uppercase text-purple-300">
            Fin de la partie
          </span>
        )}
      </div>

      {/* Center Trophy and Score display */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center w-full max-w-xs">
        {/* Animated Trophy / Medal */}
        <div className="relative w-24 h-24 mb-3 animate-bounce-gentle">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30 animate-pulse" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(245,158,11,0.5)]">
            <defs>
              <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            {/* Cup handles */}
            <path d="M 24 35 C 10 35 10 55 24 60" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            <path d="M 76 35 C 90 35 90 55 76 60" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
            {/* Cup body */}
            <path d="M 25 24 L 75 24 L 70 62 C 67 72 33 72 30 62 Z" fill="url(#cupGrad)" stroke="#B45309" strokeWidth="3" />
            {/* Star badge on cup */}
            <polygon points="50,38 53,46 61,47 55,52 57,60 50,55 43,60 45,52 39,47 47,46" fill="#FFFFFF" />
            {/* Cup stem & base */}
            <rect x="44" y="68" width="12" height="12" fill="#D97706" />
            <rect x="30" y="80" width="40" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          </svg>
        </div>

        {/* Score Readout */}
        <div className="text-xs font-bold uppercase tracking-wider text-purple-200">Score Réalisé</div>
        <div className="text-5xl sm:text-6xl font-black text-amber-300 tabular-nums drop-shadow-md my-1 font-sans">
          {animatedScore}
        </div>
        <div className="text-xs text-purple-200/70 mb-4 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Meilleur score : <b className="text-white font-bold">{highScore} pts</b></span>
        </div>

        {/* Game Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shadow-lg">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-purple-200 flex items-center gap-1">
              <span>⭐</span> Étoiles
            </span>
            <span className="text-base font-black text-white tabular-nums">
              {stats.starsPopped + stats.goldenPopped}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <span className="text-[10px] text-purple-200 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Combo
            </span>
            <span className="text-base font-black text-white tabular-nums">
              x{stats.maxCombo}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-purple-200 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Précision
            </span>
            <span className="text-base font-black text-white tabular-nums">
              {stats.accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Buttons Area: REJOUER, ACCUEIL, PARTAGER */}
      <div className="w-full flex flex-col items-center gap-2.5 z-10 pb-2 max-w-xs">
        {/* Big Replay Button */}
        <button
          onClick={handleReplay}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-lg tracking-wider uppercase shadow-[0_10px_25px_rgba(16,185,129,0.5)] border-2 border-emerald-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>REJOUER</span>
        </button>

        <div className="w-full grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onReturnHome();
            }}
            className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-purple-300" />
            <span>Accueil</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/15 transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Partager</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
