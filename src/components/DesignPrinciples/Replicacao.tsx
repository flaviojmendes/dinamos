import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Replicacao() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">Replicação em Sistemas Distribuídos</h1>
            <p className="text-zinc-400">
              A replicação é uma estratégia fundamental para garantir alta disponibilidade e redundância em sistemas distribuídos.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">O que é Replicação?</h2>
            <p className="text-zinc-300 mb-4">
              Replicação consiste em criar e manter cópias de dados ou serviços em vários locais. 
              Isso aumenta a disponibilidade e a redundância, garantindo que, se um servidor ou sistema falhar, 
              os dados e serviços ainda estejam acessíveis em outro local.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Tipos de Replicação</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Replicação Síncrona</h4>
                  <p className="text-zinc-300 text-sm">
                    Todas as cópias são atualizadas simultaneamente antes de confirmar a operação.
                    Garante consistência forte, mas pode aumentar a latência.
                  </p>
                </div>
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Replicação Assíncrona</h4>
                  <p className="text-zinc-300 text-sm">
                    As atualizações são propagadas com algum atraso. Oferece melhor performance,
                    mas com consistência eventual.
                  </p>
                </div>
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Replicação Semi-síncrona</h4>
                  <p className="text-zinc-300 text-sm">
                    Um meio termo onde algumas réplicas são atualizadas sincronamente e outras
                    assincronamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Benefícios</h3>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Alta disponibilidade e tolerância a falhas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Distribuição geográfica para menor latência</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Balanceamento de carga entre réplicas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Backup e recuperação de desastres</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Escalabilidade de leitura</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Exemplo do Mundo Real</h3>
            <p className="text-zinc-300 mb-4">
              Uma rede social armazena fotos dos usuários em múltiplos servidores ao redor do mundo. 
              Se o servidor que contém uma foto falhar, outra cópia do arquivo pode ser acessada em um 
              servidor replicado, evitando perda de dados e mantendo a disponibilidade do serviço.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Melhores Práticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">1.</span>
                  <p className="text-zinc-300">Escolha o tipo de replicação baseado nos requisitos de consistência</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">2.</span>
                  <p className="text-zinc-300">Monitore o estado e a saúde das réplicas</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">3.</span>
                  <p className="text-zinc-300">Implemente mecanismos de detecção e resolução de conflitos</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">4.</span>
                  <p className="text-zinc-300">Mantenha logs de replicação para auditoria e recuperação</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">5.</span>
                  <p className="text-zinc-300">Teste regularmente os cenários de failover</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">6.</span>
                  <p className="text-zinc-300">Considere a localização geográfica das réplicas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Explorar na Prática</h3>
            <p className="text-zinc-300 mb-4">
              Experimente diferentes estratégias de replicação e veja como elas afetam a consistência e a latência do sistema.
            </p>
            <Link 
              to="/principios-design/escalabilidade/simulator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Abrir Simulador
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 