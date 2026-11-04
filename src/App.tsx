/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BackgroundGlow } from './components/BackgroundGlow';
import { HeroVideo } from './components/HeroVideo';
import { BrandHeader } from './components/BrandHeader';
import { OrbitalCardsStage } from './components/OrbitalCardsStage';
import { Footer } from './components/Footer';
import { NotFound } from './components/NotFound';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      setCurrentPath('/');
    }
  };

  // Route fallback: if route is not root or empty, render branded 404
  if (currentPath !== '/' && currentPath !== '') {
    return <NotFound onGoHome={handleGoHome} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#04172B] text-[#F5F8FC] flex flex-col justify-between overflow-x-hidden">
      {/* Background radial gradients and subtle depth elements */}
      <BackgroundGlow />

      {/* Main Flow */}
      <main className="w-full flex-1 flex flex-col items-center">
        {/* 1. Cinematic Hero Video Banner (Full width top) */}
        <HeroVideo />

        {/* 2. Official Brand Header & Identity */}
        <BrandHeader />

        {/* 3. 3D Orbital & Horizontal Alignment Stage (3 Cards) */}
        <OrbitalCardsStage />
      </main>

      {/* 4. Minimalist Footer Signature */}
      <Footer />
    </div>
  );
}
