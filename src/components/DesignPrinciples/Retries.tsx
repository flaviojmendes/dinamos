import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Retries() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Retries (Tentativas)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Uma estratégia fundamental para lidar com falhas temporárias em sistemas distribuídos, 
          permitindo que operações falhas sejam automaticamente repetidas.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Concept and Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Como Funciona
            </h2>
            <p className="text-zinc-300 mb-6">
              Imagine que você está enviando uma mensagem para um amigo. Às vezes, a mensagem não chega 
              de primeira por causa de problemas na rede. O que você faz? Tenta enviar de novo, certo? 
              É exatamente isso que o "Retry" faz em sistemas computacionais.
            </p>
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Exemplo do Mundo Real</h3>
              <p className="text-zinc-400">
                Pense em um aplicativo de compras online. Quando você clica em "Comprar", o app precisa 
                se comunicar com um servidor para confirmar o pedido. Se a conexão com o servidor falhar 
                momentaneamente, o app pode tentar enviar a requisição novamente algumas vezes antes de 
                mostrar uma mensagem de erro.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Benefícios
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Maior Resiliência</h3>
                  <p className="text-zinc-400">Sistemas podem se recuperar automaticamente de falhas temporárias</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Melhor Experiência</h3>
                  <p className="text-zinc-400">Usuários não precisam repetir ações manualmente em caso de falhas</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Confiabilidade</h3>
                  <p className="text-zinc-400">Aumenta a taxa de sucesso das operações em redes instáveis</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Best Practices and Considerations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Melhores Práticas
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Backoff Exponencial</h3>
                <p className="text-zinc-400">
                  Aumentar gradualmente o intervalo entre as tentativas para evitar sobrecarga do sistema. 
                  Por exemplo: esperar 1s, depois 2s, 4s, 8s, etc.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Limite de Tentativas</h3>
                <p className="text-zinc-400">
                  Definir um número máximo de tentativas para evitar loops infinitos e falhar rapidamente 
                  quando necessário.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Idempotência</h3>
                <p className="text-zinc-400">
                  Garantir que múltiplas tentativas da mesma operação não causem efeitos colaterais 
                  indesejados.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Considerações Importantes
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Tipos de Falhas</h3>
                  <p className="text-zinc-400">Nem todas as falhas devem ser retentadas. Erros de validação ou autenticação, por exemplo, não se beneficiam de retentativas.</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-medium text-zinc-200">Impacto no Sistema</h3>
                  <p className="text-zinc-400">Muitas retentativas simultâneas podem sobrecarregar o sistema. Use circuit breakers em conjunto quando necessário.</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/principios-design/tolerancia-falhas/retries/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Retries
        </Link>
      </motion.div>
    </div>
  );
} 