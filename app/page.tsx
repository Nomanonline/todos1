'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { FireStick, Joystick } from '@/components/game/touch-controls';

const navItems = ['Home', 'Play', 'About', 'Controls'];

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
  ['Left Click', 'Tap or Hold to Fire'],
];

function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollY;
}

type EnginePhase = 'playing' | 'wave-clear' | 'gameover' | 'victory';

interface PhaseUpdate {
  phase: EnginePhase;
  wave?: number;
  kills?: number;
  message?: string;
}

export default function HomePage() {
  const scrollY = useParallax();
  const aboutRef = useRef(null);
  const controlsRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const controlsInView = useInView(controlsRef, { once: true, amount: 0.2 });
  const [muted, setMuted] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [phase, setPhase] = useState<EnginePhase>('playing');
  const [waveMessage, setWaveMessage] = useState('WOW!!');
  const [waveNumber, setWaveNumber] = useState(1);
  const [finalKills, setFinalKills] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(touch);
    const engine = new GameEngine(canvasRef.current, muted, touch, (update: PhaseUpdate) => {
      setPhase(update.phase);
      if (update.message) setWaveMessage(update.message);
      if (update.wave) setWaveNumber(update.wave);
      if (typeof update.kills === 'number') setFinalKills(update.kills);
    });
    gameRef.current = engine;
    setGameReady(true);
    return () => engine.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gameRef.current?.setMuted(muted);
  }, [muted]);

  const heroOffset = useMemo(() => scrollY * 0.2, [scrollY]);

  const handleRestart = () => {
    gameRef.current?.restart();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${navVisible ? 'border-b border-cyan-400/20 bg-slate-950/50 backdrop-blur-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#home" className="text-xl font-black tracking-[0.35em] text-cyan-300 drop-shadow-[0_0_16px_rgba(34,211,238,0.55)]">
            VOID HUNTER
          </a>
          <div className="hidden gap-6 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative transition duration-300 hover:scale-105 hover:text-cyan-300"
              >
                <span className="absolute inset-x-0 bottom-[-6px] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-fuchsia-400 transition-transform duration-300 hover:scale-x-100" />
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="home" className="relative flex min-h-screen items-center justify-center px-6 py-24 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ x: [0, 24, 0], y: [0, -24, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-[8%] top-[16%] h-56 w-56 rounded-full bg-fuchsia-600/25 blur-3xl" />
          <motion.div animate={{ x: [0, -30, 0], y: [0, 26, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm uppercase tracking-[0.4em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
            Cyberpunk Survival Shooter
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }} className="mt-8 text-5xl font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.35)] sm:text-7xl lg:text-8xl" style={{ transform: `translateY(${heroOffset}px)` }}>
            VOID HUNTER
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Survive three waves of terrifying monsters in a neon-drenched battlefield built for tension, momentum, and style.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#play" className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-8 py-4 font-semibold uppercase tracking-[0.3em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.24)] transition duration-300 hover:scale-105 hover:bg-cyan-400/25">
              Play Game
            </a>
            <button onClick={() => setMuted((v) => !v)} className="rounded-full border border-fuchsia-400/30 bg-white/5 px-6 py-4 text-sm uppercase tracking-[0.25em] text-slate-200 backdrop-blur-xl transition duration-300 hover:scale-105">
              {muted ? 'Unmute Audio' : 'Mute Audio'}
            </button>
          </motion.div>
        </div>
      </section>

      <section id="about" ref={aboutRef} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">About the mission</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A brutal arcade survival experience with a premium cyberpunk edge.</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {aboutCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="rounded-3xl border border-cyan-400/20 bg-slate-950/60 p-7 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-xl"
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

      <section id="controls" ref={controlsRef} className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Controls</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Master the battlefield with responsive, instinctive controls.</h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map(([key, label], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={controlsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/70 p-6 text-center shadow-[0_0_24px_rgba(139,92,246,0.12)] backdrop-blur-xl"
            >
              <div className="mb-3 text-3xl font-black text-cyan-300">{key}</div>
              <div className="text-sm uppercase tracking-[0.25em] text-slate-300">{label}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm uppercase tracking-[0.3em] text-slate-400">
          On mobile, drag the left stick to move and the right stick to aim and fire in any direction.
        </p>
      </section>

      <section id="play" className="mx-auto max-w-7xl px-2 pb-24 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Playable mission</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">A fully playable top-down survival shooter built directly in Canvas.</h2>
        </motion.div>
        <div className="rounded-xl border border-cyan-400/20 bg-slate-950/70 p-1 shadow-[0_0_40px_rgba(34,211,238,0.16)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-3">
          <div className="relative overflow-hidden rounded-lg sm:rounded-[1.5rem]">
            <canvas ref={canvasRef} width={960} height={640} className="h-full w-full rounded-lg border border-white/10 bg-slate-950 sm:rounded-[1.5rem]" />

            {isTouchDevice && phase === 'playing' && (
              <>
                <Joystick onMove={(x, y) => gameRef.current?.setVirtualMove(x, y)} />
                <FireStick
                  onAim={(x, y) => gameRef.current?.setVirtualAim(x, y)}
                  onFireStart={() => gameRef.current?.setVirtualFire(true)}
                  onFireEnd={() => gameRef.current?.setVirtualFire(false)}
                />
              </>
            )}

            <AnimatePresence>
              {phase === 'wave-clear' && (
                <motion.div
                  key="wave-clear"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.35, ease: 'backOut' }}
                  className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/30"
                >
                  <motion.p
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-6xl font-black uppercase tracking-widest text-cyan-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] sm:text-7xl"
                  >
                    {waveMessage}
                  </motion.p>
                  <p className="mt-4 text-lg uppercase tracking-[0.4em] text-white/80">Wave {waveNumber} cleared</p>
                </motion.div>
              )}

              {phase === 'gameover' && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-950/60 backdrop-blur-sm"
                >
                  <motion.h2
                    initial={{ scale: 2, opacity: 0, rotate: -6 }}
                    animate={{ scale: 1, opacity: 1, rotate: [-4, 4, -2, 2, 0] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-7xl font-black uppercase tracking-[0.2em] text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.8)] sm:text-8xl"
                  >
                    Wasted
                  </motion.h2>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-red-200">
                    Reached wave {waveNumber} · {finalKills} kills
                  </p>
                  <button
                    onClick={handleRestart}
                    className="mt-8 rounded-full border border-red-400/50 bg-red-500/20 px-8 py-3 font-semibold uppercase tracking-[0.3em] text-red-100 transition duration-300 hover:scale-105 hover:bg-red-500/30"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {phase === 'victory' && (
                <motion.div
                  key="victory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm"
                >
                  <motion.h2
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'backOut' }}
                    className="text-6xl font-black uppercase tracking-[0.2em] text-cyan-200 drop-shadow-[0_0_36px_rgba(34,211,238,0.8)] sm:text-7xl"
                  >
                    Mission Complete
                  </motion.h2>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-cyan-100/80">
                    You survived all three waves · {finalKills} kills
                  </p>
                  <motion.a
                    href="https://youtu.be/dQw4w9WgXcQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, scale: [1, 1.06, 1] }}
                    transition={{ opacity: { delay: 0.4, duration: 0.5 }, y: { delay: 0.4, duration: 0.5 }, scale: { delay: 1, duration: 1.6, repeat: Infinity } }}
                    whileHover={{ scale: 1.1 }}
                    className="mt-8 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-500 bg-clip-text font-serif text-3xl font-black italic tracking-wide text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.85)] sm:text-4xl"
                  >
                    ✨ CONGRATS BY NomanOnline AKA Nomay ✨
                  </motion.a>
                  <button
                    onClick={handleRestart}
                    className="mt-8 rounded-full border border-cyan-300/50 bg-cyan-400/20 px-8 py-3 font-semibold uppercase tracking-[0.3em] text-cyan-100 transition duration-300 hover:scale-105 hover:bg-cyan-400/30"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          {isTouchDevice
            ? 'Drag the left stick to move and the right stick to aim and fire in any direction. Survive all three waves.'
            : 'Use WASD to move, aim with your mouse, and tap or hold left click to fire. Survive all three waves.'}
        </p>
        <div className="mt-6 text-center text-sm text-slate-400">{gameReady ? 'Game engine is live.' : 'Loading game engine...'}</div>
      </section>
    </main>
  );
}

class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private lastTime = 0;
  private animationFrame = 0;
  private muted = false;
  private isTouch: boolean;
  private onPhaseChange: (update: PhaseUpdate) => void;
  private keys = new Set<string>();
  private mouse = { x: 0, y: 0, down: false };
  private virtualMove = { x: 0, y: 0 };
  private virtualAim = { x: 1, y: 0 };
  private virtualFire = false;
  private fireCooldown = 0;
  private audioUnlocked = false;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  private player: Player;
  private wave = 1;
  private kills = 0;
  private timeSurvived = 0;
  private waveTimer = 0;
  private wavePhase = 'spawn';
  private spawnCooldown = 0;
  private spawnedThisWave = 0;
  private gameOver = false;
  private victory = false;
  private shake = 0;
  private audioContext: AudioContext | null = null;
  private wastedSource: AudioBufferSourceNode | null = null;
  private readonly waveMessages = ['WOW!!', 'AMAZING!!', 'INCREDIBLE!!', 'UNSTOPPABLE!!', 'BRUTAL!!'];
  private readonly sounds = {
    shoot: null as AudioBuffer | null,
    enemyHit: null as AudioBuffer | null,
    waveClear: null as AudioBuffer | null,
    victory: null as AudioBuffer | null,
    gameOver: null as AudioBuffer | null,
    hover: null as AudioBuffer | null,
    hurt: null as AudioBuffer | null,
    wasted: null as AudioBuffer | null,
  };

  constructor(canvas: HTMLCanvasElement, muted: boolean, isTouch: boolean, onPhaseChange: (update: PhaseUpdate) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.muted = muted;
    this.isTouch = isTouch;
    this.onPhaseChange = onPhaseChange;
    this.player = new Player(this.width / 2, this.height / 2);
    this.bindEvents();
    this.initAudio();
    this.spawnWave();
    this.loop(0);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  setVirtualMove(x: number, y: number) {
    this.virtualMove.x = x;
    this.virtualMove.y = y;
    this.unlockAudio();
  }

  setVirtualAim(x: number, y: number) {
    this.virtualAim.x = x;
    this.virtualAim.y = y;
  }

  setVirtualFire(down: boolean) {
    this.virtualFire = down;
    if (down) this.unlockAudio();
  }

  restart() {
    this.unlockAudio();
    this.stopWastedLoop();
    this.resetGame();
    this.onPhaseChange({ phase: 'playing' });
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    this.stopWastedLoop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.audioContext?.close().catch(() => undefined);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keys.add(event.key.toLowerCase());
    if (event.key === ' ') event.preventDefault();
    this.unlockAudio();
  };
  private handleKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.key.toLowerCase());
  };
  private handleMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * this.width;
    this.mouse.y = ((event.clientY - rect.top) / rect.height) * this.height;
  };
  private handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;
    this.mouse.down = true;
    this.unlockAudio();
  };
  private handleMouseUp = (event: MouseEvent) => {
    if (event.button !== 0) return;
    this.mouse.down = false;
  };
  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('contextmenu', this.handleContextMenu);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  private unlockAudio() {
    if (this.audioUnlocked || !this.audioContext) return;
    this.audioUnlocked = true;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => undefined);
    }
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.audioContext = new AudioContextClass();
    this.sounds.shoot = this.createTone(440, 0.04, 0.02);
    this.sounds.enemyHit = this.createTone(180, 0.04, 0.02);
    this.sounds.waveClear = this.createTone(660, 0.08, 0.03);
    this.sounds.victory = this.createTone(880, 0.16, 0.04);
    this.sounds.gameOver = this.createTone(120, 0.18, 0.05);
    this.sounds.hover = this.createTone(520, 0.03, 0.01);
    this.sounds.hurt = this.createTone(180, 0.08, 0.08);
    this.sounds.wasted = this.createSiren();
  }

  private createTone(frequency: number, duration: number, volume: number): AudioBuffer | null {
    if (!this.audioContext) return null;
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      const t = i / buffer.sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-4 * t) * volume;
    }
    return buffer;
  }

  private createSiren(): AudioBuffer | null {
    if (!this.audioContext) return null;
    const duration = 1.4;
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i += 1) {
      const t = i / buffer.sampleRate;
      const freq = 200 + Math.sin(t * Math.PI * 2 * 1.1) * 70;
      const envelope = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 1.1 - Math.PI / 2);
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.22 * envelope;
    }
    return buffer;
  }

  private playSound(sound: keyof typeof this.sounds) {
    if (this.muted || !this.audioContext || !this.sounds[sound]) return;
    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    source.buffer = this.sounds[sound];
    source.connect(gain);
    gain.connect(this.audioContext.destination);
    gain.gain.value = 0.18;
    source.start();
  }

  private playToneImmediate(frequency: number, duration: number, volume: number) {
    if (this.muted || !this.audioContext) return;
    const buffer = this.createTone(frequency, duration, volume);
    if (!buffer) return;
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  private playCelebration() {
    if (this.muted || !this.audioContext) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      setTimeout(() => this.playToneImmediate(freq, 0.18, 0.05), index * 80);
    });
  }

  private startWastedLoop() {
    if (this.muted || !this.audioContext || !this.sounds.wasted) return;
    this.stopWastedLoop();
    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    source.buffer = this.sounds.wasted;
    source.loop = true;
    gain.gain.value = 0.16;
    source.connect(gain);
    gain.connect(this.audioContext.destination);
    source.start();
    this.wastedSource = source;
  }

  private stopWastedLoop() {
    if (this.wastedSource) {
      try {
        this.wastedSource.stop();
      } catch {
        // already stopped
      }
      this.wastedSource.disconnect();
      this.wastedSource = null;
    }
  }

  private loop(timestamp: number) {
    const delta = Math.min((timestamp - this.lastTime) / 1000 || 0.016, 0.033);
    this.lastTime = timestamp;
    this.update(delta);
    this.render();
    this.animationFrame = requestAnimationFrame((time) => this.loop(time));
  }

  private update(delta: number) {
    this.timeSurvived += delta;
    if (this.shake > 0) this.shake = Math.max(0, this.shake - delta * 10);
    if (this.fireCooldown > 0) this.fireCooldown -= delta;
    if (!this.gameOver && !this.victory) {
      this.player.update(this.moveVector(), delta, this.width, this.height);
      if (this.isFiring() && this.fireCooldown <= 0) {
        this.shoot();
        this.fireCooldown = 0.045;
      }
      this.updateEnemies(delta);
      this.updateBullets(delta);
      this.updateWave(delta);
    }
    this.updateParticles(delta);
  }

  private isFiring() {
    return this.mouse.down || this.virtualFire;
  }

  private moveVector(): { x: number; y: number } {
    let dx = 0;
    let dy = 0;
    if (this.keys.has('w')) dy -= 1;
    if (this.keys.has('a')) dx -= 1;
    if (this.keys.has('s')) dy += 1;
    if (this.keys.has('d')) dx += 1;
    if (dx !== 0 || dy !== 0) return { x: dx, y: dy };
    return { x: this.virtualMove.x, y: this.virtualMove.y };
  }

  private getAimPoint(): { x: number; y: number } {
    if (this.isTouch) {
      return { x: this.player.x + this.virtualAim.x * 100, y: this.player.y + this.virtualAim.y * 100 };
    }
    return this.mouse;
  }

  private updateWave(delta: number) {
    if (this.wavePhase === 'spawn' && this.spawnedThisWave >= this.targetCount() && this.enemies.length === 0) {
      this.wavePhase = 'clear';
      this.waveTimer = 2;
      const message = this.waveMessages[Math.floor(Math.random() * this.waveMessages.length)];
      this.playSound('waveClear');
      this.playCelebration();
      this.spawnCelebrationBurst();
      this.onPhaseChange({ phase: 'wave-clear', wave: this.wave, message });
    }

    if (this.wavePhase === 'clear') {
      this.waveTimer -= delta;
      if (this.waveTimer <= 0) {
        if (this.wave >= 3) {
          this.victory = true;
          this.playSound('victory');
          this.onPhaseChange({ phase: 'victory', wave: this.wave, kills: this.kills });
          return;
        }
        this.wave += 1;
        this.wavePhase = 'spawn';
        this.spawnWave();
        this.onPhaseChange({ phase: 'playing' });
      }
    }

    if (this.wavePhase === 'spawn') {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0 && this.spawnedThisWave < this.targetCount()) {
        const remaining = this.targetCount() - this.spawnedThisWave;
        const batch = Math.min(this.batchSize, remaining);
        for (let i = 0; i < batch; i += 1) {
          this.spawnEnemy();
        }
        this.spawnedThisWave += batch;
        this.spawnCooldown = this.batchInterval();
      }
    }
  }

  private readonly batchSize = 10;

  private targetCount() {
    if (this.wave === 1) return 50;
    if (this.wave === 2) return 100;
    return 175;
  }

  private batchInterval() {
    return Math.max(1.4, 2.6 - (this.wave - 1) * 0.4);
  }

  private spawnWave() {
    this.enemies = [];
    this.spawnedThisWave = 0;
    this.spawnCooldown = 0.6;
  }

  private spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    if (edge === 0) {
      x = Math.random() * this.width;
      y = -40;
    } else if (edge === 1) {
      x = this.width + 40;
      y = Math.random() * this.height;
    } else if (edge === 2) {
      x = Math.random() * this.width;
      y = this.height + 40;
    } else {
      x = -40;
      y = Math.random() * this.height;
    }
    const speed = 60 + this.wave * 18 + Math.random() * 20;
    this.enemies.push(new Enemy(x, y, speed, this.wave));
  }

  private shoot() {
    if (this.gameOver || this.victory) return;
    const aim = this.getAimPoint();
    const angle = Math.atan2(aim.y - this.player.y, aim.x - this.player.x);
    this.bullets.push(new Bullet(this.player.x, this.player.y, angle, 430, this.player.shootColor));
    this.shake = 0.15;
    this.playSound('shoot');
  }

  private updateBullets(delta: number) {
    for (let i = this.bullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.bullets[i];
      bullet.update(delta);
      if (bullet.life <= 0 || bullet.x < -20 || bullet.x > this.width + 20 || bullet.y < -20 || bullet.y > this.height + 20) {
        this.bullets.splice(i, 1);
        continue;
      }
      for (let j = this.enemies.length - 1; j >= 0; j -= 1) {
        const enemy = this.enemies[j];
        if (bullet.hit(enemy)) {
          enemy.hit(18);
          this.bullets.splice(i, 1);
          this.spawnHitParticles(bullet.x, bullet.y, '#22d3ee');
          if (enemy.dead) {
            this.kills += 1;
            this.spawnExplosion(enemy.x, enemy.y);
            this.playSound('enemyHit');
            this.enemies.splice(j, 1);
          }
          break;
        }
      }
    }
  }

  private updateEnemies(delta: number) {
    for (const enemy of this.enemies) {
      enemy.update(this.player, delta);
      if (enemy.distanceToPlayer(this.player) < 20) {
        this.player.health = Math.max(0, this.player.health - 1.2 * delta * 60);
        if (this.player.health > 0) {
          this.playSound('hurt');
        }
      }
    }
    if (this.player.health <= 0 && !this.gameOver) {
      this.gameOver = true;
      this.playSound('gameOver');
      this.startWastedLoop();
      this.onPhaseChange({ phase: 'gameover', wave: this.wave, kills: this.kills });
    }
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.update(delta);
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private spawnHitParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 8; i += 1) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  private spawnExplosion(x: number, y: number) {
    for (let i = 0; i < 24; i += 1) {
      this.particles.push(new Particle(x, y, i % 2 === 0 ? '#22d3ee' : '#8b5cf6'));
    }
  }

  private spawnCelebrationBurst() {
    const colors = ['#fbbf24', '#22d3ee', '#f472b6', '#a3e635'];
    for (let i = 0; i < 50; i += 1) {
      const x = Math.random() * this.width;
      this.particles.push(new Particle(x, -20, colors[i % colors.length], { speed: 60, life: 1.8, gravity: 140 }));
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    const shakeX = (Math.random() - 0.5) * this.shake * 24;
    const shakeY = (Math.random() - 0.5) * this.shake * 24;
    this.ctx.translate(shakeX, shakeY);

    this.renderBackground();
    this.renderGrid();
    const aim = this.getAimPoint();
    this.player.render(this.ctx, aim.x, aim.y);
    for (const bullet of this.bullets) bullet.render(this.ctx);
    for (const enemy of this.enemies) enemy.render(this.ctx);
    for (const particle of this.particles) particle.render(this.ctx);

    this.renderHud();
    this.ctx.restore();
  }

  private resetGame() {
    this.player = new Player(this.width / 2, this.height / 2);
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.wave = 1;
    this.kills = 0;
    this.timeSurvived = 0;
    this.waveTimer = 0;
    this.wavePhase = 'spawn';
    this.fireCooldown = 0;
    this.gameOver = false;
    this.victory = false;
    this.shake = 0;
    this.spawnWave();
  }

  private renderBackground() {
    const gradient = this.ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#020617');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < 70; i += 1) {
      this.ctx.fillStyle = i % 2 === 0 ? 'rgba(34,211,238,0.15)' : 'rgba(139,92,246,0.14)';
      this.ctx.fillRect((i * 97) % this.width, (i * 53) % this.height, 2, 2);
    }
  }

  private renderGrid() {
    this.ctx.strokeStyle = 'rgba(34,211,238,0.08)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  private renderHud() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(2,6,23,0.7)';
    this.ctx.fillRect(18, 18, 240, 84);
    this.ctx.strokeStyle = 'rgba(34,211,238,0.4)';
    this.ctx.strokeRect(18, 18, 240, 84);
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText('Health', 34, 44);
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(34, 54, 150, 18);
    this.ctx.fillStyle = '#22d3ee';
    this.ctx.fillRect(34, 54, 150 * (this.player.health / 100), 18);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    this.ctx.strokeRect(34, 54, 150, 18);
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText(`Health: ${Math.ceil(this.player.health)} / 100`, 34, 86);

    this.ctx.fillStyle = 'rgba(2,6,23,0.7)';
    this.ctx.fillRect(this.width / 2 - 120, 18, 240, 58);
    this.ctx.strokeStyle = 'rgba(139,92,246,0.4)';
    this.ctx.strokeRect(this.width / 2 - 120, 18, 240, 58);
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText(`Wave ${this.wave} / 3`, this.width / 2 - 70, 54);

    this.ctx.fillStyle = 'rgba(2,6,23,0.7)';
    this.ctx.fillRect(this.width - 198, 18, 180, 58);
    this.ctx.strokeStyle = 'rgba(34,211,238,0.4)';
    this.ctx.strokeRect(this.width - 198, 18, 180, 58);
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText(`Kills: ${this.kills}`, this.width - 168, 54);

    this.ctx.fillStyle = 'rgba(2,6,23,0.65)';
    this.ctx.fillRect(18, this.height - 90, 220, 70);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    this.ctx.strokeRect(18, this.height - 90, 220, 70);
    this.ctx.font = 'bold 15px Arial';
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.fillText('Mini Controls', 34, this.height - 60);
    this.ctx.font = '12px Arial';
    this.ctx.fillText(this.isTouch ? 'Left Stick Move' : 'WASD Move', 34, this.height - 40);
    this.ctx.fillText(this.isTouch ? 'Right Stick Aim & Fire' : 'Mouse Aim / Click Shoot', 34, this.height - 20);
    this.ctx.restore();
  }
}

