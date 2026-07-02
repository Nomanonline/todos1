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
      className="absolute bottom-4 left-4 z-20 h-16 w-16 select-none rounded-full border-2 border-cyan-300/40 bg-slate-950/50 shadow-[0_0_14px_rgba(34,211,238,0.15)] backdrop-blur-md sm:h-20 sm:w-20"
    >
      <div
        className="pointer-events-none absolute h-7 w-7 rounded-full bg-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.8)] sm:h-9 sm:w-9"
        style={{ left: `calc(50% + ${knob.x}px - 14px)`, top: `calc(50% + ${knob.y}px - 14px)` }}
      />
    </div>
  );
}

interface FireStickProps {
  onAim: (x: number, y: number) => void;
  onFireStart: () => void;
  onFireEnd: () => void;
}

export function FireStick({ onAim, onFireStart, onFireEnd }: FireStickProps) {
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
    // Ignore tiny movements near the center so the last aim direction is kept steady.
    if (dist > radius * 0.2) {
      onAim(dx / radius, dy / radius);
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    activeId.current = event.pointerId;
    (event.target as Element).setPointerCapture(event.pointerId);
    updateFromPoint(event.clientX, event.clientY);
    onFireStart();
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (activeId.current !== event.pointerId) return;
    updateFromPoint(event.clientX, event.clientY);
  };

  const releaseTouch = (event: React.PointerEvent) => {
    if (activeId.current !== event.pointerId) return;
    activeId.current = null;
    setKnob({ x: 0, y: 0 });
    onFireEnd();
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
      className="absolute bottom-4 right-4 z-20 h-16 w-16 select-none rounded-full border-2 border-fuchsia-400/50 bg-fuchsia-500/20 shadow-[0_0_14px_rgba(217,70,239,0.35)] backdrop-blur-md sm:h-20 sm:w-20"
    >
      <div
        className="pointer-events-none absolute h-7 w-7 rounded-full bg-fuchsia-400/80 shadow-[0_0_12px_rgba(217,70,239,0.8)] sm:h-9 sm:w-9"
        style={{ left: `calc(50% + ${knob.x}px - 14px)`, top: `calc(50% + ${knob.y}px - 14px)` }}
      />
    </div>
  );
}
