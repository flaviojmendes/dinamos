import React from 'react';
import { Link } from 'react-router-dom';

export default function Authorization() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Autorização em Sistemas Distribuídos
          </h1>
          <p className="text-lg text-zinc-400">
            Controle de acesso, permissões e políticas de segurança em ambientes distribuídos
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-green-400">
                A autorização é o processo que determina o que um usuário autenticado pode fazer no sistema.
                Em sistemas distribuídos, implementar uma estratégia eficaz de autorização é essencial para 
                garantir a segurança e o controle granular de acesso aos recursos.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Conceitos Fundamentais */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Conceitos Fundamentais</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Autorização</h3>
                  <p className="text-zinc-400">
                    Processo de verificar se um usuário tem permissão para acessar um recurso 
                    ou realizar uma ação específica no sistema.
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Permissões</h3>
                  <p className="text-zinc-400">
                    Direitos específicos concedidos a usuários ou grupos para realizar 
                    operações em recursos do sistema.
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Políticas</h3>
                  <p className="text-zinc-400">
                    Regras e condições que definem como as decisões de autorização 
                    são tomadas no sistema.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Modelos de Controle de Acesso */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Modelos de Controle de Acesso</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Role-Based Access Control (RBAC)</h3>
                  <p className="text-zinc-300 mb-4">
                    Controle de acesso baseado em papéis, onde as permissões são associadas a funções 
                    e os usuários são atribuídos a essas funções.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Componentes do RBAC</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>Usuários: Entidades que precisam acessar recursos</li>
                      <li>Papéis: Conjuntos de permissões agrupadas</li>
                      <li>Permissões: Direitos de acesso a recursos</li>
                      <li>Sessões: Ativação de papéis para usuários</li>
                    </ul>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Attribute-Based Access Control (ABAC)</h3>
                  <p className="text-zinc-300 mb-4">
                    Modelo que utiliza atributos de usuários, recursos e ambiente para tomar 
                    decisões de autorização dinâmicas.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Atributos Considerados</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>Atributos do usuário (cargo, departamento, nível)</li>
                      <li>Atributos do recurso (tipo, sensibilidade, proprietário)</li>
                      <li>Atributos do ambiente (hora, localização, dispositivo)</li>
                      <li>Atributos da ação (leitura, escrita, exclusão)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Policy-Based Access Control (PBAC)</h3>
                  <p className="text-zinc-300 mb-4">
                    Controle de acesso baseado em políticas que combinam diferentes aspectos 
                    de RBAC e ABAC com regras de negócio complexas.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Características</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>Políticas centralizadas e reutilizáveis</li>
                      <li>Regras baseadas em condições</li>
                      <li>Suporte a hierarquias complexas</li>
                      <li>Auditoria e compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação em Sistemas Distribuídos */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Implementação em Sistemas Distribuídos</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Arquitetura</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Serviço centralizado de autorização</li>
                      <li>• Cache distribuído de políticas</li>
                      <li>• Propagação de atualizações</li>
                      <li>• Validação em múltiplas camadas</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Desafios</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Latência nas decisões de autorização</li>
                      <li>• Consistência entre serviços</li>
                      <li>• Escalabilidade do sistema</li>
                      <li>• Manutenção de políticas</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-3">Boas Práticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-yellow-300 mb-2">Design</h4>
                      <ul className="text-zinc-400 space-y-2">
                        <li>• Princípio do menor privilégio</li>
                        <li>• Separação de responsabilidades</li>
                        <li>• Granularidade adequada</li>
                        <li>• Auditoria completa</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-yellow-300 mb-2">Implementação</h4>
                      <ul className="text-zinc-400 space-y-2">
                        <li>• Cache inteligente</li>
                        <li>• Decisões em camadas</li>
                        <li>• Monitoramento contínuo</li>
                        <li>• Atualizações atômicas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ferramentas e Tecnologias */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Ferramentas e Tecnologias</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Frameworks</h3>
                  <ul className="text-zinc-400 space-y-2">
                    <li>• OAuth 2.0 e OpenID Connect</li>
                    <li>• Keycloak</li>
                    <li>• Spring Security</li>
                    <li>• IdentityServer</li>
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Protocolos</h3>
                  <ul className="text-zinc-400 space-y-2">
                    <li>• XACML</li>
                    <li>• SAML</li>
                    <li>• UMA 2.0</li>
                    <li>• SCIM</li>
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Serviços</h3>
                  <ul className="text-zinc-400 space-y-2">
                    <li>• AWS IAM</li>
                    <li>• Azure AD</li>
                    <li>• Google Cloud IAM</li>
                    <li>• Auth0</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 