import React from 'react';
import { Link } from 'react-router-dom';
import AttackSimulator from './AttackSimulator';

export default function AttackSimulatorPage() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            to="/seguranca/ataques"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Ataques
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simulador de Ataques
          </h1>
          <p className="text-lg text-zinc-400">
            Explore de forma interativa como diferentes tipos de ataques funcionam em sistemas distribuídos.
            Este simulador demonstra visualmente o comportamento e impacto dos ataques DDoS e Man-in-the-Middle.
          </p>
        </div>

        {/* Simulator */}
        <AttackSimulator />

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Como Usar o Simulador</h2>
            <ul className="space-y-3 text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium">1</span>
                <span>Selecione o tipo de ataque que deseja simular (DDoS ou Man-in-the-Middle)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium">2</span>
                <span>Ajuste a velocidade da simulação conforme necessário</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium">3</span>
                <span>Clique em "Iniciar Simulação" para começar a visualização</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-white font-medium">4</span>
                <span>Observe o comportamento dos pacotes e o impacto no servidor</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Elementos do Simulador</h2>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Clientes legítimos tentando acessar o serviço</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <span>Servidor processando as requisições</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span>Atacantes gerando tráfego malicioso</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <span>Pacotes legítimos (verde) e maliciosos (vermelho)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 