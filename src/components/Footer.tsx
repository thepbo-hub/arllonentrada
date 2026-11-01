import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full py-12 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Continuous subtle luminous glowing line */}
      <div className="relative w-full max-w-xl flex items-center justify-center mb-6 px-4">
        <div 
          className="w-full h-[1.5px] rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(22, 135, 255, 0.05) 0%, rgba(66, 200, 255, 0.75) 15%, rgba(66, 200, 255, 0.9) 50%, rgba(66, 200, 255, 0.75) 85%, rgba(22, 135, 255, 0.05) 100%)',
            boxShadow: '0 0 8px rgba(66, 200, 255, 0.6), 0 0 18px rgba(22, 135, 255, 0.35)',
          }}
        />
      </div>

      {/* Brand Signature using requested font exclusively without image */}
      <div className="space-y-1.5 flex flex-col items-center">
        <p 
          className="text-xs sm:text-sm md:text-base font-light uppercase text-[#E2ECF8] tracking-[0.26em] sm:tracking-[0.32em] select-none text-center"
          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.28em' }}
        >
          ARLLON FERNANDES BARBEARIA
        </p>
        <p className="text-xs sm:text-sm text-[#AAB8CA] font-light tracking-wide">
          &ldquo;Estilo e personalidade em cada detalhe.&rdquo;
        </p>
      </div>

      {/* Discrete subtle copyright note */}
      <p className="mt-4 text-[11px] text-[#AAB8CA]/60 font-mono tracking-wider uppercase">
        © {new Date().getFullYear()} · Hub Digital Oficial
      </p>
    </footer>
  );
};
