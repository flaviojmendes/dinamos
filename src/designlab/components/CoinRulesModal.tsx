import { X, Coins, MessageSquare, ThumbsUp, MessageCircle, Star, Clock } from 'lucide-react';
import { TacticalButton } from './tactical';

interface CoinRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const coinAmountClass =
  'font-sans text-xs font-bold text-signal-amber border border-signal-amber/40 bg-signal-amber/10 px-2 py-1 rounded-full';

export default function CoinRulesModal({ isOpen, onClose }: CoinRulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="tactical-panel w-full max-w-2xl card-shadow max-h-[90vh] overflow-y-auto bg-white dark:bg-tactical-surface">
        <div className="p-6 border-b border-slate-200 dark:border-tactical-border flex justify-between items-center sticky top-0 bg-white dark:bg-tactical-surface z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-signal-amber/40 bg-signal-amber/10">
              <Coins className="h-6 w-6 text-signal-amber" />
            </div>
            <div>
              <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text">
                DinaCoins
              </h2>
              <p className="text-sm text-slate-600 dark:text-tactical-dim mt-0.5">
                Ganhe moedas contribuindo com a comunidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text transition-colors p-2 hover:bg-slate-100 dark:hover:bg-tactical-raised"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="tactical-panel p-4 bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border">
            <p className="text-slate-700 dark:text-tactical-dim leading-relaxed">
              Os <span className="font-sans text-signal-amber font-bold">DinaCoins</span> são a moeda da nossa comunidade, projetada para recompensar contribuições de alta qualidade, criação de conteúdo e engajamento construtivo.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0 font-sans text-lg font-bold text-slate-900 dark:text-tactical-text mb-4 pl-2">
              <Coins className="h-5 w-5 text-signal-amber" />
              Como ganhar moedas
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="tactical-panel p-4 hover:border-signal-amber/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className={coinAmountClass}>+5 moedas</span>
                </div>
                <h4 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">Criar tópico</h4>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">Ao criar um novo tópico de discussão.</p>
                <p className="text-xs text-slate-500 dark:text-tactical-label mt-2">Uma vez por post.</p>
              </div>

              <div className="tactical-panel p-4 hover:border-signal-amber/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-signal-green/40 bg-signal-green/10 text-signal-green">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className={coinAmountClass}>+2 moedas</span>
                </div>
                <h4 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">Responder tópico</h4>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">Ao comentar em uma discussão.</p>
                <p className="text-xs text-slate-500 dark:text-tactical-label mt-2">Uma vez por resposta.</p>
              </div>

              <div className="tactical-panel p-4 hover:border-signal-amber/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan">
                    <ThumbsUp className="h-5 w-5" />
                  </div>
                  <span className={coinAmountClass}>+3 moedas</span>
                </div>
                <h4 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">Upvote no tópico</h4>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">Quando seu tópico recebe um voto.</p>
                <p className="text-xs text-slate-500 dark:text-tactical-label mt-2">Max: 50 votos/dia.</p>
              </div>

              <div className="tactical-panel p-4 hover:border-signal-amber/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan">
                    <ThumbsUp className="h-5 w-5" />
                  </div>
                  <span className={coinAmountClass}>+1 moeda</span>
                </div>
                <h4 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">Upvote no comentário</h4>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">Quando seu comentário recebe um voto.</p>
                <p className="text-xs text-slate-500 dark:text-tactical-label mt-2">Max: 30 votos/dia.</p>
              </div>

              <div className="tactical-panel p-4 hover:border-signal-amber/40 transition-colors col-span-full sm:col-span-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-brand-500/40 bg-brand-500/10 text-brand-600 dark:text-signal-cyan">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className={coinAmountClass}>+2 moedas</span>
                </div>
                <h4 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text mb-1">Receber resposta</h4>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">Quando alguém responde ao seu tópico.</p>
                <p className="text-xs text-slate-500 dark:text-tactical-label mt-2">Max: 100 respostas/dia.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0 font-sans text-lg font-bold text-slate-900 dark:text-tactical-text mb-4 pl-2">
              <Star className="h-5 w-5 text-signal-amber" />
              Bônus e regras
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 tactical-panel">
                <div className="p-2 border border-signal-amber/40 bg-signal-amber/10 h-fit">
                  <Star className="h-5 w-5 text-signal-amber" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-tactical-text flex items-center gap-2 flex-wrap">
                    Bônus de conteúdo de alta qualidade
                    <span className="font-sans text-xs text-signal-amber border border-signal-amber/40 bg-signal-amber/10 px-2 py-0.5 rounded-full">+20 moedas</span>
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-tactical-dim mt-1">
                    Se o seu tópico receber <strong className="text-slate-900 dark:text-tactical-text">10 upvotes</strong> dentro de <strong className="text-slate-900 dark:text-tactical-text">24 horas</strong> após a publicação, você ganha um bônus único.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 tactical-panel">
                <div className="p-2 border border-signal-red/40 bg-signal-red/10 h-fit">
                  <Clock className="h-5 w-5 text-signal-red" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-slate-900 dark:text-tactical-text">Decaimento por inatividade</h4>
                  <p className="text-sm text-slate-600 dark:text-tactical-dim mt-1">
                    Tokens só são ganhos em interações (votos/respostas) em postagens com menos de <strong className="text-slate-900 dark:text-tactical-text">90 dias</strong>. Isso incentiva a criação de novos conteúdos e discussões ativas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-tactical-border bg-white dark:bg-tactical-surface sticky bottom-0">
          <TacticalButton variant="secondary" className="w-full" onClick={onClose}>
            Entendi
          </TacticalButton>
        </div>
      </div>
    </div>
  );
}
