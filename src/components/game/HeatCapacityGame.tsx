"use client";

import React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Beaker } from "./Beaker";

type Side = "left" | "right";

interface Vessel {
  c: number;
  temp: number;
}

interface GameState {
  left: Vessel;
  right: Vessel;
  active: Side;
  playing: boolean;
  done: boolean;
}

const AMBIENT = 20;
const TARGET = 72;
const MASS = 1;
const POWER = 38;
const COOL_K = 0.015;
const TOL = 2;

function withinTarget(t: number): boolean {
  return Math.abs(t - TARGET) <= TOL;
}

export function HeatCapacityGame(): React.ReactElement {
  const [state, setState] = React.useState<GameState>({
    left: { c: 1.2, temp: AMBIENT },
    right: { c: 4.2, temp: AMBIENT },
    active: "left",
    playing: true,
    done: false
  });

  const rafRef = React.useRef<number | null>(null);
  const lastRef = React.useRef<number | null>(null);

  const reset = React.useCallback(() => {
    setState({
      left: { c: 1.2, temp: AMBIENT },
      right: { c: 4.2, temp: AMBIENT },
      active: "left",
      playing: true,
      done: false
    });
    lastRef.current = null;
  }, []);

  const togglePlay = React.useCallback(() => {
    setState(s => ({ ...s, playing: !s.playing }));
  }, []);

  const setActive = React.useCallback((side: Side) => {
    setState(s => ({ ...s, active: side }));
  }, []);

  React.useEffect(() => {
    function step(ts: number) {
      if (lastRef.current == null) lastRef.current = ts;
      const dt = Math.min(0.05, (ts - lastRef.current) / 1000);
      lastRef.current = ts;

      setState(prev => {
        if (!prev.playing || prev.done) return prev;

        const left = { ...prev.left };
        const right = { ...prev.right };

        const dTcLeftHeat = prev.active === "left" ? (POWER * dt) / (MASS * left.c) : 0;
        const dTcRightHeat = prev.active === "right" ? (POWER * dt) / (MASS * right.c) : 0;

        const coolL = COOL_K * (AMBIENT - left.temp) * dt;
        const coolR = COOL_K * (AMBIENT - right.temp) * dt;

        left.temp = left.temp + dTcLeftHeat + coolL;
        right.temp = right.temp + dTcRightHeat + coolR;

        const bothAtTarget = withinTarget(left.temp) && withinTarget(right.temp);

        return {
          ...prev,
          left,
          right,
          done: bothAtTarget
        };
      });

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (state.done) {
      setState(s => ({ ...s, playing: false }));
    }
  }, [state.done]);

  React.useEffect(() => {
    let id: number | null = null;
    if (state.playing && !state.done) {
      id = window.setInterval(() => {
        // noop timer to keep effect dependency consistent
      }, 4000);
    }
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [state.playing, state.done]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(90,120,255,0.12),transparent),radial-gradient(800px_400px_at_0%_120%,rgba(255,120,90,0.12),transparent)] border border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            aria-label="play-pause"
            onClick={togglePlay}
            className="h-11 w-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            {state.playing ? <Pause size={18} className="text-white/90" /> : <Play size={18} className="text-white/90" />}
          </button>
          <button
            aria-label="reset"
            onClick={reset}
            className="h-11 w-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
          >
            <RotateCcw size={18} className="text-white/90" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          <Beaker
            temperature={state.left.temp}
            ambient={AMBIENT}
            target={TARGET}
            active={state.active === "left"}
            success={state.done}
            onClick={() => setActive("left")}
            hueCold={210}
            hueHot={20}
          />
          <Beaker
            temperature={state.right.temp}
            ambient={AMBIENT}
            target={TARGET}
            active={state.active === "right"}
            success={state.done}
            onClick={() => setActive("right")}
            hueCold={210}
            hueHot={20}
          />
        </div>

        <div className="pointer-events-none mt-8 flex items-center justify-center">
          <div className="w-64 h-2 rounded-full bg-gradient-to-r from-blue-500/30 via-fuchsia-400/40 to-orange-400/30 blur-md" />
        </div>
      </div>
    </div>
  );
}