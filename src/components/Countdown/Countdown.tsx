import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date('2025-02-11T23:59:59');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      if (difference < 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 text-sm">
      <div className="text-center">
        <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-lg">
          {String(days).padStart(2, '0')}
        </div>
        <div className="text-xs text-zinc-400 mt-1">dias</div>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-lg">
          {String(hours).padStart(2, '0')}
        </div>
        <div className="text-xs text-zinc-400 mt-1">horas</div>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-lg">
          {String(minutes).padStart(2, '0')}
        </div>
        <div className="text-xs text-zinc-400 mt-1">min</div>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 rounded-lg px-3 py-2 font-mono text-lg">
          {String(seconds).padStart(2, '0')}
        </div>
        <div className="text-xs text-zinc-400 mt-1">seg</div>
      </div>
    </div>
  );
} 