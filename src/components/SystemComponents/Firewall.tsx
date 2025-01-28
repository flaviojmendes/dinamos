import { Link } from "react-router-dom";

export default function Firewall() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          Firewall
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          O que é um Firewall?
        </h2>

        <p className="text-xl text-zinc-300 mb-12">
          Um Firewall é um componente de segurança essencial que monitora e controla o tráfego de rede 
          com base em regras predefinidas. Ele atua como uma barreira entre uma rede confiável e redes 
          não confiáveis (como a Internet), protegendo contra acessos não autorizados e ameaças cibernéticas.
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Principais Funcionalidades
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Filtragem de Pacotes</h3>
            <p className="text-zinc-200">
              Analisa e filtra pacotes de rede com base em regras predefinidas, como endereços IP, 
              portas e protocolos.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Inspeção de Estado</h3>
            <p className="text-zinc-200">
              Mantém registro do estado das conexões ativas e toma decisões baseadas no contexto 
              da comunicação.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Prevenção de Intrusões</h3>
            <p className="text-zinc-200">
              Detecta e bloqueia tentativas de ataques e comportamentos maliciosos na rede.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          Tipos de Firewall
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Firewall de Rede</h3>
            <p className="text-zinc-200">
              Opera na camada de rede, filtrando pacotes com base em endereços IP e portas.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">Firewall de Aplicação</h3>
            <p className="text-zinc-200">
              Analisa o tráfego no nível da aplicação, oferecendo proteção mais granular e específica.
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded p-4 mt-8">
          <p className="font-medium text-blue-200 mb-2">Exemplo:</p>
          <p className="text-zinc-300">
            Configurar um firewall para permitir apenas tráfego HTTPS (porta 443) para um servidor web, 
            bloqueando todas as outras portas.
          </p>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            Simulador Interativo
          </h2>
          <p className="text-zinc-300 mb-4">
            Experimente nossa simulação interativa de Firewall para entender melhor como as regras de 
            segurança afetam o tráfego de rede.
          </p>
          <Link 
            to="/componentes/firewall/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Acessar Simulador
          </Link>
        </div>
      </div>
    </div>
  );
} 