import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signInWithGoogle();
    navigate('/intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-zinc-900/50 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Bem-vindo ao System Design
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            Faça login para acessar o conteúdo completo e simuladores interativos
          </p>
          
          <button
            onClick={handleLogin}
            className="w-full bg-white text-zinc-900 py-3 px-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
              />
            </svg>
            Continuar com Google
          </button>
        </div>
      </motion.div>
    </div>
  );
} 