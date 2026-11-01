import React from 'react';

export const BrandHeader: React.FC = () => {
  return (
    <header className="relative w-full max-w-4xl mx-auto px-4 pt-2 pb-5 sm:pt-3 sm:pb-7 text-center flex flex-col items-center">

      {/* Brand Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[0.16em] uppercase text-[#F5F8FC]">
          ARLLON FERNANDES
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#42C8FF]" />
          <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-[0.38em] uppercase text-[#42C8FF]">
            BARBEARIA
          </h2>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#42C8FF]" />
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-4 text-xs sm:text-sm md:text-base text-[#AAB8CA] font-medium tracking-wide max-w-md mx-auto">
        &ldquo;Seu estilo. Sua identidade. Sua experiência.&rdquo;
      </p>

      {/* Subtle indicator bar */}
      <div className="mt-5 w-12 h-[2px] rounded-full bg-gradient-to-r from-[#1687FF] via-[#42C8FF] to-[#1687FF] shadow-[0_0_8px_#42C8FF]" />
    </header>
  );
};
