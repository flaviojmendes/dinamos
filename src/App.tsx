import { Routes, Route, NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ComplexityGraph from "./components/ComplexityGraph";
import RoundRobin from "./components/RoundRobin/RoundRobin";
import CacheSimulation from "./components/CacheSimulation/CacheSimulation";
import ReplicationModel from "./components/ReplicationModel/ReplicationModel";
import MessageQueue from "./components/MessageQueue/MessageQueue";
import HorizontalScaling from './components/HorizontalScaling/HorizontalScaling';

import "./App.css";
import logo from './assets/logo.svg';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when route changes on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-black flex overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Lateral Navigation */}
      <div
        className={`
          fixed md:sticky
          top-0 inset-y-0 left-0
          w-64 bg-gray-900
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          z-40
          flex flex-col
          p-6
          h-screen
          overflow-y-auto
        `}
      >
        <img src={logo} alt="Logo" className="h-16 mb-8" />
        
        <nav className="space-y-2">
          <NavLink
            to="/complexity"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            Complexidade Assintótica
          </NavLink>
          <NavLink
            to="/load-balancer"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            Load Balancer
          </NavLink>
          <NavLink
            to="/cache"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            Cache
          </NavLink>
          <NavLink
            to="/replication"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            Replicação e Consistência
          </NavLink>
          <Link
            to="/message-queue"
            onClick={handleNavClick}
            className="block px-4 py-2 rounded transition-colors text-gray-300 hover:bg-gray-800"
          >
            Filas e Pub/Sub
          </Link>
          <NavLink
            to="/horizontal-scaling"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            Escalabilidade Horizontal
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-4 md:p-8 pt-16 md:pt-8">
          <Routes>
            <Route path="/" element={<ComplexityGraph />} />
            <Route path="/complexity" element={<ComplexityGraph />} />
            <Route path="/load-balancer" element={<RoundRobin />} />
            <Route path="/cache" element={<CacheSimulation />} />
            <Route path="/replication" element={<ReplicationModel />} />
            <Route path="/message-queue" element={<MessageQueue />} />
            <Route path="/horizontal-scaling" element={<HorizontalScaling />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
