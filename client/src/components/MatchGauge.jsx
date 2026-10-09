import React from 'react';

export default function MatchGauge({ score = 0, size = 52, strokeWidth = 5 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let bgFill = 'rgba(16, 185, 129, 0.1)';

  if (clampedScore < 50) {
    strokeColor = '#ef4444'; // red
    glowColor = 'rgba(239, 68, 68, 0.4)';
    bgFill = 'rgba(239, 68, 68, 0.1)';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    bgFill = 'rgba(245, 158, 11, 0.1)';
  }

  return (
    <div
      className="match-gauge-wrap"
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={`ATS Match Score: ${clampedScore}%`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill={bgFill}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s',
            filter: `drop-shadow(0 0 6px ${glowColor})`
          }}
        />
      </svg>
      <div
        className="match-gauge-text"
        style={{
          position: 'absolute',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: size <= 52 ? '13px' : '17px',
          color: strokeColor,
          letterSpacing: '-0.5px'
        }}
      >
        {clampedScore}%
      </div>
    </div>
  );
}
