import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Panel } from '../tactical';

export default function HighAvailability() {
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="label-mono text-signal-cyan mb-2">
          [ Alta Disponibilidade ]
        </div>
        <p className="font-mono text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          A alta disponibilidade garante que o sistema esteja acessível quase o tempo todo, 
          minimizando o tempo de inatividade, mesmo em face de falhas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Panel title="Zonas de Disponibilidade" accent="cyan">
            <Link 
              to="/principios-design/alta-disponibilidade/zonas"
              className="block hover:bg-slate-50 dark:hover:bg-tactical-raised transition-colors p-2 -m-2"
            >
              <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim mb-4">
                Datacenters separados fisicamente, mas interconectados, dentro de uma mesma região 
                geográfica. Projetados para oferecer redundância e tolerância a falhas locais.
              </p>
              <div className="tactical-panel border-l-2 border-l-signal-cyan p-4 mb-4">
                <h3 className="label-mono text-signal-cyan mb-2">Exemplo:</h3>
                <p className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
                  Uma aplicação de streaming de música é implantada em duas zonas de disponibilidade 
                  em Dublin. Se um datacenter sofrer uma queda de energia, a aplicação continua 
                  funcionando normalmente, pois os servidores na outra zona assumem a operação.
                </p>
              </div>
              <div className="font-mono text-xs text-signal-cyan hover:text-signal-green transition-colors">
                Explorar Zonas de Disponibilidade →
              </div>
            </Link>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Panel title="Replicação e Failover" accent="amber">
            <Link 
              to="/principios-design/alta-disponibilidade/replicacao"
              className="block hover:bg-slate-50 dark:hover:bg-tactical-raised transition-colors p-2 -m-2"
            >
              <p className="font-mono text-sm text-slate-600 dark:text-tactical-dim mb-4">
                Estratégias para criar e manter cópias de dados ou serviços em vários locais, 
                garantindo a continuidade do serviço mesmo em caso de falhas.
              </p>
              <div className="tactical-panel border-l-2 border-l-signal-cyan p-4 mb-4">
                <h3 className="label-mono text-signal-cyan mb-2">Exemplo:</h3>
                <p className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
                  Um banco online utiliza dois servidores principais: um em Londres e outro em 
                  Frankfurt. Se o servidor em Londres apresentar uma falha crítica, o sistema 
                  detecta o problema e redireciona automaticamente todas as transações para 
                  Frankfurt.
                </p>
              </div>
              <div className="font-mono text-xs text-signal-cyan hover:text-signal-green transition-colors">
                Explorar Replicação e Failover →
              </div>
            </Link>
          </Panel>
        </motion.div>
      </div>

      <Panel title="Benefícios da Alta Disponibilidade" accent="green">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <h3 className="label-mono text-signal-green mb-2">Continuidade</h3>
            <p className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
              Garante que os serviços permaneçam disponíveis mesmo durante falhas ou 
              manutenções planejadas.
            </p>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <h3 className="label-mono text-signal-green mb-2">Confiabilidade</h3>
            <p className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
              Aumenta a confiança dos usuários ao manter o sistema funcionando de forma 
              consistente e previsível.
            </p>
          </div>
          <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
            <h3 className="label-mono text-signal-green mb-2">Recuperação</h3>
            <p className="font-mono text-xs text-slate-600 dark:text-tactical-dim">
              Permite recuperação rápida e automática de falhas, minimizando o impacto 
              nos usuários finais.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
