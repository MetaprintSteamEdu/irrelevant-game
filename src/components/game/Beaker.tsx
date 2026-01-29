"use client";

import React from "react";
import { Flame, Target, Check } from "lucide-react";

export interface BeakerProps {
  temperature: number;
  ambient: number;
  target: number;
  onClick?: () => void;
  active: boolean;
  success: boolean;
  hueCold?: number;
  hueHot?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mapTempToHue(temp: number, ambient: number, hueCold: number, hueHot: number): number {
  const t = clamp((temp - ambient) / 80, 0, 1);
  return lerp(hueCold, hueHot, t);
}

function tempToColor(temp: number, ambient: number, hueCold: number, hueHot: number): string {
  const hue = mapTempToHue(temp, ambient, hueCold, hueHot);
  const lightness = 55 - clamp((temp - ambient) / 80, 0, 1) * 10;
  return `hsl(${hue} 80% ${lightness}%)`;
}

function progressFromTemp(temp: number, ambient: number): number {
  const min = ambient;
  const max = 100;
  return clamp((temp - min) / (max - min), 0, 1);
}

export function Beaker({
  temperature,
  ambient,
  target,
  onClick,
  active,
  success,
  hueCold = 215,
  hueHot = 10
}: BeakerProps): React.ReactElement {
  const color = tempToColor(temperature, ambient, hueCold, hueHot);
  const prog = progressFromTemp(temperature, ambient);
  const targetProg = progressFromTemp(target, ambient);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        role="button"
        aria-label="beaker"
        onClick={onClick}
        className="relative w-56 h-64 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden shadow-[inset_0_0_0_2px_rgba(255,255,255,0.04)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(60%_40%_at_50%_0%,white,transparent)]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(transparent_70%,rgba(0,0,0,0.2))]" />
        </div>

        <div
          className="absolute bottom-0 left-0 w-full transition-[height] duration-200 ease-out"
          style={{
            height: `${Math.max(48, 56 + prog * 24)}%`,
            background: `linear-gradient(180deg, ${color} 0%, ${color} 60%, rgba(0,0,0,0.05) 100%)`
          }}
        />

        <div className="absolute right-2 top-3 bottom-3 w-2 rounded-full bg-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/70"
            style={{ height: `${prog * 100}%` }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-[2px] bg-fuchsia-400"
            style={{ bottom: `${targetProg * 100}%` }}
          />
          <Target
            className="absolute -left-5 text-fuchsia-400"
            size={14}
            style={{ bottom: `calc(${targetProg * 100}% - 6px)` }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {success && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-xl rounded-full bg-emerald-400/40 scale-125" />
              <Check className="relative text-emerald-400" size={56} strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      <div
        className={`relative w-40 h-6 rounded-full border border-white/15 overflow-hidden transition-colors ${
          active ? "bg-amber-500/20" : "bg-white/5"
        }`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-30"
          }`}
          style={{
            background:
              "radial-gradient(60px 60px at 20% 50%, rgba(255,200,100,0.5), transparent 60%), radial-gradient(60px 60px at 80% 50%, rgba(255,160,80,0.5), transparent 60%)"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <Flame
            className={`transition-all ${active ? "text-amber-400 drop-shadow-[0_0_10px_rgba(255,200,100,0.7)]" : "text-white/50"}`}
            size={18}
            strokeWidth={2.2}
          />
          <div
            className={`h-2 rounded-full transition-all ${active ? "w-20 bg-amber-300/80" : "w-8 bg-white/30"}`}
          />
        </div>
      </div>
    </div>
  );
}