import { useEffect } from 'react';

export function useCircularCardOrbit(viewMode: string = 'orbiting') {
  useEffect(() => {
    const stage = document.querySelector('.orbit-stage');
    if (!stage) return;

    const cards = [
      ...stage.querySelectorAll<HTMLElement>('.orbit-card'),
    ];

    if (cards.length !== 3) return;

    const mobile = window.matchMedia('(max-width: 600px)');
    if (!mobile.matches) return;

    // When aligned, pause the continuous orbit and let aligned layout take over
    if (viewMode === 'aligned' || stage.classList.contains('is-aligned')) {
      return;
    }

    const phases: Record<string, number> = {
      'card-cortes': 0,
      'card-extras': (Math.PI * 2) / 3,
      'card-produtos': (Math.PI * 4) / 3,
    };

    const start = performance.now();
    let frame: number;

    const animate = (now: number) => {
      const elapsed = now - start;

      // Uma volta completa em aproximadamente 14 segundos.
      const rotation = elapsed * ((Math.PI * 2) / 14000);

      cards.forEach((card) => {
        const className = Object.keys(phases).find((name) =>
          card.classList.contains(name)
        );

        if (!className) return;

        const angle = rotation + phases[className];

        // Trajetória circular em perspectiva.
        const depth = Math.cos(angle);
        const horizontal = Math.sin(angle);

        // Profundidade e tamanho de acordo com a posição.
        const front = (depth + 1) / 2;

        const scale = 0.70 + front * 0.40;

        // Elipse visual da órbita.
        const radiusX = Math.min(window.innerWidth * 0.29, 116);
        const radiusY = 15;

        const x = horizontal * radiusX;
        const y = depth * radiusY;

        const z = depth * 65;
        const yaw = -horizontal * 11;

        card.style.setProperty('--orbit-x', `${x}px`);
        card.style.setProperty('--orbit-y', `${y}px`);
        card.style.setProperty('--orbit-z', `${z}px`);
        card.style.setProperty('--orbit-scale', scale.toString());
        card.style.setProperty('--orbit-yaw', `${yaw}deg`);

        card.style.zIndex = Math.round(1 + front * 10).toString();

        card.style.opacity = (0.84 + front * 0.16).toString();
        card.style.filter = `brightness(${0.78 + front * 0.28})`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [viewMode]);
}
