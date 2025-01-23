import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const { user, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const refreshToken = async () => {
      if (hasChecked) return;
      
      try {
        if (!user) {
          navigate('/');
          return;
        }

        setHasChecked(true);
        // Force token refresh to get new claims
        await user.getIdToken(true);
        // Check subscription status
        const isSubscribed = await checkSubscription();
        
        if (isSubscribed) {
          // Redirect to intro after 3 seconds
          setTimeout(() => {
            navigate('/intro');
          }, 3000);
        } else {
          // If subscription check fails, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        navigate('/');
      }
    };

    refreshToken();
  }, [user, checkSubscription, navigate, hasChecked]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="mb-8 text-green-500">
          <svg
            className="w-20 h-20 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-xl text-zinc-400 mb-8">
          Seu acesso foi liberado com sucesso. Redirecionando para o conteúdo...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </motion.div>
    </div>
  );
} 