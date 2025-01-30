import React from 'react';
import { Link } from 'react-router-dom';

export default function Authentication() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Autenticação em Sistemas Distribuídos
          </h1>
          <p className="text-lg text-zinc-400">
            Entenda os conceitos, desafios e soluções para autenticação em sistemas distribuídos modernos
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-blue-400">
                A autenticação é um dos pilares fundamentais da segurança em sistemas distribuídos. 
                Em um ambiente onde múltiplos serviços precisam se comunicar e verificar a identidade dos usuários, 
                implementar uma estratégia robusta de autenticação é crucial.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Conceitos Básicos */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Conceitos Básicos</h2>
            <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
              <p className="text-zinc-300">
                A autenticação é o processo de verificar se alguém ou algo é quem ou o que diz ser. 
                Em sistemas distribuídos, este processo envolve vários componentes e desafios únicos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Identificação</h3>
                  <p className="text-zinc-400">
                    O processo de um usuário declarar sua identidade ao sistema, 
                    geralmente através de um identificador único como nome de usuário ou email.
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Verificação</h3>
                  <p className="text-zinc-400">
                    O processo de validar a identidade declarada, geralmente através de 
                    credenciais como senha, token ou certificado digital.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Métodos de Autenticação */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Métodos de Autenticação</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Autenticação Baseada em Senha</h3>
                  <p className="text-zinc-300 mb-4">
                    O método mais comum de autenticação, onde o usuário fornece uma combinação de 
                    identificador e senha.
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>Armazenamento seguro com hashing e salt</li>
                    <li>Políticas de complexidade de senha</li>
                    <li>Proteção contra ataques de força bruta</li>
                    <li>Recuperação e reset de senha</li>
                  </ul>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Autenticação Baseada em Token</h3>
                  <p className="text-zinc-300 mb-4">
                    Método stateless que utiliza tokens para manter o estado de autenticação.
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>JSON Web Tokens (JWT)</li>
                    <li>Tokens de acesso e refresh</li>
                    <li>Gerenciamento de sessão</li>
                    <li>Revogação de tokens</li>
                  </ul>
                  <div className="mt-4">
                    <Link 
                      to="/seguranca/tokens"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      Saiba mais sobre Tokens e JWT
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">OAuth 2.0 e OpenID Connect</h3>
                  <p className="text-zinc-300 mb-4">
                    Protocolos padrão para autorização e autenticação em sistemas distribuídos.
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>Fluxos de autorização</li>
                    <li>Single Sign-On (SSO)</li>
                    <li>Delegação de acesso</li>
                    <li>Identity Providers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Multi-Factor Authentication (MFA)</h3>
                  <p className="text-zinc-300 mb-4">
                    Adiciona camadas extras de segurança além da senha.
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>Códigos de verificação por SMS ou email</li>
                    <li>Aplicativos autenticadores (TOTP)</li>
                    <li>Chaves de segurança física (FIDO2/WebAuthn)</li>
                    <li>Biometria</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Desafios e Boas Práticas */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Desafios e Boas Práticas</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">Desafios</h3>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>Escalabilidade do sistema de autenticação</li>
                    <li>Gerenciamento de sessões distribuídas</li>
                    <li>Proteção contra ataques comuns</li>
                    <li>Latência em verificações distribuídas</li>
                    <li>Consistência entre múltiplos serviços</li>
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Boas Práticas</h3>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    <li>Usar HTTPS para todas as comunicações</li>
                    <li>Implementar rate limiting</li>
                    <li>Logging e monitoramento de tentativas</li>
                    <li>Rotação regular de chaves e tokens</li>
                    <li>Validação e sanitização de inputs</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Implementação</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-300">
                  A implementação de um sistema de autenticação em um ambiente distribuído 
                  requer cuidadoso planejamento e consideração de vários aspectos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Arquitetura</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Serviço centralizado de autenticação</li>
                      <li>• API Gateway para validação</li>
                      <li>• Cache distribuído</li>
                      <li>• Banco de dados de usuários</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Segurança</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Criptografia em trânsito</li>
                      <li>• Proteção contra CSRF</li>
                      <li>• Headers de segurança</li>
                      <li>• Auditoria de acessos</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Experiência</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• UX de autenticação</li>
                      <li>• Feedback de erros</li>
                      <li>• Recuperação de acesso</li>
                      <li>• Perfil e preferências</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 