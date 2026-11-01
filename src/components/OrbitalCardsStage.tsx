import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Orbit } from 'lucide-react';
import { biositeLinks } from '../config/links';
import { CardData } from '../types';
import { useCard3D } from '../hooks/useCard3D';

const CARDS_DATA: CardData[] = [
  {
    id: 'cortes',
    categoryKey: 'cortes',
    title: 'CORTES',
    description: 'Encontre seu próximo estilo.',
    link: biositeLinks.cortes,
    image: '/assets/aistudio/Cortes_-_Biosite_principal_45ccf6b2.jfif',
    imageAlt: 'Cortes masculinos e acabamento de alta precisão',
    tag: 'Estilo & Precisão',
  },
  {
    id: 'extras',
    categoryKey: 'extras',
    title: 'SERVIÇOS EXTRAS',
    description: 'Uma experiência além do corte.',
    link: biositeLinks.extras,
    image: '/assets/aistudio/Servi_os_Extras_-_Biosite_principal_23832535.jfif',
    imageAlt: 'Experiência exclusiva de lounge e cuidados pessoais',
    tag: 'Experiência VIP',
  },
  {
    id: 'produtos',
    categoryKey: 'produtos',
    title: 'PRODUTOS',
    description: 'Os produtos certos para seu estilo.',
    link: biositeLinks.produtos,
    image: '/assets/aistudio/Produtos_-_Biosite_principal_e4555702.jfif',
    imageAlt: 'Pomadas, óleos e linha completa de produtos masculinos',
    tag: 'Linha Premium',
  },
];

const CARD_CLASS_MAP = ['card-cortes', 'card-extras', 'card-produtos'];

type StageState = 'orbiting' | 'transitioning_align' | 'aligned' | 'transitioning_orbit';

