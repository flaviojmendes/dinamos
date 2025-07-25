import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PollingWebhooksTheory() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Polling vs Webhooks
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            Entenda as diferenças fundamentais entre essas duas estratégias de comunicação em sistemas distribuídos
          </motion.p>
        </div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-400">O Problema da Comunicação</h2>
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Em sistemas distribuídos, uma das questões mais fundamentais é: <strong>como o cliente pode saber quando há novos dados disponíveis no servidor?</strong>
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Imagine que você está desenvolvendo um aplicativo de mensagens. Quando alguém envia uma mensagem para você, 
              como seu aplicativo fica sabendo que há uma nova mensagem? Existem duas abordagens principais para resolver este problema:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-3">📤 Polling (Consulta)</h3>
                <p className="text-zinc-300">
                  "Vou perguntar de tempos em tempos se há algo novo"
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-3">🔔 Webhooks (Notificação)</h3>
                <p className="text-zinc-300">
                  "Me avise imediatamente quando houver algo novo"
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Polling Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-400">📤 Polling (Consulta Periódica)</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-300">Como Funciona</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              No polling, o cliente faz requisições regulares ao servidor perguntando "há algo novo?". 
              É como verificar sua caixa de correio a cada 10 minutos, mesmo quando não há cartas.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-blue-400 mb-4">Fluxo Típico:</h4>
              <ol className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>Cliente envia GET /api/messages?after=timestamp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Servidor verifica se há mensagens novas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>Servidor responde com dados ou "nada novo"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                  <span>Cliente aguarda X segundos e repete</span>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-4">✅ Vantagens</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Simplicidade:</strong> Fácil de implementar com HTTP comum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Controle do cliente:</strong> Define quando e com que frequência consultar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Funciona em qualquer rede:</strong> Não precisa de conectividade especial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Resiliente:</strong> Se uma requisição falha, a próxima pode recuperar</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-red-400 mb-4">❌ Desvantagens</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Ineficiente:</strong> Muitas requisições desnecessárias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Latência:</strong> Dados podem ficar "velhos" até a próxima consulta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Recursos desperdiçados:</strong> CPU, banda e bateria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Difícil de escalar:</strong> Muitos clientes = muitas requisições</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-400 mb-4">💡 Quando Usar Polling</h4>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">▶</span>
                <span><strong>Dados mudam raramente:</strong> Se atualizações são poucas, polling pode ser eficiente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">▶</span>
                <span><strong>Cliente atrás de firewall:</strong> Quando o servidor não consegue "chegar" no cliente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">▶</span>
                <span><strong>Simplicidade é prioridade:</strong> Para MVPs ou sistemas internos simples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">▶</span>
                <span><strong>Controle granular:</strong> Quando o cliente precisa controlar exatamente quando buscar dados</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Webhooks Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-purple-400">🔔 Webhooks (Notificações Push)</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-purple-300">Como Funciona</h3>
            <p className="text-lg text-zinc-300 leading-relaxed mb-6">
              Com webhooks, o servidor notifica automaticamente o cliente quando há novos dados. 
              É como ter um carteiro que toca sua campainha toda vez que chega uma carta.
            </p>
            
            <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-purple-400 mb-4">Fluxo Típico:</h4>
              <ol className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>Cliente registra uma URL de callback no servidor</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Quando há novos dados, servidor faz POST para a URL do cliente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>Cliente recebe os dados imediatamente</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                  <span>Cliente responde com 200 OK para confirmar recebimento</span>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-green-400 mb-4">✅ Vantagens</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Tempo real:</strong> Dados chegam imediatamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Eficiente:</strong> Zero requisições desnecessárias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Escalável:</strong> Não aumenta carga com mais clientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span><strong>Economiza recursos:</strong> Menos CPU, banda e bateria</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-red-400 mb-4">❌ Desvantagens</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Complexidade:</strong> Requer endpoint público no cliente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Segurança:</strong> Precisa validar origem das requisições</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Retry logic:</strong> O que fazer se o cliente estiver offline?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>Debug mais difícil:</strong> Fluxo menos previsível</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-purple-400 mb-4">💡 Quando Usar Webhooks</h4>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▶</span>
                <span><strong>Tempo real é crítico:</strong> Notificações, chat, atualizações de status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▶</span>
                <span><strong>Alto volume de dados:</strong> Quando mudanças são frequentes e imprevisíveis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▶</span>
                <span><strong>Eficiência é importante:</strong> Para economizar recursos e melhorar UX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▶</span>
                <span><strong>Cliente pode receber conexões:</strong> Tem IP público ou pode usar ferramentas como ngrok</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Comparison Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">⚖️ Comparação Detalhada</h2>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800/50">
                    <th className="text-left p-4 text-zinc-300 font-medium">Aspecto</th>
                    <th className="text-left p-4 text-blue-400 font-medium">📤 Polling</th>
                    <th className="text-left p-4 text-purple-400 font-medium">🔔 Webhooks</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">Latência</td>
                    <td className="p-4">Até o intervalo de polling (ex: 0-30s)</td>
                    <td className="p-4">Quase instantânea (&lt; 1s)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">Uso de Banda</td>
                    <td className="p-4">Alto (requisições constantes)</td>
                    <td className="p-4">Baixo (só quando há dados)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">Complexidade</td>
                    <td className="p-4">Baixa</td>
                    <td className="p-4">Média/Alta</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">Escalabilidade</td>
                    <td className="p-4">Limitada (O(n) requisições)</td>
                    <td className="p-4">Excelente (O(1) por evento)</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">Requisitos de Rede</td>
                    <td className="p-4">Cliente pode ser privado</td>
                    <td className="p-4">Cliente precisa ser acessível</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">Controle</td>
                    <td className="p-4">Total pelo cliente</td>
                    <td className="p-4">Iniciado pelo servidor</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30">
                    <td className="p-4 font-medium">Debugging</td>
                    <td className="p-4">Fácil (fluxo previsível)</td>
                    <td className="p-4">Mais complexo</td>
                  </tr>
                  <tr className="border-t border-zinc-700/30 bg-zinc-800/20">
                    <td className="p-4 font-medium">Reliability</td>
                    <td className="p-4">Alta (retry automático)</td>
                    <td className="p-4">Precisa implementar retry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Real World Examples */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">🌍 Exemplos do Mundo Real</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Polling Examples */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">📤 Casos de Uso - Polling</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">📊 Dashboards de Métricas</h4>
                  <p className="text-zinc-300 text-sm">
                    Grafana atualiza métricas a cada 30s. Como dados são históricos e não críticos, polling funciona bem.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">📧 Cliente de Email</h4>
                  <p className="text-zinc-300 text-sm">
                    Outlook verifica emails a cada 15 minutos. Usuário não precisa de entrega instantânea.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">📦 Tracking de Entrega</h4>
                  <p className="text-zinc-300 text-sm">
                    Status de envio muda poucas vezes por dia, polling é eficiente.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">💰 Preços de Ações</h4>
                  <p className="text-zinc-300 text-sm">
                    Apps financeiros podem fazer polling a cada minuto para dados não críticos.
                  </p>
                </div>
              </div>
            </div>

            {/* Webhook Examples */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">🔔 Casos de Uso - Webhooks</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-2">💬 Aplicativos de Chat</h4>
                  <p className="text-zinc-300 text-sm">
                    WhatsApp, Slack - mensagens precisam chegar instantaneamente.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-2">💳 Pagamentos Online</h4>
                  <p className="text-zinc-300 text-sm">
                    Stripe notifica sobre pagamentos confirmados imediatamente.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-2">🚨 Sistemas de Alerta</h4>
                  <p className="text-zinc-300 text-sm">
                    PagerDuty envia alertas críticos instantaneamente.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-2">📹 Streaming de Vídeo</h4>
                  <p className="text-zinc-300 text-sm">
                    YouTube notifica quando processo de upload/encoding termina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Implementation Considerations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">🛠️ Considerações de Implementação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Polling Implementation */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">Implementando Polling</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-3">🔧 Estratégias Comuns</h4>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li><strong>Fixed Interval:</strong> Consulta a cada X segundos</li>
                    <li><strong>Exponential Backoff:</strong> Aumenta intervalo se não há dados</li>
                    <li><strong>Adaptive Polling:</strong> Ajusta frequência baseado em atividade</li>
                    <li><strong>Long Polling:</strong> Servidor "segura" requisição até ter dados</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-3">⚠️ Cuidados Importantes</h4>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• Implementar jitter para evitar "thundering herd"</li>
                    <li>• Usar ETags/Last-Modified para cache</li>
                    <li>• Considerar impacto na bateria (mobile)</li>
                    <li>• Rate limiting no servidor</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Webhook Implementation */}
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Implementando Webhooks</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-3">🔒 Segurança Essencial</h4>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li><strong>HMAC Signatures:</strong> Verificar origem da requisição</li>
                    <li><strong>HTTPS Only:</strong> Criptografar dados em trânsito</li>
                    <li><strong>Whitelist IPs:</strong> Aceitar só de IPs conhecidos</li>
                    <li><strong>Timeout Handling:</strong> Não aguardar forever</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-purple-300 mb-3">🔄 Reliability Patterns</h4>
                  <ul className="space-y-2 text-zinc-300 text-sm">
                    <li>• Retry com exponential backoff</li>
                    <li>• Dead letter queue para failures</li>
                    <li>• Idempotência (mesmo webhook pode vir 2x)</li>
                    <li>• Circuit breaker para clientes problemáticos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Hybrid Approaches */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">🔄 Abordagens Híbridas</h2>
          
          <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50">
            <p className="text-lg text-zinc-300 leading-relaxed mb-8">
              Na prática, muitos sistemas combinam ambas as abordagens para obter o melhor dos dois mundos:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-400 mb-4">🔄 Fallback Strategy</h4>
                <p className="text-zinc-300 text-sm mb-4">
                  Use webhooks como principal, polling como backup se webhooks falharem.
                </p>
                <p className="text-xs text-zinc-500">
                  Exemplo: Slack usa webhooks, mas também polling periódico para garantir sincronização.
                </p>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-yellow-400 mb-4">⚡ Real-time + Batch</h4>
                <p className="text-zinc-300 text-sm mb-4">
                  Webhooks para dados críticos, polling para sincronização em batch.
                </p>
                <p className="text-xs text-zinc-500">
                  Exemplo: E-commerce usa webhooks para pedidos, polling para relatórios.
                </p>
              </div>
              
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-orange-400 mb-4">🎯 Context-Aware</h4>
                <p className="text-zinc-300 text-sm mb-4">
                  Escolha dinâmica baseada no contexto (usuário ativo vs inativo).
                </p>
                <p className="text-xs text-zinc-500">
                  Exemplo: App usa webhooks quando usuário está online, polling quando offline.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30"
        >
          <h2 className="text-2xl font-bold mb-4">🚀 Pronto para Ver na Prática?</h2>
          <p className="text-zinc-300 mb-6">
            Agora que você entende os conceitos, experimente nosso simulador interativo para ver a diferença em ação!
          </p>
          <Link
            to="/componentes/polling-webhooks/simulator"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Acessar Simulador Interativo
          </Link>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <Link
            to="/componentes"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Componentes Básicos
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 