'use client';

import { useRef, useState } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

export function Joystick({ onMove }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activeId = useRef<number | null>(null);

  const updateFromPoint = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const radius = rect.width / 2;
    let dx = clientX - (rect.left + radius);
    let dy = clientY - (rect.top + radius);
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      dx = (dx / dist) * radius;
      dy = (dy / dist) * radius;
    }
    setKnob({ x: dx, y: dy });
    onMove(dx / radius, dy / radius);
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    activeId.current = event.pointerId;
    (event.target as Element).setPointerCapture(event.pointerId);
    updateFromPoint(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (activeId.current !== event.pointerId) return;
    updateFromPoint(event.clientX, event.clientY);
  };

  const releaseTouch = (event: React.PointerEvent) => {
    if (activeId.current !== event.pointerId) return;
    activeId.current = null;
    setKnob({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={releaseTouch}
      onPointerCancel={releaseTouch}
      onPointerLeave={releaseTouch}
      style={{ touchAction: 'none' }}
      className="absolute bottom-6 left-6 z-20 h-28 w-28 select-none rounded-full border-2 border-cyan-300/40 bg-slate-950/60 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md"
    >
      <div
        className="pointer-events-none absolute h-12 w-12 rounded-full bg-cyan-400/70 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
        style={{ left: `calc(50% + ${knob.x}px - 24px)`, top: `calc(50% + ${knob.y}px - 24px)` }}
      />
    </div>
  );
}

interface FireButtonProps {
  onFireStart: () => void;
  onFireEnd: () => void;
}

export function FireButton({ onFireStart, onFireEnd }: FireButtonProps) {
  const activeId = useRef<number | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    activeId.current = event.pointerId;
    (event.target as Element).setPointerCapture(event.pointerId);
    onFireStart();
  };

  const releaseTouch = (event: React.PointerEvent) => {
    if (activeId.current !== event.pointerId) return;
    activeId.current = null;
    onFireEnd();
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={releaseTouch}
      onPointerCancel={releaseTouch}
      onPointerLeave={releaseTouch}
      style={{ touchAction: 'none' }}
      className="absolute bottom-8 right-8 z-20 h-24 w-24 select-none rounded-full border-2 border-fuchsia-400/50 bg-fuchsia-500/30 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_24px_rgba(217,70,239,0.5)] backdrop-blur-md transition active:scale-95"
    >
      Fire
    </button>
  );
}
