import React from 'react';
import { TargetItem } from '../types';

interface TargetItemViewProps {
  item: TargetItem;
  onPop: (item: TargetItem, event: React.PointerEvent<HTMLButtonElement>) => void;
}

export const TargetItemView: React.FC<TargetItemViewProps> = ({ item, onPop }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'golden':
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-bounce-gentle">
            {/* Glowing aura */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-75 animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(250,204,21,0.6)]">
              {/* Crown */}
              <polygon points="35,18 42,32 50,22 58,32 65,18 62,38 38,38" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="35" cy="18" r="3" fill="#EF4444" />
              <circle cx="50" cy="22" r="3" fill="#3B82F6" />
              <circle cx="65" cy="18" r="3" fill="#10B981" />
              {/* Golden 5-point star */}
              <polygon
                points="50,15 61,38 86,41 68,58 73,83 50,71 27,83 32,58 14,41 39,38"
                fill="url(#goldGradient)"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Cute face */}
              <circle cx="43" cy="48" r="4" fill="#78350F" />
              <circle cx="57" cy="48" r="4" fill="#78350F" />
              <circle cx="44.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              <circle cx="58.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              <path d="M 45 56 Q 50 62 55 56" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              {/* Blushes */}
              <circle cx="38" cy="54" r="3" fill="#F87171" opacity="0.6" />
              <circle cx="62" cy="54" r="3" fill="#F87171" opacity="0.6" />

              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="30%" stopColor="#FDE047" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute -bottom-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-amber-300">
              +30
            </span>
          </div>
        );

      case 'time':
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-wiggle">
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-60 animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(6,182,212,0.5)]">
              {/* Alarm clock bells */}
              <circle cx="28" cy="28" r="10" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
              <circle cx="72" cy="28" r="10" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
              {/* Clock body */}
              <circle cx="50" cy="52" r="36" fill="#38BDF8" stroke="#0284C7" strokeWidth="4" />
              <circle cx="50" cy="52" r="30" fill="#F0F9FF" />
              {/* Clock hands */}
              <line x1="50" y1="52" x2="50" y2="34" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="50" y1="52" x2="64" y2="52" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="52" r="3" fill="#0369A1" />
              {/* Clock face smile */}
              <circle cx="43" cy="62" r="2.5" fill="#0369A1" />
              <circle cx="57" cy="62" r="2.5" fill="#0369A1" />
              <path d="M 46 68 Q 50 71 54 68" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="absolute -bottom-2 bg-cyan-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-cyan-300">
              +3s
            </span>
          </div>
        );

      case 'meteor':
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-spin-slow">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-70 animate-ping" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(220,38,38,0.7)]">
              {/* Spiky rocky meteor */}
              <polygon
                points="50,14 66,22 84,38 78,64 62,84 38,82 22,66 18,38 34,20"
                fill="url(#meteorGradient)"
                stroke="#7F1D1D"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Cracks / fiery glow */}
              <path d="M 36 32 L 48 44 L 40 56" fill="none" stroke="#FEF08A" strokeWidth="2.5" />
              <path d="M 64 36 L 54 48 L 62 60" fill="none" stroke="#FBBF24" strokeWidth="2" />
              {/* Angry eyes */}
              <polygon points="34,44 44,48 36,52" fill="#FEF2F2" />
              <polygon points="66,44 56,48 64,52" fill="#FEF2F2" />
              <circle cx="40" cy="48" r="2" fill="#991B1B" />
              <circle cx="60" cy="48" r="2" fill="#991B1B" />
              <path d="M 44 64 Q 50 58 56 64" fill="none" stroke="#FEF2F2" strokeWidth="2.5" strokeLinecap="round" />

              <defs>
                <linearGradient id="meteorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#991B1B" />
                  <stop offset="100%" stopColor="#450A0A" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute -bottom-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-red-300">
              -20 ⚠️
            </span>
          </div>
        );

      case 'rainbow':
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-bounce-gentle">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-md opacity-80 animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(236,72,153,0.7)]">
              <polygon
                points="50,12 62,37 88,40 70,58 75,85 50,72 25,85 30,58 12,40 38,37"
                fill="url(#rainbowGrad)"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Super happy kawaii face */}
              <circle cx="43" cy="47" r="4.5" fill="#4C1D95" />
              <circle cx="57" cy="47" r="4.5" fill="#4C1D95" />
              <circle cx="45" cy="45" r="1.8" fill="#FFFFFF" />
              <circle cx="59" cy="45" r="1.8" fill="#FFFFFF" />
              <path d="M 43 56 Q 50 65 57 56" fill="#F43F5E" stroke="#4C1D95" strokeWidth="2" />
              <defs>
                <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="25%" stopColor="#FB923C" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="75%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute -bottom-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md border border-white">
              +50 🌈
            </span>
          </div>
        );

      case 'star':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-wiggle">
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md opacity-40 animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(234,179,8,0.4)]">
              {/* Classic cute yellow star */}
              <polygon
                points="50,15 61,38 86,41 68,58 73,83 50,71 27,83 32,58 14,41 39,38"
                fill="url(#starGradient)"
                stroke="#EAB308"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Cute smiling eyes */}
              <circle cx="43" cy="48" r="3.5" fill="#854D0E" />
              <circle cx="57" cy="48" r="3.5" fill="#854D0E" />
              <circle cx="44.5" cy="46.5" r="1.2" fill="#FFFFFF" />
              <circle cx="58.5" cy="46.5" r="1.2" fill="#FFFFFF" />
              <path d="M 45 56 Q 50 61 55 56" fill="none" stroke="#854D0E" strokeWidth="2.2" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="39" cy="53" r="2.8" fill="#F87171" opacity="0.5" />
              <circle cx="61" cy="53" r="2.8" fill="#F87171" opacity="0.5" />

              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute -bottom-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-yellow-200">
              +10
            </span>
          </div>
        );
    }
  };

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPop(item, e);
      }}
      aria-label={`Étoile ${item.type}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        transform: 'translate(-50%, -50%)',
      }}
      className="absolute cursor-pointer touch-none select-none transition-transform duration-75 active:scale-75 hover:scale-110 focus:outline-none z-10"
    >
      {getIcon()}
    </button>
  );
};
