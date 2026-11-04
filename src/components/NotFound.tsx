import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen w-full bg-[#04172B] text-[#F5F8FC] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1687FF 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-md w-full bg-[#082E5A]/50 border border-[#1687FF]/40 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_35px_rgba(4,23,43,0.9)] flex flex-col items-center space-y-4">
        {/* Brand header */}
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-[0.16em] uppercase text-[#F5F8FC]">
            ARLLON FERNANDES
          </h1>
          <p className="text-xs font-bold tracking-[0.38em] uppercase text-[#42C8FF]">
            BARBEARIA
          </p>
        </div>

        <div className="w-12 h-[1.5px] bg-[#42C8FF]/50 rounded-full my-1" />

        <div className="text-4xl font-extrabold tracking-widest text-[#42C8FF] drop-shadow-[0_0_15px_rgba(66,200,255,0.4)]">
          404
        </div>

        <h2 className="text-base font-semibold text-[#F5F8FC]">
          Página não encontrada
        </h2>

        <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-xs">
          O link ou endereço que você tentou acessar não existe ou foi movido. Retorne ao Hub Principal para explorar Cortes, Serviços Extras e Produtos.
        </p>

        <button
          type="button"
          onClick={onGoHome}
          className="mt-3 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1687FF] hover:bg-[#42C8FF] active:scale-95 text-[#04172B] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(66,200,255,0.4)] cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Voltar ao Hub Principal</span>
        </button>
      </div>
    </div>
  );
};
