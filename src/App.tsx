import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CacheSimulation from "./components/CacheSimulation/CacheSimulation";
import HorizontalScaling from './components/DesignPrinciples/HorizontalScaling';
import CircuitBreaker from './components/CircuitBreaker/CircuitBreaker';
import Backpressure from './components/Backpressure/Backpressure';
import RateLimiter from './components/RateLimiter/RateLimiter';
import Fallback from './components/DesignPrinciples/Fallback';
import AsyncSync from './components/AsyncSync/AsyncSync';
import CDN from './components/CDN/CDN';
import RoundRobin from './components/RoundRobin/RoundRobin';
import MessageQueueComponent from './components/SystemComponents/MessageQueue';
import MessageQueueSimulator from './components/MessageQueue/MessageQueue';
import Introduction from './components/Introduction/Introduction';
import DistributedSystems101 from './components/DistributedSystems101/DistributedSystems101';
import SystemDesign101 from './components/SystemDesign101/SystemDesign101';
import SystemComponents from './components/SystemComponents/SystemComponents';
import Database from './components/SystemComponents/Database';
import CacheComponent from './components/SystemComponents/Cache';
import LoadBalancer from './components/SystemComponents/LoadBalancer';
import CDNComponent from './components/SystemComponents/CDN';
import CDNSimulator from './components/CDN/CDN';
import APIGateway from './components/SystemComponents/APIGateway';
import APIGatewaySimulator from './components/APIGateway/APIGatewaySimulator';
import DesignPrinciples from './components/DesignPrinciples/DesignPrinciples';
import EventDriven from './components/DesignPrinciples/EventDriven';
import EventSourcingSimulator from './components/DesignPrinciples/EventSourcingSimulator';
import { MenuItem } from './types/menu';

import "./App.css";
import ServiceOriented from './components/DesignPrinciples/ServiceOriented';
import FaultTolerance from './components/DesignPrinciples/FaultTolerance';
import Retries from './components/DesignPrinciples/Retries';
import RetriesSimulator from './components/DesignPrinciples/RetriesSimulator';
import CircuitBreakerContent from './components/DesignPrinciples/CircuitBreaker';
import Timeout from './components/DesignPrinciples/Timeout';
import TimeoutSimulator from './components/DesignPrinciples/TimeoutSimulator';
import Escalabilidade from './components/DesignPrinciples/Escalabilidade';
import VerticalScaling from './components/DesignPrinciples/VerticalScaling';
import DataConsistency from './components/DesignPrinciples/DataConsistency';
import Latency from './components/DesignPrinciples/Latency';
import Failover from './components/DesignPrinciples/Failover';
import HorizontalScalingSimulator from './components/HorizontalScaling/HorizontalScalingSimulator';
import VerticalScalingSimulator from './components/DesignPrinciples/VerticalScalingSimulator';
import ScalabilitySimulator from './components/DesignPrinciples/ScalabilitySimulator';
import Replicacao from './components/DesignPrinciples/Replicacao';
import ReplicacaoSimulator from './components/DesignPrinciples/ReplicacaoSimulator';

