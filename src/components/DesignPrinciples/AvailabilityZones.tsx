import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AvailabilityZones() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">Zonas de Disponibilidade</h1>
          <p className="text-lg text-zinc-400">
            Zonas de Disponibilidade são datacenters isolados dentro de uma região geográfica, 
            projetados para fornecer redundância e alta disponibilidade para aplicações críticas.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* How it Works */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Como Funciona</h2>
              <p className="text-zinc-400 mb-4">
                Cada zona de disponibilidade é um datacenter independente com:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 mb-4">
                <li>Energia própria e redundante</li>
                <li>Refrigeração independente</li>
                <li>Infraestrutura de rede dedicada</li>
                <li>Conexões de alta velocidade entre zonas</li>
              </ul>
              <p className="text-zinc-400">
                As zonas são projetadas para serem isoladas de falhas em outras zonas, mas 
                próximas o suficiente para garantir baixa latência na comunicação entre elas.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Benefícios</h2>
              <div className="space-y-4">
                <div className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Isolamento de Falhas</h3>
                  <p className="text-sm text-zinc-400">
                    Problemas em uma zona não afetam as outras, garantindo a continuidade do serviço.
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Alta Disponibilidade</h3>
                  <p className="text-sm text-zinc-400">
                    Distribuição de recursos entre zonas garante que o serviço permaneça disponível 
                    mesmo com a falha de uma zona inteira.
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Baixa Latência</h3>
                  <p className="text-sm text-zinc-400">
                    Conexões de alta velocidade entre zonas permitem sincronização eficiente de dados 
                    e balanceamento de carga.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Real World Example */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Exemplo do Mundo Real</h2>
              <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium mb-2">E-commerce de Grande Porte</h3>
                <p className="text-zinc-400 mb-4">
                  Um e-commerce distribui sua aplicação em três zonas de disponibilidade:
                </p>
                <ul className="list-disc list-inside text-zinc-400 space-y-2">
                  <li>Zona A: Servidor principal de aplicação</li>
                  <li>Zona B: Réplica ativa e banco de dados principal</li>
                  <li>Zona C: Backup e banco de dados secundário</li>
                </ul>
              </div>
              <p className="text-sm text-zinc-400">
                Se a Zona A falhar, o tráfego é automaticamente redirecionado para a Zona B, 
                enquanto a Zona C garante que nenhum dado seja perdido durante a transição.
              </p>
            </div>

            {/* Best Practices */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Melhores Práticas</h2>
              <ul className="space-y-4">
                <li className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Distribuição Inteligente</h3>
                  <p className="text-sm text-zinc-400">
                    Distribua recursos e dados de forma equilibrada entre as zonas para maximizar 
                    a resiliência.
                  </p>
                </li>
                <li className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Monitoramento Constante</h3>
                  <p className="text-sm text-zinc-400">
                    Implemente monitoramento em tempo real para detectar e responder rapidamente 
                    a problemas em qualquer zona.
                  </p>
                </li>
                <li className="bg-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2 text-green-400">Testes Regulares</h3>
                  <p className="text-sm text-zinc-400">
                    Realize testes de failover regularmente para garantir que a transição entre 
                    zonas funcione conforme esperado.
                  </p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Simulator Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Link
            to="/principios-design/alta-disponibilidade/zonas/simulator"
            className="block bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">
              Explorar o Simulador de Zonas de Disponibilidade
            </h2>
            <p className="text-zinc-200">
              Experimente na prática como as zonas de disponibilidade funcionam e como elas 
              respondem a diferentes cenários de falha.
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 