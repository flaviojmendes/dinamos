// Touch replacement for the right-click context menus. Floats over the bottom
// of the canvas when a node or edge is selected and exposes the same actions as
// the desktop context menu (edit / duplicate / disconnect / kill / delete).

import { Settings2, Copy, Unplug, Zap, Trash2, X, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NodeProps {
  mode: 'node';
  canDelete?: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDisconnect: () => void;
  onKill: () => void;
  onDelete: () => void;
  onClose: () => void;
}

interface EdgeProps {
  mode: 'edge';
  onDelete: () => void;
  onClose: () => void;
}

type Props = NodeProps | EdgeProps;

function Action({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[52px] px-2 font-mono text-[10px] uppercase tracking-wider active:bg-slate-100 dark:active:bg-tactical-line transition-colors ${
        tone ?? 'text-slate-700 dark:text-tactical-text'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

export default function SelectionActionBar(props: Props) {
  const { t } = useTranslation();

  return (
    <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-3 max-w-[calc(100%-1rem)]">
      <div className="flex items-stretch divide-x divide-slate-200 dark:divide-tactical-border bg-white/95 dark:bg-tactical-surface/95 border border-slate-200 dark:border-tactical-border shadow-lg backdrop-blur-sm overflow-x-auto">
        {props.mode === 'node' ? (
          <>
            <Action icon={Settings2} label={t('editor.menu.edit')} onClick={props.onEdit} />
            <Action icon={Copy} label={t('editor.menu.duplicate')} onClick={props.onDuplicate} />
            <Action icon={Unplug} label={t('editor.menu.disconnect')} onClick={props.onDisconnect} />
            <Action icon={Zap} label={t('editor.menu.kill')} tone="text-signal-amber" onClick={props.onKill} />
            {props.canDelete && (
              <Action icon={Trash2} label={t('editor.menu.delete')} tone="text-signal-red" onClick={props.onDelete} />
            )}
          </>
        ) : (
          <Action icon={Trash2} label={t('editor.menu.delete_edge')} tone="text-signal-red" onClick={props.onDelete} />
        )}
        <Action icon={X} label={t('editor.mobile.close', { defaultValue: 'Close' })} onClick={props.onClose} />
      </div>
    </div>
  );
}
