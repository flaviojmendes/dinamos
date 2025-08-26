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
import { trackEvent, trackPageView, initializeAnalytics, handleConsentChange } from './utils/analytics';
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
import LanguageDetectionDialog from "./components/Common/LanguageDetectionDialog";
import { useContentProgress, PROGRESS_UPDATED_EVENT } from "./hooks/useContentProgress";
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

import OrchestrationVsChoreography from './components/DesignPrinciples/OrchestrationVsChoreography';
import Synchronization from './components/ConsistencyStrategies/Synchronization';
import SynchronizationFundamentals from './components/ConsistencyStrategies/SynchronizationFundamentals';
import SynchronizationDeadlocks from './components/ConsistencyStrategies/SynchronizationDeadlocks';
import SynchronizationAlgorithms from './components/ConsistencyStrategies/SynchronizationAlgorithms';
import SynchronizationSimulator from "./components/ConsistencyStrategies/SynchronizationSimulator";
import SimpleSystemEditorPage from "./pages/SimpleSystemEditorPage";
import PollingWebhooks from "./components/SystemComponents/PollingWebhooks";
import PollingWebhooksTheory from "./components/SystemComponents/PollingWebhooksTheory";
import { LanguageSwitcher, CouponModal } from './components/Common';
import { useTranslation } from 'react-i18next';
import CookieConsentBanner from './components/Common/CookieConsentBanner';
import { CookieConsentManager } from './utils/cookieConsent';
import CookiePreferencesPage from './pages/CookiePreferencesPage';
import CAPTheorem from "./components/TheoreticalFoundations/CAPTheorem";
import ConsistencyModels from "./components/TheoreticalFoundations/ConsistencyModels";
import DistributedChallenges from "./components/TheoreticalFoundations/DistributedChallenges";
import NetworkPartitions from "./components/TheoreticalFoundations/NetworkPartitions";
import TheoreticalFoundations from "./components/TheoreticalFoundations/TheoreticalFoundations";
import ReplicationSimulator from "./components/DesignPrinciples/ReplicationSimulator";
import AvailabilityZonesSimulator from "./components/DesignPrinciples/AvailabilityZonesSimulator";
import AvailabilityZones from "./components/DesignPrinciples/AvailabilityZones";

interface MenuItem {
  name: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  status?: "recommended" | "new" | "coming-soon" | "required";
  prerequisites?: string[];
  category?: "Básico" | "Intermediário" | "Avançado" | "Foundational" | "Building Blocks" | "Application" | "Advanced Concepts" | "Security & Safety";
  skills?: string[];
  badges?: { text: string; color: string }[];
  component?: React.ComponentType;
  disabled?: boolean;
  customStyle?: string;
  customHoverStyle?: string;
}

