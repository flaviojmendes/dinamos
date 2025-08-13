import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const WhatsApp: React.FC = () => {
  const { t } = useTranslation();
  const base = 'whatsapp';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const messageProcessingItems = t(`${base}.message_processing_items`, { returnObjects: true }) as string[];
  const messageTypesItems = t(`${base}.message_types_items`, { returnObjects: true }) as string[];
  const messageStorageItems = t(`${base}.message_storage_items`, { returnObjects: true }) as string[];
  const databaseItems = t(`${base}.database_items`, { returnObjects: true }) as string[];
  const realtimeInfrastructureItems = t(`${base}.realtime_infrastructure_items`, { returnObjects: true }) as string[];
  const realtimeFeaturesItems = t(`${base}.realtime_features_items`, { returnObjects: true }) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-zinc-400">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.users`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.users_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.messages`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.messages_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.groups`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.groups_desc`)}</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.requirements_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {functionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.non_functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {nonFunctionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.architecture_title`)}</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.high_level_title`)}</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.clients_label`)}</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.load_balancer_label`)}</text>
              </g>

              {/* Chat Servers */}
              <g>
                <rect x="50" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="255" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.chat_servers_label`)}</text>
              </g>

              {/* Presence Servers */}
              <g>
                <rect x="300" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.presence_servers_label`)}</text>
              </g>

              {/* Media Servers */}
              <g>
                <rect x="550" y="220" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="650" y="255" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.media_servers_label`)}</text>
              </g>

              {/* Authentication */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.authentication_label`)}</text>
              </g>

              {/* Key Management */}
              <g>
                <rect x="300" y="320" width="200" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.key_management_label`)}</text>
              </g>

              {/* Storage Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#25D366" fontSize="12">{t(`${base}.cassandra_messages_label`)}</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#25D366" fontSize="12">{t(`${base}.redis_cache_label`)}</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#25D366" fontSize="12">{t(`${base}.s3_media_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#25D366" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="150" y1="280" x2="150" y2="320" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="280" x2="650" y2="420" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            {t(`${base}.high_level_description`)}
          </p>
        </div>

        {/* Message Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.message_flow_title`)}</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Sender */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.sender_label`)}</text>
              </g>

              {/* Chat Server */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.chat_server_label`)}</text>
              </g>

              {/* Message Queue */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.message_queue_label`)}</text>
              </g>

              {/* Receiver */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#25D366" fillOpacity="0.1" stroke="#25D366" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#25D366" fontSize="14">{t(`${base}.receiver_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#25D366" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>

              {/* Flow Indicators */}
              <g>
                <text x="225" y="180" fill="#25D366" fontSize="12">{t(`${base}.encrypt_step`)}</text>
                <text x="425" y="180" fill="#25D366" fontSize="12">{t(`${base}.queue_step`)}</text>
                <text x="625" y="180" fill="#25D366" fontSize="12">{t(`${base}.deliver_step`)}</text>
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            {t(`${base}.message_flow_description`)}
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.messaging_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.message_processing_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {messageProcessingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.message_types_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {messageTypesItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.storage_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.message_storage_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {messageStorageItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.database_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {databaseItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.realtime_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.realtime_infrastructure_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {realtimeInfrastructureItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t(`${base}.realtime_features_list`)}
                <ul className="list-disc list-inside ml-6 mt-2">
                  {realtimeFeaturesItems.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.technical_decisions_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_1_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_1_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_2_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_2_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_3_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_3_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_4_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_4_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.scaling_challenges_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.mass_delivery_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.mass_delivery_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.connection_management_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.connection_management_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.synchronization_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.synchronization_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.large_groups_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.large_groups_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.evolution_title`)}</h2>
        <div className="space-y-6">
          {/* 2009: Initial Version */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2009</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2009_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2009_desc`)}</p>
            </div>
          </div>

          {/* 2011-2012: Basic Messaging */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2011_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2011_desc`)}</p>
            </div>
          </div>

          {/* 2014: Acquisition & Scale */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2014</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2014_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2014_desc`)}</p>
            </div>
          </div>

          {/* 2016: End-to-End Encryption */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2016</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2016_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2016_desc`)}</p>
            </div>
          </div>

          {/* 2019-Present: Multi-Device */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2019-{t(`${base}.timeline_2019_desc`).includes('Presente') ? 'Presente' : 'Present'}</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2019_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2019_desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-emerald-500">{t(`${base}.references_title`)}</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">{t(`${base}.official_docs_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://engineering.fb.com/category/whatsapp/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Engineering Blog</a></li>
              <li><a href="https://www.whatsapp.com/security/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Security</a></li>
              <li><a href="https://developers.facebook.com/docs/whatsapp/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Business API</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Encryption Overview</a></li>
              <li><a href="https://engineering.fb.com/2014/10/09/production-engineering/scaling-mercurial-at-facebook/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Scaling WhatsApp Infrastructure</a></li>
              <li><a href="https://signal.org/docs/specifications/doubleratchet/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Signal Protocol Specification</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=vvhC64hQZMk" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">F8 - WhatsApp Business Platform</a></li>
              <li><a href="https://www.youtube.com/watch?v=5DgVkKHxKQk" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Real-time Messaging Architecture</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-emerald-400 mb-2">{t(`${base}.security_privacy_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.whatsapp.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp Privacy Policy</a></li>
              <li><a href="https://scontent.whatsapp.net/v/t39.8562-34/316546300_547692750646518_7299107161331633308_n.pdf?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=t_1sHkqHzr4AX9QJTP-&_nc_ht=scontent.whatsapp.net&oh=01_AdTz6KJ_MWwjY_lQh6MH1_BPmXiC_1kdpvnNvCXcaHsUxw&oe=65C2F7C1" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">End-to-End Encryption Technical Paper</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default WhatsApp; 
