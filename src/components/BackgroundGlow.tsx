import React from 'react';

export const BackgroundGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#04172B]">
      {/* Primary top-center ambient glow */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #1687FF 0%, #082E5A 60%, transparent 100%)',
        }}
      />

      {/* Center 3D stage radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] rounded-full blur-[160px] opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, #42C8FF 0%, #082E5A 50%, transparent 75%)',
        }}
      />

      {/* Bottom ambient anchor */}
      <div 
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #1687FF 0%, #04172B 70%, transparent 100%)',
        }}
      />

      {/* Discrete subtle background grid texture */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: `linear-gradient(to right, #42C8FF 1px, transparent 1px), linear-gradient(to bottom, #42C8FF 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle depth particles / glowing points */}
      <div className="absolute top-[22%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#42C8FF] opacity-30 blur-[0.5px] animate-ambient-pulse" />
      <div className="absolute top-[38%] right-[15%] w-2 h-2 rounded-full bg-[#1687FF] opacity-25 blur-[1px] animate-ambient-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[65%] left-[8%] w-1 h-1 rounded-full bg-[#42C8FF] opacity-40 blur-[0.5px] animate-ambient-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute top-[72%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#1687FF] opacity-30 blur-[0.8px] animate-ambient-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[88%] left-[24%] w-1.5 h-1.5 rounded-full bg-[#42C8FF] opacity-25 blur-[0.5px] animate-ambient-pulse" style={{ animationDelay: '3s' }} />
    </div>
  );
};
