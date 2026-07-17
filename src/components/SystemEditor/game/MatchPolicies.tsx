import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, Eye, Shield, Users, Trophy } from 'lucide-react';
import { DEFAULT_MAX_PLAYERS } from '../engine/constants';
import type { GameState } from './types';

/** Documents tie-break, late-join, pause, kick, spectator, and capacity policies. */
export default function MatchPolicies({
  state,
  compact = false,
}: {
  state?: Pick<GameState, 'max_players'> | null;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const maxPlayers = state?.max_players ?? DEFAULT_MAX_PLAYERS;

  const items = [
    {
      icon: Trophy,
      title: t('editor.game.policies.tie.title', { defaultValue: 'Tie-break order' }),
      body: t('editor.game.policies.tie.body', {
        defaultValue:
          'Verified score, then best SLO streak, earliest verified submission, join time, then user ID.',
      }),
    },
    {
      icon: Clock,
      title: t('editor.game.policies.late_join.title', { defaultValue: 'Late join' }),
      body: t('editor.game.policies.late_join.body', {
        defaultValue:
          'Players who join mid-round receive a frozen architecture snapshot and score only from eligible simulation seconds after they joined.',
      }),
    },
    {
      icon: Shield,
      title: t('editor.game.policies.pause.title', { defaultValue: 'Pause & host override' }),
      body: t('editor.game.policies.pause.body', {
        defaultValue:
          'Host pause freezes simulation eligibility and countdowns. Resume extends deadlines by the paused duration. Hosts may start early, extend, or end rounds.',
      }),
    },
    {
      icon: Users,
      title: t('editor.game.policies.kick.title', { defaultValue: 'Kick & rejoin' }),
      body: t('editor.game.policies.kick.body', {
        defaultValue:
          'Removed players cannot rejoin the same match. The host can open or close joins and share invite links for private matches.',
      }),
    },
    {
      icon: Eye,
      title: t('editor.game.policies.spectator.title', { defaultValue: 'Spectators & stage' }),
      body: t('editor.game.policies.spectator.body', {
        defaultValue:
          'Live architectures are hidden from public spectators during rounds. The rotatable stage link shows rankings and countdowns only.',
      }),
    },
    {
      icon: BookOpen,
      title: t('editor.game.policies.capacity.title', { defaultValue: 'Capacity' }),
      body: t('editor.game.policies.capacity.body', {
        defaultValue: 'This match accepts up to {{max}} players. Join is blocked when full.',
        max: maxPlayers,
      }),
    },
  ];

  return (
    <div className={`tactical-panel ${compact ? 'p-3' : 'p-4'} mb-6`}>
      <div className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-2">
        {t('editor.game.policies.title', { defaultValue: 'Match policies' })}
      </div>
      {!compact && (
        <p className="font-sans text-[11px] text-tactical-dim mb-3">
          {t('editor.game.policies.subtitle', {
            defaultValue:
              'Competitive rules enforced by the server. Leaderboard totals use verified recomputation unless an emergency rollback flag is active.',
          })}
        </p>
      )}
      <ul className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-x-6 gap-y-3`}>
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-2 font-sans text-xs text-tactical-text">
            <Icon className="w-3.5 h-3.5 text-signal-cyan shrink-0 mt-0.5" aria-hidden />
            <span>
              <span className="font-medium text-tactical-text">{title}: </span>
              {body}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
