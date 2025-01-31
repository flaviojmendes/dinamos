import React from 'react';
import { Link } from 'react-router-dom';
import { useContentProgress } from '../../hooks/useContentProgress';
import ContentLayout from '../Common/ContentLayout';

interface RoadmapStep {
  title: string;
  description: string;
  path: string;
  status: 'required' | 'recommended' | 'optional';
  prerequisites: string[];
  category: string;
  icon: JSX.Element;
  skills: string[];
  children?: RoadmapStep[];
}

const getChildPaths = (step: RoadmapStep): string[] => {
  const paths: string[] = [];
  if (step.children) {
    for (const child of step.children) {
      paths.push(child.path);
      // Get paths from child's children (simulators, etc)
      if (child.children) {
        for (const grandchild of child.children) {
          paths.push(grandchild.path);
        }
      }
    }
  }
  return paths;
};

export default function Roadmap() {
  const { isCompleted } = useContentProgress();

  const roadmapSteps: RoadmapStep[] = [
    {
      title: "Introdução",
      description: "Fundamentos e motivação para estudar sistemas distribuídos",
      path: "/intro",
      status: "required",
      prerequisites: [],
      category: "Fundamentos",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      skills: ["Conceitos básicos", "Motivação", "Visão geral"]
    },
    {
      title: "Sistemas Distribuídos 101",
      description: "Conceitos fundamentais através de analogias",
      path: "/sistemas-distribuidos-101",
      status: "required",
      prerequisites: ["Introdução"],
      category: "Fundamentos",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      skills: ["Arquitetura básica", "Comunicação", "Escalabilidade"]
    },
    {
      title: "System Design 101",
      description: "Fundamentos de design de sistemas",
      path: "/system-design-101",
      status: "required",
      prerequisites: ["Sistemas Distribuídos 101"],
      category: "Fundamentos",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      skills: ["Design patterns", "Arquitetura", "Boas práticas"]
    },
    {
      title: "Componentes Básicos",
      description: "Blocos fundamentais de sistemas distribuídos",
      path: "/componentes",
      status: "required",
      prerequisites: ["System Design 101"],
      category: "Componentes",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        </svg>
      ),
      skills: ["Bancos de dados", "Cache", "Load Balancer", "Message Queue", "CDN"],
      children: [
        {
          title: "Bancos de Dados",
          description: "Armazenamento e gerenciamento de dados",
          path: "/componentes/banco-dados",
          status: "required",
          prerequisites: [],
          category: "Componentes",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
            </svg>
          ),
          skills: ["SQL", "NoSQL", "Replicação", "Sharding"]
        },
        {
          title: "Cache",
          description: "Armazenamento temporário para melhor performance",
          path: "/componentes/cache",
          status: "required",
          prerequisites: [],
          category: "Componentes",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          skills: ["Cache Strategies", "Redis", "Memcached"]
        },
        {
          title: "Load Balancer",
          description: "Distribuição de tráfego entre servidores",
          path: "/componentes/load-balancer",
          status: "required",
          prerequisites: [],
          category: "Componentes",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          skills: ["Round Robin", "Least Connections", "Health Checks"]
      }
      ]
    },
    {
      title: "Princípios de Design",
      description: "Conceitos fundamentais de arquitetura",
      path: "/principios-design",
      status: "required",
      prerequisites: ["Componentes Básicos"],
      category: "Arquitetura",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      skills: ["Event-Driven", "Microservices", "Fault Tolerance"],
      children: [
        {
          title: "Arquitetura Orientada a Eventos",
          description: "Sistemas baseados em eventos",
          path: "/principios-design/eventos",
          status: "required",
          prerequisites: [],
          category: "Arquitetura",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
          skills: ["Event Sourcing", "Message Brokers", "Event-Driven Architecture"]
        },
        {
          title: "Arquitetura de Serviços",
          description: "Monolito vs Microsserviços",
          path: "/principios-design/servicos",
          status: "required",
          prerequisites: [],
          category: "Arquitetura",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          skills: ["Microservices", "Service Discovery", "API Gateway"]
        },
        {
          title: "Tolerância a Falhas",
          description: "Estratégias para lidar com falhas",
          path: "/principios-design/tolerancia-falhas",
          status: "required",
          prerequisites: [],
          category: "Arquitetura",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          skills: ["Circuit Breaker", "Retries", "Fallback", "Timeout"]
        }
      ]
    },
    {
      title: "Estratégias de Consistência",
      description: "Como garantir a consistência em sistemas distribuídos",
      path: "/estrategias-de-consistencia",
      status: "recommended",
      prerequisites: ["Princípios de Design"],
      category: "Avançado",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      skills: ["Consenso", "Timestamps de Lamport", "Consistência eventual"],
      children: [
        {
          title: "Two-Phase Commit",
          description: "Protocolo de consenso para transações distribuídas",
          path: "/estrategias-de-consistencia/two-phase-commit",
          status: "recommended",
          prerequisites: [],
          category: "Avançado",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          skills: ["2PC", "Transações Distribuídas", "Consenso Atômico"]
        },
        {
          title: "Estratégia de Consenso",
          description: "Protocolos e mecanismos para garantir acordo entre nós",
          path: "/estrategias-de-consistencia/consenso",
          status: "recommended",
          prerequisites: [],
          category: "Avançado",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          skills: ["Raft", "Paxos", "Consenso Distribuído"]
        },
        {
          title: "Relógios Lógicos de Lamport",
          description: "Ordenação de eventos em sistemas distribuídos",
          path: "/estrategias-de-consistencia/lamport-timestamps",
          status: "recommended",
          prerequisites: [],
          category: "Avançado",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          skills: ["Timestamps Lógicos", "Ordenação Causal", "Relógios Vetoriais"]
        }
      ]
    },
    {
      title: "Segurança",
      description: "Proteção e segurança em sistemas distribuídos",
      path: "/seguranca",
      status: "required",
      prerequisites: ["Estratégias de Consistência"],
      category: "Segurança",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      skills: ["Autenticação", "Autorização", "Criptografia", "SSL/TLS", "Ataques comuns"],
      children: [
        {
          title: "Autenticação",
          description: "Verificação de identidade em sistemas distribuídos",
          path: "/seguranca/autenticacao",
          status: "required",
          prerequisites: [],
          category: "Segurança",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          skills: ["OAuth", "OpenID Connect", "SSO"]
        },
        {
          title: "Autorização",
          description: "Controle de acesso e permissões",
          path: "/seguranca/autorizacao",
          status: "required",
          prerequisites: [],
          category: "Segurança",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          skills: ["RBAC", "ABAC", "ACLs"]
        },
        {
          title: "Criptografia",
          description: "Proteção de dados em trânsito e em repouso",
          path: "/seguranca/criptografia",
          status: "required",
          prerequisites: [],
          category: "Segurança",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          ),
          skills: ["Criptografia Simétrica", "Criptografia Assimétrica", "Hashing"]
        },
        {
          title: "SSL/TLS",
          description: "Comunicação segura entre sistemas",
          path: "/seguranca/ssl-tls",
          status: "required",
          prerequisites: [],
          category: "Segurança",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          skills: ["Certificados", "Handshake", "HTTPS"]
        },
        {
          title: "Ataques Comuns",
          description: "Prevenção contra ataques em sistemas distribuídos",
          path: "/seguranca/ataques",
          status: "required",
          prerequisites: [],
          category: "Segurança",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          skills: ["DDoS", "Man-in-the-Middle", "SQL Injection"]
        }
      ]
    }
  ];

  const getStepStatus = (step: RoadmapStep) => {
    if (isCompleted(step.path)) {
      return 'bg-green-500';
    }
      
    // Check if all children are completed
    if (step.children && step.children.length > 0) {
      const allChildrenCompleted = step.children.every(child => isCompleted(child.path));
      if (allChildrenCompleted) {
        return 'bg-green-500';
      }
    }

    switch (step.status) {
      case 'required':
        return 'bg-blue-500';
      case 'recommended':
        return 'bg-purple-500';
      case 'optional':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
      
  const calculateProgress = () => {
    const getAllSteps = (steps: RoadmapStep[]): RoadmapStep[] => {
      return steps.reduce((acc: RoadmapStep[], step) => {
        if (step.path !== '/roadmap') {
          acc.push(step);
          if (step.children) {
            acc.push(...getAllSteps(step.children));
          }
        }
        return acc;
    }, []);

  };

    const allSteps = getAllSteps(roadmapSteps);
    const completedSteps = allSteps.filter(step => isCompleted(step.path));
    return Math.round((completedSteps.length / allSteps.length) * 100);
  };

  const renderStep = (step: RoadmapStep, isChild = false) => {
    const childPaths = getChildPaths(step);
    // Log the paths to debug
    console.log(`Child paths for ${step.path}:`, childPaths);

  return (
      <div key={step.path} className={`bg-zinc-900 rounded-lg p-6 ${isChild ? 'ml-8 mt-4' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${getStepStatus(step)} relative group`}>
            {step.icon}
            {isCompleted(step.path) && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
                </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getStepStatus(step)} bg-opacity-20`}>
                {isCompleted(step.path) ? 'Concluído' :
                 step.status === 'required' ? 'Obrigatório' : 
                 step.status === 'recommended' ? 'Recomendado' : 'Opcional'}
              </span>
            </div>
            <p className="text-zinc-400 mb-4">{step.description}</p>
            
            {/* Prerequisites */}
            {step.prerequisites.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">Pré-requisitos:</div>
                <div className="flex flex-wrap gap-2">
                  {step.prerequisites.map(prereq => (
                    <span key={prereq} className="text-xs bg-zinc-800 px-2 py-1 rounded">
                      {prereq}
                    </span>
                  ))}
          </div>
        </div>
                    )}

            {/* Skills */}
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Habilidades:</div>
                      <div className="flex flex-wrap gap-2">
                {step.skills.map(skill => (
                  <span key={skill} className="text-xs bg-zinc-800 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                  </div>

                    <Link
              to={step.path}
              state={{ childPaths }}
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
                    >
              {isCompleted(step.path) ? 'Revisar módulo' : 'Começar módulo'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
                    </Link>
                  </div>
                </div>

        {/* Render children */}
        {step.children && step.children.map(child => renderStep(child, true))}
              </div>
            );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hide completion button for roadmap page */}
      <ContentLayout hideCompletion>
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Roadmap de Aprendizado</h1>
            <p className="text-lg text-zinc-400 mb-4">
              Siga este guia estruturado para dominar os conceitos de sistemas distribuídos.
              O roadmap está organizado em uma sequência lógica de aprendizado, com pré-requisitos
              claros e habilidades a serem desenvolvidas em cada etapa.
            </p>
            
            {/* Progress Bar */}
            <div className="bg-zinc-800 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              {calculateProgress()}% do conteúdo completado
            </p>
          </div>

          {/* Progress Overview */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="text-blue-500 font-semibold mb-2">Obrigatório</div>
              <div className="text-2xl font-bold">
                {roadmapSteps.filter(step => step.status === 'required').length} módulos
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="text-purple-500 font-semibold mb-2">Recomendado</div>
              <div className="text-2xl font-bold">
                {roadmapSteps.filter(step => step.status === 'recommended').length} módulos
              </div>
            </div>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="text-yellow-500 font-semibold mb-2">Opcional</div>
              <div className="text-2xl font-bold">
                {roadmapSteps.filter(step => step.status === 'optional').length} módulos
              </div>
            </div>
          </div>

          {/* Roadmap Steps */}
          <div className="space-y-6">
            {roadmapSteps.map(step => renderStep(step))}
        </div>
      </div>
      </ContentLayout>
    </div>
  );
} 