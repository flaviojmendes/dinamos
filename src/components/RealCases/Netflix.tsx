import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Netflix: React.FC = () => {
  const { t } = useTranslation();
  const base = 'netflix';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const openConnectItems = t(`${base}.open_connect_items`, { returnObjects: true }) as string[];
  const videoProcessingItems = t(`${base}.video_processing_items`, { returnObjects: true }) as string[];
  const algorithmsItems = t(`${base}.algorithms_items`, { returnObjects: true }) as string[];
  const featuresItems = t(`${base}.features_items`, { returnObjects: true }) as string[];
  const dataPipelineItems = t(`${base}.data_pipeline_items`, { returnObjects: true }) as string[];
  const featuresListItems = t(`${base}.features_list_items`, { returnObjects: true }) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.subscribers`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.subscribers_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.streaming_hours`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.streaming_hours_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.internet_traffic`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.internet_traffic_desc`)}</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.requirements_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {functionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.non_functional_title`)}</h3>
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
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.architecture_title`)}</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.high_level_title`)}</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-red-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.clients_label`)}</text>
              </g>

              {/* CDN Layer */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.open_connect_label`)}</text>
              </g>

              {/* Control Plane */}
              <g>
                <rect x="250" y="220" width="300" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.api_gateway_label`)}</text>
              </g>

              {/* Application Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.streaming_service_label`)}</text>

                <rect x="300" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.recommendation_service_label`)}</text>

                <rect x="550" y="320" width="200" height="60" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="650" y="355" textAnchor="middle" fill="#E50914" fontSize="14">{t(`${base}.metadata_service_label`)}</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#E50914" fontSize="12">{t(`${base}.s3_videos_label`)}</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#E50914" fontSize="12">{t(`${base}.cassandra_metadata_label`)}</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#E50914" fillOpacity="0.1" stroke="#E50914" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#E50914" fontSize="12">{t(`${base}.evcache_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#E50914" strokeWidth="1" opacity="0.5">
                <line x1="400" y1="80" x2="400" y2="120" />
                <line x1="400" y1="180" x2="400" y2="220" />
                <line x1="400" y1="280" x2="400" y2="320" />
                <line x1="150" y1="380" x2="150" y2="420" />
                <line x1="400" y1="380" x2="400" y2="420" />
                <line x1="650" y1="380" x2="650" y2="420" />
              </g>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            {t(`${base}.high_level_description`)}
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.streaming_system_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.open_connect_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {openConnectItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-slate-700 dark:text-slate-200 mt-4">{t(`${base}.video_processing_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {videoProcessingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.recommendation_system_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.algorithms_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {algorithmsItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-slate-700 dark:text-slate-200 mt-4">{t(`${base}.features_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {featuresItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data Processing */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.data_processing_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.data_pipeline_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {dataPipelineItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t(`${base}.features_list`)}
                <ul className="list-disc list-inside ml-6 mt-2">
                  {featuresListItems.map((feature, idx) => (
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
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.technical_decisions_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.decision_1_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_1_text`)}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.decision_2_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_2_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.decision_3_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_3_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.decision_4_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.decision_4_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.scaling_challenges_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.global_traffic_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.global_traffic_text`)}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.video_processing_challenge_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.video_processing_challenge_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.machine_learning_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.machine_learning_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.microservices_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.microservices_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.evolution_title`)}</h2>
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2007</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2007_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2007_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2009-2010</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2009_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2009_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2011_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2011_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2012-2016</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2012_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2012_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-red-500">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-red-400 font-semibold">2016-{t(`${base}.timeline_2016_desc`).includes('Presente') ? 'Presente' : 'Present'}</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2016_title`)}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t(`${base}.timeline_2016_desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-500">{t(`${base}.references_title`)}</h2>
        <div className="space-y-3">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.official_docs_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://netflixtechblog.com/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix Tech Blog</a></li>
              <li><a href="https://netflix.github.io/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix Open Source</a></li>
              <li><a href="https://about.netflix.com/en/news/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix ISP Infrastructure</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://netflixtechblog.com/netflix-at-velocity-2015-89c1794da400" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Netflix's Global Infrastructure</a></li>
              <li><a href="https://netflixtechblog.com/how-netflix-works-with-isps-around-the-globe-to-deliver-a-great-viewing-experience-c40c25b3b9fb" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Content Delivery Network</a></li>
              <li><a href="https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Recommendation System</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.open_source_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://github.com/Netflix/hystrix" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Hystrix - Latency and Fault Tolerance</a></li>
              <li><a href="https://github.com/Netflix/zuul" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Zuul - Gateway Service</a></li>
              <li><a href="https://github.com/Netflix/eureka" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Eureka - Service Discovery</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://www.youtube.com/watch?v=CZ3wIuvmHeM" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Netflix Cloud Architecture</a></li>
              <li><a href="https://www.youtube.com/watch?v=uCXv4gl2JT0" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">AWS re:Invent - Netflix on AWS</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Netflix; 