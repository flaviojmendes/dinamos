import { Routes, Route, NavLink, Link } from 'react-router-dom';
import CacheSimulation from "./components/CacheSimulation/CacheSimulation";
import HorizontalScaling from './components/HorizontalScaling/HorizontalScaling';
import LoadBalancer from './components/LoadBalancer/LoadBalancer';
import CircuitBreaker from './components/CircuitBreaker/CircuitBreaker';
import Backpressure from './components/Backpressure/Backpressure';
import RateLimiter from './components/RateLimiter/RateLimiter';
import Fallback from './components/Fallback/Fallback';
import AsyncSync from './components/AsyncSync/AsyncSync';
import CDN from './components/CDN/CDN';

import "./App.css";
import RoundRobin from './components/RoundRobin/RoundRobin';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Cache
              </NavLink>
              <NavLink
                to="/horizontal-scaling"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Escalabilidade Horizontal
              </NavLink>
              <NavLink
                to="/load-balancer"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Load Balancer
              </NavLink>
              <NavLink
                to="/circuit-breaker"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Circuit Breaker
              </NavLink>
              <NavLink
                to="/backpressure"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Backpressure
              </NavLink>
              <NavLink
                to="/rate-limiter"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Rate Limiter
              </NavLink>
              <NavLink
                to="/fallback"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`
                }
              >
                Fallback
              </NavLink>
              <Link
                to="/async-sync"
                className="px-4 py-2 rounded-lg hover:bg-zinc-800"
              >
                Sync vs Async
              </Link>
              <NavLink
                to="/cdn"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/50'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`
                }
              >
                CDN
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
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
      </main>
    </div>
  );
}
