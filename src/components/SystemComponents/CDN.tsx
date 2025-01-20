export default function CDN() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          CDN (Content Delivery Network)
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          O que é uma CDN?
        </h2>

        <p className="text-xl text-zinc-300 mb-12">
          Uma CDN é uma rede de servidores distribuídos geograficamente, usados para entregar conteúdo 
          (como arquivos de imagem, vídeos ou páginas web) de maneira rápida aos usuários. As CDNs armazenam 
          cópias de conteúdo em diversos servidores ao redor do mundo, reduzindo a latência ao entregar o 
          conteúdo a partir de um local mais próximo do usuário.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Benefícios de Usar CDN
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Redução de Latência</h3>
            <p className="text-zinc-200">
              Os dados são entregues de um servidor próximo ao usuário, diminuindo o tempo de resposta.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Distribuição de Carga</h3>
            <p className="text-zinc-200">
              A CDN distribui a carga entre múltiplos servidores, evitando sobrecarga em servidores centrais.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Maior Disponibilidade</h3>
            <p className="text-zinc-200">
              Caso um servidor falhe, a CDN pode redirecionar o tráfego para outro servidor, garantindo alta 
              disponibilidade.
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded p-4 mt-8">
          <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
          <p className="text-zinc-300">
            Usar uma CDN como o Cloudflare para acelerar o carregamento de páginas de um site global.
          </p>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Simulador Interativo
          </h2>
          <p className="text-zinc-300 mb-4">
            Experimente nossa simulação interativa de CDN para entender melhor como a distribuição geográfica 
            de conteúdo afeta a latência e disponibilidade.
          </p>
          <a 
            href="/componentes/cdn/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </a>
        </div>
      </div>
    </div>
  );
} 