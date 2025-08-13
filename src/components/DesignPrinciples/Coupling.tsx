import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Coupling() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t('design_principles.coupling.title')}
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          {t('design_principles.coupling.intro')}
        </p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-300">
          <strong className="block mb-2">💡 {t('design_principles.coupling.key_concept_label')}:</strong>
          {t('design_principles.coupling.key_concept_text')}
        </div>
      </motion.div>

      {/* Types of Coupling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.coupling.types_title')}</h2>
        
        {/* Static Coupling */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">{t('design_principles.coupling.static_title')}</h3>
          <p className="text-zinc-300 mb-6">
            O acoplamento estático ocorre quando componentes são conectados em tempo de compilação,
            criando dependências rígidas que são difíceis de modificar sem alterar o código.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">{t('design_principles.coupling.characteristics_title')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Dependências Diretas</span>
                    <p className="text-zinc-400">Referências explícitas a classes ou módulos específicos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Verificação em Tempo de Compilação</span>
                    <p className="text-zinc-400">Erros são detectados antes da execução</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Menor Flexibilidade</span>
                    <p className="text-zinc-400">Mudanças requerem recompilação e reimplantação</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-blue-300">{t('design_principles.coupling.advantages_title')}</h4>
              <div className="space-y-4">
                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <h5 className="text-green-400 font-medium mb-2">Vantagens</h5>
                  <ul className="text-zinc-300 space-y-1 text-sm">
                    <li>• Detecção precoce de erros</li>
                    <li>• Melhor performance em tempo de execução</li>
                    <li>• Mais fácil de entender e rastrear</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <h5 className="text-red-400 font-medium mb-2">Desvantagens</h5>
                  <ul className="text-zinc-300 space-y-1 text-sm">
                    <li>• Menor flexibilidade para mudanças</li>
                    <li>• Maior dificuldade de manutenção</li>
                    <li>• Menor resiliência a falhas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2 text-blue-300">{t('design_principles.coupling.example_static_title')}:</h4>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-zinc-300">
{`// Acoplamento estático através de importação direta
import { UserService } from './UserService';

class OrderProcessor {
  private userService: UserService;

  constructor() {
    // Dependência direta e fixa
    this.userService = new UserService();
  }

  async processOrder(orderId: string) {
    // Se UserService estiver indisponível, não há alternativa
    const user = await this.userService.getUser(orderId);
    // Processamento do pedido...
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Dynamic Coupling */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">{t('design_principles.coupling.dynamic_title')}</h3>
          <p className="text-zinc-300 mb-6">
            O acoplamento dinâmico permite que componentes sejam conectados em tempo de execução,
            oferecendo maior flexibilidade e facilitando mudanças sem necessidade de recompilação.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-purple-300">{t('design_principles.coupling.characteristics_title')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Descoberta em Runtime</span>
                    <p className="text-zinc-400">Serviços são descobertos e conectados dinamicamente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Maior Flexibilidade</span>
                    <p className="text-zinc-400">Facilidade para trocar implementações em runtime</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Resiliência</span>
                    <p className="text-zinc-400">Melhor adaptação a falhas e mudanças</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-purple-300">{t('design_principles.coupling.advantages_title')} / {t('design_principles.coupling.disadvantages_title')}</h4>
              <div className="space-y-4">
                <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <h5 className="text-green-400 font-medium mb-2">Vantagens</h5>
                  <ul className="text-zinc-300 space-y-1 text-sm">
                    <li>• Maior flexibilidade e adaptabilidade</li>
                    <li>• Melhor resiliência a falhas</li>
                    <li>• Facilidade de manutenção e evolução</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <h5 className="text-red-400 font-medium mb-2">Desvantagens</h5>
                  <ul className="text-zinc-300 space-y-1 text-sm">
                    <li>• Maior complexidade de implementação</li>
                    <li>• Possíveis falhas em tempo de execução</li>
                    <li>• Overhead de performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-2 text-purple-300">{t('design_principles.coupling.example_dynamic_title')}:</h4>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-zinc-300">
{`// Acoplamento dinâmico usando injeção de dependência e service discovery
interface UserServiceInterface {
  getUser(id: string): Promise<User>;
}

class OrderProcessor {
  private userService: UserServiceInterface;
  private serviceRegistry: ServiceRegistry;

  constructor(serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry;
  }

  async processOrder(orderId: string) {
    try {
      // Descoberta dinâmica do serviço
      this.userService = await this.serviceRegistry.getService('UserService');
      const user = await this.userService.getUser(orderId);
    } catch (error) {
      // Fallback para serviço alternativo
      this.userService = await this.serviceRegistry.getBackupService('UserService');
      const user = await this.userService.getUser(orderId);
    }
    // Processamento do pedido...
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Service Discovery */}
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-green-400">{t('design_principles.coupling.service_discovery_title')}</h3>
          <p className="text-zinc-300 mb-6">
            {t('design_principles.coupling.service_discovery_intro')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-green-300">{t('design_principles.coupling.components_title')}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Registro de Serviços</span>
                    <p className="text-zinc-400">Onde os serviços se registram ao iniciar</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Health Checking</span>
                    <p className="text-zinc-400">Monitoramento da saúde dos serviços</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">DNS Dinâmico</span>
                    <p className="text-zinc-400">Resolução dinâmica de endereços</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3 text-green-300">{t('design_principles.coupling.tools_title')}</h4>
              <div className="space-y-3">
                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <h5 className="text-white font-medium mb-1">Consul</h5>
                  <p className="text-zinc-400 text-sm">Solução completa com service discovery, configuração e segmentação</p>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <h5 className="text-white font-medium mb-1">Eureka</h5>
                  <p className="text-zinc-400 text-sm">Service discovery da Netflix para aplicações Java</p>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg">
                  <h5 className="text-white font-medium mb-1">etcd</h5>
                  <p className="text-zinc-400 text-sm">Armazenamento distribuído de chave-valor usado no Kubernetes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.coupling.best_practices_title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Design e Arquitetura</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Interfaces Bem Definidas</span>
                    <p className="text-zinc-400 text-sm">Use interfaces para definir contratos claros entre serviços</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Injeção de Dependência</span>
                    <p className="text-zinc-400 text-sm">Utilize DI para gerenciar dependências de forma flexível</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Abstração Adequada</span>
                    <p className="text-zinc-400 text-sm">Encontre o nível certo de abstração para cada componente</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Implementação</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Service Discovery</span>
                    <p className="text-zinc-400 text-sm">Implemente mecanismos robustos de descoberta de serviços</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Circuit Breakers</span>
                    <p className="text-zinc-400 text-sm">Use circuit breakers para lidar com falhas de serviços</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="text-white font-medium">Fallbacks</span>
                    <p className="text-zinc-400 text-sm">Implemente estratégias de fallback para maior resiliência</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trade-offs and Considerations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.coupling.tradeoffs_title')}</h2>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Performance</h3>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li>• Acoplamento estático geralmente tem melhor performance</li>
                <li>• Acoplamento dinâmico adiciona overhead de descoberta</li>
                <li>• Considere o impacto em latência e throughput</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Complexidade</h3>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li>• Acoplamento dinâmico aumenta a complexidade</li>
                <li>• Necessidade de gerenciar estados distribuídos</li>
                <li>• Maior curva de aprendizado para a equipe</li>
              </ul>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Manutenibilidade</h3>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li>• Acoplamento baixo facilita mudanças</li>
                <li>• Maior facilidade de testes isolados</li>
                <li>• Melhor suporte para desenvolvimento paralelo</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real World Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">{t('design_principles.coupling.real_world_title')}</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Microsserviços na Netflix</h3>
            <p className="text-zinc-300 mb-4">
              A Netflix utiliza acoplamento dinâmico extensivamente em sua arquitetura de microsserviços,
              com ferramentas como Eureka para service discovery e Hystrix para circuit breaking.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <pre className="text-sm text-zinc-300">
{`@EnableEurekaClient
public class VideoServiceApplication {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}`}
              </pre>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Kubernetes Service Discovery</h3>
            <p className="text-zinc-300 mb-4">
              O Kubernetes implementa service discovery através de seu sistema de DNS interno e
              serviços, permitindo que pods se comuniquem sem conhecer localizações específicas.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <pre className="text-sm text-zinc-300">
{`apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080`}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>

      
    </div>
  );
} 
