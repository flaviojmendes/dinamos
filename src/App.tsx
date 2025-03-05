import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CacheSimulation from "./components/CacheSimulation/CacheSimulation";
import HorizontalScaling from "./components/DesignPrinciples/HorizontalScaling";
import CircuitBreaker from "./components/CircuitBreaker/CircuitBreaker";
import Backpressure from "./components/Backpressure/Backpressure";
import RateLimiter from "./components/RateLimiter/RateLimiter";
import Fallback from "./components/DesignPrinciples/Fallback";
import AsyncSync from "./components/AsyncSync/AsyncSync";
import CDN from "./components/CDN/CDN";
import RoundRobin from "./components/RoundRobin/RoundRobin";
import MessageQueueComponent from "./components/SystemComponents/MessageQueue";
import MessageQueueSimulator from "./components/MessageQueue/MessageQueue";
import Introduction from "./components/Introduction/Introduction";
import DistributedSystems101 from "./components/DistributedSystems101/DistributedSystems101";
import SystemDesign101 from "./components/SystemDesign101/SystemDesign101";
import SystemComponents from "./components/SystemComponents/SystemComponents";
import Database from "./components/SystemComponents/Database";
import CacheComponent from "./components/SystemComponents/Cache";
import LoadBalancer from "./components/SystemComponents/LoadBalancer";
import CDNComponent from "./components/SystemComponents/CDN";
import CDNSimulator from "./components/CDN/CDN";
import APIGateway from "./components/SystemComponents/APIGateway";
import APIGatewaySimulator from "./components/APIGateway/APIGatewaySimulator";
import DesignPrinciples from "./components/DesignPrinciples/DesignPrinciples";
import EventDriven from "./components/DesignPrinciples/EventDriven";
import EventSourcingSimulator from "./components/DesignPrinciples/EventSourcingSimulator";
import LogSimulator from "./components/Monitoramento/LogSimulator";
import LogsPage from './components/Monitoramento/LogsPage';
import TracingSimulator from './components/Monitoramento/TracingSimulator';

import LandingPage from "./components/LandingPage/LandingPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Subscription from "./components/Subscription/Subscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import ReactGA from "react-ga4";
import ServiceOriented from "./components/DesignPrinciples/ServiceOriented";
import FaultTolerance from "./components/DesignPrinciples/FaultTolerance";
import Retries from "./components/DesignPrinciples/Retries";
import RetriesSimulator from "./components/DesignPrinciples/RetriesSimulator";
import CircuitBreakerContent from "./components/DesignPrinciples/CircuitBreaker";
import Timeout from "./components/DesignPrinciples/Timeout";
import TimeoutSimulator from "./components/DesignPrinciples/TimeoutSimulator";
import Escalabilidade from "./components/DesignPrinciples/Escalabilidade";
import VerticalScaling from "./components/DesignPrinciples/VerticalScaling";
import DataConsistency from "./components/DesignPrinciples/DataConsistency";
import Latency from "./components/DesignPrinciples/Latency";
import Failover from "./components/DesignPrinciples/Failover";
import HorizontalScalingSimulator from "./components/HorizontalScaling/HorizontalScalingSimulator";
import VerticalScalingSimulator from "./components/DesignPrinciples/VerticalScalingSimulator";
import ScalabilitySimulator from "./components/DesignPrinciples/ScalabilitySimulator";
import Replicacao from "./components/DesignPrinciples/Replicacao";
import ReplicacaoSimulator from "./components/DesignPrinciples/ReplicacaoSimulator";
import ServiceArchitectureSimulator from "./components/DesignPrinciples/ServiceArchitectureSimulator";
import Disponibilidade from "./components/DesignPrinciples/Disponibilidade";
import Preferences from "./components/Preferences/Preferences";
import ConsistencyStrategies from "./components/ConsistencyStrategies/ConsistencyStrategies";
import ConsensusStrategy from "./components/ConsistencyStrategies/ConsensusStrategy";
import ConsensusSimulator from "./components/ConsistencyStrategies/ConsensusSimulator";
import Firewall from "./components/SystemComponents/Firewall";
import FirewallSimulator from "./components/SystemComponents/FirewallSimulator";
import LamportTimestamps from "./components/ConsistencyStrategies/LamportTimestamps";
import LamportTimestampsSimulator from "./components/ConsistencyStrategies/LamportTimestampsSimulator";
import SystemEditor from "./components/SystemEditor/SystemEditor";
import SecurityOverview from "./components/Security/SecurityOverview";
import Authentication from "./components/Security/Authentication";
import Authorization from "./components/Security/Authorization";
import Cryptography from "./components/Security/Cryptography";
import TokensAndJWT from "./components/Security/TokensAndJWT";
import SSLTLS from "./components/Security/SSLTLS";
import CommonAttacks from "./components/Security/CommonAttacks";
import TokensSimulator from "./components/Security/TokensSimulator";
import CryptographySimulator from "./components/Security/CryptographySimulator";
import AttackSimulatorPage from "./components/Security/AttackSimulatorPage";
import Roadmap from "./components/Roadmap/Roadmap";
import ContentLayout from "./components/Common/ContentLayout";
import { useContentProgress } from "./hooks/useContentProgress";
import ContentPage from "./components/Common/ContentPage";
import TwoPhaseCommit from "./components/ConsistencyStrategies/TwoPhaseCommit";
import TwoPhaseCommitSimulator from "./components/ConsistencyStrategies/TwoPhaseCommitSimulator";
import Coupling from "./components/DesignPrinciples/Coupling";
import MonitoringMaintenance from "./components/MonitoringMaintenance/MonitoringMaintenance";
import Metrics from "./components/MonitoringMaintenance/Metrics";
import Logs from "./components/MonitoringMaintenance/Logs";
import Alerts from "./components/MonitoringMaintenance/Alerts";
import Performance from "./components/MonitoringMaintenance/Performance";
import HealthChecks from "./components/MonitoringMaintenance/HealthChecks";
import RealCases from "./components/RealCases/RealCases";
import YouTube from "./components/RealCases/YouTube";
import Spotify from "./components/RealCases/Spotify";
import WhatsApp from "./components/RealCases/WhatsApp";
import Bitly from "./components/RealCases/Bitly";
import Netflix from "./components/RealCases/Netflix";
import Uber from "./components/RealCases/Uber";

