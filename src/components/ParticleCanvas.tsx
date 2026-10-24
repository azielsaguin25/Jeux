import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleCanvasHandle {
  burst: (x: number, y: number, colorType?: string, count?: number) => void;
  celebrate: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'circle' | 'star' | 'rect';
}

export const ParticleCanvas = forwardRef<ParticleCanvasHandle, { className?: string }>(
  ({ className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number | null>(null);

    const colors = [
      '#FFD700', // Gold
      '#FF69B4', // Pink
      '#00E5FF', // Cyan
      '#7C4DFF', // Purple
      '#76FF03', // Lime
      '#FF3D00', // Orange
      '#FFFFFF', // White
    ];

    useImperativeHandle(ref, () => ({
      burst: (x: number, y: number, colorType = 'star', count = 16) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        const baseColors =
          colorType === 'golden'
            ? ['#FFD700', '#FFA000', '#FFF59D', '#FFFFFF']
            : colorType === 'meteor'
            ? ['#FF3D00', '#DD2C00', '#424242', '#FF9100']
            : colorType === 'time'
            ? ['#00E5FF', '#18FFFF', '#80D8FF', '#FFFFFF']
            : colorType === 'rainbow'
            ? colors
            : ['#FBBF24', '#F59E0B', '#FDE68A', '#FFFFFF'];

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 2;
          particlesRef.current.push({
            x: relativeX,
            y: relativeY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 3,
            color: baseColors[Math.floor(Math.random() * baseColors.length)],
            alpha: 1,
            decay: Math.random() * 0.025 + 0.02,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            shape: Math.random() > 0.4 ? 'star' : 'circle',
          });
        }
      },
      celebrate: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.width;
        const height = canvas.height;

        for (let i = 0; i < 90; i++) {
          const startX = Math.random() * width;
          const startY = Math.random() * (height * 0.4);
          particlesRef.current.push({
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * -6 - 2,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.008 + 0.005,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.15,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
          });
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * (window.devicePixelRatio || 1);
        canvas.height = rect.height * (window.devicePixelRatio || 1);
      };

      resize();
      window.addEventListener('resize', resize);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loop = () => {
        const scale = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // Gravity
          p.vx *= 0.98; // Air resistance
          p.alpha -= p.decay;
          p.rotation += p.vRot;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x * scale, p.y * scale);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === 'star') {
            const r = p.size * scale;
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
              ctx.lineTo(
                Math.cos(((18 + j * 72) * Math.PI) / 180) * r,
                -Math.sin(((18 + j * 72) * Math.PI) / 180) * r
              );
              ctx.lineTo(
                Math.cos(((54 + j * 72) * Math.PI) / 180) * (r * 0.5),
                -Math.sin(((54 + j * 72) * Math.PI) / 180) * (r * 0.5)
              );
            }
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'rect') {
            const w = p.size * 1.6 * scale;
            const h = p.size * 0.8 * scale;
            ctx.fillRect(-w / 2, -h / 2, w, h);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * scale, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      loop();

      return () => {
        window.removeEventListener('resize', resize);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none z-30 w-full h-full ${className}`}
      />
    );
  }
);

ParticleCanvas.displayName = 'ParticleCanvas';
