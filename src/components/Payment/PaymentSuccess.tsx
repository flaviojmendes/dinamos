import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export default function PaymentSuccess() {
  const { checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    const handleSuccess = async () => {
      if (status === 'approved') {
        try {
          // Update subscription status - wait a moment for backend to process
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Force refresh to get latest subscription claims after payment
          const isActive = await checkSubscription(true);
          
          if (!isActive) {
            // Security: Never activate subscriptions locally
            // If subscription is not active after payment, redirect to payment page
            console.warn('Payment approved but subscription not active - possible backend delay');
            navigate('/pagamento');
            return;
          }
          
          // Success - redirect to content
          navigate('/intro');
        } catch (error) {
          console.error('Error validating subscription:', error);
          navigate('/pagamento');
        }
      } else {
        console.warn('Payment not approved, redirecting to payment page');
        navigate('/pagamento');
      }
    };

    handleSuccess();
  }, [status, externalReference, checkSubscription, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Pagamento Confirmado!
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">
              Seu acesso foi liberado com sucesso. Aproveite todo o conteúdo!
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              to="/intro" 
              className="inline-block w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Começar Agora
            </Link>
            <p className="text-sm text-zinc-500 mt-4">
              Em caso de dúvidas, entre em contato conosco
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 