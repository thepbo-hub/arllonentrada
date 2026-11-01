import { useEffect } from 'react';

export function useCard3D(deps: unknown[] = []) {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.orbit-card');

    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;

        const rect = card.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--light-x', `${x}%`);
        card.style.setProperty('--light-y', `${y}%`);
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);

        card.style.setProperty(
          '--pointer-tilt-x',
          `${(50 - y) * 0.08}deg`
        );

        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const rotateX = (0.5 - (event.clientY - rect.top) / rect.height) * 10;
        card.style.setProperty('--tilt-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);

        card.classList.add('is-interacting');
      };

      const leave = () => {
        card.style.setProperty('--light-x', '50%');
        card.style.setProperty('--light-y', '50%');
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
        card.style.setProperty('--pointer-tilt-x', '0deg');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');

        card.classList.remove('is-interacting');
      };

      card.addEventListener('pointermove', move as EventListener);
      card.addEventListener('pointerleave', leave as EventListener);

      cleanups.push(() => {
        card.removeEventListener('pointermove', move as EventListener);
        card.removeEventListener('pointerleave', leave as EventListener);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, deps);
}
