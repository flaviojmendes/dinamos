import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  GameProvider,
  useGameContext,
} from '../components/SystemEditor/game/GameContext';
import GameLobby from '../components/SystemEditor/game/GameLobby';
import SystemEditorV2 from '../components/SystemEditor/SystemEditorV2';

function Spinner({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 dark:border-signal-green border-t-transparent" aria-hidden />
        <span className="font-mono uppercase tracking-wider text-sm text-slate-600 dark:text-tactical-dim">
          {label}
        </span>
      </div>
    </div>
  );
}

function GameEditorContent({ code }: { code: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const game = useGameContext();

  if (!game) return null;

  if (game.notFound) {
    return (
      <div className="max-w-md mx-auto p-10 text-center">
        <AlertTriangle className="w-10 h-10 text-signal-amber mx-auto mb-4" />
        <h1 className="font-mono text-xl font-bold text-tactical-text mb-2">
          {t('editor.game.not_found', { defaultValue: 'Match not found' })}
        </h1>
        <p className="font-mono text-sm text-tactical-dim mb-6">
          {t('editor.game.not_found_hint', {
            defaultValue: 'This match may have ended or the link is incorrect.',
          })}
        </p>
        <Link to="/editor" className="font-mono text-sm text-signal-cyan underline">
          {t('editor.game.go_editor', { defaultValue: 'Go to the editor' })}
        </Link>
      </div>
    );
  }

  if (game.loading && !game.state) {
    return <Spinner label={t('editor.game.loading', { defaultValue: 'Loading match…' })} />;
  }

  if (game.state?.status === 'lobby') {
    return <GameLobby currentUserId={user?.uid} />;
  }

  return <SystemEditorV2 gameId={code} />;
}

export default function GameEditorPage() {
  const { code } = useParams<{ code: string }>();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Spinner label="Loading…" />;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: `/editor/game/${code ?? ''}` }} />;
  }
  if (!code) {
    return <Navigate to="/editor" replace />;
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      <GameProvider code={code}>
        <GameEditorContent code={code} />
      </GameProvider>
    </div>
  );
}
