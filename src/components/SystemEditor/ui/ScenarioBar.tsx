// Scenario controls: preset loader, load profile selector and chaos injection.

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChaosEvent, ChaosType, LoadProfileType, PRESETS } from '../engine/scenarios';
import { CloudProvider } from '../engine/costModel';

interface Props {
  profileType: LoadProfileType;
  onProfileChange: (t: LoadProfileType) => void;
  onLoadPreset: (id: string) => void;
  nodeOptions: { id: string; label: string }[];
  chaos: ChaosEvent[];
  onAddChaos: (ev: ChaosEvent) => void;
  onRemoveChaos: (id: string) => void;
  provider: CloudProvider;
  onProviderChange: (p: CloudProvider) => void;
  currentTime: number;
}

const PROFILE_VALUES: LoadProfileType[] = ['constant', 'ramp', 'spike', 'diurnal', 'step'];
const CHAOS_VALUES: ChaosType[] = ['killNode', 'latencyInjection', 'partition'];

const selectCls =
  'bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-xs text-tactical-text';

export default function ScenarioBar({
  profileType,
  onProfileChange,
  onLoadPreset,
  nodeOptions,
  chaos,
  onAddChaos,
  onRemoveChaos,
  provider,
  onProviderChange,
  currentTime,
}: Props) {
  const { t } = useTranslation();
  const [presetId, setPresetId] = useState(PRESETS[0]?.id ?? '');
  const [chaosTarget, setChaosTarget] = useState('');
  const [chaosType, setChaosType] = useState<ChaosType>('killNode');

  const addChaos = () => {
    const target = chaosTarget || nodeOptions[0]?.id;
    if (!target) return;
    onAddChaos({
      id: `chaos-${Date.now()}`,
      type: chaosType,
      targetId: target,
      startSec: Math.ceil(currentTime) + 1,
      durationSec: 15,
      magnitude: chaosType === 'latencyInjection' ? 5 : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.scenario.preset')}</div>
          <div className="flex gap-1">
            <select value={presetId} onChange={(e) => setPresetId(e.target.value)} className={selectCls}>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {t(`editor.scenario.presets.${p.id}`, { defaultValue: p.name })}
                </option>
              ))}
            </select>
            <button
              onClick={() => onLoadPreset(presetId)}
              className="border border-signal-cyan text-signal-cyan rounded-md px-3 py-1 font-sans text-xs hover:bg-signal-cyan/10"
            >
              {t('editor.scenario.load')}
            </button>
          </div>
        </div>

        <div>
          <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.scenario.load_profile')}</div>
          <select value={profileType} onChange={(e) => onProfileChange(e.target.value as LoadProfileType)} className={selectCls}>
            {PROFILE_VALUES.map((p) => (
              <option key={p} value={p}>
                {t(`editor.scenario.profiles.${p}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.scenario.cloud')}</div>
          <select value={provider} onChange={(e) => onProviderChange(e.target.value as CloudProvider)} className={selectCls}>
            <option value="aws">AWS</option>
            <option value="gcp">Google Cloud</option>
          </select>
        </div>

        <div>
          <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.scenario.chaos')}</div>
          <div className="flex gap-1">
            <select value={chaosType} onChange={(e) => setChaosType(e.target.value as ChaosType)} className={selectCls}>
              {CHAOS_VALUES.map((c) => (
                <option key={c} value={c}>
                  {t(`editor.scenario.chaos_types.${c}`)}
                </option>
              ))}
            </select>
            <select value={chaosTarget} onChange={(e) => setChaosTarget(e.target.value)} className={selectCls}>
              {nodeOptions.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <button
              onClick={addChaos}
              className="border border-signal-red text-signal-red rounded-md px-3 py-1 font-sans text-xs hover:bg-signal-red/10"
            >
              {t('editor.scenario.inject')}
            </button>
          </div>
        </div>
      </div>

      {chaos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chaos.map((ev) => {
            const label = nodeOptions.find((n) => n.id === ev.targetId)?.label ?? ev.targetId;
            return (
              <span
                key={ev.id}
                className="flex items-center gap-2 border border-signal-red/50 bg-signal-red/10 rounded-full px-2 py-1 font-sans text-[11px] text-signal-red"
              >
                {ev.type} · {label} · t={ev.startSec}s+{ev.durationSec}s
                <button onClick={() => onRemoveChaos(ev.id)} className="hover:text-white">
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
