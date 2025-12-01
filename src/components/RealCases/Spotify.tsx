import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Spotify: React.FC = () => {
  const { t } = useTranslation();
  const base = 'spotify';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const streamingPipelineItems = t(`${base}.streaming_pipeline_items`, { returnObjects: true }) as string[];
  const audioProcessingItems = t(`${base}.audio_processing_items`, { returnObjects: true }) as string[];
  const audioStorageItems = t(`${base}.audio_storage_items`, { returnObjects: true }) as string[];
  const databaseItems = t(`${base}.database_items`, { returnObjects: true }) as string[];
  const algorithmsFeaturesItems = t(`${base}.algorithms_features_items`, { returnObjects: true }) as string[];
  const featuresList = t(`${base}.features_list`, { returnObjects: true }) as string[];
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.users`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.users_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.streams`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.streams_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{t(`${base}.metrics.songs`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.songs_desc`)}</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.requirements_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {functionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.non_functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {nonFunctionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.architecture_title`)}</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.high_level_title`)}</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.clients_label`)}</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.cdn_cache_label`)}</text>
              </g>

              {/* Load Balancer */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.load_balancer_label`)}</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.streaming_service_label`)}</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.recommendation_service_label`)}</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.metadata_service_label`)}</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">{t(`${base}.s3_audio_label`)}</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">{t(`${base}.cassandra_metadata_label`)}</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#1DB954" fontSize="12">{t(`${base}.redis_cache_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#1DB954" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="380" x2="650" y2="420" />
                <line x1="150" y1="320" x2="650" y2="320" />
              </g>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            {t(`${base}.high_level_description`)}
          </p>
        </div>

        {/* Streaming Architecture Diagram */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.streaming_architecture_title`)}</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-green-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Client */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.spotify_client_label`)}</text>
              </g>

              {/* Edge Cache */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.edge_cache_label`)}</text>
              </g>

              {/* Streaming Service */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.streaming_service_label`)}</text>
              </g>

              {/* Storage */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.storage_s3_label`)}</text>
              </g>

              {/* Processing Components */}
              <g>
                <rect x="450" y="280" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="525" y="315" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.transcoding_label`)}</text>

                <rect x="650" y="280" width="150" height="60" rx="4" fill="#1DB954" fillOpacity="0.1" stroke="#1DB954" strokeWidth="2"/>
                <text x="725" y="315" textAnchor="middle" fill="#1DB954" fontSize="14">{t(`${base}.processing_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#1DB954" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
                <line x1="725" y1="230" x2="725" y2="280" />
                <line x1="525" y1="230" x2="525" y2="280" />
              </g>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            {t(`${base}.streaming_description`)}
          </p>
        </div>

        {/* Audio Streaming */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.streaming_system_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.streaming_pipeline_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {streamingPipelineItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-slate-700 dark:text-slate-200 mt-4">{t(`${base}.audio_processing_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {audioProcessingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.storage_system_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.audio_storage_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {audioStorageItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-slate-700 dark:text-slate-200 mt-4">{t(`${base}.database_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {databaseItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.recommendation_system_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.algorithms_features_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {algorithmsFeaturesItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t(`${base}.features_considered`)}
                <ul className="list-disc list-inside ml-6 mt-2">
                  {featuresList.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-green-400">{t(`${base}.realtime_features_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.realtime_infrastructure_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
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
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.technical_decisions_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_1_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_1_text`)}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_2_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_2_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_3_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_3_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.decision_4_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_4_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.scaling_challenges_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.global_latency_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.global_latency_text`)}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.distributed_data_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.distributed_data_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.machine_learning_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.machine_learning_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.microservices_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.microservices_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.evolution_title`)}</h2>
        <div className="space-y-6">
          {/* 2006: Initial Architecture */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2006</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2006_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2006_desc`)}</p>
            </div>
          </div>

          {/* 2008-2009: First Scaling */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2008-2009</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2008_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2008_desc`)}</p>
            </div>
          </div>

          {/* 2011-2012: Microservices */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2011_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2011_desc`)}</p>
            </div>
          </div>

          {/* 2014-2015: Event-Driven */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2014-2015</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2014_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2014_desc`)}</p>
            </div>
          </div>

          {/* 2016-Present: Cloud Native */}
          <div className="relative pl-8 border-l-2 border-green-500">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-green-400 font-semibold">2016-{t(`${base}.timeline_2016_desc`).includes('Presente') ? 'Presente' : 'Present'}</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2016_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2016_desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-green-500">{t(`${base}.references_title`)}</h2>
        <div className="space-y-3">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.official_docs_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://engineering.atspotify.com/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify Engineering Blog</a></li>
              <li><a href="https://spotify.design/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify Design</a></li>
              <li><a href="https://developer.spotify.com/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Spotify for Developers</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://engineering.atspotify.com/2013/03/backend-infrastructure-at-spotify/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Backend Infrastructure at Spotify</a></li>
              <li><a href="https://engineering.atspotify.com/2015/01/spotifys-event-delivery-the-road-to-the-cloud-part-i/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Event Delivery System</a></li>
              <li><a href="https://engineering.atspotify.com/2016/02/spotifys-big-data-ecosystem/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Big Data Ecosystem</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://www.youtube.com/watch?v=Xr2soUVHxG8" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Spotify's Audio Delivery at Scale</a></li>
              <li><a href="https://www.youtube.com/watch?v=Z2JzVxP4H4w" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">InfoQ - Scaling Spotify</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-400 mb-2">{t(`${base}.open_source_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://backstage.io/" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Backstage - Developer Portal</a></li>
              <li><a href="https://github.com/spotify/luigi" className="text-green-400 hover:underline" target="_blank" rel="noopener noreferrer">Luigi - Workflow Management</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Spotify; 
