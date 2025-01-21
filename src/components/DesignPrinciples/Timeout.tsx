import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Timeout() {
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Timeout (Tempo Limite)
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-zinc-300"
        >
          Uma estratégia fundamental para evitar que operações lentas ou travadas 
          comprometam a experiência do usuário e a saúde do sistema.
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
              Imagine que você está em um restaurante e faz seu pedido. Se o prato demorar muito 
              para chegar, você provavelmente vai cancelar o pedido e ir embora. O "Timeout" 
              funciona de forma similar.
            </p>
            <p className="text-zinc-300">
              Ele define um tempo máximo para uma operação ser concluída. Se esse tempo for 
              ultrapassado, o sistema assume que algo deu errado e interrompe a operação.
            </p>
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
                  <h3 className="font-medium text-zinc-200">Melhor Experiência do Usuário</h3>
                  <p className="text-zinc-400">Evita que usuários fiquem esperando indefinidamente</p>
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
                  <h3 className="font-medium text-zinc-200">Liberação de Recursos</h3>
                  <p className="text-zinc-400">Libera recursos do sistema que poderiam ficar presos</p>
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
                  <h3 className="font-medium text-zinc-200">Prevenção de Falhas</h3>
                  <p className="text-zinc-400">Evita que problemas em um serviço afetem outros</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </motion.div>

        {/* Right Column - Example and Best Practices */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Exemplo do Mundo Real
            </h2>
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <p className="text-zinc-300">
                Você está preenchendo um formulário online e, ao clicar em "Enviar", o site precisa 
                se comunicar com um servidor para salvar as informações. Se o servidor estiver lento 
                ou indisponível, a operação de envio pode demorar muito. Para evitar que você fique 
                esperando indefinidamente, o site define um "Timeout" de, por exemplo, 30 segundos. 
                Se o servidor não responder nesse tempo, o site exibe uma mensagem de erro e 
                interrompe o envio.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Melhores Práticas
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Tempos Apropriados</h3>
                <p className="text-zinc-400">
                  Defina timeouts realistas baseados no tipo de operação e expectativas do usuário
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Mensagens Claras</h3>
                <p className="text-zinc-400">
                  Informe ao usuário o que aconteceu e o que ele pode fazer a seguir
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Retry Strategy</h3>
                <p className="text-zinc-400">
                  Combine timeouts com retries para maior resiliência
                </p>
              </div>
            </div>
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
          to="/principios-design/tolerancia-falhas/timeout/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Explorar Simulador de Timeout
        </Link>
      </motion.div>
    </div>
  );
} 