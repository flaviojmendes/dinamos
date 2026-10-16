import { motion } from 'framer-motion';
import { useSimulationMotion } from '../simulation';

/** A packet crosses the entire parent track, rather than moving its own width. */
export default function TransitPacket({
  tone = 'cyan', reverse = false, seconds = 0.55,
}: { tone?: 'cyan' | 'green' | 'amber' | 'red'; reverse?: boolean; seconds?: number }) {
  const { reducedMotion } = useSimulationMotion();
  const end = 'calc(100% - 12px)';
  const color = { cyan: 'text-signal-cyan', green: 'text-signal-green', amber: 'text-signal-amber', red: 'text-signal-red' }[tone];
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={reducedMotion ? false : { x: reverse ? end : 0, opacity: 0 }}
      animate={reducedMotion
        ? { x: reverse ? 0 : end, opacity: 1 }
        : { x: reverse ? 0 : end, opacity: [0, 1, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : seconds, ease: 'linear', times: [0, 0.12, 0.82, 1] }}
    >
      <span className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-sm border border-current bg-current ${color}`} />
    </motion.div>
  );
}
