import { Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CacheSimulation from "./components/CacheSimulation/CacheSimulation";
import HorizontalScaling from './components/HorizontalScaling/HorizontalScaling';
import CircuitBreaker from './components/CircuitBreaker/CircuitBreaker';
import Backpressure from './components/Backpressure/Backpressure';
import RateLimiter from './components/RateLimiter/RateLimiter';
import Fallback from './components/Fallback/Fallback';
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
import { MenuItem } from './types/menu';

import "./App.css";

const menuItems: MenuItem[] = [
  { path: "/intro", name: "Introdução", description: "Sobre o curso e motivação" },
  { path: "/sistemas-distribuidos-101", name: "Sistemas Distribuídos 101", description: "Conceitos fundamentais através de analogias" },
  { path: "/system-design-101", name: "System Design 101", description: "Fundamentos de design de sistemas" },
  { 
    path: "/componentes", 
    name: "Componentes de um Sistema", 
    description: "Principais componentes de sistemas distribuídos",
    children: [
      { 
        path: "/componentes/banco-dados", 
        name: "Bancos de Dados", 
        description: "SQL, NoSQL, Sharding e Replicação" 
      },
      {
        path: "/componentes/cache",
        name: "Cache",
        description: "Estratégias e sistemas de cache",
        children: [
          {
            path: "/componentes/cache/simulator",
            name: "Simulador de Cache",
            description: "Simulação interativa de cache"
          }
        ]
      },
      {
        path: "/componentes/load-balancer",
        name: "Balanceador de Carga",
        description: "Distribuição de carga entre servidores",
        children: [
          {
            path: "/componentes/load-balancer/simulator",
            name: "Simulador de Load Balancer",
            description: "Simulação de balanceamento de carga"
          }
        ]
      },
      {
        path: "/componentes/message-queue",
        name: "Filas de Mensagens",
        description: "Comunicação assíncrona entre sistemas",
        children: [
          {
            path: "/componentes/message-queue/simulator",
            name: "Simulador de Message Queue",
            description: "Simulação de filas de mensagens"
          }
        ]
      },
      {
        path: "/componentes/cdn",
        name: "CDN",
        description: "Rede de distribuição de conteúdo",
        children: [
          {
            path: "/componentes/cdn/simulator",
            name: "Simulador de CDN",
            description: "Simulação de distribuição de conteúdo"
          }
        ]
      },
      {
        path: "/componentes/api-gateway",
        name: "API Gateway",
        description: "Intermediário entre clientes e serviços",
        children: [
          {
            path: "/componentes/api-gateway/simulator",
            name: "Simulador de API Gateway",
            description: "Simulação de roteamento de requisições"
          }
        ]
      }
    ]
  },
  { path: "/horizontal-scaling", name: "Escalabilidade Horizontal", description: "Distribuição de carga entre múltiplos servidores" },
  { path: "/load-balancer", name: "Load Balancer", description: "Balanceamento de carga usando Round Robin" },
  { path: "/message-queue", name: "Message Queue", description: "Fila de mensagens com produtores e consumidores" },
  { path: "/circuit-breaker", name: "Circuit Breaker", description: "Prevenção de falhas em cascata" },
  { path: "/backpressure", name: "Backpressure", description: "Controle de fluxo em sistemas distribuídos" },
  { path: "/rate-limiter", name: "Rate Limiter", description: "Limitação de taxa de requisições" },
  { path: "/fallback", name: "Fallback", description: "Estratégias de recuperação de falhas" },
  { path: "/async-sync", name: "Sync vs Async", description: "Comparação entre comunicação síncrona e assíncrona" },
  { path: "/cdn", name: "CDN", description: "Rede de distribuição de conteúdo" }
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const MenuLink = ({ item }: { item: MenuItem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
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
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
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
          </Routes>
        </div>
      </main>
    </div>
  );
}
