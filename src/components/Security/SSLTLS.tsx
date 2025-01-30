import React from 'react';
import { Link } from 'react-router-dom';

export default function SSLTLS() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            SSL/TLS em Sistemas Distribuídos
          </h1>
          <p className="text-lg text-zinc-400 mb-6">
            Protocolos de segurança para comunicação segura em redes e sistemas distribuídos
          </p>
         
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-emerald-400">
                SSL/TLS são protocolos fundamentais que garantem a segurança das comunicações na internet,
                protegendo dados sensíveis e garantindo a autenticidade dos serviços.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Visão Geral */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Visão Geral</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">O que é SSL/TLS?</h3>
                  <p className="text-zinc-400">
                    SSL (Secure Sockets Layer) e seu sucessor TLS (Transport Layer Security) são
                    protocolos criptográficos que fornecem comunicação segura através da internet.
                    Eles operam na camada de transporte, garantindo:
                  </p>
                  <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                    <li>Confidencialidade dos dados</li>
                    <li>Integridade das mensagens</li>
                    <li>Autenticação do servidor</li>
                    <li>Autenticação opcional do cliente</li>
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">Evolução</h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-red-500 pl-4">
                      <p className="text-red-400 font-medium">SSL 2.0/3.0</p>
                      <p className="text-zinc-400 text-sm">Obsoleto e inseguro</p>
                    </div>
                    <div className="border-l-2 border-yellow-500 pl-4">
                      <p className="text-yellow-400 font-medium">TLS 1.0/1.1</p>
                      <p className="text-zinc-400 text-sm">Descontinuado</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-4">
                      <p className="text-green-400 font-medium">TLS 1.2</p>
                      <p className="text-zinc-400 text-sm">Amplamente suportado</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4">
                      <p className="text-blue-400 font-medium">TLS 1.3</p>
                      <p className="text-zinc-400 text-sm">Versão mais recente e segura</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Como Funciona */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Como Funciona</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-emerald-400 mb-4">O Handshake TLS</h3>
                <div className="grid gap-4">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">1</div>
                      <div>
                        <h4 className="text-lg font-medium text-blue-400 mb-2">Client Hello</h4>
                        <p className="text-zinc-400">
                          O cliente inicia a conexão enviando:
                        </p>
                        <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                          <li>Versão TLS suportada</li>
                          <li>Lista de cipher suites</li>
                          <li>Número aleatório</li>
                          <li>Extensões suportadas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">2</div>
                      <div>
                        <h4 className="text-lg font-medium text-green-400 mb-2">Server Hello</h4>
                        <p className="text-zinc-400">
                          O servidor responde com:
                        </p>
                        <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                          <li>Certificado digital</li>
                          <li>Cipher suite escolhida</li>
                          <li>Número aleatório do servidor</li>
                          <li>Extensões negociadas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">3</div>
                      <div>
                        <h4 className="text-lg font-medium text-purple-400 mb-2">Key Exchange</h4>
                        <p className="text-zinc-400">
                          Troca de chaves e estabelecimento de segredos:
                        </p>
                        <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                          <li>Cliente verifica o certificado</li>
                          <li>Geração do pre-master secret</li>
                          <li>Derivação das chaves de sessão</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400">4</div>
                      <div>
                        <h4 className="text-lg font-medium text-yellow-400 mb-2">Finished</h4>
                        <p className="text-zinc-400">
                          Finalização do handshake:
                        </p>
                        <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                          <li>Verificação de integridade</li>
                          <li>Confirmação dos parâmetros</li>
                          <li>Início da comunicação segura</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Certificados Digitais */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Certificados Digitais</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Estrutura</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• Informações do titular</li>
                      <li>• Chave pública</li>
                      <li>• Período de validade</li>
                      <li>• Emissor (CA)</li>
                      <li>• Assinatura digital da CA</li>
                      <li>• Número de série</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">Tipos</h3>
                    <ul className="space-y-4 text-zinc-400">
                      <li>
                        <span className="text-emerald-400 font-medium">DV (Domain Validation)</span>
                        <p className="mt-1">Validação básica do domínio</p>
                      </li>
                      <li>
                        <span className="text-emerald-400 font-medium">OV (Organization Validation)</span>
                        <p className="mt-1">Validação da organização</p>
                      </li>
                      <li>
                        <span className="text-emerald-400 font-medium">EV (Extended Validation)</span>
                        <p className="mt-1">Validação extendida e rigorosa</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cipher Suites */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Cipher Suites</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-400">
                  Cipher suites são conjuntos de algoritmos que definem como a comunicação
                  será protegida. Uma cipher suite típica inclui:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">Key Exchange</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• ECDHE</li>
                      <li>• DHE</li>
                      <li>• RSA</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">Authentication</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• RSA</li>
                      <li>• ECDSA</li>
                      <li>• PSK</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Encryption</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• AES-GCM</li>
                      <li>• ChaCha20</li>
                      <li>• AES-CBC</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">MAC</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• AEAD</li>
                      <li>• SHA-384</li>
                      <li>• POLY1305</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Melhores Práticas */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Melhores Práticas</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Configuração</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• Use apenas TLS 1.2 e 1.3</li>
                    <li>• Desative cipher suites inseguras</li>
                    <li>• Configure HSTS</li>
                    <li>• Implemente OCSP Stapling</li>
                  </ul>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Certificados</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• Mantenha certificados atualizados</li>
                    <li>• Use chaves fortes (RSA 2048+ ou ECC)</li>
                    <li>• Implemente renovação automática</li>
                    <li>• Proteja chaves privadas</li>
                  </ul>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">Monitoramento</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• Monitore expiração de certificados</li>
                    <li>• Verifique vulnerabilidades conhecidas</li>
                    <li>• Realize testes de segurança regulares</li>
                    <li>• Mantenha logs de acesso</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Considerações de Segurança */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Considerações de Segurança</h2>
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">Ameaças Comuns</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• MITM (Man-in-the-Middle)</li>
                      <li>• Downgrade Attacks</li>
                      <li>• Protocol Vulnerabilities</li>
                      <li>• Certificate Spoofing</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">Mitigações</h3>
                    <ul className="space-y-2 text-zinc-400">
                      <li>• Certificate Pinning</li>
                      <li>• Perfect Forward Secrecy</li>
                      <li>• Strong Cipher Preferences</li>
                      <li>• Regular Security Updates</li>
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