import { useEffect } from 'react';

/**
 * High-performance 3D Card Hover & Tilt Hook
 * Uses requestAnimationFrame throttling to prevent DOM thrashing on high-frequency pointer moves.
 */
export function useCard3D(deps: unknown[] = []) {
  useEffect(() => {
    // Only bind if pointer device supports hover
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) {
      return;
    }

    const cards = document.querySelectorAll<HTMLElement>('.orbit-card');
    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      let rafId: number | null = null;
      let latestEvent: PointerEvent | null = null;

      const updateCardStyles = () => {
        if (!latestEvent) return;

        const rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const clientX = latestEvent.clientX;
        const clientY = latestEvent.clientY;

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--light-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--light-y', `${y.toFixed(1)}%`);
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}%`);
        card.style.setProperty('--pointer-tilt-x', `${((50 - y) * 0.08).toFixed(2)}deg`);

        const rotateY = ((clientX - rect.left) / rect.width - 0.5) * 10;
        const rotateX = (0.5 - (clientY - rect.top) / rect.height) * 10;
        card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);

        if (!card.classList.contains('is-interacting')) {
          card.classList.add('is-interacting');
        }

        rafId = null;
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        latestEvent = event;

        if (rafId === null) {
          rafId = requestAnimationFrame(updateCardStyles);
        }
      };

      const leave = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        latestEvent = null;

        card.style.setProperty('--light-x', '50%');
        card.style.setProperty('--light-y', '50%');
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        card.style.setProperty('--pointer-tilt-x', '0deg');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');

        card.classList.remove('is-interacting');
      };

      card.addEventListener('pointermove', move as EventListener, { passive: true });
      card.addEventListener('pointerleave', leave as EventListener, { passive: true });

      cleanups.push(() => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        card.removeEventListener('pointermove', move as EventListener);
        card.removeEventListener('pointerleave', leave as EventListener);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, deps);
}
