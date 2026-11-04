import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Captured React render exception:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#04172B] text-[#F5F8FC] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-[#082E5A]/60 border border-[#1687FF]/40 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_30px_rgba(22,135,255,0.2)] flex flex-col items-center space-y-4">
            {/* Brand Title */}
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold tracking-[0.16em] uppercase text-[#F5F8FC]">
                ARLLON FERNANDES
              </h1>
              <p className="text-xs font-bold tracking-[0.38em] uppercase text-[#42C8FF]">
                BARBEARIA
              </p>
            </div>

            <div className="w-12 h-[1.5px] bg-[#42C8FF]/50 rounded-full my-2" />

            <h2 className="text-lg font-semibold text-[#F5F8FC]">
              Experiência Temporariamente Interrompida
            </h2>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Ocorreu uma instabilidade pontual ao carregar os recursos interativos. Clique abaixo para reiniciar a experiência completa.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1687FF] hover:bg-[#42C8FF] active:scale-95 text-[#04172B] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(66,200,255,0.4)] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recarregar Hub Digital</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
