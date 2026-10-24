export type GameScreen = 'home' | 'playing' | 'gameover';

export type GameMode = 'timed' | 'zen';

export type TargetType = 'star' | 'golden' | 'time' | 'meteor' | 'rainbow';

export interface TargetItem {
  id: string;
  type: TargetType;
  x: number; // percentage (5 to 90)
  y: number; // percentage (10 to 85)
  size: number; // px size
  points: number;
  duration: number; // lifespan in ms
  createdAt: number;
  vx: number; // drift speed
  vy: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  starsPopped: number;
  goldenPopped: number;
  meteorsAvoided: number;
  maxCombo: number;
  accuracy: number;
  totalClicks: number;
  successfulHits: number;
}
