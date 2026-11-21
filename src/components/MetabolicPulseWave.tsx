import React, { useEffect, useRef } from 'react';

interface MetabolicPulseWaveProps {
  color: string;
  intensityRatio: number;
  status: string;
}

export const MetabolicPulseWave: React.FC<MetabolicPulseWaveProps> = ({
  color,
  intensityRatio,
  status,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Glow effect
      ctx.beginPath();
      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 * window.devicePixelRatio;

      const frequency = 0.016 + Math.min(0.04, intensityRatio * 0.005);
      const amplitude = h * 0.32;

      for (let x = 0; x <= w; x += 3) {
        // Double harmonic sine wave for organic pulse waveform
        const y =
          cy +
          Math.sin(x * frequency + phase) * amplitude * Math.sin(x * 0.003 + phase * 0.4);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

      phase += 0.045 + Math.min(0.06, intensityRatio * 0.006);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, intensityRatio]);

  return (
    <div className="w-full flex items-center justify-between gap-4 py-2 px-4 rounded-xl bg-[#0B1120] border border-white/10 shadow-inner">
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="w-3 h-3 rounded-full animate-pulse shrink-0"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Metabolic Pulse
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color }}>
              {status}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-300">
              {intensityRatio.toFixed(2)} tCO2e / $M
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 h-12 relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
