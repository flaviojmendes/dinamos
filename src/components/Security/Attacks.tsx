import React from 'react';
import { Link } from 'react-router-dom';

export default function Attacks() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Ataques em Sistemas Distribuídos
          </h1>
          <p className="text-lg text-zinc-400 mb-6">
            Compreenda os principais tipos de ataques, seus impactos e estratégias de mitigação
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-red-400">
                Ataques a sistemas distribuídos podem causar sérios danos à infraestrutura,
                comprometer dados sensíveis e resultar em perdas financeiras significativas.
                É crucial entender e implementar medidas de proteção adequadas.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Categorias de Ataques */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Categorias de Ataques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-zinc-900 rounded-lg p-6 border-t-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-400 mb-3">Ataques de Rede</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>• DDoS (Distributed Denial of Service)</li>
                  <li>• Man-in-the-Middle (MITM)</li>
                  <li>• DNS Spoofing</li>
                  <li>• ARP Poisoning</li>
                  <li>• TCP/IP Hijacking</li>
                </ul>
              </div>

              <div className="bg-zinc-900 rounded-lg p-6 border-t-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Ataques de Aplicação</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>• SQL Injection</li>
                  <li>• Cross-Site Scripting (XSS)</li>
                  <li>• CSRF (Cross-Site Request Forgery)</li>
                  <li>• Command Injection</li>
                  <li>• File Inclusion</li>
                </ul>
              </div>

              <div className="bg-zinc-900 rounded-lg p-6 border-t-4 border-blue-500">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Ataques de Autenticação</h3>
                <ul className="space-y-2 text-zinc-400">
                  <li>• Brute Force</li>
                  <li>• Dictionary Attacks</li>
                  <li>• Session Hijacking</li>
                  <li>• Credential Stuffing</li>
                  <li>• Password Spraying</li>
                </ul>
              </div>
            </div>
          </section>

          {/* DDoS Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Ataques DDoS</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-400">
                  Ataques de Negação de Serviço Distribuído (DDoS) visam tornar recursos ou serviços
                  indisponíveis para usuários legítimos sobrecarregando os sistemas com tráfego malicioso.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Tipos Comuns</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        <span className="text-emerald-400 font-medium">Volumétrico</span>
                        <p className="mt-1">Inunda a rede com grande volume de tráfego</p>
                      </li>
                      <li>
                        <span className="text-emerald-400 font-medium">Protocolo</span>
                        <p className="mt-1">Explora vulnerabilidades em protocolos de rede</p>
                      </li>
                      <li>
                        <span className="text-emerald-400 font-medium">Aplicação</span>
                        <p className="mt-1">Ataca camada de aplicação com requisições maliciosas</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Mitigação</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• Firewalls e WAFs</li>
                      <li>• Rate Limiting</li>
                      <li>• Load Balancing</li>
                      <li>• Traffic Analysis</li>
                      <li>• CDN Protection</li>
                      <li>• Blackholing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Man-in-the-Middle */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Ataques Man-in-the-Middle</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Como Funciona</h3>
                    <p className="text-zinc-400 mb-4">
                      O atacante se posiciona entre duas partes que se comunicam, interceptando
                      e potencialmente modificando a comunicação sem que as partes percebam.
                    </p>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• Interceptação de tráfego</li>
                      <li>• Modificação de dados</li>
                      <li>• Roubo de informações</li>
                      <li>• Falsificação de identidade</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Prevenção</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• Uso de TLS/SSL</li>
                      <li>• Certificate Pinning</li>
                      <li>• VPNs</li>
                      <li>• Mutual Authentication</li>
                      <li>• HSTS</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Injection Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Ataques de Injeção</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">SQL Injection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Vulnerabilidade</h4>
                      <p className="text-zinc-400">
                        Inserção de código SQL malicioso em entradas de dados para manipular
                        ou extrair informações do banco de dados.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Prevenção</h4>
                      <ul className="space-y-1 text-zinc-400">
                        <li>• Prepared Statements</li>
                        <li>• Input Validation</li>
                        <li>• Escaping</li>
                        <li>• Least Privilege</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">Cross-Site Scripting (XSS)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Vulnerabilidade</h4>
                      <p className="text-zinc-400">
                        Injeção de scripts maliciosos em páginas web visualizadas por outros usuários,
                        permitindo roubo de sessões e manipulação do conteúdo.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Prevenção</h4>
                      <ul className="space-y-1 text-zinc-400">
                        <li>• Input Sanitization</li>
                        <li>• Content Security Policy</li>
                        <li>• HttpOnly Cookies</li>
                        <li>• Output Encoding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Ataques de Autenticação</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Brute Force</h3>
                    <p className="text-zinc-400 mb-4">
                      Tentativas sistemáticas de adivinhar credenciais testando todas as combinações possíveis.
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">Mitigação</h4>
                    <ul className="space-y-1 text-zinc-400">
                      <li>• Rate Limiting</li>
                      <li>• CAPTCHA</li>
                      <li>• Account Lockout</li>
                      <li>• Strong Passwords</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Session Hijacking</h3>
                    <p className="text-zinc-400 mb-4">
                      Roubo ou falsificação de tokens de sessão para acessar contas de usuários autenticados.
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">Mitigação</h4>
                    <ul className="space-y-1 text-zinc-400">
                      <li>• Secure Session Management</li>
                      <li>• SSL/TLS</li>
                      <li>• Session Timeout</li>
                      <li>• Regenerate IDs</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Credential Stuffing</h3>
                    <p className="text-zinc-400 mb-4">
                      Uso automatizado de pares de usuário/senha vazados para tentar acesso em múltiplos serviços.
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">Mitigação</h4>
                    <ul className="space-y-1 text-zinc-400">
                      <li>• Multi-factor Authentication</li>
                      <li>• Password Policies</li>
                      <li>• Breach Detection</li>
                      <li>• IP-based Rate Limiting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Melhores Práticas de Segurança</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Prevenção</h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Mantenha todos os sistemas e dependências atualizados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Implemente autenticação forte e multi-fator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Use HTTPS em todas as comunicações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Valide e sanitize todas as entradas de usuário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Implemente logging e monitoramento adequados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Monitoramento</h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Configure alertas para comportamentos suspeitos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Realize auditorias de segurança regulares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Mantenha logs de acesso e atividades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Implemente detecção de intrusão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Monitore métricas de performance e disponibilidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 