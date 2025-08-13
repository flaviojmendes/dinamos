import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Bitly: React.FC = () => {
  const { t } = useTranslation();
  const base = 'bitly';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const shortUrlGenerationItems = t(`${base}.short_url_generation_items`, { returnObjects: true }) as string[];
  const urlTypesItems = t(`${base}.url_types_items`, { returnObjects: true }) as string[];
  const urlStorageItems = t(`${base}.url_storage_items`, { returnObjects: true }) as string[];
  const cacheStrategiesItems = t(`${base}.cache_strategies_items`, { returnObjects: true }) as string[];
  const metricsCollectedItems = t(`${base}.metrics_collected_items`, { returnObjects: true }) as string[];
  const processingItems = t(`${base}.processing_items`, { returnObjects: true }) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-zinc-400">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{t(`${base}.metrics.links`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.links_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{t(`${base}.metrics.redirects`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.redirects_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{t(`${base}.metrics.active`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.active_desc`)}</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.requirements_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {functionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.non_functional_title`)}</h3>
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
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.architecture_title`)}</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-blue-400">{t(`${base}.high_level_title`)}</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.clients_label`)}</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.cdn_cache_label`)}</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.load_balancer_label`)}</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.shortening_service_label`)}</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.redirect_service_label`)}</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.analytics_service_label`)}</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">{t(`${base}.mysql_metadata_label`)}</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">{t(`${base}.redis_cache_label`)}</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#2196F3" fontSize="12">{t(`${base}.cassandra_analytics_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#2196F3" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="380" x2="650" y2="420" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            {t(`${base}.high_level_description`)}
          </p>
        </div>

        {/* URL Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-blue-400">{t(`${base}.url_flow_title`)}</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* URL Creation */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.original_url_label`)}</text>
              </g>

              {/* Hash Generation */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.hash_generation_label`)}</text>
              </g>

              {/* Storage */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.storage_label`)}</text>
              </g>

              {/* Short URL */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#2196F3" fillOpacity="0.1" stroke="#2196F3" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#2196F3" fontSize="14">{t(`${base}.short_url_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#2196F3" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            {t(`${base}.url_flow_description`)}
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">{t(`${base}.shortening_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.short_url_generation_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {shortUrlGenerationItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.url_types_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {urlTypesItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">{t(`${base}.storage_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.url_storage_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {urlStorageItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.cache_strategies_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {cacheStrategiesItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Analytics System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-blue-400">{t(`${base}.analytics_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.metrics_collected_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {metricsCollectedItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.processing_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {processingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Decisions and Trade-offs */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.technical_decisions_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.decision_1_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_1_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.decision_2_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_2_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.decision_3_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_3_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.decision_4_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_4_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.scaling_challenges_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.mass_redirect_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.mass_redirect_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.url_generation_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.url_generation_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.analytics_challenge_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.analytics_challenge_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.spam_abuse_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.spam_abuse_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.evolution_title`)}</h2>
        <div className="space-y-6">
          {/* 2008: Initial Version */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2008</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2008_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2008_desc`)}</p>
            </div>
          </div>

          {/* 2010-2011: Scale */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2010-2011</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2010_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2010_desc`)}</p>
            </div>
          </div>

          {/* 2012-2013: Enterprise */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2012-2013</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2012_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2012_desc`)}</p>
            </div>
          </div>

          {/* 2015-2016: Microservices */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2015-2016</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2015_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2015_desc`)}</p>
            </div>
          </div>

          {/* 2018-Present: Modern Stack */}
          <div className="relative pl-8 border-l-2 border-blue-500">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">2018-{t(`${base}.timeline_2018_desc`).includes('Presente') ? 'Presente' : 'Present'}</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2018_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2018_desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-blue-500">{t(`${base}.references_title`)}</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.official_docs_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://dev.bitly.com/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Bitly API Documentation</a></li>
              <li><a href="https://bitly.com/pages/resources" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Bitly Resources</a></li>
              <li><a href="https://support.bitly.com/hc/en-us/articles/231247868-Technical-requirements-for-Bitly" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Technical Requirements</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://blog.bitly.com/posts/infrastructure-update-improving-redirects" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Infrastructure: Improving Redirects</a></li>
              <li><a href="https://medium.com/bitly-engineering/building-a-distributed-link-shortening-system-d4c1edc3f13b" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Building a Distributed Link Shortening System</a></li>
              <li><a href="https://www.highscalability.com/blog/2014/7/14/bitly-lessons-learned-building-a-distributed-system-that-han.html" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">High Scalability - Bitly Architecture</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=JGLx8Jg4K6Y" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Scaling Bit.ly</a></li>
              <li><a href="https://www.youtube.com/watch?v=SagZK5CSF8M" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Tech Talk - URL Shortening at Scale</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-400 mb-2">{t(`${base}.tools_sdks_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://github.com/bitly/api-clients" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Official API Clients</a></li>
              <li><a href="https://github.com/bitly/go-nsq" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">NSQ - Distributed Messaging Platform</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Bitly; 