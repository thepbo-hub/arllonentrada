import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeroVideoProps {
  videoUrl?: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoUrl = 'https://yourimageshare.com/ib/CufIM3MjZf.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay policy fallback: mute and retry
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#04172B]">
      {/* Video Container - Expanded cinematic height extending downward */}
      <div className="relative w-full h-[48vh] min-h-[300px] sm:h-[58vh] md:h-[66vh] lg:h-[72vh] xl:h-[76vh] max-h-[760px]">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setHasStartedPlaying(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            hasStartedPlaying ? 'opacity-90' : 'opacity-70'
          }`}
          style={{ objectPosition: 'center 40%' }}
        />

        {/* Cinematic dark blue overlay for tonal cohesion */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(4, 23, 43, 0.3) 0%, rgba(8, 46, 90, 0.15) 50%, rgba(4, 23, 43, 0.85) 88%, #04172B 100%)',
          }}
        />

        {/* Lateral vignette for cinematic theater look */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4, 23, 43, 0.6) 100%)',
          }}
        />

        {/* Ambient top light beam */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #1687FF 50%, transparent 100%)',
            opacity: 0.7,
          }}
        />

        {/* Subtle, unobtrusive sound toggle button (does not interfere with no-controls rule) */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Ativar áudio do vídeo' : 'Silenciar vídeo'}
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#04172B]/70 hover:bg-[#082E5A]/90 text-[#F5F8FC] border border-[#1687FF]/30 backdrop-blur-md text-xs font-medium tracking-wide transition-all shadow-lg active:scale-95"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#42C8FF]" />
              <span className="hidden sm:inline text-[#AAB8CA]">Áudio desativado</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#1687FF]" />
              <span className="hidden sm:inline text-[#F5F8FC]">Áudio ativo</span>
            </>
          )}
        </button>
      </div>

      {/* Deep gradient transition directly blending with the rest of the page */}
      <div className="w-full h-8 bg-gradient-to-b from-transparent to-[#04172B] -mt-8 relative z-10" />
    </section>
  );
};
