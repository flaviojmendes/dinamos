import React from 'react';

export default function TokensAndJWT() {
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Tokens e JWT em Sistemas Distribuídos
          </h1>
          <p className="text-xl text-zinc-400">
            Um guia completo sobre autenticação e autorização stateless em sistemas distribuídos
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <div className="text-blue-400 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-blue-300">
              Tokens são a base da autenticação moderna em sistemas distribuídos, permitindo 
              comunicação segura e sem estado entre diferentes serviços e aplicações.
            </p>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              Fundamentos de Tokens
            </h2>
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">O que são Tokens?</h3>
            <p>
              Tokens são credenciais digitais que representam autorizações e identidades em sistemas distribuídos.
              Funcionam como um "passe digital" que permite:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2 mt-4">
              <li>Autenticação sem necessidade de armazenar sessões no servidor</li>
              <li>Compartilhamento seguro de informações entre serviços</li>
              <li>Validação de identidade sem consultas constantes ao banco de dados</li>
              <li>Gerenciamento eficiente de permissões e acessos</li>
            </ul>
          </section>

          {/* JWT Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              JSON Web Tokens (JWT)
            </h2>
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">O Padrão JWT</h3>
            <p>
              JWT é um padrão aberto (RFC 7519) que define um formato compacto e seguro para
              transmissão de informações entre partes como um objeto JSON. Cada token é:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2 mt-4 mb-8">
              <li>Assinado digitalmente para garantir autenticidade</li>
              <li>Codificado em Base64URL para fácil transmissão</li>
              <li>Autocontido, carregando todas as informações necessárias</li>
              <li>Verificável independentemente do emissor</li>
            </ul>

            <div className="bg-zinc-900 rounded-lg p-6 my-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">Anatomia de um JWT</h3>
              <div className="space-y-6">
                <div className="bg-zinc-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-blue-300 font-mono mb-4">1. Header</h4>
                  <p className="text-zinc-400 mb-4">
                    Metadados do token, incluindo tipo e algoritmo de assinatura
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-blue-200">
                      {"{ \"alg\": \"HS256\", \"typ\": \"JWT\" }"}
                    </code>
                  </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-green-300 font-mono mb-4">2. Payload</h4>
                  <p className="text-zinc-400 mb-4">
                    Dados do token (claims) que carregam as informações principais
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-green-200">
                      {`{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "exp": 1516239022
}`}
                    </code>
                  </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-purple-300 font-mono mb-4">3. Signature</h4>
                  <p className="text-zinc-400 mb-4">
                    Assinatura que garante a integridade e autenticidade do token
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-purple-200">
                      HMACSHA256(
                        base64UrlEncode(header) + "." +
                        base64UrlEncode(payload),
                        secret
                      )
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Claims Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              Claims: O Coração do JWT
            </h2>
            <p className="mb-6">
              Claims são as declarações que compõem o payload do JWT, carregando informações
              sobre a entidade (geralmente o usuário) e metadados do token.
            </p>
            
            <div className="grid gap-6 my-8">
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-blue-300 mb-4">Claims Registradas</h3>
                <p className="text-zinc-400 mb-4">
                  Claims padronizadas pelo JWT, com propósitos específicos:
                </p>
                <ul className="grid grid-cols-2 gap-4 text-zinc-400">
                  <li className="bg-zinc-800 p-4 rounded">
                    <code className="text-blue-300">iss</code> (issuer)
                    <p className="mt-1 text-sm">Identifica quem emitiu o token</p>
                  </li>
                  <li className="bg-zinc-800 p-4 rounded">
                    <code className="text-blue-300">sub</code> (subject)
                    <p className="mt-1 text-sm">Identifica o sujeito do token</p>
                  </li>
                  <li className="bg-zinc-800 p-4 rounded">
                    <code className="text-blue-300">exp</code> (expiration)
                    <p className="mt-1 text-sm">Timestamp de expiração</p>
                  </li>
                  <li className="bg-zinc-800 p-4 rounded">
                    <code className="text-blue-300">iat</code> (issued at)
                    <p className="mt-1 text-sm">Timestamp de emissão</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-300 mb-4">Claims Públicas</h3>
                <p className="text-zinc-400">
                  Claims definidas livremente, mas registradas no IANA JWT Registry para evitar
                  colisões. Úteis para informações padronizadas como:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Nome e informações do usuário</li>
                  <li>Papéis e permissões</li>
                  <li>Informações organizacionais</li>
                </ul>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-purple-300 mb-4">Claims Privadas</h3>
                <p className="text-zinc-400">
                  Claims personalizadas para uso específico entre as partes envolvidas.
                  Ideais para:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Metadados específicos da aplicação</li>
                  <li>Configurações personalizadas</li>
                  <li>Informações de controle interno</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              Melhores Práticas de Implementação
            </h2>
            
            <div className="space-y-6 my-8">
              <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-2xl font-semibold text-green-300 mb-4">Otimização de Payload</h3>
                <p className="text-zinc-400">
                  Mantenha tokens compactos para melhor performance:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Inclua apenas dados essenciais</li>
                  <li>Use nomes curtos para as claims</li>
                  <li>Evite duplicação de informações</li>
                </ul>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-2xl font-semibold text-blue-300 mb-4">Segurança na Transmissão</h3>
                <p className="text-zinc-400">
                  Proteja a transmissão dos tokens:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Use sempre HTTPS para transmissão</li>
                  <li>Implemente rate limiting</li>
                  <li>Monitore tentativas de acesso suspeitas</li>
                </ul>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-2xl font-semibold text-yellow-300 mb-4">Gestão de Ciclo de Vida</h3>
                <p className="text-zinc-400">
                  Gerencie adequadamente a vida útil dos tokens:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Defina tempos de expiração apropriados</li>
                  <li>Implemente renovação automática</li>
                  <li>Mantenha uma lista de tokens revogados</li>
                </ul>
              </div>
              
              <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-semibold text-red-300 mb-4">Proteção de Dados</h3>
                <p className="text-zinc-400">
                  Proteja informações sensíveis:
                </p>
                <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                  <li>Nunca inclua credenciais no payload</li>
                  <li>Evite dados pessoais sensíveis</li>
                  <li>Use claims privadas para dados internos</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Implementation Flow */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              Fluxo de Autenticação com JWT
            </h2>
            
            <div className="bg-zinc-900 rounded-lg p-8 my-8">
              <ol className="space-y-8">
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Autenticação Inicial</h3>
                    <p className="text-zinc-400">
                      O usuário fornece suas credenciais (email/senha) através de um formulário
                      de login seguro. O servidor valida essas credenciais contra o banco de dados.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-300 mb-2">Geração do JWT</h3>
                    <p className="text-zinc-400">
                      Após validação bem-sucedida, o servidor gera um JWT contendo informações
                      relevantes do usuário, como ID, papéis e permissões. O token é assinado
                      com uma chave secreta.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">Armazenamento Seguro</h3>
                    <p className="text-zinc-400">
                      O cliente recebe e armazena o token de forma segura, seja em um cookie
                      HTTP-only para aplicações web ou no armazenamento seguro para apps móveis.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-300 mb-2">Requisições Autenticadas</h3>
                    <p className="text-zinc-400">
                      Em cada requisição subsequente, o cliente inclui o JWT no header
                      Authorization usando o esquema Bearer: <code>Authorization: Bearer {`<token>`}</code>
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xl font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">Validação e Autorização</h3>
                    <p className="text-zinc-400">
                      O servidor valida a assinatura do token, verifica a expiração e utiliza
                      as claims para autorizar o acesso aos recursos solicitados.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Security Considerations */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">
              Considerações de Segurança
            </h2>
            
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 my-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">Riscos e Mitigações</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">Ataques XSS</h4>
                    <p className="text-zinc-400">
                      Proteja-se contra Cross-Site Scripting:
                    </p>
                    <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                      <li>Use cookies HTTP-only para tokens</li>
                      <li>Implemente CSP (Content Security Policy)</li>
                      <li>Sanitize todas as entradas de usuário</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">CSRF</h4>
                    <p className="text-zinc-400">
                      Previna Cross-Site Request Forgery:
                    </p>
                    <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                      <li>Use tokens CSRF para operações importantes</li>
                      <li>Verifique o Origin/Referer header</li>
                      <li>Implemente SameSite cookies</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">Roubo de Tokens</h4>
                    <p className="text-zinc-400">
                      Minimize o impacto de tokens comprometidos:
                    </p>
                    <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                      <li>Implemente refresh tokens com rotação</li>
                      <li>Mantenha expiração curta para access tokens</li>
                      <li>Monitore padrões suspeitos de uso</li>
                      <li>Mantenha uma blacklist de tokens revogados</li>
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