const menuItems: MenuItem[] = [
  { 
    path: "/intro", 
    name: "Introdução", 
    description: "Sobre o curso e motivação" 
  },
  { 
    path: "/sistemas-distribuidos-101", 
    name: "Sistemas Distribuídos 101", 
    description: "Conceitos fundamentais através de analogias" 
  },
  { 
    path: "/system-design-101", 
    name: "System Design 101", 
    description: "Fundamentos de design de sistemas" 
  },
  { 
    path: "/componentes", 
    name: "Componentes Básicos", 
    description: "Blocos fundamentais de sistemas distribuídos",
    children: [
      { 
        path: "/componentes/banco-dados", 
        name: "Bancos de Dados", 
        description: "Armazenamento e gerenciamento de dados" 
      },
      {
        path: "/componentes/cache",
        name: "Cache",
        description: "Armazenamento temporário para melhor performance",
        children: [
          {
            path: "/componentes/cache/simulator",
            name: "Simulador",
            description: "Experimente diferentes estratégias de cache"
          }
        ]
      },
      {
        path: "/componentes/load-balancer",
        name: "Balanceador de Carga",
        description: "Distribuição de tráfego entre servidores",
        children: [
          {
            path: "/componentes/load-balancer/simulator",
            name: "Simulador",
            description: "Experimente diferentes algoritmos de balanceamento"
          }
        ]
      },
      {
        path: "/componentes/message-queue",
        name: "Filas de Mensagens",
        description: "Comunicação assíncrona entre serviços",
        children: [
          {
            path: "/componentes/message-queue/simulator",
            name: "Simulador",
            description: "Experimente o fluxo de mensagens"
          }
        ]
      },
      {
        path: "/componentes/cdn",
        name: "CDN",
        description: "Distribuição global de conteúdo",
        children: [
          {
            path: "/componentes/cdn/simulator",
            name: "Simulador",
            description: "Veja como o CDN acelera entregas"
          }
        ]
      },
      {
        path: "/componentes/api-gateway",
        name: "API Gateway",
        description: "Ponto único de entrada para APIs",
        children: [
          {
            path: "/componentes/api-gateway/simulator",
            name: "Simulador",
            description: "Experimente roteamento e proteção de APIs"
          }
        ]
      }
    ]
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
                description: "Experimente escalabilidade horizontal"
              }
            ]
          },
          {
            path: "/principios-design/escalabilidade/vertical",
            name: "Vertical (Scale Up)",
            description: "Aumentando recursos da máquina",
            children: [
              {
                path: "/principios-design/escalabilidade/vertical/simulator",
                name: "Simulador",
                description: "Experimente escalabilidade vertical"
              }
            ]
          },
          {
            path: "/principios-design/escalabilidade/simulator",
            name: "Simulador Completo",
            description: "Compare diferentes estratégias de escala"
          }
        ]
      },
      {
        path: "/principios-design/disponibilidade",
        name: "Alta Disponibilidade",
        description: "Mantendo o sistema sempre funcionando",
        children: [
          {
            path: "/principios-design/disponibilidade/replicacao",
            name: "Replicação",
            description: "Cópias sincronizadas dos dados"
          },
          {
            path: "/principios-design/disponibilidade/failover",
            name: "Failover",
            description: "Recuperação automática de falhas"
          },
          {
            path: "/principios-design/disponibilidade/simulator",
            name: "Simulador",
            description: "Experimente estratégias de disponibilidade"
          }
        ]
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
                description: "Experimente diferentes estratégias de retry"
              }
            ]
          },
          {
            path: "/principios-design/tolerancia-falhas/circuit-breaker",
            name: "Circuit Breaker",
            description: "Prevenindo falhas em cascata",
            children: [
              {
                path: "/principios-design/tolerancia-falhas/circuit-breaker/simulator",
                name: "Simulador",
                description: "Veja o circuit breaker em ação"
              }
            ]
          },
          {
            path: "/principios-design/tolerancia-falhas/timeout",
            name: "Timeout",
            description: "Limitando tempo de espera",
            children: [
              {
                path: "/principios-design/tolerancia-falhas/timeout/simulator",
                name: "Simulador",
                description: "Experimente diferentes configurações de timeout"
              }
            ]
          }
        ]
      },
      {
        path: "/principios-design/eventos",
        name: "Arquitetura Orientada a Eventos",
        description: "Sistemas baseados em eventos",
        children: [
          {
            path: "/principios-design/eventos/simulator",
            name: "Simulador",
            description: "Experimente event sourcing e event-driven"
          }
        ]
      },
      {
        path: "/principios-design/servicos",
        name: "Arquitetura de Serviços",
        description: "Monolito vs Microsserviços"
      }
    ]
  }
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const MenuLink = ({ item }: { item: MenuItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { pathname } = useLocation();
    
    // Check if current path matches this item or any of its children
    const isActive = pathname === item.path || 
      (item.children?.some(child => 
        pathname === child.path || child.children?.some(grandchild => pathname === grandchild.path)
      ));

    // Auto-expand when active and has children
    useEffect(() => {
      if (isActive && item.children) {
        setIsExpanded(true);
      }
    }, [isActive, item.children]);
    
    return (
      <div>
        <div className="flex items-center gap-1">
          <NavLink
            to={item.path}
            className={({ isActive }: { isActive: boolean }) =>
              `flex-1 flex flex-col p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`
            }
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <span className="font-medium">{item.name}</span>
            <span className="text-sm opacity-75">{item.description}</span>
          </NavLink>
          {item.children && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className={`p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-transform ${
                isActive ? 'text-white' : ''
              }`}
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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
          <div className="ml-4 mt-1 space-y-1 border-l border-zinc-800 pl-3">
            {item.children.map((child) => (
              <MenuLink key={child.path} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
              ${isMobile ? 'shadow-lg' : ''}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-white">System Design</h1>
                {isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <MenuLink key={item.path} item={item} />
                ))}
              </nav>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
          
          <Routes>
            <Route path="/intro" element={<Introduction />} />
            <Route path="/sistemas-distribuidos-101" element={<DistributedSystems101 />} />
            <Route path="/system-design-101" element={<SystemDesign101 />} />
            <Route path="/componentes" element={<SystemComponents />} />
            <Route path="/componentes/banco-dados" element={<Database />} />
            <Route path="/componentes/cache" element={<CacheComponent />} />
            <Route path="/componentes/cache/simulator" element={<CacheSimulation />} />
            <Route path="/componentes/load-balancer" element={<LoadBalancer />} />
            <Route path="/componentes/load-balancer/simulator" element={<RoundRobin />} />
            <Route path="/componentes/message-queue" element={<MessageQueueComponent />} />
            <Route path="/componentes/message-queue/simulator" element={<MessageQueueSimulator />} />
            <Route path="/componentes/cdn" element={<CDNComponent />} />
            <Route path="/componentes/cdn/simulator" element={<CDN />} />
            <Route path="/componentes/api-gateway" element={<APIGateway />} />
            <Route path="/componentes/api-gateway/simulator" element={<APIGatewaySimulator />} />
            <Route path="/horizontal-scaling" element={<HorizontalScaling />} />
            <Route path="/circuit-breaker" element={<CircuitBreaker />} />
            <Route path="/backpressure" element={<Backpressure />} />
            <Route path="/rate-limiter" element={<RateLimiter />} />
            <Route path="/fallback" element={<Fallback />} />
            <Route path="/async-sync" element={<AsyncSync />} />
            <Route path="/cdn" element={<CDN />} />
            <Route path="/principios-design" element={<DesignPrinciples />} />
            <Route path="/principios-design/eventos" element={<EventDriven />} />
            <Route path="/principios-design/eventos/simulator" element={<EventSourcingSimulator />} />
            <Route path="/principios-design/servicos" element={<ServiceOriented />} />
            <Route path="/principios-design/tolerancia-falhas" element={<FaultTolerance />} />
            <Route path="/principios-design/tolerancia-falhas/retries" element={<Retries />} />
            <Route path="/principios-design/tolerancia-falhas/retries/simulator" element={<RetriesSimulator />} />
            <Route path="/principios-design/tolerancia-falhas/circuit-breaker" element={<CircuitBreakerContent />} />
            <Route path="/principios-design/tolerancia-falhas/circuit-breaker/simulator" element={<CircuitBreaker />} />
            <Route path="/principios-design/tolerancia-falhas/timeout" element={<Timeout />} />
            <Route path="/principios-design/tolerancia-falhas/timeout/simulator" element={<TimeoutSimulator />} />
            <Route path="/principios-design/tolerancia-falhas/fallback" element={<Fallback />} />
            <Route path="/principios-design/escalabilidade" element={<Escalabilidade />} />
            <Route path="/principios-design/escalabilidade/horizontal" element={<HorizontalScaling />} />
            <Route path="/principios-design/escalabilidade/horizontal/simulator" element={<HorizontalScalingSimulator />} />
            <Route path="/principios-design/escalabilidade/vertical" element={<VerticalScaling />} />
            <Route path="/principios-design/escalabilidade/vertical/simulator" element={<VerticalScalingSimulator />} />
            <Route path="/principios-design/escalabilidade/consistencia" element={<DataConsistency />} />
            <Route path="/principios-design/escalabilidade/latencia" element={<Latency />} />
            <Route path="/principios-design/escalabilidade/failover" element={<Failover />} />
            <Route path="/principios-design/escalabilidade/simulator" element={<ScalabilitySimulator />} />
            <Route path="/principios-design/disponibilidade/simulator" element={<ReplicacaoSimulator />} />
            <Route path="/principios-design/disponibilidade/replicacao" element={<Replicacao />} />
            <Route path="/principios-design/disponibilidade/failover" element={<Failover />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
