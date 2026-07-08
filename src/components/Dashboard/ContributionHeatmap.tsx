import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityCalendar, type Activity } from 'react-activity-calendar';
import api from '../../app/utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ActivityDay {
  date: string;
  count: number;
  reads: number;
  quizzes: number;
  solutions: number;
  forum: number;
}

interface ActivityResponse {
  days: number;
  total: number;
  activity: ActivityDay[];
}

const DAYS = 364; // 52 full weeks.

// Flat, tactical color ramps. Level 0 is a quiet neutral; higher levels ramp
// toward the app's success color (emerald in light, signal-green in dark).
const THEME = {
  light: ['#eef2f6', '#a7f3d0', '#6ee7b7', '#34d399', '#059669'],
  dark: ['#1b1b21', '#0e3f2c', '#17694a', '#23a06f', '#34d399'],
};

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// A full zero-filled year so the calendar has stable dimensions before data
// loads (and drives the library's loading skeleton).
function buildEmptySeries(): ActivityDay[] {
  const out: ActivityDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    out.push({ date: toISODate(d), count: 0, reads: 0, quizzes: 0, solutions: 0, forum: 0 });
  }
  return out;
}

function levelFor(count: number, max: number): number {
  if (count <= 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

interface HeatmapProps {
  className?: string;
}

export default function ContributionHeatmap({ className }: HeatmapProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [days, setDays] = useState<ActivityDay[]>(buildEmptySeries);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    api
      .get(`/api/user/activity?days=${DAYS}`)
      .then((res) => {
        if (!active) return;
        const payload = res.data as ActivityResponse;
        if (Array.isArray(payload.activity) && payload.activity.length) setDays(payload.activity);
        setTotal(payload.total ?? 0);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const maxCount = useMemo(() => days.reduce((m, d) => (d.count > m ? d.count : m), 0), [days]);

  const calendarData = useMemo<Activity[]>(
    () => days.map((d) => ({ date: d.date, count: d.count, level: levelFor(d.count, maxCount) })),
    [days, maxCount],
  );

  // Streaks + best day — the dashboard rewards density, so surface the numbers.
  const stats = useMemo(() => {
    let longest = 0;
    let run = 0;
    for (const d of days) {
      if (d.count > 0) {
        run += 1;
        if (run > longest) longest = run;
      } else run = 0;
    }
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current += 1;
      else break;
    }
    return { current, longest, best: maxCount };
  }, [days, maxCount]);

  // Localized labels for the library.
  const labels = useMemo(() => {
    const monthFmt = new Intl.DateTimeFormat(i18n.language, { month: 'short' });
    const wdFmt = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
    const months = Array.from({ length: 12 }, (_, m) =>
      monthFmt.format(new Date(2021, m, 1)).replace(/\.$/, ''),
    );
    // Library expects weekdays as Sun..Sat.
    const weekdays = Array.from({ length: 7 }, (_, i) =>
      wdFmt.format(new Date(2021, 7, 1 + i)).replace(/\.$/, ''),
    );
    return {
      months,
      weekdays,
      legend: { less: t('heatmap.less'), more: t('heatmap.more') },
    };
  }, [i18n.language, t]);

  const dayFmt = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { weekday: 'short', month: 'short', day: 'numeric' }),
    [i18n.language],
  );

  function tooltipText(activity: Activity): string {
    const when = dayFmt.format(new Date(`${activity.date}T00:00:00`));
    const d = byDate.get(activity.date);
    if (!d || d.count === 0) return `${when} — ${t('heatmap.no_activity')}`;
    const parts: string[] = [];
    if (d.reads) parts.push(t('heatmap.parts.reads', { count: d.reads }));
    if (d.quizzes) parts.push(t('heatmap.parts.quizzes', { count: d.quizzes }));
    if (d.solutions) parts.push(t('heatmap.parts.solutions', { count: d.solutions }));
    if (d.forum) parts.push(t('heatmap.parts.forum', { count: d.forum }));
    return `${when} — ${parts.join(' · ')}`;
  }

  const microLabel = 'text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-tactical-label';

  if (!user) {
    return (
      <p className={`py-6 text-center font-sans text-sm text-slate-500 dark:text-tactical-dim ${className ?? ''}`}>
        {t('heatmap.signed_out')}
      </p>
    );
  }

  const statItems = [
    { value: stats.current, label: t('heatmap.stat_current_streak'), unit: t('heatmap.unit_days', { count: stats.current }) },
    { value: stats.longest, label: t('heatmap.stat_longest_streak'), unit: t('heatmap.unit_days', { count: stats.longest }) },
    { value: stats.best, label: t('heatmap.stat_best_day'), unit: t('heatmap.unit_actions', { count: stats.best }) },
  ];

  return (
    <div className={`flex flex-col gap-5 lg:flex-row lg:items-stretch ${className ?? ''}`}>
      <div className="min-w-0 flex-1">
        <p className="mb-3 font-sans text-sm text-slate-600 dark:text-tactical-dim">
          <span className="font-semibold tabular-nums text-slate-900 dark:text-tactical-text">{total}</span>{' '}
          {t('heatmap.summary_suffix')}
        </p>

        <div className="overflow-x-auto pb-1 text-slate-500 dark:text-tactical-dim">
          <ActivityCalendar
            data={calendarData}
            loading={loading}
            theme={THEME}
            colorScheme={theme}
            labels={labels}
            blockSize={12}
            blockMargin={3}
            blockRadius={2}
            fontSize={12}
            showWeekdayLabels={['mon', 'wed', 'fri']}
            showTotalCount={false}
            maxLevel={4}
            tooltips={{ activity: { text: tooltipText } }}
          />
        </div>

        {!loading && total === 0 && (
          <p className="mt-3 font-sans text-xs text-slate-500 dark:text-tactical-dim">
            {t('heatmap.empty_hint')}
          </p>
        )}
      </div>

      <dl className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 dark:border-tactical-border lg:w-44 lg:grid-cols-1 lg:gap-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1">
        {statItems.map((s) => (
          <div key={s.label}>
            <dd className="flex items-baseline gap-1">
              <span className="font-sans text-2xl font-bold leading-none tabular-nums text-slate-900 dark:text-tactical-text">
                {s.value}
              </span>
              <span className="font-sans text-xs text-slate-400 dark:text-tactical-label">{s.unit}</span>
            </dd>
            <dt className={`mt-1.5 ${microLabel}`}>{s.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
