/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BackgroundGlow } from './components/BackgroundGlow';
import { HeroVideo } from './components/HeroVideo';
import { BrandHeader } from './components/BrandHeader';
import { OrbitalCardsStage } from './components/OrbitalCardsStage';
import { Footer } from './components/Footer';
import { useCard3D } from './hooks/useCard3D';

export default function App() {
  useCard3D();

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
