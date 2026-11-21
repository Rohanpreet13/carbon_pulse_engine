import React from 'react';

interface PulseStrengthGaugeProps {
  score: number; // 0 to 100
  riskLevel: string;
  color: string;
}

export const PulseStrengthGauge: React.FC<PulseStrengthGaugeProps> = ({
  score,
  riskLevel,
  color,
}) => {
  // Map score (0-100) to rotation angle from -70 deg to +70 deg
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = -70 + (clampedScore / 100) * 140;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-36 h-20 overflow-visible flex items-center justify-center">
        <svg viewBox="0 0 160 85" className="w-full h-full overflow-visible">
          {/* Base Track */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Safe Zone (Green) */}
          <path
            d="M 20 80 A 60 60 0 0 1 58 33"
            fill="none"
            stroke="#10B981"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Warning Zone (Amber) */}
          <path
            d="M 58 33 A 60 60 0 0 1 102 33"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="12"
          />

          {/* Alert Zone (Crimson) */}
          <path
            d="M 102 33 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#EF4444"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Needle Indicator */}
          <g
            transform={`rotate(${angle}, 80, 80)`}
            className="transition-transform duration-700 ease-out"
          >
            <line
              x1="80"
              y1="80"
              x2="80"
              y2="28"
              stroke="#F8FAFC"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="80" cy="80" r="7" fill="#F8FAFC" />
            <circle cx="80" cy="80" r="3.5" fill="#0F172A" />
          </g>
        </svg>
      </div>

      <div
        className="text-xs font-bold mt-1 tracking-wide"
        style={{ color }}
      >
        {riskLevel} Intensity
      </div>
    </div>
  );
};