export const OrbitalCardsStage: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Dedicated state machines for mobile and desktop/tablet
  const [mobileState, setMobileState] = useState<StageState>('orbiting');
  const [desktopState, setDesktopState] = useState<StageState>('orbiting');

  // Direct card element references for hardware-accelerated 3D transforms
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile angle & animation references
  const mobileOrbitAngleRef = useRef<number>(0);
  const mobileRafRef = useRef<number | null>(null);
  const mobileLastTimeRef = useRef<number>(performance.now());
  const mobileTransitionTimerRef = useRef<number | null>(null);

  // Desktop / Tablet angle & animation references
  const desktopOrbitAngleRef = useRef<number>(0);
  const desktopRafRef = useRef<number | null>(null);
  const desktopLastTimeRef = useRef<number>(performance.now());
  const desktopTransitionTimerRef = useRef<number | null>(null);

  // Hook for 3D cursor tilt and luminous dynamic radial reflection (desktop)
  useCard3D([desktopState]);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setMobileState('aligned');
      setDesktopState('aligned');
    }
  }, []);

  // =========================================================================
  // MOBILE 3D ORBIT ENGINE & CINEMATIC TRANSITIONS
  // =========================================================================

  const applyMobileOrbitPosition = useCallback((card: HTMLElement, index: number, angleOffset: number) => {
    const angle = angleOffset + (index * 2 * Math.PI) / 3;
    const depth = Math.cos(angle);
    const horizontal = Math.sin(angle);
    const front = (depth + 1) / 2;

    const scale = 0.74 + front * 0.36;
    const rx = Math.min(window.innerWidth * 0.29, 110);
    const ry = 14;
    const rz = 65;

    const x = horizontal * rx;
    const y = depth * ry;
    const z = depth * rz;
    const yaw = -horizontal * 11;

    card.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), ${z.toFixed(2)}px) scale(${scale.toFixed(3)}) rotateY(${yaw.toFixed(2)}deg)`;
    card.style.zIndex = Math.round(10 + front * 15).toString();
    card.style.filter = `brightness(${(0.76 + front * 0.32).toFixed(2)})`;
    card.style.opacity = (0.84 + front * 0.16).toFixed(2);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    if (mobileState === 'orbiting') {
      mobileLastTimeRef.current = performance.now();

      const runMobileOrbit = (time: number) => {
        const delta = (time - mobileLastTimeRef.current) / 1000;
        mobileLastTimeRef.current = time;

        // One complete 360deg loop in ~14 seconds
        mobileOrbitAngleRef.current = (mobileOrbitAngleRef.current + delta * ((Math.PI * 2) / 14)) % (Math.PI * 2);

        mobileCardRefs.current.forEach((card, index) => {
          if (card) {
            applyMobileOrbitPosition(card, index, mobileOrbitAngleRef.current);
          }
        });

        mobileRafRef.current = requestAnimationFrame(runMobileOrbit);
      };

      mobileRafRef.current = requestAnimationFrame(runMobileOrbit);
    } else {
      if (mobileRafRef.current !== null) {
        cancelAnimationFrame(mobileRafRef.current);
        mobileRafRef.current = null;
      }
    }

    return () => {
      if (mobileRafRef.current !== null) {
        cancelAnimationFrame(mobileRafRef.current);
      }
    };
  }, [isMobile, mobileState, applyMobileOrbitPosition]);

  const handleMobileTriggerAlign = () => {
    if (mobileState !== 'orbiting') return;

    if (mobileRafRef.current !== null) {
      cancelAnimationFrame(mobileRafRef.current);
      mobileRafRef.current = null;
    }

    setMobileState('transitioning_align');

    requestAnimationFrame(() => {
      mobileCardRefs.current.forEach((card, index) => {
        if (!card) return;

        card.style.transition = 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1), width 1150ms cubic-bezier(0.22, 1, 0.36, 1), height 1150ms cubic-bezier(0.22, 1, 0.36, 1), filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease';

        const targetX = (index - 1) * 112;
        card.style.setProperty('--target-x', `${targetX}px`);

        card.style.transform = `translate3d(calc(-50% + ${targetX}px), -50%, 0px) scale(1) rotateY(0deg)`;
        card.style.zIndex = '20';
        card.style.filter = 'brightness(1)';
        card.style.opacity = '1';
      });

      mobileTransitionTimerRef.current = window.setTimeout(() => {
        setMobileState('aligned');
      }, 1150);
    });
  };

  const handleMobileReturnToOrbit = () => {
    if (mobileState !== 'aligned') return;

    setMobileState('transitioning_orbit');

    requestAnimationFrame(() => {
      mobileCardRefs.current.forEach((card, index) => {
        if (!card) return;

        card.style.transition = 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1), width 1150ms cubic-bezier(0.22, 1, 0.36, 1), height 1150ms cubic-bezier(0.22, 1, 0.36, 1), filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease';
        applyMobileOrbitPosition(card, index, mobileOrbitAngleRef.current);
      });

      mobileTransitionTimerRef.current = window.setTimeout(() => {
        mobileCardRefs.current.forEach((card) => {
          if (card) {
            card.style.transition = 'none';
          }
        });
        setMobileState('orbiting');
      }, 1150);
    });
  };

  const handleMobileCardTap = (index: number) => {
    if (mobileState === 'orbiting') {
      handleMobileTriggerAlign();
    } else if (mobileState === 'aligned') {
      openBiosite(CARDS_DATA[index].link);
    }
  };

  // =========================================================================
  // DESKTOP & TABLET 3D ORBIT ENGINE & CINEMATIC TRANSITIONS
  // =========================================================================

  const applyDesktopOrbitPosition = useCallback((card: HTMLElement, index: number, angleOffset: number) => {
    const angle = angleOffset + (index * 2 * Math.PI) / 3;
    const depth = Math.cos(angle);
    const horizontal = Math.sin(angle);
    const front = (depth + 1) / 2;

    const scale = 0.84 + front * 0.26;
    const rx = Math.min(window.innerWidth * 0.22, 230);
    const ry = 18;
    const rz = Math.min(window.innerWidth * 0.13, 130);

    const x = horizontal * rx;
    const y = depth * ry;
    const z = depth * rz;
    const yaw = -horizontal * 12;

    card.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), ${z.toFixed(2)}px) scale(${scale.toFixed(3)}) rotateY(${yaw.toFixed(2)}deg)`;
    card.style.zIndex = Math.round(10 + front * 20).toString();
    card.style.filter = `brightness(${(0.80 + front * 0.25).toFixed(2)})`;
    card.style.opacity = (0.86 + front * 0.14).toFixed(2);
  }, []);

  // Desktop / Tablet RAF Orbit Loop
  useEffect(() => {
    if (isMobile) return;

    if (desktopState === 'orbiting') {
      desktopLastTimeRef.current = performance.now();

      const runDesktopOrbit = (time: number) => {
        const delta = (time - desktopLastTimeRef.current) / 1000;
        desktopLastTimeRef.current = time;

        // One complete 360deg loop in ~15 seconds
        desktopOrbitAngleRef.current = (desktopOrbitAngleRef.current + delta * ((Math.PI * 2) / 15)) % (Math.PI * 2);

        desktopCardRefs.current.forEach((card, index) => {
          if (card) {
            applyDesktopOrbitPosition(card, index, desktopOrbitAngleRef.current);
          }
        });

        desktopRafRef.current = requestAnimationFrame(runDesktopOrbit);
      };

      desktopRafRef.current = requestAnimationFrame(runDesktopOrbit);
    } else {
      if (desktopRafRef.current !== null) {
        cancelAnimationFrame(desktopRafRef.current);
        desktopRafRef.current = null;
      }
    }

    return () => {
      if (desktopRafRef.current !== null) {
        cancelAnimationFrame(desktopRafRef.current);
      }
    };
  }, [isMobile, desktopState, applyDesktopOrbitPosition]);

  // Transition: Desktop Orbit -> Aligned (Fluid, cinematic glide)
  const handleDesktopTriggerAlign = (selectedIndex: number = 0) => {
    if (desktopState !== 'orbiting') return;

    if (desktopRafRef.current !== null) {
      cancelAnimationFrame(desktopRafRef.current);
      desktopRafRef.current = null;
    }

    setDesktopState('transitioning_align');
    setActiveCardIndex(selectedIndex);

    requestAnimationFrame(() => {
      const baseOffset = Math.min(window.innerWidth * 0.25, 255);

      desktopCardRefs.current.forEach((card, index) => {
        if (!card) return;

        const targetX = (index - 1) * baseOffset;
        const isSelected = index === selectedIndex;
        const scale = isSelected ? 1.05 : 0.95;
        const zOffset = isSelected ? 25 : 0;

        card.style.setProperty('--desktop-x', `${targetX}px`);
        card.style.setProperty('--desktop-scale', `${scale}`);
        card.style.setProperty('--desktop-z', `${zOffset}px`);

        // Fluid and cinematic transition over 1150ms
        card.style.transition = 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1), filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease';
        card.style.transform = `translate3d(calc(-50% + ${targetX}px), -50%, ${zOffset}px) scale(${scale}) rotateY(0deg)`;
        card.style.zIndex = isSelected ? '30' : '20';
        card.style.filter = 'brightness(1)';
        card.style.opacity = '1';
      });

      desktopTransitionTimerRef.current = window.setTimeout(() => {
        setDesktopState('aligned');
      }, 1150);
    });
  };

  // Transition: Desktop Aligned -> Orbit
  const handleDesktopReturnToOrbit = () => {
    if (desktopState !== 'aligned') return;

    setDesktopState('transitioning_orbit');

    requestAnimationFrame(() => {
      desktopCardRefs.current.forEach((card, index) => {
        if (!card) return;

        // Fluid reverse transition back to orbital positions
        card.style.transition = 'transform 1150ms cubic-bezier(0.22, 1, 0.36, 1), filter 1150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease';
        applyDesktopOrbitPosition(card, index, desktopOrbitAngleRef.current);
      });

      desktopTransitionTimerRef.current = window.setTimeout(() => {
        desktopCardRefs.current.forEach((card) => {
          if (card) {
            card.style.transition = 'none';
          }
        });
        setDesktopState('orbiting');
      }, 1150);
    });
  };

  // Desktop click handler
  const handleDesktopCardClick = (index: number) => {
    if (desktopState === 'orbiting') {
      handleDesktopTriggerAlign(index);
    } else if (desktopState === 'aligned') {
      if (activeCardIndex === index) {
        openBiosite(CARDS_DATA[index].link);
      } else {
        setActiveCardIndex(index);
        const baseOffset = Math.min(window.innerWidth * 0.25, 255);
        desktopCardRefs.current.forEach((card, i) => {
          if (!card) return;
          const targetX = (i - 1) * baseOffset;
          const isSelected = i === index;
          const scale = isSelected ? 1.05 : 0.95;
          const zOffset = isSelected ? 25 : 0;
          card.style.setProperty('--desktop-scale', `${scale}`);
          card.style.setProperty('--desktop-z', `${zOffset}px`);
          card.style.zIndex = isSelected ? '30' : '20';
        });
      }
    }
  };

  // Desktop hover handler
  const handleDesktopCardMouseEnter = (index: number) => {
    if (desktopState === 'aligned' && activeCardIndex !== index) {
      setActiveCardIndex(index);
      const baseOffset = Math.min(window.innerWidth * 0.25, 255);
      desktopCardRefs.current.forEach((card, i) => {
        if (!card) return;
        const targetX = (i - 1) * baseOffset;
        const isSelected = i === index;
        const scale = isSelected ? 1.05 : 0.95;
        const zOffset = isSelected ? 25 : 0;
        card.style.setProperty('--desktop-scale', `${scale}`);
        card.style.setProperty('--desktop-z', `${zOffset}px`);
        card.style.zIndex = isSelected ? '30' : '20';
      });
    }
  };

  // Clean transition timers on unmount
  useEffect(() => {
    return () => {
      if (mobileTransitionTimerRef.current !== null) {
        clearTimeout(mobileTransitionTimerRef.current);
      }
      if (desktopTransitionTimerRef.current !== null) {
        clearTimeout(desktopTransitionTimerRef.current);
      }
    };
  }, []);

  // Safe external navigation
  const openBiosite = (url: string) => {
    if (!url || url.includes('INSERIR LINK')) {
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 pt-1 pb-10 flex flex-col items-center select-none">
      {isMobile ? (
        /* =========================================================================
           MODELO MOBILE: ÓRBITA 3D CONTÍNUA -> ALINHAMENTO CINEMATOGRÁFICO
        ========================================================================= */
        <div className="w-full flex flex-col items-center">
          <div
            onClick={mobileState === 'orbiting' ? handleMobileTriggerAlign : undefined}
            className="relative w-full max-w-[420px] h-[280px] perspective-1200 flex items-center justify-center overflow-visible cursor-pointer"
          >
            <div className="relative w-full h-full transform-style-3d">
              {/* Glowing 3D Orbital Track Path — Posicionada ABAIXO das cartas */}
              <div
                className={`absolute top-1/2 left-1/2 pointer-events-none rounded-full transition-all duration-700 ${
                  mobileState === 'orbiting' ? 'opacity-90 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{
                  width: `${Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.29 * 2 : 220, 224)}px`,
                  height: '138px',
                  transform: 'translate(-50%, calc(-50% + 110px)) rotateX(78deg)',
                  transformStyle: 'preserve-3d',
                  border: '1.5px solid rgba(66, 200, 255, 0.55)',
                  boxShadow: '0 0 18px rgba(66, 200, 255, 0.45), 0 0 35px rgba(22, 135, 255, 0.25), inset 0 0 15px rgba(66, 200, 255, 0.2)',
                  background: 'radial-gradient(ellipse at center, rgba(22, 135, 255, 0.06) 0%, transparent 75%)',
                }}
              >
                <div className="absolute inset-[-3px] rounded-full border border-[#42C8FF]/25 filter blur-[1.5px] pointer-events-none" />
              </div>

              {CARDS_DATA.map((card, index) => {
                const isAligned = mobileState === 'aligned' || mobileState === 'transitioning_align';

                return (
                  <div
                    key={card.id}
                    ref={(el) => {
                      mobileCardRefs.current[index] = el;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMobileCardTap(index);
                    }}
                    className={`orbit-card ${CARD_CLASS_MAP[index]} absolute top-1/2 left-1/2 rounded-xl cursor-pointer select-none active:scale-[0.97] border border-[#1687FF]/40 shadow-[0_8px_22px_rgba(4,23,43,0.95),0_0_15px_rgba(22,135,255,0.2)] overflow-hidden transition-[width,height] duration-[1150ms] ease-out ${
                      isAligned
                        ? 'w-[104px] xs:w-[108px] h-[230px]'
                        : 'w-[136px] xs:w-[144px] h-[238px]'
                    } ${
                      mobileState === 'aligned' ? 'is-aligned-floating-mobile' : ''
                    }`}
                    style={{
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Lâmina de Luz: sutil, lenta e sincronizada */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-25">
                      <div className="light-blade-beam" />
                    </div>

                    {/* Gradiente contínuo para transição suave e leitura dos textos sobre a fotografia contínua */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(4, 23, 43, 0.05) 0%, rgba(4, 23, 43, 0.25) 45%, rgba(4, 23, 43, 0.78) 72%, rgba(4, 23, 43, 0.96) 100%)',
                      }}
                    />

                    {/* REGIÃO INFERIOR — INFORMAÇÕES SOBREPOSTAS NA FOTOGRAFIA CONTÍNUA */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-end p-2.5 xs:p-3 text-left">
                      {/* 1. TÍTULO & 2. DESCRIÇÃO */}
                      <div className="space-y-0.5 xs:space-y-1">
                        {/* 1. TÍTULO: Sem corte, legibilidade completa para SERVIÇOS EXTRAS */}
                        <h3 className={`font-extrabold uppercase text-[#F5F8FC] tracking-wider leading-snug text-left break-words drop-shadow-md transition-all duration-300 ${
                          isAligned ? 'text-[9.5px] xs:text-[10px]' : 'text-[11px] xs:text-[12px]'
                        }`}>
                          {card.title}
                        </h3>

                        {/* 2. DESCRIÇÃO */}
                        <p className={`text-[#CBD5E1] font-normal leading-snug text-left break-words line-clamp-2 drop-shadow-sm transition-all duration-300 ${
                          isAligned ? 'text-[7.5px] xs:text-[8px]' : 'text-[8.5px] xs:text-[9.5px]'
                        }`}>
                          {card.description}
                        </p>
                      </div>

                      {/* 3. DIVISÓRIA & 4. INDICADOR DE ACESSO */}
                      <div className="w-full pt-1">
                        {/* 3. DIVISÓRIA: Linha horizontal fina em azul-ciano com transparência */}
                        <div className="w-full h-[1px] bg-[#42C8FF]/40 mb-1.5" />

                        {/* 4. INDICADOR DE ACESSO: Alinhamento à esquerda, texto azul-ciano, seta */}
                        <div className={`flex items-center gap-1 text-[#42C8FF] font-bold tracking-wider uppercase text-left drop-shadow-sm transition-all duration-300 ${
                          isAligned ? 'text-[8px] xs:text-[8.5px]' : 'text-[9px] xs:text-[9.5px]'
                        }`}>
                          <span>{mobileState === 'aligned' ? 'ACESSAR' : 'ENTRAR'}</span>
                          <ArrowRight className="w-2.5 h-2.5 text-[#42C8FF]" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão Retomar Órbita Mobile */}
          {mobileState === 'aligned' && (
            <div className="mt-4 flex justify-center z-30 transition-all duration-500 animate-in fade-in">
              <button
                type="button"
                onClick={handleMobileReturnToOrbit}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#082E5A]/90 hover:bg-[#0B2340] active:scale-95 text-[#42C8FF] border border-[#42C8FF]/70 text-xs font-semibold tracking-wider backdrop-blur-md shadow-[0_0_16px_rgba(66,200,255,0.3)] transition-all cursor-pointer"
              >
                <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>↺ VOLTAR À ÓRBITA</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
           MODELO COMPUTADOR & TABLET: ÓRBITA 3D COM TRANSIÇÃO ULTRA-FLUIDA E ALINHAMENTO
        ========================================================================= */
        <>
          <div
            className={`orbit-stage relative w-full h-[340px] md:h-[395px] perspective-1200 flex items-center justify-center overflow-visible ${
              desktopState === 'aligned' ? 'is-expanded is-aligned' : ''
            }`}
          >
            {/* 3D Scene Root */}
            <div className="relative w-full h-full transform-style-3d">
              {/* Glowing 3D Orbital Track Path — Desktop: Exactly below the cards' orbital path */}
              <div
                className={`absolute top-1/2 left-1/2 pointer-events-none rounded-full transition-all duration-700 ${
                  desktopState === 'orbiting' ? 'opacity-90 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{
                  width: `${Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.22 * 2 : 440, 460)}px`,
                  height: '266px',
                  transform: 'translate(-50%, calc(-50% + 148px)) rotateX(78deg)',
                  transformStyle: 'preserve-3d',
                  border: '1.5px solid rgba(66, 200, 255, 0.55)',
                  boxShadow: '0 0 20px rgba(66, 200, 255, 0.45), 0 0 40px rgba(22, 135, 255, 0.25), inset 0 0 20px rgba(66, 200, 255, 0.2)',
                  background: 'radial-gradient(ellipse at center, rgba(22, 135, 255, 0.06) 0%, transparent 75%)',
                }}
              >
                <div className="absolute inset-[-4px] rounded-full border border-[#42C8FF]/25 filter blur-[2px] pointer-events-none" />
              </div>

              {CARDS_DATA.map((card, index) => {
                const isSelected = activeCardIndex === index;

                return (
                  <div
                    key={card.id}
                    ref={(el) => {
                      desktopCardRefs.current[index] = el;
                    }}
                    onClick={() => handleDesktopCardClick(index)}
                    onMouseEnter={() => handleDesktopCardMouseEnter(index)}
                    className={`orbit-card ${CARD_CLASS_MAP[index]} absolute top-1/2 left-1/2 w-[195px] md:w-[220px] h-[315px] md:h-[345px] rounded-2xl cursor-pointer select-none active:scale-[0.98] overflow-hidden ${
                      desktopState === 'aligned'
                        ? isSelected
                          ? 'ring-2 ring-[#42C8FF] shadow-[0_8px_25px_rgba(4,23,43,0.95),0_0_25px_rgba(66,200,255,0.45)] is-aligned-floating-desktop'
                          : 'is-aligned-floating-desktop'
                        : isSelected && desktopState === 'orbiting'
                        ? 'ring-1 ring-[#1687FF]/80 shadow-[0_8px_20px_rgba(8,46,90,0.85)]'
                        : 'shadow-[0_6px_16px_rgba(4,23,43,0.9)] border border-[#082E5A]/80'
                    }`}
                    style={{
                      backgroundImage: `url(${card.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Lâmina de Luz: sutil, lenta e sincronizada */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-25">
                      <div className="light-blade-beam" />
                    </div>

                    {/* Gradiente contínuo para transição suave e leitura dos textos sobre a fotografia contínua */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(4, 23, 43, 0.05) 0%, rgba(4, 23, 43, 0.25) 45%, rgba(4, 23, 43, 0.78) 72%, rgba(4, 23, 43, 0.96) 100%)',
                      }}
                    />

                    {/* REGIÃO INFERIOR — INFORMAÇÕES SOBREPOSTAS NA FOTOGRAFIA CONTÍNUA */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 sm:p-5 text-left">
                      {/* 1. TÍTULO & 2. DESCRIÇÃO */}
                      <div className="space-y-1.5">
                        {/* 1. TÍTULO */}
                        <h3 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-[#F5F8FC] leading-snug text-left break-words drop-shadow-md">
                          {card.title}
                        </h3>

                        {/* 2. DESCRIÇÃO */}
                        <p className="text-xs text-[#CBD5E1] font-normal leading-relaxed text-left break-words drop-shadow-sm">
                          {card.description}
                        </p>
                      </div>

                      {/* 3. DIVISÓRIA & 4. INDICADOR DE ACESSO */}
                      <div className="w-full pt-1.5">
                        {/* 3. DIVISÓRIA */}
                        <div className="w-full h-[1px] bg-[#42C8FF]/40 mb-2" />

                        {/* 4. INDICADOR DE ACESSO */}
                        <div className="flex items-center gap-1.5 text-[#42C8FF] text-xs font-bold tracking-wider uppercase text-left group-hover:text-[#F5F8FC] transition-colors drop-shadow-sm">
                          <span>ACESSAR</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#42C8FF] transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Resume Orbit Button (Computador & Tablet) */}
          {desktopState === 'aligned' && (
            <div className="mt-4 sm:mt-6 z-20 flex justify-center animate-in fade-in transition-all duration-500">
              <button
                onClick={handleDesktopReturnToOrbit}
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082E5A]/90 hover:bg-[#0B2340] text-[#42C8FF] border border-[#42C8FF]/70 text-xs font-semibold tracking-wider backdrop-blur-md transition-all shadow-[0_0_16px_rgba(66,200,255,0.3)] active:scale-95 cursor-pointer"
              >
                <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>↺ RETOMAR ÓRBITA 3D</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
