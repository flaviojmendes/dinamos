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

import "./App.css";

const menuItems = [
  { path: "/", name: "Cache", description: "Simulação de cache e seus impactos no desempenho" },
  { path: "/horizontal-scaling", name: "Escalabilidade Horizontal", description: "Distribuição de carga entre múltiplos servidores" },
  { path: "/load-balancer", name: "Load Balancer", description: "Balanceamento de carga usando Round Robin" },
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
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }: { isActive: boolean }) =>
                      `flex flex-col p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`
                    }
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm opacity-75">{item.description}</span>
                  </NavLink>
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
            <Route path="/" element={<CacheSimulation />} />
            <Route path="/horizontal-scaling" element={<HorizontalScaling />} />
            <Route path="/load-balancer" element={<RoundRobin />} />
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
