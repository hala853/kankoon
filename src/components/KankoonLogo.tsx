import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function KankoonLogo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="goldGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f2e8da" />
            <stop offset="0.45" stopColor="#c9974a" />
            <stop offset="1" stopColor="#8a6030" />
          </linearGradient>
        </defs>
        
        {/* House geometric shape */}
        <path 
          d="M50 15L15 45V85H40V60H60V85H85V45L50 15Z" 
          fill="url(#goldGradient)"
        />
        {/* Diamond/Keyhole center */}
        <path 
          d="M50 35L42 45L50 55L58 45L50 35Z" 
          fill="var(--color-background)"
          style={{ fill: 'var(--color-background, #1a1109)' }}
        />
      </svg>
      {showText && (
        <span className="font-display font-bold text-2xl tracking-wide text-foreground">
          كنكون
        </span>
      )}
    </div>
  );
}
