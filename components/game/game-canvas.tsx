'use client';

import { motion } from 'framer-motion';
import { RefObject } from 'react';

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  gameReady: boolean;
}

export function GameCanvas({ canvasRef, gameReady }: GameCanvasProps) {
  return (
    <motion.section id="play" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Playable mission</p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A fully playable top-down survival shooter built directly in Canvas.</h2>
      </div>
      <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-3 shadow-panel backdrop-blur-2xl">
        <canvas ref={canvasRef} width={960} height={640} className="h-full w-full rounded-[1.5rem] border border-white/10 bg-slate-950" />
      </div>
      <p className="mt-4 text-center text-sm text-slate-400">Use WASD to move, aim with your mouse, and hold left click to fire. Survive all three waves.</p>
      <div className="mt-6 text-center text-sm text-slate-400">{gameReady ? 'Game engine is live.' : 'Loading game engine...'}</div>
    </motion.section>
  );
}
