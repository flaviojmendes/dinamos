// Touch component palette: a tap-to-add grid used inside a BottomSheet on
// phones/tablets where HTML5 drag-and-drop does not work. Tapping a component
// adds a node to the canvas (the editor places it at the viewport centre).

import { useTranslation } from 'react-i18next';
import { NodeKind } from '../engine/types';
import { NODE_CATALOG, PALETTE_ORDER, KIND_DEFAULT_LABEL } from './nodeCatalog';

interface Props {
  onAdd: (kind: NodeKind) => void;
}

export default function MobilePalette({ onAdd }: Props) {
  const { t } = useTranslation();
  return (
    <div className="p-3">
      <p className="font-mono text-[11px] text-tactical-dim mb-3">
        {t('editor.mobile.palette_hint', {
          defaultValue: 'Tap a component to drop it onto the canvas.',
        })}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PALETTE_ORDER.map((kind) => {
          const entry = NODE_CATALOG[kind];
          const Icon = entry.icon;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => onAdd(kind)}
              title={t(`editor.descriptions.${kind}`)}
              className={`min-h-[52px] px-3 py-2 bg-slate-50 dark:bg-tactical-raised active:bg-slate-100 dark:active:bg-tactical-line border-l-2 ${entry.accent} font-mono text-xs text-slate-700 dark:text-tactical-text flex items-center gap-2 text-left transition-colors`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {t(`editor.kinds.${kind}`, { defaultValue: KIND_DEFAULT_LABEL[kind] })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
