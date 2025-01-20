import React from 'react';

export default function APIGateway() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          API Gateway
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          Imagine um restaurante movimentado. Você, cliente, faz seu pedido ao garçom (API Gateway). 
          Ele é quem vai garantir que tudo funcione perfeitamente para você, mesmo que a cozinha seja 
          complexa e tenha vários cozinheiros especializados.
        </p>

        <p className="text-xl text-zinc-300 mb-12">
          O API Gateway atua como um intermediário inteligente entre os clientes e os serviços de backend, 
          simplificando o acesso, aumentando a segurança e melhorando o desempenho geral do sistema.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Funções do API Gateway
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Autenticação e Autorização</h3>
            <p className="text-zinc-200">
              É como o segurança na porta do restaurante, que verifica sua identidade e se você tem permissão para entrar. 
              O API Gateway verifica se o usuário está logado e se tem permissão para acessar o recurso solicitado.
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">Exemplo:</p>
              <p className="text-zinc-300">
                Para acessar sua conta bancária online, você precisa inserir seu nome de usuário e senha. 
                O API Gateway garante que somente você, com as credenciais corretas, possa acessar suas informações.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Roteamento</h3>
            <p className="text-zinc-200">
              É o garçom que sabe exatamente para qual cozinheiro (microsserviço) enviar cada pedido. 
              O API Gateway direciona as solicitações para o serviço correto.
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">Exemplo:</p>
              <p className="text-zinc-300">
                Em um aplicativo de e-commerce, o pedido de um produto pode ser roteado para o serviço de estoque, 
                enquanto o pagamento é roteado para o serviço de processamento de pagamentos.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Limitação de Taxa</h3>
            <p className="text-zinc-200">
              É como o restaurante limitar o número de clientes por hora para evitar sobrecarga. 
              O API Gateway limita a quantidade de solicitações que um cliente pode fazer para proteger 
              os serviços de backend de serem sobrecarregados.
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">Exemplo:</p>
              <p className="text-zinc-300">
                Um serviço de API de previsão do tempo pode limitar o número de solicitações por usuário 
                para evitar abusos e garantir que o serviço esteja disponível para todos.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Agregação de Respostas</h3>
            <p className="text-zinc-200">
              É o garçom que organiza todos os pratos do seu pedido em uma única bandeja. 
              O API Gateway combina as respostas de vários serviços em uma única resposta para o cliente.
            </p>
            <div className="mt-4 bg-zinc-800 p-4 rounded">
              <p className="font-medium text-blue-200">Exemplo:</p>
              <p className="text-zinc-300">
                Em um aplicativo de viagens, o API Gateway pode agregar informações de voos, hotéis e 
                aluguel de carros de diferentes provedores em uma única resposta para o usuário.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Exemplo de Arquiteturas Baseadas em Microsserviços
        </h2>

        <p className="text-xl text-zinc-300 mb-6">
          Em uma arquitetura de microsserviços, o API Gateway age como um ponto central para os clientes 
          interagirem com os microsserviços. Ele encaminha as solicitações para os serviços corretos e 
          gerencia a comunicação entre o cliente e os vários componentes do sistema.
        </p>

        <div className="bg-zinc-800 rounded p-4 mt-8">
          <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
          <p className="text-zinc-300">
            Em uma aplicação de e-commerce baseada em microsserviços, o API Gateway lida com solicitações 
            de produtos, carrinhos de compra e transações, redirecionando para os serviços backend 
            relevantes (produto, inventário, pagamento).
          </p>
        </div>
      </div>
    </div>
  );
} 