import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  
  const getErrorMessage = () => {
    switch (status) {
      case 'rejected':
        return 'O pagamento foi rejeitado. Por favor, tente novamente com outro método de pagamento.';
      case 'cancelled':
        return 'O pagamento foi cancelado.';
      case 'pending':
        return 'O pagamento está pendente de processamento.';
      default:
        return 'Ocorreu um erro durante o processamento do pagamento.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Pagamento não Concluído
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">
              {getErrorMessage()}
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              to="/pagamento" 
              className="inline-block w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </Link>
            <p className="text-sm text-zinc-500 mt-4">
              Se o problema persistir, entre em contato com nosso suporte
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 