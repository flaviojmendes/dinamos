import { useTranslation } from 'react-i18next';
import { Activity, DollarSign, Flame, Layers, ShieldCheck, Timer } from 'lucide-react';
import { normalizeScoring, STREAK_RAMP_SEC, STREAK_MAX_MULTIPLIER } from '../engine/scoring';
import type { GameState, PublicRound } from './types';

/** Pre-match explainer driven by the active scoring config and round weights. */
export default function ScoringExplainer({ state }: { state: GameState }) {
  const { t } = useTranslation();
  const cfg = normalizeScoring(state.scoring_config);
  const rounds: PublicRound[] = state.rounds_public ?? [];
  const hasWeights = rounds.some((r) => r.weight !== 1);

  return (
    <div className="tactical-panel p-4 mb-6">
      <div className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-2">
        {t('editor.game.scoring.title', { defaultValue: 'How scoring works' })}
      </div>
      <p className="font-sans text-[11px] text-tactical-dim mb-3">
        {t('editor.game.scoring.subtitle', {
          defaultValue:
            'Points accrue every simulated second while your architecture stays valid and healthy. Leaderboard totals may be verified by the server after each round.',
        })}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-sans text-xs text-tactical-text">
        <li className="flex items-start gap-2">
          <Activity className="w-3.5 h-3.5 text-signal-green shrink-0 mt-0.5" />
          <span>
            {t('editor.game.scoring.throughput', {
              defaultValue: 'Throughput: +{{w}} pts per req/s served',
              w: cfg.wThroughput,
            })}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-signal-green shrink-0 mt-0.5" />
          <span>
            {t('editor.game.scoring.availability', {
              defaultValue: 'Availability: up to +{{w}}×100 per second when errors stay low',
              w: cfg.wSuccess,
            })}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Timer className="w-3.5 h-3.5 text-signal-amber shrink-0 mt-0.5" />
          <span>
            {t('editor.game.scoring.latency', {
              defaultValue: 'Latency target: p95 under {{ms}} ms (penalty ×{{w}} above target)',
              ms: cfg.latencyTargetMs,
              w: cfg.wLatency,
            })}
          </span>
        </li>
        {cfg.budgetPerHour > 0 && (
          <li className="flex items-start gap-2">
            <DollarSign className="w-3.5 h-3.5 text-signal-red shrink-0 mt-0.5" />
            <span>
              {t('editor.game.scoring.budget', {
                defaultValue: 'Spend budget: ${{budget}}/hr (penalty ×{{w}} when over)',
                budget: cfg.budgetPerHour,
                w: cfg.wCost,
              })}
            </span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <Flame className="w-3.5 h-3.5 text-signal-amber shrink-0 mt-0.5" />
          <span>
            {t('editor.game.scoring.streak', {
              defaultValue:
                'SLO streak: hold errors <1% and p95 under target for {{sec}}s to reach ×{{mult}} on positive points',
              sec: STREAK_RAMP_SEC,
              mult: STREAK_MAX_MULTIPLIER,
            })}
          </span>
        </li>
        {hasWeights && rounds.length > 0 && (
          <li className="flex items-start gap-2 md:col-span-2">
            <Layers className="w-3.5 h-3.5 text-signal-cyan shrink-0 mt-0.5" />
            <span>
              {t('editor.game.scoring.weights', {
                defaultValue: 'Weighted rounds: {{list}}',
                list: rounds
                  .map((r, i) => `R${i + 1}×${r.weight}`)
                  .join(', '),
              })}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
