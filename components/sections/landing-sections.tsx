'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const aboutCards = [
  { title: 'Adaptive Combat', icon: '⚔️', copy: 'React quickly to swarms with precise movement, aim, and devastating shots.' },
  { title: 'Wave Survival', icon: '🌌', copy: 'Brace for escalating threats as each wave pushes your reflexes and positioning.' },
  { title: 'Nebula Tech', icon: '💡', copy: 'Harness futuristic gear with glowing weapons, particle effects, and cinematic feedback.' },
];

const controls = [
  ['W', 'Move Up'],
  ['A', 'Move Left'],
  ['S', 'Move Down'],
  ['D', 'Move Right'],
  ['Mouse', 'Aim'],
  ['Left Click', 'Shoot'],
];

interface HeroSectionProps {
  scrollY: number;
  muted: boolean;
  onToggleMute: () => void;
}

export function HeroSection({ scrollY, muted, onToggleMute }: HeroSectionProps) {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-6 py-24 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[10%] top-[14%] h-56 w-56 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm uppercase tracking-[0.4em] text-cyan-200 shadow-glow">
          Cyberpunk Survival Shooter
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="mt-8 text-5xl font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_0_24px_rgba(34,211,238,0.35)] sm:text-7xl lg:text-8xl" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          VOID HUNTER
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
          Survive three waves of terrifying monsters in a neon-drenched battlefield built for tension, momentum, and style.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#play" className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-8 py-4 font-semibold uppercase tracking-[0.3em] text-cyan-100 shadow-glow transition duration-300 hover:scale-105 hover:bg-cyan-400/25">
            Play Game
          </a>
          <button onClick={onToggleMute} className="rounded-full border border-fuchsia-400/30 bg-white/5 px-6 py-4 text-sm uppercase tracking-[0.25em] text-slate-200 backdrop-blur-xl transition duration-300 hover:scale-105">
            {muted ? 'Unmute Audio' : 'Mute Audio'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">About the mission</p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A brutal arcade survival experience with a premium cyberpunk edge.</h2>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-3">
        {aboutCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="rounded-3xl border border-white/10 bg-white/10 p-7 shadow-panel backdrop-blur-xl"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl shadow-glow">
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{card.copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function ControlsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="controls" ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Controls</p>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Master the battlefield with responsive, instinctive controls.</h2>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map(([key, label], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center shadow-panel backdrop-blur-xl"
          >
            <div className="mb-3 text-3xl font-black text-cyan-300">{key}</div>
            <div className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