class Player {
  x: number;
  y: number;
  health = 100;
  shootColor = '#8b5cf6';
  private speed = 220;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(move: { x: number; y: number }, delta: number, width: number, height: number) {
    let dx = move.x;
    let dy = move.y;
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    this.x += dx * this.speed * delta;
    this.y += dy * this.speed * delta;
    this.x = Math.max(20, Math.min(width - 20, this.x));
    this.y = Math.max(20, Math.min(height - 20, this.y));
  }

  render(ctx: CanvasRenderingContext2D, aimX: number, aimY: number) {
    const angle = Math.atan2(aimY - this.y, aimX - this.x);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(8, -6, 24, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(18, -2, 10, 4);
    ctx.restore();
  }
}

class Enemy {
  x: number;
  y: number;
  speed: number;
  private health = 36 + Math.random() * 10;
  private color: string;
  private wave: number;
  dead = false;

  constructor(x: number, y: number, speed: number, wave: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.wave = wave;
    this.color = ['#f43f5e', '#fb923c', '#8b5cf6', '#22d3ee'][Math.floor(Math.random() * 4)];
  }

  update(player: Player, delta: number) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const scale = this.speed * delta;
    this.x += (dx / len) * scale;
    this.y += (dy / len) * scale;
  }

  hit(amount: number) {
    this.health -= amount;
    if (this.health <= 0) this.dead = true;
  }

  distanceToPlayer(player: Player) {
    return Math.hypot(player.x - this.x, player.y - this.y);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.fillStyle = '#020617';
    ctx.fillRect(-6, -8, 12, 4);
    ctx.fillRect(-10, 2, 20, 4);
    ctx.restore();
  }
}

class Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life = 1.1;
  color: string;

  constructor(x: number, y: number, angle: number, speed: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
  }

  update(delta: number) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.life -= delta;
  }

  hit(enemy: Enemy) {
    return Math.hypot(this.x - enemy.x, this.y - enemy.y) < 16;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

interface ParticleOptions {
  speed?: number;
  life?: number;
  gravity?: number;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  gravity: number;
  color: string;

  constructor(x: number, y: number, color: string, options?: ParticleOptions) {
    this.x = x;
    this.y = y;
    const speed = options?.speed ?? 220;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;
    this.life = options?.life ?? 0.45;
    this.maxLife = this.life;
    this.gravity = options?.gravity ?? 0;
    this.color = color;
  }

  update(delta: number) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    if (this.gravity) {
      this.vy += this.gravity * delta;
    } else {
      this.vx *= 0.92;
      this.vy *= 0.92;
    }
    this.life -= delta;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.life / this.maxLife));
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
