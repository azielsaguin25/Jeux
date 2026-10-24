/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameScreen as GameScreenType, GameMode } from './types';
import { AndroidPhoneShell } from './components/AndroidPhoneShell';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { AndroidGuideModal } from './components/AndroidGuideModal';
import { sound } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState<GameScreenType>('home');
  const [gameMode, setGameMode] = useState<GameMode>('timed');
  const [highScore, setHighScore] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const [lastStats, setLastStats] = useState({
    starsPopped: 0,
    goldenPopped: 0,
    maxCombo: 1,
    accuracy: 100,
    totalClicks: 0,
    successfulHits: 0,
  });

  // Load high score and sound preferences from localStorage
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('tap_etoile_highscore');
      if (savedScore) {
        setHighScore(parseInt(savedScore, 10) || 0);
      }
      const savedMute = localStorage.getItem('tap_etoile_muted');
      if (savedMute === '1') {
        setIsMuted(true);
        sound.setMuted(true);
      }
    } catch {
      // ignore localStorage errors in restricted environments
    }
  }, []);

  const handleStartGame = () => {
    setScreen('playing');
  };

  const handleFinishGame = (
    finalScore: number,
    stats: {
      starsPopped: number;
      goldenPopped: number;
      maxCombo: number;
      accuracy: number;
      totalClicks: number;
      successfulHits: number;
    }
  ) => {
    setLastScore(finalScore);
    setLastStats(stats);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      setIsNewRecord(true);
      try {
        localStorage.setItem('tap_etoile_highscore', finalScore.toString());
      } catch {
        // ignore
      }
    } else {
      setIsNewRecord(false);
    }

    setScreen('gameover');
  };

  const handlePlayAgain = () => {
    setScreen('playing');
  };

  const handleReturnHome = () => {
    setScreen('home');
  };

  const handleToggleMute = () => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <AndroidPhoneShell onOpenHelp={() => setShowGuide(true)}>
      {screen === 'home' && (
        <HomeScreen
          highScore={highScore}
          gameMode={gameMode}
          onSetGameMode={setGameMode}
          onStartGame={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenGuide={() => setShowGuide(true)}
        />
      )}

      {screen === 'playing' && (
        <GameScreen
          mode={gameMode}
          highScore={highScore}
          onFinishGame={handleFinishGame}
          onReturnHome={handleReturnHome}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={lastScore}
          highScore={highScore}
          isNewRecord={isNewRecord}
          stats={lastStats}
          onPlayAgain={handlePlayAgain}
          onReturnHome={handleReturnHome}
        />
      )}

      {/* Android Guide & Launch Instructions Modal */}
      <AndroidGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </AndroidPhoneShell>
  );
}
