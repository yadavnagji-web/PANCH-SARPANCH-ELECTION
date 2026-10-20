import React from 'react';

interface SwastikStampProps {
  size?: number;
  color?: string;
  className?: string;
  rotation?: number;
}

export const SwastikStamp: React.FC<SwastikStampProps> = ({
  size = 54,
  color = '#831843', // Indian ballot voting ink purple/magenta or black
  className = '',
  rotation = -8,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center relative select-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      title="मतदान मुहर (स्वस्तिक छाप)"
    >
      {/* Authentic rubber stamp circular border with ink distress */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Double dashed / stamp circular edge */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray="90 3 40 2"
          opacity="0.9"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* Traditional Swastik symbol for ballot stamping in Indian elections */}
        {/* Center vertical bar */}
        <line x1="50" y1="22" x2="50" y2="78" stroke={color} strokeWidth="6" strokeLinecap="square" />
        {/* Top arm going right */}
        <line x1="50" y1="22" x2="74" y2="22" stroke={color} strokeWidth="6" strokeLinecap="square" />
        {/* Bottom arm going left */}
        <line x1="50" y1="78" x2="26" y2="78" stroke={color} strokeWidth="6" strokeLinecap="square" />

        {/* Center horizontal bar */}
        <line x1="22" y1="50" x2="78" y2="50" stroke={color} strokeWidth="6" strokeLinecap="square" />
        {/* Left arm going up */}
        <line x1="22" y1="50" x2="22" y2="26" stroke={color} strokeWidth="6" strokeLinecap="square" />
        {/* Right arm going down */}
        <line x1="78" y1="50" x2="78" y2="74" stroke={color} strokeWidth="6" strokeLinecap="square" />

        {/* 4 dots in quadrants */}
        <circle cx="36" cy="36" r="3.2" fill={color} />
        <circle cx="64" cy="36" r="3.2" fill={color} />
        <circle cx="36" cy="64" r="3.2" fill={color} />
        <circle cx="64" cy="64" r="3.2" fill={color} />
      </svg>
      <span
        className="text-[9px] font-bold tracking-tight uppercase mt-0.5"
        style={{ color }}
      >
        मतदान मुहर
      </span>
    </div>
  );
};