const createMenuItems = (t: any): MenuItem[] => [
  {
    path: "/roadmap",
    name: t('menu.roadmap.name'),
    description: t('menu.roadmap.description'),
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
    name: t('menu.intro.name'),
    description: t('menu.intro.description'),
    badges: [{ text: t('badges.free'), color: "bg-green-500" }],
  },
  {
    path: "/sistemas-distribuidos-101",
    name: t('menu.sistemas_distribuidos_101.name'),
    description: t('menu.sistemas_distribuidos_101.description'),
    badges: [{ text: t('badges.free'), color: "bg-green-500" }],
  },
  {
    path: "/theoretical-foundations",
    name: t('menu.theoretical_foundations.name'),
    description: t('menu.theoretical_foundations.description'),
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }, { text: t('badges.free'), color: "bg-green-500" }],
    status: "recommended",
    prerequisites: ["sistemas-distribuidos-101"],
    category: "Foundational",
    icon: (
      <svg
        className="w-6 h-6 text-purple-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    children: [
      {
        path: "/theoretical-foundations/cap-theorem",
        name: t('menu.theoretical_foundations.cap_theorem.name'),
        description: t('menu.theoretical_foundations.cap_theorem.description'),
      },
      {
        path: "/theoretical-foundations/consistency-models",
        name: t('menu.theoretical_foundations.consistency_models.name'),
        description: t('menu.theoretical_foundations.consistency_models.description'),
      },
      {
        path: "/theoretical-foundations/distributed-challenges",
        name: t('menu.theoretical_foundations.distributed_challenges.name'),
        description: t('menu.theoretical_foundations.distributed_challenges.description'),
      },
      {
        path: "/theoretical-foundations/network-partitions",
        name: t('menu.theoretical_foundations.network_partitions.name'),
        description: t('menu.theoretical_foundations.network_partitions.description'),
      },
    ],
  },
  {
    path: "/componentes",
    name: t('menu.componentes.name'),
    description: t('menu.componentes.description'),

    status: "required",
    prerequisites: ["theoretical-foundations"],
    category: "Building Blocks",
    children: [
      {
        path: "/componentes/banco-dados",
        name: t('menu.componentes.banco_dados.name'),
        description: t('menu.componentes.banco_dados.description'),
      },
      {
        path: "/componentes/cache",
        name: t('menu.componentes.cache.name'),
        description: t('menu.componentes.cache.description'),
        children: [
          {
            path: "/componentes/cache/simulator",
            name: t('menu.componentes.cache.simulator.name'),
            description: t('menu.componentes.cache.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/load-balancer",
        name: t('menu.componentes.load_balancer.name'),
        description: t('menu.componentes.load_balancer.description'),
        children: [
          {
            path: "/componentes/load-balancer/simulator",
            name: t('menu.componentes.load_balancer.simulator.name'),
            description: t('menu.componentes.load_balancer.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/message-queue",
        name: t('menu.componentes.message_queue.name'),
        description: t('menu.componentes.message_queue.description'),
        children: [
          {
            path: "/componentes/message-queue/simulator",
            name: t('menu.componentes.message_queue.simulator.name'),
            description: t('menu.componentes.message_queue.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/cdn",
        name: t('menu.componentes.cdn.name'),
        description: t('menu.componentes.cdn.description'),
        children: [
          {
            path: "/componentes/cdn/simulator",
            name: t('menu.componentes.cdn.simulator.name'),
            description: t('menu.componentes.cdn.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/api-gateway",
        name: t('menu.componentes.api_gateway.name'),
        description: t('menu.componentes.api_gateway.description'),
        children: [
          {
            path: "/componentes/api-gateway/simulator",
            name: t('menu.componentes.api_gateway.simulator.name'),
            description: t('menu.componentes.api_gateway.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/firewall",
        name: t('menu.componentes.firewall.name'),
        description: t('menu.componentes.firewall.description'),
        children: [
          {
            path: "/componentes/firewall/simulator",
            name: t('menu.componentes.firewall.simulator.name'),
            description: t('menu.componentes.firewall.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/polling-webhooks",
        name: t('menu.componentes.polling_webhooks.name'),
        description: t('menu.componentes.polling_webhooks.description'),
        status: "new",
        badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
        children: [
          {
            path: "/componentes/polling-webhooks",
            name: t('menu.componentes.polling_webhooks.teoria.name'),
            description: t('menu.componentes.polling_webhooks.teoria.description'),
          },
          {
            path: "/componentes/polling-webhooks/simulator",
            name: t('menu.componentes.polling_webhooks.simulator.name'),
            description: t('menu.componentes.polling_webhooks.simulator.description'),
          },
        ],
      },
    ],
  },
  {
    path: "/system-design-101",
    name: t('menu.system_design_101.name'),
    description: t('menu.system_design_101.description'),
    badges: [{ text: t('badges.free'), color: "bg-green-500" }],
    status: "recommended",
    prerequisites: ["componentes"],
    category: "Application",
  },
  {
    path: "/principios-design",
    name: t('menu.principios_design.name'),
    description: t('menu.principios_design.description'),

    status: "recommended",
    prerequisites: ["system-design-101"],
    category: "Advanced Concepts",
    children: [
      {
        path: "/principios-design/escalabilidade",
        name: t('menu.principios_design.escalabilidade.name'),
        description: t('menu.principios_design.escalabilidade.description'),
        children: [
          {
            path: "/principios-design/escalabilidade/horizontal",
            name: t('menu.principios_design.escalabilidade.horizontal.name'),
            description: t('menu.principios_design.escalabilidade.horizontal.description'),
            children: [
              {
                path: "/principios-design/escalabilidade/horizontal/simulator",
                name: t('menu.principios_design.escalabilidade.horizontal.simulator.name'),
                description: t('menu.principios_design.escalabilidade.horizontal.simulator.description'),
              },
            ],
          },
          {
            path: "/principios-design/escalabilidade/vertical",
            name: t('menu.principios_design.escalabilidade.vertical.name'),
            description: t('menu.principios_design.escalabilidade.vertical.description'),
            children: [
              {
                path: "/principios-design/escalabilidade/vertical/simulator",
                name: t('menu.principios_design.escalabilidade.vertical.simulator.name'),
                description: t('menu.principios_design.escalabilidade.vertical.simulator.description'),
              },
            ],
          },
          {
            path: "/principios-design/escalabilidade/latencia",
            name: t('menu.principios_design.escalabilidade.latencia.name'),
            description: t('menu.principios_design.escalabilidade.latencia.description'),
          },
          {
            path: "/principios-design/escalabilidade/failover",
            name: t('menu.principios_design.escalabilidade.failover.name'),
            description: t('menu.principios_design.escalabilidade.failover.description'),
          },
          {
            path: "/principios-design/escalabilidade/simulator",
            name: t('menu.principios_design.escalabilidade.simulator.name'),
            description: t('menu.principios_design.escalabilidade.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/disponibilidade",
        name: t('menu.principios_design.disponibilidade.name'),
        description: t('menu.principios_design.disponibilidade.description'),
        children: [
          {
            path: "/principios-design/disponibilidade/replicacao",
            name: t('menu.principios_design.disponibilidade.replicacao.name'),
            description: t('menu.principios_design.disponibilidade.replicacao.description'),
          },
          {
            path: "/principios-design/disponibilidade/failover",
            name: t('menu.principios_design.disponibilidade.failover.name'),
            description: t('menu.principios_design.disponibilidade.failover.description'),
          },
          {
            path: "/principios-design/disponibilidade/zonas",
            name: t('menu.principios_design.disponibilidade.zonas.name'),
            description: t('menu.principios_design.disponibilidade.zonas.description'),
          },
          
          {
            path: "/principios-design/disponibilidade/simulator",
            name: t('menu.principios_design.disponibilidade.simulator.name'),
            description: t('menu.principios_design.disponibilidade.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/tolerancia-falhas",
        name: t('menu.principios_design.tolerancia_falhas.name'),
        description: t('menu.principios_design.tolerancia_falhas.description'),
        children: [
          {
            path: "/principios-design/tolerancia-falhas/retries",
            name: t('menu.principios_design.tolerancia_falhas.retries.name'),
            description: t('menu.principios_design.tolerancia_falhas.retries.description'),
            children: [
              {
                path: "/principios-design/tolerancia-falhas/retries/simulator",
                name: t('menu.principios_design.tolerancia_falhas.retries.simulator.name'),
                description: t('menu.principios_design.tolerancia_falhas.retries.simulator.description'),
              },
            ],
          },
          {
            path: "/principios-design/tolerancia-falhas/circuit-breaker",
            name: t('menu.principios_design.tolerancia_falhas.circuit_breaker.name'),
            description: t('menu.principios_design.tolerancia_falhas.circuit_breaker.description'),
            children: [
              {
                path: "/principios-design/tolerancia-falhas/circuit-breaker/simulator",
                name: t('menu.principios_design.tolerancia_falhas.circuit_breaker.simulator.name'),
                description: t('menu.principios_design.tolerancia_falhas.circuit_breaker.simulator.description'),
              },
            ],
          },
          {
            path: "/principios-design/tolerancia-falhas/timeout",
            name: t('menu.principios_design.tolerancia_falhas.timeout.name'),
            description: t('menu.principios_design.tolerancia_falhas.timeout.description'),
            children: [
              {
                path: "/principios-design/tolerancia-falhas/timeout/simulator",
                name: t('menu.principios_design.tolerancia_falhas.timeout.simulator.name'),
                description: t('menu.principios_design.tolerancia_falhas.timeout.simulator.description'),
              },
            ],
          },
        ],
      },
      {
        path: "/principios-design/eventos",
        name: t('menu.principios_design.eventos.name'),
        description: t('menu.principios_design.eventos.description'),
        children: [
          {
            path: "/principios-design/eventos/simulator",
            name: t('menu.principios_design.eventos.simulator.name'),
            description: t('menu.principios_design.eventos.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/servicos",
        name: t('menu.principios_design.servicos.name'),
        description: t('menu.principios_design.servicos.description'),
      },
      {
        path: "/principios-design/acoplamento",
        name: t('menu.principios_design.acoplamento.name'),
        description: t('menu.principios_design.acoplamento.description'),
        badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
      },
      {
        path: "/principios-design/orquestracao-vs-coreografia",
        name: t('menu.principios_design.orquestracao_vs_coreografia.name'),
        description: t('menu.principios_design.orquestracao_vs_coreografia.description'),
        component: OrchestrationVsChoreography,
        status: "new"
      }
    ],
  },
  {
    path: "/seguranca",
    name: t('menu.seguranca.name'),
    description: t('menu.seguranca.description'),

    status: "required",
    prerequisites: ["principios-design"],
    category: "Security & Safety",
    children: [
      {
        path: "/seguranca/autenticacao",
        name: t('menu.seguranca.autenticacao.name'),
        description: t('menu.seguranca.autenticacao.description'),
      },
      {
        path: "/seguranca/autorizacao",
        name: t('menu.seguranca.autorizacao.name'),
        description: t('menu.seguranca.autorizacao.description'),
      },
      {
        path: "/seguranca/criptografia",
        name: t('menu.seguranca.criptografia.name'),
        description: t('menu.seguranca.criptografia.description'),
        children: [
          {
            path: "/seguranca/criptografia/simulador",
            name: t('menu.seguranca.criptografia.simulador.name'),
            description: t('menu.seguranca.criptografia.simulador.description'),
          },
        ],
      },
      {
        path: "/seguranca/tokens",
        name: t('menu.seguranca.tokens.name'),
        description: t('menu.seguranca.tokens.description'),
        children: [
          {
            path: "/seguranca/tokens/simulador",
            name: t('menu.seguranca.tokens.simulador.name'),
            description: t('menu.seguranca.tokens.simulador.description'),
          },
        ],
      },
      {
        path: "/seguranca/ssl-tls",
        name: t('menu.seguranca.ssl_tls.name'),
        description: t('menu.seguranca.ssl_tls.description'),
      },
      {
        path: "/seguranca/ataques",
        name: t('menu.seguranca.ataques.name'),
        description: t('menu.seguranca.ataques.description'),
      },
    ],
  },
  {
    name: t('menu.estrategias_de_consistencia.name'),
    description: t('menu.estrategias_de_consistencia.description'),
    path: "/estrategias-de-consistencia",
    status: "recommended",
    prerequisites: [t('prerequisites.design_principles')],
    category: t('categories.advanced'),
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
    skills: [t('skills.consensus'), t('skills.lamport_timestamps'), t('skills.eventual_consistency'), t('skills.synchronization')],
    children: [
      {
        name: t('menu.estrategias_de_consistencia.sincronizacao.name'),
        description: t('menu.estrategias_de_consistencia.sincronizacao.description'),
        path: "/estrategias-de-consistencia/sincronizacao",
        status: "recommended",
        prerequisites: [],
        category: t('categories.advanced'),
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        skills: [t('skills.mutual_exclusion'), t('skills.deadlock_prevention'), t('skills.distributed_synchronization')],
        children: [
          {
            name: t('menu.estrategias_de_consistencia.sincronizacao.fundamentos.name'),
            path: "/estrategias-de-consistencia/sincronizacao/fundamentos",
            description: t('menu.estrategias_de_consistencia.sincronizacao.fundamentos.description'),
            status: "recommended",
            skills: [t('skills.mutual_exclusion'), t('skills.race_conditions'), t('skills.shared_resources')]
          },
          {
            name: t('menu.estrategias_de_consistencia.sincronizacao.deadlocks.name'),
            path: "/estrategias-de-consistencia/sincronizacao/deadlocks",
            description: t('menu.estrategias_de_consistencia.sincronizacao.deadlocks.description'),
            status: "recommended",
            skills: [t('skills.deadlock_detection'), t('skills.prevention'), t('skills.recovery')]
          },
          {
            name: t('menu.estrategias_de_consistencia.sincronizacao.algoritmos.name'),
            path: "/estrategias-de-consistencia/sincronizacao/algoritmos",
            description: t('menu.estrategias_de_consistencia.sincronizacao.algoritmos.description'),
            status: "recommended",
            skills: [t('skills.bakery_algorithm'), t('skills.token_ring'), t('skills.ricart_agrawala')]
          },
          // {
          //   name: "Simulador dos Filósofos",
          //   path: "/estrategias-de-consistencia/sincronizacao/simulador",
          //   description: "Experimente diferentes estratégias de sincronização",
          //   status: "recommended",
          //   skills: ["Visualização", "Experimentação", "Análise de Soluções"]
          // }
        ]
      },
      {
        name: t('menu.estrategias_de_consistencia.two_phase_commit.name'),
        description: t('menu.estrategias_de_consistencia.two_phase_commit.description'),
        path: "/estrategias-de-consistencia/two-phase-commit",
        status: "recommended",
        prerequisites: [],
        category: t('categories.advanced'),
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
        skills: [t('skills.two_phase_commit'), t('skills.distributed_transactions'), t('skills.atomic_consensus')],
        children: [
          {
            name: t('menu.estrategias_de_consistencia.two_phase_commit.simulador.name'),
            path: "/estrategias-de-consistencia/two-phase-commit/simulador",
            description: t('menu.estrategias_de_consistencia.two_phase_commit.simulador.description'),
          },
        ],
      },
      {
        name: t('menu.estrategias_de_consistencia.consenso.name'),
        path: "/estrategias-de-consistencia/consenso",
        description: t('menu.estrategias_de_consistencia.consenso.description'),
        children: [
          {
            name: t('menu.estrategias_de_consistencia.consenso.simulador.name'),
            path: "/estrategias-de-consistencia/consenso/simulador",
            description: t('menu.estrategias_de_consistencia.consenso.simulador.description'),
          },
        ],
      },
      {
        name: t('menu.estrategias_de_consistencia.lamport_timestamps.name'),
        path: "/estrategias-de-consistencia/lamport-timestamps",
        description: t('menu.estrategias_de_consistencia.lamport_timestamps.description'),
        children: [
          {
            name: t('menu.estrategias_de_consistencia.lamport_timestamps.simulador.name'),
            path: "/estrategias-de-consistencia/lamport-timestamps/simulador",
            description: t('menu.estrategias_de_consistencia.lamport_timestamps.simulador.description'),
          },
        ],
      },
    ],
  },
  {
    path: "/monitoramento-e-manutencao",
    name: t('menu.monitoramento_e_manutencao.name'),
    description: t('menu.monitoramento_e_manutencao.description'),
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
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
        name: t('menu.monitoramento_e_manutencao.metricas.name'),
        description: t('menu.monitoramento_e_manutencao.metricas.description'),
      },
      {
        path: "/monitoramento-e-manutencao/logs",
        name: t('menu.monitoramento_e_manutencao.logs.name'),
        description: t('menu.monitoramento_e_manutencao.logs.description'),
        children: [
          {
            name: t('menu.monitoramento_e_manutencao.logs.simulador.name'),
            description: t('menu.monitoramento_e_manutencao.logs.simulador.description'),
            path: "/monitoramento-e-manutencao/logs/simulador",
            component: LogSimulator,
            status: "new"
          },
          {
            path: "/monitoramento-e-manutencao/logs/tracing",
            name: t('menu.monitoramento_e_manutencao.logs.tracing.name'),
            description: t('menu.monitoramento_e_manutencao.logs.tracing.description'),
            component: TracingSimulator,
            status: "new"
          }
        ]
      },
      {
        path: "/monitoramento-e-manutencao/alertas",
        name: t('menu.monitoramento_e_manutencao.alertas.name'),
        description: t('menu.monitoramento_e_manutencao.alertas.description'),
      },
      {
        path: "/monitoramento-e-manutencao/performance",
        name: t('menu.monitoramento_e_manutencao.performance.name'),
        description: t('menu.monitoramento_e_manutencao.performance.description'),
      },
      {
        path: "/monitoramento-e-manutencao/health-checks",
        name: t('menu.monitoramento_e_manutencao.health_checks.name'),
        description: t('menu.monitoramento_e_manutencao.health_checks.description'),
      },
    ],
  },
  {
    path: "/casos-reais",
    name: t('menu.casos_reais.name'),
    description: t('menu.casos_reais.description'),
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
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
        name: t('menu.casos_reais.youtube.name'),
        description: t('menu.casos_reais.youtube.description'),
      },
      {
        path: "/casos-reais/spotify",
        name: t('menu.casos_reais.spotify.name'),
        description: t('menu.casos_reais.spotify.description'),
      },
      {
        path: "/casos-reais/bitly",
        name: t('menu.casos_reais.bitly.name'),
        description: t('menu.casos_reais.bitly.description')
      },
      {
        path: "/casos-reais/whatsapp",
        name: t('menu.casos_reais.whatsapp.name'),
        description: t('menu.casos_reais.whatsapp.description')
      },
      {
        path: "/casos-reais/netflix",
        name: t('menu.casos_reais.netflix.name'),
        description: t('menu.casos_reais.netflix.description')
      },
      {
        path: "/casos-reais/uber",
        name: t('menu.casos_reais.uber.name'),
        description: t('menu.casos_reais.uber.description'),
      },
    ],
  },
  {
    path: "/editor",
    name: t('menu.editor.name'),
    description: t('menu.editor.description'),
    status: "new",
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
    icon: (
      <svg
        className="w-6 h-6 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut } = useAuth();
  const { isCompleted, progress, updateTrigger } = useContentProgress();
  const { t } = useTranslation();
  const menuItems = createMenuItems(t);
  
  // Coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [hasShownCouponModal, setHasShownCouponModal] = useState(false);
  const [previousUser, setPreviousUser] = useState<any>(null);

  // Make menuItems accessible to other components via window object
  // This helps avoid circular dependencies when components need to access menuItems
  useEffect(() => {
    // Initialize the __APP_DATA__ object if it doesn't exist
    if (!window.__APP_DATA__) {
      window.__APP_DATA__ = {
        menuItems: []
      };
    }
    
    // Update menuItems in the window object
    window.__APP_DATA__.menuItems = menuItems;
  }, []);

  // Initialize analytics only if user has consented
  useEffect(() => {
    if (CookieConsentManager.hasAnalyticsConsent()) {
      initializeAnalytics();
    }
    
    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);
  }, []);

  // Detect actual login (transition from no user to user) and show coupon modal
  useEffect(() => {
    // Detect fresh login: user went from null/undefined to logged in
    const isNewLogin = !previousUser && user;
    
    if (isNewLogin && !hasShownCouponModal) {
      // Check if modal was already shown in this browser session
      const modalShownThisSession = sessionStorage.getItem('couponModalShown');
      
      if (!modalShownThisSession) {
        // Mark that we're showing the modal this session
        sessionStorage.setItem('couponModalShown', 'true');
        
        // This is a genuine new login, show the modal
        const timer = setTimeout(() => {
          setShowCouponModal(true);
          setHasShownCouponModal(true);
        }, 1000); // 1 second delay to let the user see they've logged in
        
        return () => clearTimeout(timer);
      }
    }
    
    // Update previous user state
    setPreviousUser(user);
  }, [user, previousUser, hasShownCouponModal]);
  
  // Reset modal state when user logs out
  useEffect(() => {
    if (!user) {
      setHasShownCouponModal(false);
      setShowCouponModal(false);
      // Clear session storage when user logs out so modal can show for next login
      sessionStorage.removeItem('couponModalShown');
    }
  }, [user]);

  const MenuLink = ({ item, onNavigate }: { item: MenuItem; onNavigate?: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { pathname } = useLocation();
    const { isCompleted, updateTrigger } = useContentProgress();
    const { t } = useTranslation();
    const makeMenuKey = (path: string, field: 'name' | 'description') => `menu.${path.replace(/^\//, '').replace(/\//g, '.')}.${field}`;
    const displayName = t(makeMenuKey(item.path, 'name'), { defaultValue: item.name });
    const displayDescription = t(makeMenuKey(item.path, 'description'), { defaultValue: item.description });
    
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
    
    // This forces the component to re-render when updateTrigger changes
    useEffect(() => {
      // Empty dependency on updateTrigger causes re-render
    }, [updateTrigger]);

    const translatedBadge = (badgeText?: string) => {
      if (!badgeText) return '';
      if (badgeText.toLowerCase() === 'grátis' || badgeText.toLowerCase() === 'free') return t('badges.free');
      if (badgeText.toLowerCase() === 'novo' || badgeText.toLowerCase() === 'new') return t('badges.new');
      return badgeText;
    };

    return (
      <div className="text-white">
        <div className="flex items-center gap-1">
          {item.disabled ? (
            <div className="flex-1 flex flex-col p-3 rounded-lg text-zinc-600 relative cursor-not-allowed">
              <div className="absolute -top-2 right-2 bg-zinc-800 text-white text-xs px-2 py-0.5 rounded-full">
                {t('status.coming_soon')}
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">{item.name}</span>
                {isCompleted(item.path) && (
                  <span className="flex-shrink-0 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </span>
                )}
              </div>
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
                if (!item.disabled) {
                  onNavigate?.();
                  trackEvent("User", "Clicked on Menu Item", item.name);
                }
              }}
            >
              <div className="flex items-center">
                <span className="font-medium mr-2">{displayName}</span>
                {isCompleted(item.path) && (
                  <span className="flex-shrink-0 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </span>
                )}
              </div>
              <span className="text-sm opacity-75">{displayDescription}</span>
              {item.badges && (
                <div className="absolute -top-2 right-2 flex gap-1">
                  {item.badges.map((badge, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${badge.color}`}
                    >
                      {translatedBadge(badge.text)}
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
                trackEvent("User", "Clicked on Menu Item", displayName);
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
              <MenuLink key={child.path} item={child} onNavigate={onNavigate} />
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
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Header */}
        {isMobile && user && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <img src="/logo.png" alt="Logo" className="h-12" />
              </Link>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/80"
                >
                  {isSidebarOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        {user && (
          <aside
            className={`${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${
              isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'
            } w-80 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 transition-transform duration-300 ease-in-out flex flex-col`}
          >
            {/* Sidebar Content */}
            <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent ${isMobile ? 'pt-16' : ''}`}>
              <div className="p-6">
                {!isMobile && (
                  <div className="flex items-center justify-between mb-8 ">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mx-auto">
                      <img src="/logo.png" alt="Logo" className="h-14 mx-auto" /> 
                    </Link>
                  </div>
                )}
                <div className="flex justify-end mb-4">
                  <LanguageSwitcher />
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <MenuLink 
                      key={item.path} 
                      item={item} 
                      onNavigate={() => isMobile && setIsSidebarOpen(false)}
                    />
                  ))}
                </nav>
              </div>
            </div>

            {/* User profile section */}
            {user && (
              <div className="p-4 border-t border-zinc-800/50">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/80 backdrop-blur-xl rounded-lg">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.displayName || user.email}
                    </p>
                    {user.displayName && (
                      <p className="text-xs text-zinc-300 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={signOut}
                    className="text-zinc-300 hover:text-white transition-colors"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black ${isMobile ? 'pt-16' : ''}`}>
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
            <Route 
              path="/pagamento/sucesso" 
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <PaymentSuccess />
                </ProtectedRoute>
              } 
            />
            <Route path="/editor" element={<SimpleSystemEditorPage />} />
            
            {/* Preferences routes */}
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <Preferences />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences/cookies" 
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <CookiePreferencesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes */}
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
              path="/theoretical-foundations"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <TheoreticalFoundations />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/theoretical-foundations/cap-theorem"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <CAPTheorem />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/theoretical-foundations/consistency-models"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <ConsistencyModels />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/theoretical-foundations/distributed-challenges"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <DistributedChallenges />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/theoretical-foundations/network-partitions"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <NetworkPartitions />
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
                    <AvailabilityZonesSimulator />
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
              path="/componentes/polling-webhooks"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <PollingWebhooksTheory />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/componentes/polling-webhooks/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <PollingWebhooks />
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
              path="/estrategias-de-consistencia/sincronizacao"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Synchronization />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/sincronizacao/fundamentos"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SynchronizationFundamentals />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/sincronizacao/deadlocks"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SynchronizationDeadlocks />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/sincronizacao/algoritmos"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SynchronizationAlgorithms />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estrategias-de-consistencia/sincronizacao/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <SynchronizationSimulator />
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
              path="/principios-design/orquestracao-vs-coreografia"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <OrchestrationVsChoreography />
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
            <Route
              path="/principios-design/disponibilidade/zonas"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <AvailabilityZones />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/principios-design/disponibilidade/zonas/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <AvailabilityZonesSimulator />
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
              path="/principios-design/disponibilidade/replicacao/simulador"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <ReplicationSimulator />
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
            
          </Routes>
        </main>
      </div>
      
      {/* Coupon Modal */}
      <CouponModal 
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        couponCode="DINA30"
      />
      
      <LanguageDetectionDialog />
      <CookieConsentBanner onConsentChange={handleConsentChange} />
    </div>
  );
}
