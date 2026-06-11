import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, StatusBadge } from '../tactical';

type Scenario = 'normal' | 'partition';
type PA = 'PA' | 'PC';
type EL = 'EL' | 'EC';

interface SystemPreset {
  id: string;
  pa: PA;
  el: EL;
}

const PRESETS: SystemPreset[] = [
  { id: 'dynamo', pa: 'PA', el: 'EL' },
  { id: 'cassandra', pa: 'PA', el: 'EL' },
  { id: 'mongo', pa: 'PC', el: 'EC' },
  { id: 'pnuts', pa: 'PC', el: 'EL' },
  { id: 'bigtable', pa: 'PC', el: 'EC' },
];

export default function PacelcSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.pacelc';

  const [scenario, setScenario] = useState<Scenario>('normal');
  const [pa, setPa] = useState<PA>('PA');
  const [el, setEl] = useState<EL>('EL');
  const [preset, setPreset] = useState<string | null>('dynamo');

  const applyPreset = (p: SystemPreset) => {
    setPreset(p.id);
    setPa(p.pa);
    setEl(p.el);
  };

  const activeChoice = scenario === 'partition' ? pa : el;
  const favorsAvailability = (scenario === 'partition' && pa === 'PA') || (scenario === 'normal' && el === 'EL');

  return (
    <div className="space-y-6">
      <Panel title={t(`${base}.title`)} accent="cyan">
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono mb-2">{t(`${base}.presets`)}</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <TacticalButton key={p.id} size="sm" variant={preset === p.id ? 'secondary' : 'ghost'} onClick={() => applyPreset(p)}>
                  {t(`${base}.systems.${p.id}`)}
                </TacticalButton>
              ))}
            </div>
          </div>
          <div>
            <div className="label-mono mb-2">{t(`${base}.scenario.label`)}</div>
            <div className="flex gap-1.5">
              {(['normal', 'partition'] as Scenario[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScenario(s)}
                  className={`rounded-md border px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                    scenario === s
                      ? s === 'partition'
                        ? 'border-signal-red/60 bg-signal-red/10 text-signal-red'
                        : 'border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-tactical-border dark:text-tactical-dim'
                  }`}
                >
                  {t(`${base}.scenario.${s}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decision tree root */}
        <div className="flex flex-col items-center">
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 font-mono text-xs text-slate-700 dark:border-tactical-line dark:bg-tactical-raised dark:text-tactical-text">
            {t(`${base}.root`)}
          </div>
          <div className="h-4 w-px bg-slate-300 dark:bg-tactical-line" />
          <div className="flex w-full items-center justify-center">
            <div className="h-px w-1/2 max-w-[14rem] bg-slate-300 dark:bg-tactical-line" />
          </div>
        </div>

        {/* Two branches */}
        <div className="mt-0 grid gap-4 md:grid-cols-2">
          <Branch
            active={scenario === 'partition'}
            tone="red"
            condition={t(`${base}.if_partition`)}
            question={t(`${base}.p_question`)}
            activeLabel={t(`${base}.active_now`)}
            options={(['PA', 'PC'] as PA[]).map((c) => ({
              id: c,
              label: t(`${base}.choices.${c}`),
              selected: pa === c,
            }))}
            onPick={(c) => {
              setScenario('partition');
              setPa(c as PA);
              setPreset(null);
            }}
          />
          <Branch
            active={scenario === 'normal'}
            tone="cyan"
            condition={t(`${base}.else_normal`)}
            question={t(`${base}.e_question`)}
            activeLabel={t(`${base}.active_now`)}
            options={(['EL', 'EC'] as EL[]).map((c) => ({
              id: c,
              label: t(`${base}.choices.${c}`),
              selected: el === c,
            }))}
            onPick={(c) => {
              setScenario('normal');
              setEl(c as EL);
              setPreset(null);
            }}
          />
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
          <div className="mb-2 flex items-center gap-3">
            <span className="label-mono">{t(`${base}.classification`)}</span>
            <StatusBadge variant="online" label={`PACELC ${pa}/${el}`} />
          </div>
          <motion.p
            key={`${scenario}-${activeChoice}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim"
          >
            {t(`${base}.outcomes.${activeChoice}`)}
          </motion.p>
          <div className="mt-3">
            <StatusBadge
              variant={favorsAvailability ? 'pending' : 'classified'}
              label={favorsAvailability ? t(`${base}.favors_latency`) : t(`${base}.favors_consistency`)}
            />
          </div>
        </div>

        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

interface Option {
  id: string;
  label: string;
  selected: boolean;
}

function Branch({
  active,
  tone,
  condition,
  question,
  activeLabel,
  options,
  onPick,
}: {
  active: boolean;
  tone: 'red' | 'cyan';
  condition: string;
  question: string;
  activeLabel: string;
  options: Option[];
  onPick: (id: string) => void;
}) {
  const toneText = tone === 'red' ? 'text-signal-red' : 'text-signal-cyan';
  const activeBorder = tone === 'red' ? 'border-signal-red/60 bg-signal-red/5' : 'border-signal-cyan/60 bg-signal-cyan/5';
  const selectedChip = tone === 'red' ? 'bg-signal-red text-white' : 'bg-signal-cyan text-white';

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.55, scale: active ? 1 : 0.99 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`rounded-lg border p-4 ${active ? activeBorder : 'border-slate-200 dark:border-tactical-border'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className={`label-mono ${toneText}`}>{condition}</div>
        {active && (
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide ${toneText}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tone === 'red' ? 'bg-signal-red' : 'bg-signal-cyan'}`} />
            {activeLabel}
          </span>
        )}
      </div>
      <div className="mt-1 font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">{question}</div>
      <div className="mt-3 flex gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            className={`flex-1 rounded-md px-3 py-2 font-mono text-xs transition-colors ${
              o.selected
                ? selectedChip
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-tactical-border dark:text-tactical-dim dark:hover:bg-tactical-line'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
