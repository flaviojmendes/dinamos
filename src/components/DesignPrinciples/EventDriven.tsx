import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventDriven() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Desenvolvimento Orientado a Eventos
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          O desenvolvimento orientado a eventos é uma abordagem em que as ações e mudanças no sistema 
          são desencadeadas e gerenciadas por eventos. Um evento é qualquer ação significativa que 
          ocorra no sistema, como uma transação de compra ou a atualização de um banco de dados.
        </p>

        <div className="space-y-12">
          {/* Event Sourcing Section */}
          <section>
            <h2 className="text-3xl font-bold text-blue-300 mb-6">
              Event Sourcing
            </h2>
            
            <p className="text-zinc-300 mb-6">
              O event sourcing é um padrão de design em que o estado de um sistema é derivado de uma 
              sequência de eventos, em vez de um estado atual armazenado. Cada mudança de estado é 
              capturada como um evento imutável, e o sistema pode ser reconstruído a qualquer momento 
              ao reproduzir esses eventos.
            </p>

            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Vantagens</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                <li>Histórico completo de mudanças no sistema</li>
                <li>Fácil de auditar e rastrear ações</li>
                <li>Suporte para reverter ou "replays" de eventos</li>
              </ul>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Exemplo</h3>
              <p className="text-zinc-300">
                Um sistema de e-commerce em que cada atualização do estado de um pedido 
                (pedido realizado, processado, enviado) é registrado como um evento. O estado 
                final do pedido é determinado pela sequência de eventos.
              </p>
            </div>
          </section>

          {/* Distributed Event Systems Section */}
          <section>
            <h2 className="text-3xl font-bold text-blue-300 mb-6">
              Sistemas de Eventos Distribuídos
            </h2>
            
            <p className="text-zinc-300 mb-6">
              Sistemas de eventos distribuídos permitem que diferentes partes de um sistema 
              (frequentemente em diferentes servidores) se comuniquem e sincronizem com base em eventos. 
              Eles são fundamentais para sistemas assíncronos, onde diferentes componentes podem reagir 
              a eventos de maneira descentralizada.
            </p>

            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Ferramentas Populares</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                <li>Apache Kafka</li>
                <li>RabbitMQ</li>
                <li>Amazon SNS</li>
              </ul>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">Exemplo</h3>
              <p className="text-zinc-300">
                Uma aplicação de pagamento que publica eventos de confirmação de pagamento, os quais 
                são consumidos por diferentes serviços para atualizar inventário, notificar o usuário 
                e gerar faturas.
              </p>
            </div>
          </section>

          {/* Simulator Link */}
          <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">
              Simulador Interativo
            </h2>
            <p className="text-zinc-300 mb-4">
              Experimente nossa simulação interativa de Event Sourcing para entender melhor como 
              os eventos são registrados e processados em um sistema distribuído.
            </p>
            <button 
              onClick={() => navigate('/principios-design/eventos/simulator')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Acessar Simulador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 