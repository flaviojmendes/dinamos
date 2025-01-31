import React from "react";
import { Link } from "react-router-dom";

export default function TwoPhaseCommit() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Introdução */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            Two-Phase Commit (2PC)
          </h1>
          <p className="text-lg text-zinc-300 mb-6">
            O Two-Phase Commit (2PC) é um protocolo de consenso distribuído que
            garante que todas as partes de uma transação distribuída sejam
            executadas com sucesso, ou nenhuma delas seja executada. É como uma
            "votação unânime" para decidir se uma operação deve prosseguir.
          </p>
        </section>

        {/* Por que precisamos do 2PC? */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Por que precisamos do Two-Phase Commit?
          </h2>
          <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              O Problema
            </h3>
            <p className="text-zinc-300 mb-4">
              Imagine uma transferência bancária entre contas em diferentes
              bancos:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>O Banco A precisa debitar $100 da conta do cliente</li>
              <li>O Banco B precisa creditar $100 na conta do destinatário</li>
            </ul>
            <p className="text-zinc-300">
              Se um banco executar sua parte mas o outro falhar, teremos
              inconsistência nos dados. O Two-Phase Commit resolve este problema
              garantindo que ambos os bancos executem suas operações ou nenhum
              deles execute.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Como funciona o Two-Phase Commit?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Fase 1: Prepare */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                <span className="text-blue-400">Fase 1:</span> Prepare (Votação)
              </h3>
              <ol className="list-decimal list-inside text-zinc-300 space-y-3">
                <li>
                  O coordenador envia uma mensagem "prepare" para todos os
                  participantes
                </li>
                <li>Cada participante verifica se pode realizar a operação</li>
                <li>
                  Os participantes respondem:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li className="text-green-400">
                      "Sim" se podem garantir a execução
                    </li>
                    <li className="text-red-400">
                      "Não" se não podem garantir
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Fase 2: Commit/Abort */}
            <div className="bg-zinc-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                <span className="text-blue-400">Fase 2:</span> Commit/Abort
                (Decisão)
              </h3>
              <p className="text-zinc-300 mb-4">
                O coordenador toma a decisão final:
              </p>
              <ul className="list-disc list-inside text-zinc-300 space-y-3">
                <li className="text-green-400">
                  <strong>Commit:</strong> Se TODOS votaram "Sim"
                  <p className="ml-6 mt-1 text-zinc-300">
                    → Todos executam a transação
                  </p>
                </li>
                <li className="text-red-400">
                  <strong>Abort:</strong> Se ALGUM votou "Não"
                  <p className="ml-6 mt-1 text-zinc-300">
                    → Ninguém executa a transação
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Características importantes */}
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Características Importantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-3">
                  Vantagens
                </h4>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Garante consistência forte dos dados</li>
                  <li>Previne transações parciais</li>
                  <li>Processo de decisão transparente</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-3">
                  Limitações
                </h4>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>Bloqueante (participantes aguardam decisão)</li>
                  <li>Sensível a falhas do coordenador</li>
                  <li>Maior latência devido às duas fases</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Casos de Uso */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Casos de Uso</h2>
          <div className="bg-zinc-800/50 rounded-lg p-6">
            <ul className="list-disc list-inside text-zinc-300 space-y-4">
              <li>
                <strong className="text-white">Transações Bancárias:</strong>
                <p className="ml-6 mt-1">
                  Transferências entre bancos diferentes, onde é crucial que o
                  dinheiro não "desapareça" nem seja "duplicado".
                </p>
              </li>
              <li>
                <strong className="text-white">E-commerce:</strong>
                <p className="ml-6 mt-1">
                  Processamento de pedidos que envolvem múltiplos sistemas
                  (estoque, pagamento, entrega).
                </p>
              </li>
              <li>
                <strong className="text-white">Sistemas de Reservas:</strong>
                <p className="ml-6 mt-1">
                  Reservas de passagens aéreas que envolvem múltiplas companhias
                  ou serviços.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Link to Simulator */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">
            Experimente na Prática
          </h2>
          <p className="text-zinc-300 mb-4">
            Quer ver como esses protocolos funcionam na prática? Experimente
            nosso simulador interativo!
          </p>
          <Link
            to="simulador"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </Link>
        </div>
      </div>
    </div>
  );
}
