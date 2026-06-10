import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Simulators are heavy, route-only components rendered inside the <Suspense>
// boundary below. Lazy-load them so they are code-split out of the entry chunk
// and only fetched when their route is visited.
const CircuitBreaker = React.lazy(() => import("./components/CircuitBreaker/CircuitBreaker"));
const Backpressure = React.lazy(() => import("./components/Backpressure/Backpressure"));
const RateLimiter = React.lazy(() => import("./components/RateLimiter/RateLimiter"));
const AsyncSync = React.lazy(() => import("./components/AsyncSync/AsyncSync"));
const CDN = React.lazy(() => import("./components/CDN/CDN"));
const LogSimulator = React.lazy(() => import("./components/Monitoramento/LogSimulator"));
const TracingSimulator = React.lazy(() => import('./components/Monitoramento/TracingSimulator'));

import LandingPage from "./components/LandingPage/LandingPage";
import CommandCenter from "./components/Dashboard/CommandCenter";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
// --- designLab (merged) ---
import DLProtectedRoute from "./app/components/ProtectedRoute";
const DLHome = React.lazy(() => import("./app/pages/Home"));
const DLChallenge = React.lazy(() => import("./app/pages/Challenge"));
const DLFeedback = React.lazy(() => import("./app/pages/Feedback"));
const DLProfile = React.lazy(() => import("./app/pages/Profile"));
const DLNotifications = React.lazy(() => import("./app/pages/Notifications"));
const DLLeaderboard = React.lazy(() => import("./app/pages/Leaderboard"));
const DLRegister = React.lazy(() => import("./app/pages/Register"));
const DLForgotPassword = React.lazy(() => import("./app/pages/ForgotPassword"));
const DLVerifyEmail = React.lazy(() => import("./app/pages/VerifyEmail"));
const DLForumList = React.lazy(() => import("./app/pages/forum/ForumList"));
const DLCreateTopic = React.lazy(() => import("./app/pages/forum/CreateTopic"));
const DLTopicView = React.lazy(() => import("./app/pages/forum/TopicView"));
const DLQuizList = React.lazy(() => import("./app/pages/quiz/QuizList"));
const DLQuizTake = React.lazy(() => import("./app/pages/quiz/QuizTake"));
const DLAdminUsers = React.lazy(() => import("./app/pages/AdminUsers"));
const DLAdminRoles = React.lazy(() => import("./app/pages/AdminRoles"));
const DLAdminChallenges = React.lazy(() => import("./app/pages/AdminChallenges"));
const DLAdminForumCategories = React.lazy(() => import("./app/pages/AdminForumCategories"));
const DLAdminNotifications = React.lazy(() => import("./app/pages/AdminNotifications"));
const DLAdminSettings = React.lazy(() => import("./app/pages/AdminSettings"));
const DLAdminQuizzes = React.lazy(() => import("./app/pages/AdminQuizzes"));
const DLAdminDashboard = React.lazy(() => import("./app/pages/AdminDashboard"));
const DLAdminContent = React.lazy(() => import("./app/pages/AdminContent"));
const DLAdminModules = React.lazy(() => import("./app/pages/AdminModules"));
const DLAdminHub = React.lazy(() => import("./app/pages/AdminHub"));
const DLAdminContentTree = React.lazy(() => import("./app/pages/AdminContentTree"));

function DesignLabRouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="inline-flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 dark:border-signal-green border-t-transparent" aria-hidden />
        <span className="font-mono uppercase tracking-wider text-sm text-slate-600 dark:text-tactical-dim">
          Carregando...
        </span>
      </div>
    </div>
  );
}
import { trackEvent, trackPageView, initializeAnalytics, handleConsentChange } from './utils/analytics';
const Preferences = React.lazy(() => import("./components/Preferences/Preferences"));
const Roadmap = React.lazy(() => import("./components/Roadmap/Roadmap"));
import ContentLayout from "./components/Common/ContentLayout";
import LanguageDetectionDialog from "./components/Common/LanguageDetectionDialog";
import { useContentProgress, PROGRESS_UPDATED_EVENT } from "./hooks/useContentProgress";
import ContentPage from "./components/Common/ContentPage";
import MdxPage from "./components/Common/MdxPage";
import { useContent } from "./contexts/ContentContext";
import { getSimulator } from "./config/simulatorRegistry";
import {
  contentRegistry,
  getItem,
  getModule,
  menuKey,
  fallbackLabel,
  orderRank,
  titleForPath,
  TIER_ORDER,
  type Tier,
} from "./config/contentRegistry";
const SynchronizationAlgorithms = React.lazy(() => import('./components/ConsistencyStrategies/SynchronizationAlgorithms'));
const SimpleSystemEditorPage = React.lazy(() => import("./pages/SimpleSystemEditorPage"));
const GameEditorPage = React.lazy(() => import("./pages/GameEditorPage"));
const AdminGameConsole = React.lazy(() => import("./pages/AdminGameConsole"));
import { LanguageSwitcher } from './components/Common';
import ThemeToggle from "./components/Common/ThemeToggle";
import TopStatusBar from "./components/Common/TopStatusBar";
import CommandPalette, { openCommandPalette } from "./components/Common/CommandPalette";
import { useTranslation } from 'react-i18next';
import CookieConsentBanner from './components/Common/CookieConsentBanner';
import Footer from "./components/Common/Footer";
import { CookieConsentManager } from './utils/cookieConsent';
import CookiePreferencesPage from './pages/CookiePreferencesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
// Forum is now served by the merged designLab forum (see /forum routes below).
const ExplorePage = React.lazy(() => import("./components/Explore/ExplorePage"));

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
  },
  {
    path: "/sistemas-distribuidos-101",
    name: t('menu.sistemas_distribuidos_101.name'),
    description: t('menu.sistemas_distribuidos_101.description'),
  },
  {
    path: "/theoretical-foundations",
    name: t('menu.theoretical_foundations.name'),
    description: t('menu.theoretical_foundations.description'),
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
      {
        path: "/componentes/vector-database",
        name: t('menu.componentes.vector_database.name'),
        description: t('menu.componentes.vector_database.description'),
      },
      {
        path: "/componentes/model-gateway",
        name: t('menu.componentes.model_gateway.name'),
        description: t('menu.componentes.model_gateway.description'),
      },
      {
        path: "/componentes/kafka",
        name: t('menu.componentes.kafka.name'),
        description: t('menu.componentes.kafka.description'),
        children: [
          {
            path: "/componentes/kafka/simulator",
            name: t('menu.componentes.kafka.simulator.name'),
            description: t('menu.componentes.kafka.simulator.description'),
          },
        ],
      },
      {
        path: "/componentes/dns",
        name: t('menu.componentes.dns.name'),
        description: t('menu.componentes.dns.description'),
      },
      {
        path: "/componentes/reverse-proxy",
        name: t('menu.componentes.reverse_proxy.name'),
        description: t('menu.componentes.reverse_proxy.description'),
      },
      {
        path: "/componentes/service-discovery",
        name: t('menu.componentes.service_discovery.name'),
        description: t('menu.componentes.service_discovery.description'),
      },
      {
        path: "/componentes/service-mesh",
        name: t('menu.componentes.service_mesh.name'),
        description: t('menu.componentes.service_mesh.description'),
      },
      {
        path: "/componentes/kubernetes",
        name: t('menu.componentes.kubernetes.name'),
        description: t('menu.componentes.kubernetes.description'),
      },
    ],
  },
  {
    path: "/system-design-101",
    name: t('menu.system_design_101.name'),
    description: t('menu.system_design_101.description'),
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
            path: "/principios-design/disponibilidade/zonas/simulator",
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
      },
      {
        path: "/principios-design/orquestracao-vs-coreografia",
        name: t('menu.principios_design.orquestracao_vs_coreografia.name'),
        description: t('menu.principios_design.orquestracao_vs_coreografia.description'),
      },
      {
        path: "/principios-design/canary-deployment",
        name: t('menu.principios_design.canary_deployment.name'),
        description: t('menu.principios_design.canary_deployment.description'),
        children: [
          {
            path: "/principios-design/canary-deployment/simulator",
            name: t('menu.principios_design.canary_deployment.simulator.name'),
            description: t('menu.principios_design.canary_deployment.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/cqrs",
        name: t('menu.principios_design.cqrs.name'),
        description: t('menu.principios_design.cqrs.description'),
        children: [
          {
            path: "/principios-design/cqrs/simulator",
            name: t('menu.principios_design.cqrs.simulator.name'),
            description: t('menu.principios_design.cqrs.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/rate-limiting",
        name: t('menu.principios_design.rate_limiting.name'),
        description: t('menu.principios_design.rate_limiting.description'),
        children: [
          {
            path: "/principios-design/rate-limiting/simulator",
            name: t('menu.principios_design.rate_limiting.simulator.name'),
            description: t('menu.principios_design.rate_limiting.simulator.description'),
          },
        ],
      },
      {
        path: "/principios-design/backpressure",
        name: t('menu.principios_design.backpressure.name'),
        description: t('menu.principios_design.backpressure.description'),
        children: [
          {
            path: "/backpressure",
            name: t('menu.principios_design.backpressure.simulator.name'),
            description: t('menu.principios_design.backpressure.simulator.description'),
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
            path: "/seguranca/criptografia/simulator",
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
            path: "/seguranca/tokens/simulator",
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
      {
        path: "/seguranca/prompt-injection",
        name: t('menu.seguranca.prompt_injection.name'),
        description: t('menu.seguranca.prompt_injection.description'),
        children: [
          {
            path: "/seguranca/prompt-injection/simulator",
            name: t('menu.seguranca.prompt_injection.simulador.name'),
            description: t('menu.seguranca.prompt_injection.simulador.description'),
          },
        ],
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
          //   path: "/estrategias-de-consistencia/sincronizacao/simulator",
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
            path: "/estrategias-de-consistencia/two-phase-commit/simulator",
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
            path: "/estrategias-de-consistencia/consenso/simulator",
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
            path: "/estrategias-de-consistencia/lamport-timestamps/simulator",
            description: t('menu.estrategias_de_consistencia.lamport_timestamps.simulador.description'),
          },
        ],
      },
      {
        name: t('menu.estrategias_de_consistencia.saga.name'),
        path: "/estrategias-de-consistencia/saga",
        description: t('menu.estrategias_de_consistencia.saga.description'),
        children: [
          {
            name: t('menu.estrategias_de_consistencia.saga.simulator.name'),
            path: "/estrategias-de-consistencia/saga/simulator",
            description: t('menu.estrategias_de_consistencia.saga.simulator.description'),
          },
        ],
      },
      {
        name: t('menu.estrategias_de_consistencia.delivery_semantics.name'),
        path: "/estrategias-de-consistencia/delivery-semantics",
        description: t('menu.estrategias_de_consistencia.delivery_semantics.description'),
        children: [
          {
            name: t('menu.estrategias_de_consistencia.delivery_semantics.simulator.name'),
            path: "/estrategias-de-consistencia/delivery-semantics/simulator",
            description: t('menu.estrategias_de_consistencia.delivery_semantics.simulator.description'),
          },
        ],
      },
      {
        name: t('menu.estrategias_de_consistencia.vector_clocks.name'),
        path: "/estrategias-de-consistencia/vector-clocks",
        description: t('menu.estrategias_de_consistencia.vector_clocks.description'),
      },
    ],
  },
  {
    path: "/monitoramento-e-manutencao",
    name: t('menu.monitoramento_e_manutencao.name'),
    description: t('menu.monitoramento_e_manutencao.description'),
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
            path: "/monitoramento-e-manutencao/logs/simulator",
            component: LogSimulator,
          },
          {
            path: "/monitoramento-e-manutencao/logs/tracing",
            name: t('menu.monitoramento_e_manutencao.logs.tracing.name'),
            description: t('menu.monitoramento_e_manutencao.logs.tracing.description'),
            component: TracingSimulator,
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
      {
        path: "/monitoramento-e-manutencao/llm-observability",
        name: t('menu.monitoramento_e_manutencao.llm_observability.name'),
        description: t('menu.monitoramento_e_manutencao.llm_observability.description'),
      },
      {
        path: "/monitoramento-e-manutencao/distributed-tracing",
        name: t('menu.monitoramento_e_manutencao.distributed_tracing.name'),
        description: t('menu.monitoramento_e_manutencao.distributed_tracing.description'),
      },
      {
        path: "/monitoramento-e-manutencao/slo-sli-sla",
        name: t('menu.monitoramento_e_manutencao.slo_sli_sla.name'),
        description: t('menu.monitoramento_e_manutencao.slo_sli_sla.description'),
      },
    ],
  },
  {
    path: "/casos-reais",
    name: t('menu.casos_reais.name'),
    description: t('menu.casos_reais.description'),
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
      {
        path: "/casos-reais/chatgpt",
        name: t('menu.casos_reais.chatgpt.name'),
        description: t('menu.casos_reais.chatgpt.description'),
      },
      {
        path: "/casos-reais/perplexity",
        name: t('menu.casos_reais.perplexity.name'),
        description: t('menu.casos_reais.perplexity.description'),
      },
      {
        path: "/casos-reais/github-copilot",
        name: t('menu.casos_reais.github_copilot.name'),
        description: t('menu.casos_reais.github_copilot.description'),
      },
    ],
  },
  {
    path: "/sistemas-ia",
    name: t('menu.ai_systems.name'),
    description: t('menu.ai_systems.description'),
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
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 7h10v10H7V7zm3 3h4v4h-4v-4z"
        />
      </svg>
    ),
    children: [
      {
        path: "/sistemas-ia/llm-serving-fundamentals",
        name: t('menu.ai_systems.llm_serving_fundamentals.name'),
        description: t('menu.ai_systems.llm_serving_fundamentals.description'),
        children: [
          {
            path: "/sistemas-ia/llm-serving-fundamentals/simulator",
            name: t('menu.ai_systems.llm_serving_fundamentals.simulator.name'),
            description: t('menu.ai_systems.llm_serving_fundamentals.simulator.description'),
          },
        ],
      },
      {
        path: "/sistemas-ia/rag",
        name: t('menu.ai_systems.rag.name'),
        description: t('menu.ai_systems.rag.description'),
        children: [
          {
            path: "/sistemas-ia/rag/simulator",
            name: t('menu.ai_systems.rag.simulator.name'),
            description: t('menu.ai_systems.rag.simulator.description'),
          },
        ],
      },
      {
        path: "/sistemas-ia/vector-search",
        name: t('menu.ai_systems.vector_search.name'),
        description: t('menu.ai_systems.vector_search.description'),
        children: [
          {
            path: "/sistemas-ia/vector-search/simulator",
            name: t('menu.ai_systems.vector_search.simulator.name'),
            description: t('menu.ai_systems.vector_search.simulator.description'),
          },
        ],
      },
      {
        path: "/sistemas-ia/llm-gateway",
        name: t('menu.ai_systems.llm_gateway.name'),
        description: t('menu.ai_systems.llm_gateway.description'),
        children: [
          {
            path: "/sistemas-ia/llm-gateway/simulator",
            name: t('menu.ai_systems.llm_gateway.simulator.name'),
            description: t('menu.ai_systems.llm_gateway.simulator.description'),
          },
        ],
      },
      {
        path: "/sistemas-ia/gpu-autoscaling",
        name: t('menu.ai_systems.gpu_autoscaling.name'),
        description: t('menu.ai_systems.gpu_autoscaling.description'),
        children: [
          {
            path: "/sistemas-ia/gpu-autoscaling/simulator",
            name: t('menu.ai_systems.gpu_autoscaling.simulator.name'),
            description: t('menu.ai_systems.gpu_autoscaling.simulator.description'),
          },
        ],
      },
      {
        path: "/sistemas-ia/agentic-systems",
        name: t('menu.ai_systems.agentic.name'),
        description: t('menu.ai_systems.agentic.description'),
        children: [
          {
            path: "/sistemas-ia/agentic-systems/simulator",
            name: t('menu.ai_systems.agentic.simulator.name'),
            description: t('menu.ai_systems.agentic.simulator.description'),
          },
        ],
      },
    ],
  },
  {
    path: "/dados-armazenamento",
    name: t('menu.data_storage.name'),
    description: t('menu.data_storage.description'),
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
          d="M4 7v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7M4 7c0 1.66 3.58 3 8 3s8-1.34 8-3M4 7c0-1.66 3.58-3 8-3s8 1.34 8 3m0 5c0 1.66-3.58 3-8 3s-8-1.34-8-3"
        />
      </svg>
    ),
    children: [
      {
        path: "/dados-armazenamento/consistent-hashing",
        name: t('menu.data_storage.consistent_hashing.name'),
        description: t('menu.data_storage.consistent_hashing.description'),
        children: [
          {
            path: "/dados-armazenamento/consistent-hashing/simulator",
            name: t('menu.data_storage.consistent_hashing.simulator.name'),
            description: t('menu.data_storage.consistent_hashing.simulator.description'),
          },
        ],
      },
      {
        path: "/dados-armazenamento/sharding",
        name: t('menu.data_storage.sharding.name'),
        description: t('menu.data_storage.sharding.description'),
        children: [
          {
            path: "/dados-armazenamento/sharding/simulator",
            name: t('menu.data_storage.sharding.simulator.name'),
            description: t('menu.data_storage.sharding.simulator.description'),
          },
        ],
      },
      {
        path: "/dados-armazenamento/object-storage",
        name: t('menu.data_storage.object_storage.name'),
        description: t('menu.data_storage.object_storage.description'),
      },
      {
        path: "/dados-armazenamento/distributed-file-systems",
        name: t('menu.data_storage.distributed_file_systems.name'),
        description: t('menu.data_storage.distributed_file_systems.description'),
      },
      {
        path: "/dados-armazenamento/inverted-index",
        name: t('menu.data_storage.inverted_index.name'),
        description: t('menu.data_storage.inverted_index.description'),
        children: [
          {
            path: "/dados-armazenamento/inverted-index/simulator",
            name: t('menu.data_storage.inverted_index.simulator.name'),
            description: t('menu.data_storage.inverted_index.simulator.description'),
          },
        ],
      },
    ],
  },
  {
    path: "/editor",
    name: t('menu.editor.name'),
    description: t('menu.editor.description'),
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
    path: "/design-lab",
    name: t('menu.design_lab.name'),
    description: t('menu.design_lab.description'),
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
  {
    path: "/quizzes",
    name: t('menu.quizzes.name', { defaultValue: 'Quizzes' }),
    description: t('menu.quizzes.description', { defaultValue: 'Teste seus conhecimentos e ganhe DinaCoins' }),
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    path: "/ranking",
    name: t('menu.ranking.name', { defaultValue: 'Ranking' }),
    description: t('menu.ranking.description', { defaultValue: 'Classificação global da comunidade' }),
    icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // On desktop, restore the saved open/closed preference (default: open).
    try {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        const saved = localStorage.getItem('sidebar-open');
        return saved == null ? true : saved === '1';
      }
    } catch {
      /* ignore storage failures (private mode) */
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [navFilter, setNavFilter] = useState('');
  const { user, signOut } = useAuth();
  const { isCompleted, progress, updateTrigger } = useContentProgress();
  const { t } = useTranslation();
  const { pages: contentPages } = useContent();
  // The sidebar must mirror what actually exists in the database. The static
  // tree below is only a source of labels/icons/structure — we prune it down to
  // the items present in the live registry (DB lessons + code-based simulators,
  // tools and practice destinations). With an empty DB, lessons disappear
  // instead of rendering a hardcoded menu. Parents are kept when any descendant
  // survives so module groupings don't collapse.
  const menuItems = useMemo(() => {
    const pruneToRegistry = (items: MenuItem[]): MenuItem[] =>
      items.reduce<MenuItem[]>((acc, item) => {
        const prunedChildren = item.children ? pruneToRegistry(item.children) : undefined;
        const selfVisible = item.external || Boolean(getItem(item.path));
        if (selfVisible || (prunedChildren && prunedChildren.length > 0)) {
          acc.push({
            ...item,
            children: prunedChildren && prunedChildren.length > 0 ? prunedChildren : undefined,
          });
        }
        return acc;
      }, []);
    // The static tree only defines structure/icons/links; the DB owns ordering.
    // Sort every sibling list by (module order_index, page order_index), keeping
    // the original static position as a stable tiebreaker for items with no DB
    // row (simulators ride along with their parent lesson, external links, etc.).
    const sortByDbOrder = (items: MenuItem[]): MenuItem[] =>
      items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
          const ra = orderRank(a.item.path);
          const rb = orderRank(b.item.path);
          return ra.module - rb.module || ra.page - rb.page || a.index - b.index;
        })
        .map(({ item }) => ({
          ...item,
          children: item.children ? sortByDbOrder(item.children) : undefined,
        }));
    return sortByDbOrder(pruneToRegistry(createMenuItems(t)));
    // contentPages drives registry rebuilds (via ContentContext), so recompute
    // the pruned menu whenever the DB content index changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentPages, t]);

  // Group the top-level nav by learning tier, derived from the registry.
  const tierLabelFallback: Record<Tier, string> = {
    FOUNDATIONAL: 'Foundations',
    CORE: 'Core',
    ADVANCED: 'Advanced',
    APPLIED: 'Applied',
    TOOLS: 'Tools & Community',
  };
  const tierLabel = (tier: Tier) =>
    tier === 'TOOLS'
      ? t('nav.tier_tools', { defaultValue: tierLabelFallback.TOOLS })
      : t(`command_center.tier.${tier.toLowerCase()}`, { defaultValue: tierLabelFallback[tier] });
  const tierForMenuItem = (item: MenuItem): Tier =>
    item.external ? 'TOOLS' : getItem(item.path)?.tier ?? 'TOOLS';
  // Roadmap is pinned to the very top of the nav, above the tier groups.
  const pinnedPaths = ['/roadmap'];
  const pinnedItems = pinnedPaths
    .map((p) => menuItems.find((it) => it.path === p))
    .filter((it): it is MenuItem => Boolean(it));
  const groupedMenu = TIER_ORDER.map((tier) => ({
    tier,
    items: menuItems.filter(
      (it) => !pinnedPaths.includes(it.path) && tierForMenuItem(it) === tier,
    ),
  })).filter((g) => g.items.length > 0);

  // Flat, translated index used when the inline nav filter has a query.
  const filteredNavItems = (() => {
    const q = navFilter.trim().toLowerCase();
    if (!q) return [] as { path: string; label: string; moduleLabel: string; type: string }[];
    const tokens = q.split(/\s+/).filter(Boolean);
    return contentRegistry
      .map((i) => {
        const m = getModule(i.moduleId);
        return {
          path: i.path,
          label: t(menuKey(i.path, 'name'), { defaultValue: fallbackLabel(i.path) }),
          moduleLabel: m ? t(`command_center.modules.${m.id}`, { defaultValue: m.label }) : '',
          type: i.type,
        };
      })
      .filter((i) => {
        const hay = `${i.label} ${i.moduleLabel} ${i.path}`.toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      })
      .slice(0, 50);
  })();
  
  // Make menuItems accessible to other components via window object
  // This helps avoid circular dependencies when components need to access menuItems
  useEffect(() => {
    // Initialize the __APP_DATA__ object if it doesn't exist
    if (!window.__APP_DATA__) {
      window.__APP_DATA__ = {
        menuItems: []
      };
    }
    
    // Update menuItems in the window object. menuItems is now derived
    // asynchronously from DB content (useMemo on contentPages), so this must
    // re-run whenever it changes — otherwise consumers like /roadmap read the
    // initial empty array and spin forever.
    window.__APP_DATA__.menuItems = menuItems;
  }, [menuItems]);

  // Initialize analytics only if user has consented
  useEffect(() => {
    if (CookieConsentManager.hasAnalyticsConsent()) {
      initializeAnalytics();
    }
    
    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);
  }, []);

  const MenuLink = ({ item, onNavigate }: { item: MenuItem; onNavigate?: () => void }) => {
    const expandStorageKey = `nav-exp:${item.path}`;
    const [isExpanded, setIsExpanded] = useState<boolean>(() => {
      try {
        const saved = localStorage.getItem(expandStorageKey);
        return saved != null ? saved === '1' : false;
      } catch {
        return false;
      }
    });
    const setExpandedPersist = (next: boolean) => {
      setIsExpanded(next);
      try {
        localStorage.setItem(expandStorageKey, next ? '1' : '0');
      } catch {
        /* ignore storage failures (private mode) */
      }
    };
    const { pathname } = useLocation();
    const { isCompleted, updateTrigger } = useContentProgress();
    const { t, i18n } = useTranslation();
    const makeMenuKey = (path: string, field: 'name' | 'description') => `menu.${path.replace(/^\//, '').replace(/\//g, '.')}.${field}`;
    // Labels come from the DB (content_pages.title_*) when the page exists there.
    // Otherwise fall back to the i18n key, then the static tree name — but never
    // a raw, unresolved key (those start with "menu."): use a prettified label
    // from the path instead, so DB-less items (e.g. simulators) read cleanly.
    const staticName =
      item.name && !item.name.startsWith('menu.') ? item.name : fallbackLabel(item.path);
    const displayName =
      titleForPath(item.path, i18n.language) ??
      t(makeMenuKey(item.path, 'name'), { defaultValue: staticName });
    
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

    // Minimal menu item: rounded hover/active highlight, sans label, no per-item
    // description, no accent bars or type glyphs.
    const itemBase =
      'group flex-1 flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-colors relative';
    const itemInactive =
      'text-slate-600 dark:text-tactical-dim hover:bg-slate-100 dark:hover:bg-tactical-raised hover:text-slate-900 dark:hover:text-tactical-text';
    const itemActive =
      'bg-slate-100 dark:bg-tactical-raised text-slate-900 dark:text-tactical-text font-medium';

    const TypeMarker = () => null;

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
            <span key={index} className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-emerald-700 dark:rounded-sm dark:bg-signal-green/10 dark:text-signal-green">
              {translatedBadge(badge.text)}
            </span>
          ))}
        </div>
      ) : null;

    return (
      <div className="text-slate-900 dark:text-tactical-text">
        <div className="flex items-stretch gap-1">
          {item.disabled ? (
            <div className="flex-1 flex flex-col gap-0.5 px-3 py-2 rounded-lg border-transparent text-slate-400 dark:text-tactical-label/70 relative cursor-not-allowed">
              <div className="flex items-center">
                <span className="font-sans text-sm mr-2">{item.name}</span>
                <span className="ml-auto font-sans text-[10px] text-slate-400 dark:text-tactical-label">
                  {t('status.coming_soon')}
                </span>
              </div>
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
                <span className="font-sans text-sm mr-2">{displayName}</span>
                <svg className="w-3.5 h-3.5 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
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
                <TypeMarker />
                <span className="font-sans text-sm mr-2">{displayName}</span>
                {isCompleted(item.path) && <CompletedMark />}
              </div>
              <Badges />
            </NavLink>
          )}
          {item.children && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setExpandedPersist(!isExpanded);
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

  // Toggle the sidebar. On desktop the choice is persisted so it survives reloads.
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      if (!isMobile) {
        try {
          localStorage.setItem('sidebar-open', next ? '1' : '0');
        } catch {
          /* ignore storage failures (private mode) */
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        // Mobile always starts collapsed (the panel is an overlay).
        setIsSidebarOpen(false);
      } else {
        // Desktop restores the persisted preference (default: open).
        let open = true;
        try {
          const saved = localStorage.getItem('sidebar-open');
          if (saved != null) open = saved === '1';
        } catch {
          /* ignore */
        }
        setIsSidebarOpen(open);
      }
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
                  onClick={toggleSidebar}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text rounded-lg hover:bg-slate-100 dark:hover:bg-tactical-raised"
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
              isMobile
                ? `fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-200 dark:border-tactical-border transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                : `relative shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${isSidebarOpen ? 'w-80 border-r border-slate-200 dark:border-tactical-border' : 'w-0'}`
            } bg-white dark:bg-tactical-surface flex flex-col`}
          >
            {/* Fixed-width inner shell so content doesn't reflow while the panel animates open/closed */}
            <div className="flex h-full w-80 flex-col">
            {/* Sidebar Content */}
            <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-tactical-line scrollbar-track-transparent ${isMobile ? 'pt-16' : ''}`}>
              <div className="p-4">
                {!isMobile && (
                  <div className="flex items-center justify-between mb-5 px-2">
                    <Link to="/" className="flex items-center gap-2">
                      <img src="/logo.png" alt="Logo" className="h-9" />
                      <span className="font-sans text-base font-semibold tracking-tight text-slate-900 dark:text-tactical-text">Dinamos</span>
                    </Link>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="label-mono">Navigation</span>
                  <div className="flex gap-2">
                    <ThemeToggle />
                    <LanguageSwitcher />
                    {!isMobile && (
                      <button
                        onClick={toggleSidebar}
                        title={t('nav.collapse_sidebar', { defaultValue: 'Collapse menu' })}
                        aria-label={t('nav.collapse_sidebar', { defaultValue: 'Collapse menu' })}
                        className="flex h-8 w-8 items-center justify-center border border-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text cursor-pointer"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Global search: prominent trigger for the command palette */}
                <button
                  onClick={() => openCommandPalette()}
                  className="mb-4 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2 text-left text-slate-500 dark:text-tactical-dim transition-colors hover:border-brand-500 dark:hover:border-signal-green hover:text-slate-900 dark:hover:text-tactical-text"
                  aria-label={t('command_center.search_aria')}
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  <span className="flex-1 truncate font-sans text-sm">
                    {t('command_center.search_placeholder')}
                  </span>
                  <span className="shrink-0 rounded border border-current px-1 font-sans text-[10px] opacity-70">⌘K</span>
                </button>

                {/* Inline nav filter */}
                <div className="mb-3 px-0.5">
                  <input
                    value={navFilter}
                    onChange={(e) => setNavFilter(e.target.value)}
                    placeholder={t('nav.filter_placeholder', { defaultValue: 'Filter navigation…' })}
                    aria-label={t('nav.filter_placeholder', { defaultValue: 'Filter navigation' })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none dark:border-tactical-border dark:bg-tactical-raised dark:text-tactical-text dark:placeholder:text-tactical-label dark:focus:border-signal-green"
                  />
                </div>

                {navFilter.trim() ? (
                  <nav className="space-y-0.5">
                    {filteredNavItems.length === 0 ? (
                      <p className="px-3 py-4 font-sans text-sm text-slate-400 dark:text-tactical-label">
                        {t('command_center.no_matches')}
                      </p>
                    ) : (
                      filteredNavItems.map((i) => (
                        <NavLink
                          key={i.path}
                          to={i.path}
                          onClick={() => isMobile && setIsSidebarOpen(false)}
                          className={({ isActive }: { isActive: boolean }) =>
                            `flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm transition-colors ${
                              isActive
                                ? 'bg-slate-100 font-medium text-slate-900 dark:bg-tactical-raised dark:text-tactical-text'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text'
                            }`
                          }
                        >
                          <span className="truncate">{i.label}</span>
                          <span className="ml-auto shrink-0 text-[10px] text-slate-400 dark:text-tactical-label">
                            {i.moduleLabel}
                          </span>
                        </NavLink>
                      ))
                    )}
                  </nav>
                ) : (
                  <nav className="space-y-3">
                    {pinnedItems.length > 0 && (
                      <div className="space-y-0.5">
                        {pinnedItems.map((item) => (
                          <MenuLink
                            key={item.path}
                            item={item}
                            onNavigate={() => isMobile && setIsSidebarOpen(false)}
                          />
                        ))}
                      </div>
                    )}
                    {groupedMenu.map((group) => (
                      <div key={group.tier}>
                        <div className="label-mono px-2 pb-1 pt-1">{tierLabel(group.tier)}</div>
                        <div className="space-y-0.5">
                          {group.items.map((item) => (
                            <MenuLink
                              key={item.path}
                              item={item}
                              onNavigate={() => isMobile && setIsSidebarOpen(false)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* User profile section */}
            {user && (
              <div className="p-3 border-t border-slate-200 dark:border-tactical-border">
                <div className="flex items-center gap-3 p-3 tactical-panel bg-slate-50 dark:bg-tactical-raised">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-signal-green"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-500 dark:bg-tactical-bg dark:border dark:border-signal-green flex items-center justify-center">
                      <span className="text-lg font-semibold font-sans text-white dark:text-signal-green">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium text-slate-900 dark:text-tactical-text truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="label-mono truncate">
                      {user ? 'Free tier' : 'Guest'}
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
            </div>
          </aside>
        )}

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {user && <CommandPalette />}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto bg-canvas-paper dark:bg-canvas-dark ${isMobile ? 'pt-16' : ''}`}>
          {user && <TopStatusBar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}
          <React.Suspense fallback={<DesignLabRouteFallback />}>
          <Routes>
            {/* Content-only pages rendered from MDX (src/content/**). One route per
                manifest entry replaces the ~60 former per-page component routes.
                Interactive simulators remain as explicit routes below. */}
            {contentPages.map(({ path, slug }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <ContentPage>
                      <MdxPage slug={slug} />
                    </ContentPage>
                  </ProtectedRoute>
                }
              />
            ))}
            {/* Auto-registered simulator routes for CMS pages that attach one by
                key. Existing bespoke simulator routes remain declared below. */}
            {contentPages
              .filter((p) => p.simulatorKey && getSimulator(p.simulatorKey))
              .map(({ path, simulatorKey }) => {
                const def = getSimulator(simulatorKey)!;
                const Simulator = def.component;
                return (
                  <Route
                    key={`${path}/simulator`}
                    path={`${path}/simulator`}
                    element={
                      <ProtectedRoute>
                        <ContentPage>
                          <Simulator />
                        </ContentPage>
                      </ProtectedRoute>
                    }
                  />
                );
              })}
            <Route path="/" element={user ? <CommandCenter /> : <LandingPage />} />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
            <Route path="/editor" element={<SimpleSystemEditorPage />} />
            <Route path="/editor/game/:code" element={<GameEditorPage />} />
            
            {/* Preferences routes */}
            <Route 
              path="/preferences" 
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preferences/cookies" 
              element={
                <ProtectedRoute>
                  <CookiePreferencesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes */}
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
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <Roadmap />
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
              path="/monitoramento-e-manutencao/logs/tracing"
              element={
                <ProtectedRoute>
                  <ContentPage>
                    <TracingSimulator />
                  </ContentPage>
                </ProtectedRoute>
              }
            />
            
            {/* --- Forum (designLab: polls, nested replies, notifications) --- */}
            <Route
              path="/forum"
              element={
                <DLProtectedRoute>
                  <DLForumList />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/forum/new"
              element={
                <DLProtectedRoute>
                  <DLCreateTopic />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/forum/topic/:id"
              element={
                <DLProtectedRoute>
                  <DLTopicView />
                </DLProtectedRoute>
              }
            />

            {/* --- designLab: challenges, feedback, quizzes, ranking, profile --- */}
            {/* Legacy alias: old /home links redirect to the canonical /design-lab. */}
            <Route path="/home" element={<Navigate to="/design-lab" replace />} />
            <Route
              path="/design-lab"
              element={
                <DLProtectedRoute>
                  <DLHome />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/challenge/:id"
              element={
                <DLProtectedRoute>
                  <DLChallenge />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <DLProtectedRoute>
                  <DLFeedback />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <DLProtectedRoute>
                  <DLQuizList />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id"
              element={
                <DLProtectedRoute>
                  <DLQuizTake />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/ranking"
              element={
                <DLProtectedRoute>
                  <DLLeaderboard />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <DLProtectedRoute>
                  <DLProfile />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <DLProtectedRoute>
                  <DLNotifications />
                </DLProtectedRoute>
              }
            />

            {/* --- designLab: auth flows --- */}
            <Route path="/register" element={<DLRegister />} />
            <Route path="/forgot-password" element={<DLForgotPassword />} />
            <Route path="/verify-email" element={<DLVerifyEmail />} />

            {/* --- designLab: admin panels (gated by Sub + Admin role) --- */}
            <Route
              path="/admin/users"
              element={
                <DLProtectedRoute>
                  <DLAdminUsers />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <DLProtectedRoute>
                  <DLAdminRoles />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/challenges"
              element={
                <DLProtectedRoute>
                  <DLAdminChallenges />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/forum/categories"
              element={
                <DLProtectedRoute>
                  <DLAdminForumCategories />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <DLProtectedRoute>
                  <DLAdminNotifications />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <DLProtectedRoute>
                  <DLAdminSettings />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <DLProtectedRoute>
                  <DLAdminDashboard />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <DLProtectedRoute>
                  <DLAdminQuizzes />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <DLProtectedRoute>
                  <DLAdminHub />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/content-tree"
              element={
                <DLProtectedRoute>
                  <DLAdminContentTree />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <DLProtectedRoute>
                  <DLAdminContent />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/modules"
              element={
                <DLProtectedRoute>
                  <DLAdminModules />
                </DLProtectedRoute>
              }
            />
            <Route
              path="/admin/game"
              element={
                <DLProtectedRoute>
                  <AdminGameConsole />
                </DLProtectedRoute>
              }
            />

          </Routes>
          </React.Suspense>
          {user && <Footer />}
        </main>
      </div>
      
      <LanguageDetectionDialog />
      <CookieConsentBanner onConsentChange={handleConsentChange} />
    </div>
  );
}
