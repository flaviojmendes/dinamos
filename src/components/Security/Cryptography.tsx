import React from 'react';
import { Link } from 'react-router-dom';

export default function Cryptography() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Criptografia em Sistemas Distribuídos
          </h1>
          <p className="text-lg text-zinc-400 mb-6">
            Proteção de dados, comunicação segura e gerenciamento de chaves em ambientes distribuídos
          </p>
          <Link
            to="/seguranca/criptografia/simulador"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Experimente o Simulador de Criptografia
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-indigo-400">
                A criptografia é fundamental para garantir a segurança em sistemas distribuídos, 
                protegendo dados em repouso e em trânsito. Compreender seus conceitos e 
                implementações é essencial para construir sistemas seguros e confiáveis.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Fundamentos da Criptografia */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Fundamentos da Criptografia</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Confidencialidade</h3>
                  <p className="text-zinc-400">
                    Garante que apenas as partes autorizadas possam acessar e 
                    compreender as informações protegidas.
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Integridade</h3>
                  <p className="text-zinc-400">
                    Assegura que os dados não foram alterados durante o 
                    armazenamento ou transmissão.
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">Autenticidade</h3>
                  <p className="text-zinc-400">
                    Confirma a origem dos dados e garante que as partes 
                    envolvidas são quem dizem ser.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tipos de Criptografia */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Tipos de Criptografia</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Criptografia Simétrica</h3>
                  <p className="text-zinc-300 mb-4">
                    Utiliza a mesma chave para criptografar e descriptografar dados. 
                    É rápida e eficiente para grandes volumes de dados.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Algoritmos Comuns</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>AES (Advanced Encryption Standard)</li>
                      <li>ChaCha20</li>
                      <li>3DES (Triple DES)</li>
                      <li>Blowfish</li>
                    </ul>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Criptografia Assimétrica</h3>
                  <p className="text-zinc-300 mb-4">
                    Usa um par de chaves (pública e privada) para operações de 
                    criptografia e descriptografia.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Algoritmos e Usos</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>RSA: Criptografia e assinatura digital</li>
                      <li>ECC: Curvas elípticas para dispositivos com recursos limitados</li>
                      <li>Diffie-Hellman: Troca de chaves</li>
                      <li>Ed25519: Assinaturas digitais modernas</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">Funções Hash Criptográficas</h3>
                  <p className="text-zinc-300 mb-4">
                    Geram uma impressão digital única dos dados, garantindo integridade 
                    e não-repúdio.
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">Algoritmos Populares</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      <li>SHA-256/SHA-3: Padrão atual para hashing seguro</li>
                      <li>BLAKE2/BLAKE3: Alta performance</li>
                      <li>Argon2: Específico para senhas</li>
                      <li>HMAC: Hash com chave para autenticação</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gerenciamento de Chaves */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Gerenciamento de Chaves</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Ciclo de Vida</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Geração de chaves segura</li>
                      <li>• Distribuição e troca</li>
                      <li>• Armazenamento protegido</li>
                      <li>• Rotação e revogação</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Boas Práticas</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Hardware Security Modules (HSM)</li>
                      <li>• Key Derivation Functions</li>
                      <li>• Backup e recuperação</li>
                      <li>• Auditoria de uso</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Protocolos de Segurança */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Protocolos de Segurança</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3">TLS/SSL</h3>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <p className="text-zinc-300 mb-4">
                      Protocolo padrão para comunicação segura na web e entre serviços.
                    </p>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Handshake e negociação de cifras</li>
                      <li>• Certificados digitais</li>
                      <li>• Perfect Forward Secrecy</li>
                      <li>• HTTPS e HSTS</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3">Outros Protocolos</h3>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <ul className="text-zinc-400 space-y-2">
                      <li>• SSH: Acesso remoto seguro</li>
                      <li>• IPsec: Segurança na camada de rede</li>
                      <li>• WireGuard: VPN moderna</li>
                      <li>• Signal Protocol: Mensagens seguras</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação Segura */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Implementação Segura</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-300">
                  Ao implementar criptografia em sistemas distribuídos, considere:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">Não Faça</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Implementar próprios algoritmos</li>
                      <li>• Reutilizar chaves ou IVs</li>
                      <li>• Armazenar chaves no código</li>
                      <li>• Ignorar validações</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">Faça</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Use bibliotecas comprovadas</li>
                      <li>• Implemente Perfect Forward Secrecy</li>
                      <li>• Valide certificados</li>
                      <li>• Monitore e atualize</li>
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">Considere</h3>
                    <ul className="text-zinc-400 space-y-2">
                      <li>• Requisitos de performance</li>
                      <li>• Conformidade legal</li>
                      <li>• Recuperação de desastres</li>
                      <li>• Auditoria e logging</li>
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