interface MenuItem {
  name: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  status?: "recommended" | "new" | "coming-soon";
  prerequisites?: string[];
  category?: "Básico" | "Intermediário" | "Avançado";
  skills?: string[];
  badges?: { text: string; color: string }[];
  component?: React.ComponentType;
  disabled?: boolean;
  customStyle?: string;
  customHoverStyle?: string;
}

const menuItems: MenuItem[] = [
  {
    path: "/roadmap",
    name: "🎯 Comece Aqui",
    description: "Sua jornada de aprendizado passo a passo",
    customStyle:
      "bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 border-l-4 border-blue-500",
    customHoverStyle: "hover:from-zinc-800 hover:to-zinc-900",
    icon: (
      <svg
        className="w-6 h-6 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    path: "/intro",
    name: "Introdução",
    description: "Sobre o curso e motivação",
  },
  {
    path: "/sistemas-distribuidos-101",
    name: "Sistemas Distribuídos 101",
    description: "Conceitos fundamentais através de analogias",
    badges: [{ text: "Grátis", color: "bg-green-500" }],
  },
  {
    path: "/editor",
    name: "Editor de Sistemas",
    description: "Crie e visualize arquiteturas distribuídas",
    badges: [
      { text: "Alpha", color: "bg-blue-500" },
      { text: "Grátis", color: "bg-green-500" },
    ],
  },
  {
    path: "/system-design-101",
    name: "System Design 101",
    description: "Fundamentos de design de sistemas",
    badges: [{ text: "Grátis", color: "bg-green-500" }],
  },
  {
    path: "/componentes",
    name: "Componentes Básicos",
    description: "Blocos fundamentais de sistemas distribuídos",
    children: [
      {
        path: "/componentes/banco-dados",
        name: "Bancos de Dados",
        description: "Armazenamento e gerenciamento de dados",
      },
      {
        path: "/componentes/cache",
        name: "Cache",
        description: "Armazenamento temporário para melhor performance",
        children: [
          {
            path: "/componentes/cache/simulator",
            name: "Simulador",
            description: "Experimente diferentes estratégias de cache",
          },
        ],
      },
      {
        path: "/componentes/load-balancer",
        name: "Balanceador de Carga",
        description: "Distribuição de tráfego entre servidores",
        children: [
          {
            path: "/componentes/load-balancer/simulator",
            name: "Simulador",
            description: "Experimente diferentes algoritmos de balanceamento",
          },
        ],
      },
      {
        path: "/componentes/message-queue",
        name: "Filas de Mensagens",
        description: "Comunicação assíncrona entre serviços",
        children: [
          {
            path: "/componentes/message-queue/simulator",
            name: "Simulador",
            description: "Experimente o fluxo de mensagens",
          },
        ],
      },
      {
        path: "/componentes/cdn",
        name: "CDN",
        description: "Distribuição global de conteúdo",
        children: [
          {
            path: "/componentes/cdn/simulator",
            name: "Simulador",
            description: "Veja como o CDN acelera entregas",
          },
        ],
      },
      {
        path: "/componentes/api-gateway",
        name: "API Gateway",
        description: "Ponto único de entrada para APIs",
        children: [
          {
            path: "/componentes/api-gateway/simulator",
            name: "Simulador",
            description: "Experimente roteamento e proteção de APIs",
          },
        ],
      },
      {
        path: "/componentes/firewall",
        name: "Firewall",
        description: "Segurança e controle de tráfego",
        children: [
          {
            path: "/componentes/firewall/simulator",
            name: "Simulador",
            description: "Experimente regras de firewall",
          },
        ],
      },
    ],
  },
  {
    path: "/principios-design",
    name: "Princípios de Design",
    description: "Conceitos essenciais para sistemas robustos",
    children: [
      {
        path: "/principios-design/escalabilidade",
        name: "Escalabilidade",
        description: "Crescimento e adaptação do sistema",
        children: [
          {
            path: "/principios-design/escalabilidade/horizontal",
            name: "Horizontal (Scale Out)",
            description: "Adicionando mais máquinas",
            children: [
              {
                path: "/principios-design/escalabilidade/horizontal/simulator",
                name: "Simulador",
                description: "Experimente escalabilidade horizontal",
              },
            ],
          },
          {
            path: "/principios-design/escalabilidade/vertical",
            name: "Vertical (Scale Up)",
            description: "Aumentando recursos da máquina",
            children: [
              {
                path: "/principios-design/escalabilidade/vertical/simulator",
                name: "Simulador",
                description: "Experimente escalabilidade vertical",
              },
            ],
          },
          {
            path: "/principios-design/escalabilidade/simulator",
            name: "Simulador Completo",
            description: "Compare diferentes estratégias de escala",
          },
        ],
      },
      {
        path: "/principios-design/disponibilidade",
        name: "Alta Disponibilidade",
        description: "Mantendo o sistema sempre funcionando",
        children: [
          {
            path: "/principios-design/disponibilidade/replicacao",
            name: "Replicação",
            description: "Cópias sincronizadas dos dados",
          },
          {
            path: "/principios-design/disponibilidade/failover",
            name: "Failover",
            description: "Recuperação automática de falhas",
          },
          {
            path: "/principios-design/disponibilidade/simulator",
            name: "Simulador",
            description: "Experimente estratégias de disponibilidade",
          },
        ],
      },
      {
        path: "/principios-design/tolerancia-falhas",
        name: "Tolerância a Falhas",
        description: "Lidando com falhas no sistema",
        children: [
          {
            path: "/principios-design/tolerancia-falhas/retries",
            name: "Retries",
            description: "Tentativas automáticas",
            children: [
              {
                path: "/principios-design/tolerancia-falhas/retries/simulator",
                name: "Simulador",
                description: "Experimente diferentes estratégias de retry",
              },
            ],
          },
          {
            path: "/principios-design/tolerancia-falhas/circuit-breaker",
            name: "Circuit Breaker",
            description: "Prevenindo falhas em cascata",
            children: [
              {
                path: "/principios-design/tolerancia-falhas/circuit-breaker/simulator",
                name: "Simulador",
                description: "Veja o circuit breaker em ação",
              },
            ],
          },
          {
            path: "/principios-design/tolerancia-falhas/timeout",
            name: "Timeout",
            description: "Limitando tempo de espera",
            children: [
              {
                path: "/principios-design/tolerancia-falhas/timeout/simulator",
                name: "Simulador",
                description: "Experimente diferentes configurações de timeout",
              },
            ],
          },
        ],
      },
      {
        path: "/principios-design/eventos",
        name: "Arquitetura Orientada a Eventos",
        description: "Sistemas baseados em eventos",
        children: [
          {
            path: "/principios-design/eventos/simulator",
            name: "Simulador",
            description: "Experimente event sourcing e event-driven",
          },
        ],
      },
      {
        path: "/principios-design/servicos",
        name: "Arquitetura de Serviços",
        description: "Monolito vs Microsserviços",
      },
      {
        path: "/principios-design/acoplamento",
        name: "Acoplamento",
        description: "Acoplamento dinâmico e estático entre serviços",
        badges: [{ text: "Novo", color: "bg-blue-500" }],
      },
    ],
  },
  {
    name: "Estratégias de Consistência",
    description: "Como garantir a consistência em sistemas distribuídos",
    path: "/estrategias-de-consistencia",
    status: "recommended",
    prerequisites: ["Princípios de Design"],
    category: "Avançado",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    skills: ["Consenso", "Timestamps de Lamport", "Consistência eventual"],
    children: [
      {
        name: "Two Phase Commit",
        description: "Protocolo de consenso para transações distribuídas",
        path: "/estrategias-de-consistencia/two-phase-commit",
        status: "recommended",
        prerequisites: [],
        category: "Avançado",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        ),
        skills: ["2PC", "Transações Distribuídas", "Consenso Atômico"],
        children: [
          {
            name: "Simulador",
            path: "/estrategias-de-consistencia/two-phase-commit/simulador",
            description: "Simulação interativa do protocolo Two Phase Commit",
          },
        ],
      },
      {
        name: "Estratégia de Consenso",
        path: "/estrategias-de-consistencia/consenso",
        description: "Protocolos e mecanismos para garantir acordo entre nós",
        children: [
          {
            name: "Simulador",
            path: "/estrategias-de-consistencia/consenso/simulador",
            description: "Simulação interativa dos protocolos de consenso",
          },
        ],
      },
      {
        name: "Relógios Lógicos de Lamport",
        path: "/estrategias-de-consistencia/lamport-timestamps",
        description: "Ordenação de eventos em sistemas distribuídos",
        children: [
          {
            name: "Simulador",
            path: "/estrategias-de-consistencia/lamport-timestamps/simulador",
            description:
              "Visualize a ordenação de eventos com timestamps de Lamport",
          },
        ],
      },
    ],
  },
  {
    path: "/monitoramento-e-manutencao",
    name: "Monitoramento e Manutenção",
    description: "Monitoramento e manutenção de sistemas distribuídos",
    badges: [{ text: "Novo", color: "bg-blue-500" }],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    children: [
      {
        path: "/monitoramento-e-manutencao/metricas",
        name: "Métricas e KPIs",
        description: "Indicadores essenciais para monitoramento",
      },
      {
        path: "/monitoramento-e-manutencao/logs",
        name: "Logs e Tracing",
        description: "Rastreamento e análise de logs distribuídos",
        children: [
          {
            name: "Simulador de Logs",
            description: "Experimente com bons e maus exemplos de logs",
            path: "/monitoramento-e-manutencao/logs/simulador",
            component: LogSimulator,
            status: "new"
          },
          {
            path: "/monitoramento-e-manutencao/logs/tracing",
            name: "Tracing Simulator",
            description: "Experimente o rastreamento de eventos",
            component: TracingSimulator,
            status: "new"
          }
        ]
      },
      {
        path: "/monitoramento-e-manutencao/alertas",
        name: "Alertas e Notificações",
        description: "Configuração e gestão de alertas",
      },
      {
        path: "/monitoramento-e-manutencao/performance",
        name: "Análise de Performance",
        description: "Identificação e resolução de gargalos",
      },
      {
        path: "/monitoramento-e-manutencao/health-checks",
        name: "Health Checks",
        description: "Monitoramento de saúde dos serviços",
      },
    ],
  },
  {
    path: "/casos-reais",
    name: "Casos Reais",
    description: "Exemplos reais de system design de grandes empresas",
    badges: [{ text: "Novo", color: "bg-blue-500" }],
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
    children: [
      {
        path: "/casos-reais/youtube",
        name: "YouTube",
        description: "Como o YouTube processa e distribui vídeos globalmente",
      },
      {
        path: "/casos-reais/spotify",
        name: "Spotify",
        description: "Arquitetura de streaming de música em tempo real",
      },
      {
        path: "/casos-reais/bitly",
        name: "Bit.ly",
        description: "Design de um serviço de encurtamento de URLs em escala"
      },
      {
        path: "/casos-reais/whatsapp",
        name: "WhatsApp",
        description: "Sistema de mensagens em tempo real"
      },
      {
        path: "/casos-reais/netflix",
        name: "Netflix",
        description: "Streaming de vídeo e recomendação de conteúdo"
      },
      {
        path: "/casos-reais/uber",
        name: "Uber",
        description: "Sistema de geolocalização e matching em tempo real",
      },
    ],
  },
  {
    path: "/seguranca",
    name: "Segurança",
    description: "Proteção e segurança em sistemas distribuídos",
    children: [
      {
        path: "/seguranca/autenticacao",
        name: "Autenticação",
        description: "Verificação de identidade em sistemas distribuídos",
      },
      {
        path: "/seguranca/autorizacao",
        name: "Autorização",
        description: "Controle de acesso e permissões",
      },
      {
        path: "/seguranca/criptografia",
        name: "Criptografia",
        description: "Proteção de dados em trânsito e em repouso",
        children: [
          {
            path: "/seguranca/criptografia/simulador",
            name: "Simulador",
            description:
              "Experimente diferentes tipos de criptografia na prática",
          },
        ],
      },
      {
        path: "/seguranca/tokens",
        name: "Tokens e JWT",
        description: "Gerenciamento de sessões e tokens de acesso",
        children: [
          {
            path: "/seguranca/tokens/simulador",
            name: "Simulador",
            description: "Experimente a geração e validação de JWTs",
          },
        ],
      },
      {
        path: "/seguranca/ssl-tls",
        name: "SSL/TLS",
        description: "Comunicação segura entre sistemas",
      },
      {
        path: "/seguranca/ataques",
        name: "Ataques Comuns",
        description: "Prevenção contra ataques em sistemas distribuídos",
      },
    ],
  },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut } = useAuth();
  const { isCompleted } = useContentProgress();

  ReactGA.initialize("G-FB645J9ZQH");
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });

  const MenuLink = ({ item }: { item: MenuItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { pathname } = useLocation();

    // Check if current path matches this item or any of its children
    const isActive =
      pathname === item.path ||
      item.children?.some(
        (child) =>
          pathname === child.path ||
          child.children?.some((grandchild) => pathname === grandchild.path)
      );

    // Auto-expand when active and has children
    useEffect(() => {
      if (isActive && item.children) {
        setIsExpanded(true);
      }
    }, [isActive, item.children]);

    return (
      <div>
        <div className="flex items-center gap-1">
          {item.disabled ? (
            <div className="flex-1 flex flex-col p-3 rounded-lg text-zinc-600 relative cursor-not-allowed">
              <div className="absolute -top-2 right-2 bg-zinc-800 text-white text-xs px-2 py-0.5 rounded-full">
                Em breve
              </div>
              <span className="font-medium">{item.name}</span>
              <span className="text-sm opacity-75">{item.description}</span>
            </div>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `flex-1 flex flex-col p-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : item.customStyle
                    ? `${item.customStyle} ${
                        item.customHoverStyle || "hover:bg-zinc-800"
                      } text-zinc-400 hover:text-white`
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
              onClick={() => {
                if (!item.disabled && isMobile) {
                  setIsSidebarOpen(false);
                  ReactGA.event({
                    category: "User",
                    action: "Clicked on Menu Item",
                    label: item.name,
                  });
                }
              }}
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm opacity-75">{item.description}</span>
              {item.badges && (
                <div className="absolute -top-2 right-2 flex gap-1">
                  {item.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </NavLink>
          )}
          {item.children && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
                ReactGA.event({
                  category: "User",
                  action: "Clicked on Menu Item",
                  label: item.name,
                });
              }}
              className={`p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-transform ${
                isActive ? "text-white" : ""
              }`}
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        {item.children && isExpanded && (
          <div className="ml-4 mt-1 space-y-1 border-l border-zinc-800 pl-3">
            {item.children.map((child) => (
              <MenuLink key={child.path} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen h-full bg-black text-white flex">
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`bg-zinc-900 border-r border-zinc-800 w-72 fixed md:relative h-screen z-30 overflow-y-auto
              ${isMobile ? "shadow-lg" : ""}`}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex flex-col gap-4 mb-8">
                {/* App Title */}
                <div className="flex items-center justify-between">
                  <a href="/" className="mx-auto">
                    <img
                      src="/logo.png"
                      alt="System Design"
                      className="h-20 mx-auto"
                    />
                  </a>
                  {isMobile && (
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-zinc-800 rounded-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* User Profile Section */}
                {user ? (
                  <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.displayName || user.email}
                      </p>
                      {user.displayName && (
                        <p className="text-xs text-zinc-400 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <Link
                      to="/preferences"
                      className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                      title="Preferências"
                    >
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                      title="Sair"
                    >
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Fazer Login</span>
                  </Link>
                )}
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <MenuLink key={item.path} item={item} />
                ))}
              </nav>

              {/* Add flex-1 to push the footer to the bottom */}
              <div className="flex-1"></div>
              {/* Instagram Footer */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <a
                  href="https://instagram.com/trilhainfo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Powered by: @trilhainfo</span>
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-auto">
        <div className="h-full">
          {/* Mobile Header */}
          {isMobile && (
            <div className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-10">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-zinc-800 rounded-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/pagamento"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <Subscription />
                </ProtectedRoute>
              }
            />
            <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/intro"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <Introduction />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sistemas-distribuidos-101"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <DistributedSystems101 />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/system-design-101"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <SystemDesign101 />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SystemComponents />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/banco-dados"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Database />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/cache"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CacheComponent />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/cache/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CacheSimulation />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/load-balancer"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <LoadBalancer />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/load-balancer/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <RoundRobin />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/message-queue"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <MessageQueueComponent />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/message-queue/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <MessageQueueSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/cdn"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CDNComponent />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/cdn/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CDN />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/api-gateway"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <APIGateway />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/api-gateway/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <APIGatewaySimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/horizontal-scaling"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <HorizontalScaling />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuit-breaker"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CircuitBreaker />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/backpressure"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Backpressure />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rate-limiter"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <RateLimiter />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fallback"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Fallback />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/async-sync"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <AsyncSync />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cdn"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CDN />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <DesignPrinciples />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/eventos"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <EventDriven />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/eventos/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <EventSourcingSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/servicos"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ServiceOriented />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/servicos/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ServiceArchitectureSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <FaultTolerance />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/retries"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Retries />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/retries/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <RetriesSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/circuit-breaker"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CircuitBreakerContent />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/circuit-breaker/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CircuitBreaker />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/timeout"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Timeout />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/timeout/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TimeoutSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/tolerancia-falhas/fallback"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Fallback />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Escalabilidade />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/horizontal"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <HorizontalScaling />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/horizontal/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <HorizontalScalingSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/vertical"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <VerticalScaling />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/vertical/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <VerticalScalingSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/consistencia"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <DataConsistency />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/latencia"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Latency />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/failover"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Failover />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/escalabilidade/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ScalabilitySimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/disponibilidade/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ReplicacaoSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/disponibilidade/replicacao"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Replicacao />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/disponibilidade/failover"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Failover />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/disponibilidade"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Disponibilidade />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ConsistencyStrategies />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/consenso"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ConsensusStrategy />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/consenso/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ConsensusSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/lamport-timestamps"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <LamportTimestamps />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/lamport-timestamps/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <LamportTimestampsSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/firewall"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Firewall />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/firewall/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <FirewallSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SystemEditor />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SecurityOverview />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/autenticacao"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Authentication />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/autorizacao"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Authorization />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/criptografia"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Cryptography />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/tokens"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TokensAndJWT />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/tokens/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TokensSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/ssl-tls"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SSLTLS />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/seguranca/ataques"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CommonAttacks />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/ataques/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <AttackSimulatorPage />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguranca/criptografia/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CryptographySimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <Roadmap />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/two-phase-commit"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TwoPhaseCommit />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/two-phase-commit/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TwoPhaseCommitSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/principios-design/acoplamento"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Coupling />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoramento-e-manutencao"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <MonitoringMaintenance />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoramento-e-manutencao/metricas"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Metrics />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoramento-e-manutencao/logs"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <LogsPage />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento-e-manutencao/alertas"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Alerts />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento-e-manutencao/performance"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Performance />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento-e-manutencao/health-checks"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <HealthChecks />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <RealCases />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/youtube"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <YouTube />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/spotify"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Spotify />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/whatsapp"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <WhatsApp />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/bitly"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Bitly />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/netflix"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Netflix />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/casos-reais/uber"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Uber />
                  </ContentPage>
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitoramento-e-manutencao/logs/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <LogSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoramento-e-manutencao/logs/tracing"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TracingSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}
