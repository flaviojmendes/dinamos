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
import CircuitBreaker from "./components/CircuitBreaker/CircuitBreaker";
import Backpressure from "./components/Backpressure/Backpressure";
import RateLimiter from "./components/RateLimiter/RateLimiter";
import AsyncSync from "./components/AsyncSync/AsyncSync";
import CDN from "./components/CDN/CDN";
import RoundRobin from "./components/RoundRobin/RoundRobin";
import MessageQueueSimulator from "./components/MessageQueue/MessageQueue";
import CDNSimulator from "./components/CDN/CDN";
import APIGatewaySimulator from "./components/APIGateway/APIGatewaySimulator";
import EventSourcingSimulator from "./components/DesignPrinciples/EventSourcingSimulator";
import LogSimulator from "./components/Monitoramento/LogSimulator";
import TracingSimulator from './components/Monitoramento/TracingSimulator';

import LandingPage from "./components/LandingPage/LandingPage";
import CommandCenter from "./components/Dashboard/CommandCenter";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Subscription from "./components/Subscription/Subscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import { trackEvent, trackPageView, initializeAnalytics, handleConsentChange } from './utils/analytics';
import ServiceOriented from "./components/DesignPrinciples/ServiceOriented";
import RetriesSimulator from "./components/DesignPrinciples/RetriesSimulator";
import TimeoutSimulator from "./components/DesignPrinciples/TimeoutSimulator";
import HorizontalScalingSimulator from "./components/HorizontalScaling/HorizontalScalingSimulator";
import VerticalScalingSimulator from "./components/DesignPrinciples/VerticalScalingSimulator";
import ScalabilitySimulator from "./components/DesignPrinciples/ScalabilitySimulator";
import ReplicacaoSimulator from "./components/DesignPrinciples/ReplicacaoSimulator";
import ServiceArchitectureSimulator from "./components/DesignPrinciples/ServiceArchitectureSimulator";
import Preferences from "./components/Preferences/Preferences";
import ConsensusSimulator from "./components/ConsistencyStrategies/ConsensusSimulator";
import FirewallSimulator from "./components/SystemComponents/FirewallSimulator";
import LamportTimestampsSimulator from "./components/ConsistencyStrategies/LamportTimestampsSimulator";
import SystemEditor from "./components/SystemEditor/SystemEditor";
import TokensSimulator from "./components/Security/TokensSimulator";
import CryptographySimulator from "./components/Security/CryptographySimulator";
import AttackSimulatorPage from "./components/Security/AttackSimulatorPage";
import Roadmap from "./components/Roadmap/Roadmap";
import ContentLayout from "./components/Common/ContentLayout";
import LanguageDetectionDialog from "./components/Common/LanguageDetectionDialog";
import { useContentProgress, PROGRESS_UPDATED_EVENT } from "./hooks/useContentProgress";
import ContentPage from "./components/Common/ContentPage";
import MdxPage, { availableSlugs } from "./components/Common/MdxPage";
import { contentManifest } from "./config/contentManifest";
import CanaryDeploymentSimulator from "./components/CanaryDeployment/CanaryDeploymentSimulator";
import TwoPhaseCommitSimulator from "./components/ConsistencyStrategies/TwoPhaseCommitSimulator";
import Logs from "./components/MonitoringMaintenance/Logs";

