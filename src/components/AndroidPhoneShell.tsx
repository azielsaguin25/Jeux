import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2, Info } from 'lucide-react';

interface AndroidPhoneShellProps {
  children: React.ReactNode;
  onOpenHelp?: () => void;
}

export const AndroidPhoneShell: React.FC<AndroidPhoneShellProps> = ({ children, onOpenHelp }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('12:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden select-none font-sans">
      {/* Top utility bar on desktop */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-3 py-2 mb-2 text-xs text-slate-400 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Mode Android Mobile</span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              title="Guide de lancement & installation"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Guide Android</span>
            </button>
          )}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Plein Écran</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Cadre Android</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`relative transition-all duration-300 w-full ${
          isPhoneFrame
            ? 'sm:w-[410px] sm:h-[840px] sm:max-h-[94vh] sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:ring-4 sm:ring-slate-700/50 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
            : 'max-w-2xl h-screen sm:h-[90vh] sm:rounded-3xl sm:border border-slate-800 sm:shadow-2xl'
        } h-screen flex flex-col bg-slate-950 overflow-hidden`}
      >
        {/* Android Punch Hole Camera (only on framed mode) */}
        {isPhoneFrame && (
          <div className="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800 pointer-events-none" />
        )}

        {/* Android Status Bar */}
        <div className="w-full h-8 px-5 pt-1.5 flex items-center justify-between text-xs text-white/80 font-medium z-40 select-none bg-black/30 backdrop-blur-sm shrink-0">
          <span className="font-semibold tracking-wide text-white">{currentTime}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-white/90" />
            <Wifi className="w-3.5 h-3.5 text-white/90" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col">{children}</div>

        {/* Android Bottom Navigation Pill */}
        <div className="w-full h-5 bg-black/40 flex items-center justify-center shrink-0 z-40 pb-1">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
