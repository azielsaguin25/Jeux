import React from 'react';
import { Play, Trophy, Volume2, VolumeX, Sparkles, HelpCircle, Zap, ShieldAlert } from 'lucide-react';
import { GameMode } from '../types';
import { sound } from '../utils/audio';

interface HomeScreenProps {
  highScore: number;
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  highScore,
  gameMode,
  onSetGameMode,
  onStartGame,
  isMuted,
  onToggleMute,
  onOpenGuide,
}) => {
  const handlePlay = () => {
    sound.playClick();
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
    onStartGame();
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between p-6 text-white overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-950">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top quick actions */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onOpenGuide();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/15 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Aide & Guide</span>
        </button>

        <button
          onClick={() => {
            onToggleMute();
          }}
          aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 border border-white/15 transition-all active:scale-90 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Hero Mascot & Title */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
        {/* Animated mascot star */}
        <div className="relative w-28 h-28 mb-4 animate-bounce-slow">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40 animate-pulse" />
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(245,158,11,0.6)]">
            <polygon
              points="50,12 62,37 88,40 70,58 75,85 50,72 25,85 30,58 12,40 38,37"
              fill="url(#homeStarGrad)"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Blinking cute eyes */}
            <circle cx="43" cy="48" r="4.2" fill="#78350F" />
            <circle cx="57" cy="48" r="4.2" fill="#78350F" />
            <circle cx="44.8" cy="46" r="1.5" fill="#FFFFFF" />
            <circle cx="58.8" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Big happy smile */}
            <path d="M 43 57 Q 50 67 57 57" fill="#EF4444" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="37" cy="54" r="3.5" fill="#F87171" opacity="0.6" />
            <circle cx="63" cy="54" r="3.5" fill="#F87171" opacity="0.6" />

            <defs>
              <linearGradient id="homeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute -top-1 -right-1 text-xl animate-spin-slow">✨</div>
        </div>

        {/* Title Lockup */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md mb-1 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent font-sans">
          TAP'ÉTOILE
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/80 font-medium max-w-xs">
          Le mini-jeu d'arcade tactile le plus rapide et amusant !
        </p>

        {/* High Score Badge */}
        <div className="mt-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2.5 shadow-lg">
          <Trophy className="w-5 h-5 text-amber-300 drop-shadow" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-purple-200">Record</div>
            <div className="text-lg font-black text-amber-300 tabular-nums leading-tight">
              {highScore} <span className="text-xs font-normal text-white/70">pts</span>
            </div>
          </div>
        </div>

        {/* Mode selector: Chrono vs Zen */}
        <div className="mt-5 flex items-center p-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 w-64 shadow-inner">
          <button
            onClick={() => {
              sound.playClick();
              onSetGameMode('timed');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              gameMode === 'timed'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Chrono 30s</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSetGameMode('zen');
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              gameMode === 'zen'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mode Zen</span>
          </button>
        </div>
      </div>

      {/* Bottom Area: Big JOUER Button and mini rule */}
      <div className="w-full flex flex-col items-center gap-3 z-10 pb-2">
        <button
          onClick={handlePlay}
          className="group relative w-full max-w-xs py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xl tracking-wider uppercase shadow-[0_10px_30px_rgba(16,185,129,0.5)] border-2 border-emerald-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 text-slate-950 ml-0.5" />
          </div>
          <span>JOUER</span>
        </button>

        <p className="text-[11px] text-purple-200/70 text-center flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Attrapez les étoiles et évitez les météores !</span>
        </p>
      </div>
    </div>
  );
};
