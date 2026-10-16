import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

export const simulationEase = [0.22, 1, 0.36, 1] as const;

/** One timing vocabulary for the simulators, with a static accessible mode. */
export function useSimulationMotion() {
  const reducedMotion = !!useReducedMotion();
  return {
    reducedMotion,
    transition: { duration: reducedMotion ? 0 : 0.22, ease: simulationEase },
    duration: (seconds: number) => reducedMotion ? 0 : seconds,
  };
}

/** Activity reflects the simulation's actual state, never an idle decoration. */
export function SimulationActivity({ active, label, className = '' }: {
  active: boolean;
  label?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <span className={`sim-activity ${className}`} data-active={active}>
      <span className="sim-activity-bars" aria-hidden="true"><i /><i /><i /></span>
      <span>{label ?? t(active ? 'simulators.motion.running' : 'simulators.motion.ready')}</span>
    </span>
  );
}

/** A full-length connection. An event key plays once; streams run while active. */
export function FlowLink({ active, direction = 'horizontal', tone = 'cyan', count = 2, eventKey, className = '' }: {
  active: boolean;
  direction?: 'horizontal' | 'vertical';
  tone?: 'green' | 'cyan' | 'amber' | 'red' | 'pink';
  count?: number;
  eventKey?: string | number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [events, setEvents] = useState<{ id: number; started: number }[]>([]);
  const sequence = useRef(0);
  const lastDeparture = useRef(-Infinity);
  const packetCount = Math.min(3, Math.max(1, count));
  useEffect(() => {
    if (!active || eventKey === undefined || reducedMotion) {
      setEvents(previous => previous.length ? [] : previous);
      lastDeparture.current = -Infinity;
      return;
    }
    const now = performance.now();
    // Sample busy streams without cancelling packets already in flight.
    if (now - lastDeparture.current < 220) return;
    lastDeparture.current = now;
    const id = ++sequence.current;
    setEvents(previous => [...previous.filter(event => now - event.started < 1500), { id, started: now }].slice(-7));
  }, [active, eventKey, reducedMotion]);
  const flights = eventKey === undefined || reducedMotion ? [{ id: 0, started: 0 }] : events;
  return (
    <span className={`sim-flow sim-flow-${direction} ${className}`} data-active={active} data-tone={tone} data-mode={eventKey === undefined ? 'stream' : 'event'} aria-hidden="true">
      {flights.flatMap(event => Array.from({ length: packetCount }, (_, i) => (
        <span key={`${event.id}-${i}`} className="sim-flow-carrier" style={{ '--flow-delay': `${i * 0.23}s` } as CSSProperties}
          onAnimationEnd={eventKey !== undefined && !reducedMotion && i === packetCount - 1 ? () => setEvents(previous => previous.filter(item => item.id !== event.id)) : undefined}><i /></span>
      )))}
    </span>
  );
}
