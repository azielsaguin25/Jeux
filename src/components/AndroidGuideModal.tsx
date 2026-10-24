import React from 'react';
import { X, Play, Smartphone, Terminal, CheckCircle2, Share2, Sparkles } from 'lucide-react';

interface AndroidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidGuideModal: React.FC<AndroidGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Guide : Lancer l’App Android</h2>
            <p className="text-xs text-slate-400">Comment démarrer et installer le jeu</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Step 1: Lancement local */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 mb-2 font-bold text-indigo-300">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>1. Lancement local (Développement)</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Pour démarrer l’application sur votre ordinateur :
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 space-y-1">
              <div># 1. Installer les dépendances</div>
              <div className="text-white">npm install</div>
              <div className="mt-1"># 2. Lancer le serveur de développement</div>
              <div className="text-white">npm run dev</div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              L'application sera accessible immédiatement sur <span className="text-indigo-400 font-mono">http://localhost:3000</span>.
            </p>
          </div>

          {/* Step 2: Utilisation sur mobile Android */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-300">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>2. Jouer directement sur votre téléphone Android</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ouvrez le lien de l’application dans <b>Google Chrome</b> sur votre smartphone Android.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Appuyez sur les trois points verticaux <b className="text-white">⋮</b> en haut à droite.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sélectionnez <b className="text-emerald-400">"Ajouter à l’écran d’accueil"</b> ou <b className="text-emerald-400">"Installer l'application"</b>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>L'icône <b>Tap'Étoile</b> apparaîtra parmi vos applications comme une vraie appli native Android, plein écran sans barre d'adresse !</span>
              </li>
            </ul>
          </div>

          {/* Step 3: Règles simples du jeu */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50">
            <div className="flex items-center gap-2 mb-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. Règles du Mini-Jeu</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded-xl flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span><b>Étoile</b> : +10 pts</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl flex items-center gap-2">
                <span className="text-lg">👑</span>
                <span><b>Dorée</b> : +30 pts</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <span><b>Horloge</b> : +3 sec</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl flex items-center gap-2">
                <span className="text-lg">☄️</span>
                <span><b>Météore</b> : -20 pts ⚠️</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>C'est parti, jouer !</span>
        </button>
      </div>
    </div>
  );
};
