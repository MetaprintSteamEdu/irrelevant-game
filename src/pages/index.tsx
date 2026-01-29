import React from "react";
import dynamic from "next/dynamic";
import { SEO } from "@/components/SEO";

const HeatCapacityGame = dynamic(() => import("@/components/game/HeatCapacityGame").then(m => m.HeatCapacityGame), {
  ssr: false
});

export default function Home(): React.ReactElement {
  return (
    <>
      <SEO
        title="Heat Capacity — Interactive Mini-Game"
        description="Feel how different materials warm up. No words, just play."
        image="/heat-capacity/og-image.png"
        url="/"
      />
      <main className="min-h-screen bg-[#0b0d12] text-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.5] bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(150,100,255,0.15),transparent)]" />
          <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(900px_500px_at_10%_120%,rgba(255,140,100,0.12),transparent)]" />
          <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2032%22%20viewBox=%220%200%2032%2032%22><path fill=%22white%22 fill-opacity=%220.06%22 d=%22M0 31h32v1H0zM31 0h1v32h-1z%22/></svg>')]" />
        </div>

        <section className="relative pt-16 pb-8">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/30 via-fuchsia-400/30 to-orange-400/30 blur-lg" />
                <h1 className="relative text-3xl sm:text-5xl font-semibold tracking-tight">
                  Heat Capacity
                </h1>
              </div>
              <div className="text-white/60 text-sm sm:text-base">
                {/* Intentionally minimal: no instructions */}
              </div>
            </div>
          </div>
        </section>

        <section className="relative pb-20 px-6">
          <HeatCapacityGame />
        </section>

        <footer className="relative border-t border-white/10 py-8 text-center text-white/40 text-xs">
          © 2026 Heat Capacity
        </footer>
      </main>
    </>
  );
}