import SynchronizationAlgorithms from './components/ConsistencyStrategies/SynchronizationAlgorithms';
import SynchronizationSimulator from "./components/ConsistencyStrategies/SynchronizationSimulator";
import SimpleSystemEditorPage from "./pages/SimpleSystemEditorPage";
import PollingWebhooks from "./components/SystemComponents/PollingWebhooks";
import { LanguageSwitcher, CouponModal } from './components/Common';
import ThemeToggle from "./components/Common/ThemeToggle";
import TopStatusBar from "./components/Common/TopStatusBar";
import { useTranslation } from 'react-i18next';
import CookieConsentBanner from './components/Common/CookieConsentBanner';
import { CookieConsentManager } from './utils/cookieConsent';
import CookiePreferencesPage from './pages/CookiePreferencesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ReplicationSimulator from "./components/DesignPrinciples/ReplicationSimulator";
import AvailabilityZonesSimulator from "./components/DesignPrinciples/AvailabilityZonesSimulator";
import { ForumPage } from "./components/Forum";

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
  external?: boolean;
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
        status: "new"
      },
      {
        path: "/principios-design/canary-deployment",
        name: t('menu.principios_design.canary_deployment.name'),
        description: t('menu.principios_design.canary_deployment.description'),
        status: "new",
        badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
        children: [
          {
            path: "/principios-design/canary-deployment/simulator",
            name: t('menu.principios_design.canary_deployment.simulator.name'),
            description: t('menu.principios_design.canary_deployment.simulator.description'),
          },
        ],
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
        className="w-6 h-6 text-brand-600 dark:text-brand-400"
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
  {
    path: "/forum",
    name: t('menu.forum.name'),
    description: t('menu.forum.description'),
    status: "new",
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
    icon: (
      <svg
        className="w-6 h-6 text-emerald-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
  },
  {
    path: "https://lab.dinamos.net",
    name: t('menu.design_lab.name'),
    description: t('menu.design_lab.description'),
    external: true,
    status: "new",
    badges: [{ text: t('badges.new'), color: "bg-blue-500" }],
    icon: (
      <svg
        className="w-6 h-6 text-pink-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
];

// Quick-access destinations surfaced at the top of the main sidebar.
const railLinks: { to: string; labelKey: string; label: string; d: string }[] = [
  { to: '/', labelKey: 'command_center', label: 'Command Center', d: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/roadmap', labelKey: 'roadmap', label: 'Roadmap', d: 'M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 012.447-1.842L9 5m0 15l6-3m-6 3V5m6 12l5.447 2.724A2 2 0 0021 15.382V5.618a2 2 0 00-2.447-1.842L15 5m0 12V5' },
  { to: '/editor', labelKey: 'editor', label: 'System Editor', d: 'M11 4H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7m-9 2l9-9 3 3-9 9H8v-2z' },
  { to: '/forum', labelKey: 'forum', label: 'Forum', d: 'M8 12h8M8 8h8m-8 8h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/preferences', labelKey: 'preferences', label: 'Preferences', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut, isSubscribed } = useAuth();
  const { isCompleted, progress, updateTrigger } = useContentProgress();
  const { t } = useTranslation();
  const menuItems = createMenuItems(t);
  
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

    // Tactical menu item: sharp edges, mono label, left accent on active, bracket tags.
    const itemBase =
      'group flex-1 flex flex-col gap-0.5 px-3 py-2.5 border-l-2 transition-colors relative';
    const itemInactive =
      'border-transparent text-slate-600 dark:text-tactical-dim hover:bg-slate-100 dark:hover:bg-tactical-raised hover:text-slate-900 dark:hover:text-tactical-text';
    const itemActive =
      'border-brand-600 dark:border-signal-green bg-brand-50 dark:bg-tactical-raised text-slate-900 dark:text-tactical-text';

    const CompletedMark = () => (
      <span className="ml-auto flex-shrink-0 text-signal-green" title="completed">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </span>
    );

    const Badges = () =>
      item.badges ? (
        <div className="flex gap-1.5 mt-1">
          {item.badges.map((badge, index) => (
            <span key={index} className="font-mono text-[10px] uppercase tracking-wider text-signal-green">
              [{translatedBadge(badge.text)}]
            </span>
          ))}
        </div>
      ) : null;

    return (
      <div className="text-slate-900 dark:text-tactical-text">
        <div className="flex items-stretch gap-1">
          {item.disabled ? (
            <div className="flex-1 flex flex-col gap-0.5 px-3 py-2.5 border-l-2 border-transparent text-slate-400 dark:text-tactical-label/70 relative cursor-not-allowed">
              <div className="flex items-center">
                <span className="font-mono text-sm tracking-tight mr-2">{item.name}</span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                  [{t('status.coming_soon')}]
                </span>
              </div>
              <span className="font-mono text-xs opacity-70">{item.description}</span>
            </div>
          ) : item.external ? (
            <a
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className={`${itemBase} ${item.customStyle ? `${item.customStyle} ${item.customHoverStyle || 'hover:bg-slate-100 dark:hover:bg-tactical-raised'}` : ''} ${itemInactive}`}
              onClick={() => {
                if (!item.disabled) {
                  onNavigate?.();
                  trackEvent("User", "Clicked on External Menu Item", item.name);
                }
              }}
            >
              <div className="flex items-center">
                <span className="font-mono text-sm tracking-tight mr-2">{displayName}</span>
                <svg className="w-3.5 h-3.5 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <span className="font-mono text-xs opacity-70">{displayDescription}</span>
              <Badges />
            </a>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `${itemBase} ${isActive ? itemActive : `${item.customStyle ?? ''} ${itemInactive}`}`
              }
              onClick={() => {
                if (!item.disabled) {
                  onNavigate?.();
                  trackEvent("User", "Clicked on Menu Item", item.name);
                }
              }}
            >
              <div className="flex items-center">
                <span className="font-mono text-sm tracking-tight mr-2">{displayName}</span>
                {isCompleted(item.path) && <CompletedMark />}
              </div>
              <span className="font-mono text-xs opacity-70">{displayDescription}</span>
              <Badges />
            </NavLink>
          )}
          {item.children && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
                trackEvent("User", "Clicked on Menu Item", displayName);
              }}
              className={`px-2 text-slate-400 dark:text-tactical-label hover:text-slate-900 dark:hover:text-tactical-text hover:bg-slate-100 dark:hover:bg-tactical-raised transition-colors ${
                isActive ? "text-slate-900 dark:text-tactical-text" : ""
              }`}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {item.children && isExpanded && (
          <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 dark:border-tactical-border pl-2">
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
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Header */}
        {isMobile && user && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-tactical-surface/95 backdrop-blur-xl border-b border-slate-200 dark:border-tactical-border px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                <img src="/logo.png" alt="Logo" className="h-12" />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text rounded-lg dark:rounded-none hover:bg-slate-100 dark:hover:bg-tactical-raised"
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
            } w-80 bg-white dark:bg-tactical-surface border-r border-slate-200 dark:border-tactical-border transition-transform duration-300 ease-in-out flex flex-col`}
          >
            {/* Sidebar Content */}
            <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-tactical-line scrollbar-track-transparent ${isMobile ? 'pt-16' : ''}`}>
              <div className="p-4">
                {!isMobile && (
                  <div className="flex items-center justify-between mb-5 px-2">
                    <Link to="/" className="flex items-center gap-2">
                      <img src="/logo.png" alt="Logo" className="h-9" />
                      <span className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-900 dark:text-tactical-text">Dinamos</span>
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="label-mono">NAV // INDEX</span>
                  <div className="flex gap-2">
                    <ThemeToggle />
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Quick access: top-level destinations with icons */}
                <div className="mb-4">
                  <span className="label-mono px-2">{t('quick_access.title')}</span>
                  <div className="mt-2 space-y-0.5">
                    {railLinks.map(({ to, labelKey, label, d }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                        className={({ isActive }: { isActive: boolean }) =>
                          `flex items-center gap-2.5 px-3 py-2 border-l-2 font-mono text-sm tracking-tight transition-colors ${
                            isActive
                              ? 'border-brand-600 dark:border-signal-green bg-brand-50 dark:bg-tactical-raised text-slate-900 dark:text-tactical-text'
                              : 'border-transparent text-slate-600 dark:text-tactical-dim hover:bg-slate-100 dark:hover:bg-tactical-raised hover:text-slate-900 dark:hover:text-tactical-text'
                          }`
                        }
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
                        </svg>
                        <span className="truncate">{t(`quick_access.${labelKey}`, { defaultValue: label })}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="mb-3 border-t border-slate-200 dark:border-tactical-border" />

                <nav className="space-y-0.5">
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
              <div className="p-3 border-t border-slate-200 dark:border-tactical-border">
                <div className="flex items-center gap-3 p-3 tactical-panel bg-slate-100 dark:bg-tactical-raised">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-none border border-brand-500 dark:border-signal-green"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-brand-500 dark:bg-tactical-bg dark:border dark:border-signal-green flex items-center justify-center">
                      <span className="text-lg font-bold font-mono text-white dark:text-signal-green">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-medium text-slate-900 dark:text-tactical-text truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="label-mono truncate">
                      {isSubscribed ? 'ACCESS: FREE-TIER-1' : 'ACCESS: GUEST'}
                    </p>
                  </div>
                  <button
                    onClick={signOut}
                    className="text-slate-400 hover:text-slate-700 dark:text-tactical-label dark:hover:text-signal-red transition-colors"
                    aria-label="Sign out"
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto bg-canvas-paper dark:bg-canvas-dark ${isMobile ? 'pt-16' : ''}`}>
          {user && <TopStatusBar />}
          <Routes>
            {/* Content-only pages rendered from MDX (src/content/**). One route per
                manifest entry replaces the ~60 former per-page component routes.
                Interactive simulators remain as explicit routes below. */}
            {contentManifest
              .filter((entry) => availableSlugs.has(entry.slug))
              .map(({ path, slug, requiresSubscription = true }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute requiresSubscription={requiresSubscription}>
                      <ContentPage>
                        <MdxPage slug={slug} />
                      </ContentPage>
                    </ProtectedRoute>
                  }
                />
              ))}
            <Route
              path="/principios-design/canary-deployment/simulator"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <CanaryDeploymentSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={user ? <CommandCenter /> : <LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
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
              path="/forum"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <ForumPage />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/:topicId"
              element={
                <ProtectedRoute requiresSubscription={false}>
                  <ContentPage>
                    <ForumPage />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </main>
      </div>
      
      <LanguageDetectionDialog />
      <CookieConsentBanner onConsentChange={handleConsentChange} />
    </div>
  );
}
