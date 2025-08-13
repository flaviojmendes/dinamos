import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Uber: React.FC = () => {
  const { t } = useTranslation();
  const base = 'uber';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const matchingAlgorithmItems = t(`${base}.matching_algorithm_items`, { returnObjects: true }) as string[];
  const factorsConsideredItems = t(`${base}.factors_considered_items`, { returnObjects: true }) as string[];
  const locationProcessingItems = t(`${base}.location_processing_items`, { returnObjects: true }) as string[];
  const optimizationsItems = t(`${base}.optimizations_items`, { returnObjects: true }) as string[];
  const realtimeInfrastructureItems = t(`${base}.realtime_infrastructure_items`, { returnObjects: true }) as string[];
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-zinc-400">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Metrics Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.metrics_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">{t(`${base}.metrics.monthly_users`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.monthly_users_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">{t(`${base}.metrics.active_drivers`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.active_drivers_desc`)}</div>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-zinc-200">{t(`${base}.metrics.trips_per_day`)}</div>
            <div className="text-sm text-zinc-400">{t(`${base}.metrics.trips_per_day_desc`)}</div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.requirements_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.functional_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {functionalItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.non_functional_title`)}</h3>
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
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.architecture_title`)}</h2>
        
        {/* High Level Architecture Diagram */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4">
          <h3 className="text-xl font-medium text-zinc-200">{t(`${base}.high_level_title`)}</h3>
          <div className="relative h-[500px] bg-black/50 rounded-lg border border-zinc-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Client Layer */}
              <g>
                <rect x="250" y="20" width="300" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.apps_label`)}</text>
              </g>

              {/* API Gateway */}
              <g>
                <rect x="250" y="120" width="300" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="155" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.api_gateway_label`)}</text>
              </g>

              {/* Core Services */}
              <g>
                <rect x="50" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.matching_service_label`)}</text>
              </g>

              {/* Location Services */}
              <g>
                <rect x="300" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.location_service_label`)}</text>
              </g>

              {/* Trip Services */}
              <g>
                <rect x="550" y="220" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="650" y="255" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.trip_service_label`)}</text>
              </g>

              {/* Supporting Services */}
              <g>
                <rect x="50" y="320" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="355" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.payment_service_label`)}</text>
              </g>

              {/* Analytics */}
              <g>
                <rect x="300" y="320" width="200" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="355" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.analytics_label`)}</text>
              </g>

              {/* Data Layer */}
              <g>
                <rect x="50" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="150" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">{t(`${base}.postgresql_data_label`)}</text>

                <rect x="300" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="400" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">{t(`${base}.redis_cache_label`)}</text>

                <rect x="550" y="420" width="200" height="50" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="650" y="450" textAnchor="middle" fill="#FFFFFF" fontSize="12">{t(`${base}.kafka_events_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#333333" strokeWidth="1" opacity="0.5">
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

        {/* Matching Flow Architecture */}
        <div className="bg-zinc-800/50 p-4 rounded-lg space-y-4 mt-8">
          <h3 className="text-xl font-medium text-zinc-200">{t(`${base}.matching_flow_title`)}</h3>
          <div className="relative h-[400px] bg-black/50 rounded-lg border border-zinc-900/30 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Request */}
              <g>
                <rect x="50" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="125" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.request_label`)}</text>
              </g>

              {/* Location Processing */}
              <g>
                <rect x="250" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="325" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.processing_label`)}</text>
              </g>

              {/* Driver Selection */}
              <g>
                <rect x="450" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="525" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.driver_selection_label`)}</text>
              </g>

              {/* Match */}
              <g>
                <rect x="650" y="170" width="150" height="60" rx="4" fill="#333333" fillOpacity="0.1" stroke="#333333" strokeWidth="2"/>
                <text x="725" y="205" textAnchor="middle" fill="#FFFFFF" fontSize="14">{t(`${base}.match_label`)}</text>
              </g>

              {/* Connecting Lines */}
              <g stroke="#333333" strokeWidth="1" opacity="0.5">
                <line x1="200" y1="200" x2="250" y2="200" />
                <line x1="400" y1="200" x2="450" y2="200" />
                <line x1="600" y1="200" x2="650" y2="200" />
              </g>
            </svg>
          </div>
          <p className="text-zinc-400">
            {t(`${base}.matching_flow_description`)}
          </p>
        </div>

        {/* Core Components */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">{t(`${base}.matching_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.matching_algorithm_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {matchingAlgorithmItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            
            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.factors_considered_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {factorsConsideredItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">{t(`${base}.location_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.location_processing_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {locationProcessingItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <h4 className="font-medium text-zinc-200 mt-4">{t(`${base}.optimizations_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {optimizationsItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-time Features */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-zinc-200">{t(`${base}.realtime_system_title`)}</h3>
          <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-zinc-200">{t(`${base}.realtime_infrastructure_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              {realtimeInfrastructureItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t(`${base}.features_label`)}
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
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.technical_decisions_title`)}</h2>
        <div className="space-y-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.decision_1_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_1_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.decision_2_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_2_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.decision_3_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_3_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.decision_4_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.decision_4_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Scaling Challenges */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.scaling_challenges_title`)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.mass_matching_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.mass_matching_text`)}
            </p>
          </div>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.realtime_data_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.realtime_data_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.global_consistency_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.global_consistency_text`)}
            </p>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.demand_peaks_title`)}</h3>
            <p className="text-zinc-300">
              {t(`${base}.demand_peaks_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.evolution_title`)}</h2>
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2009</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2009_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2009_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2011-2012</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2011_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2011_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2014-2015</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2014_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2014_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2016-2018</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2016_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2016_desc`)}</p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-zinc-500">
            <div className="absolute w-4 h-4 bg-zinc-500 rounded-full -left-[9px] top-0" />
            <div className="mb-2">
              <span className="text-zinc-400 font-semibold">2019-{t(`${base}.timeline_2019_desc`).includes('Presente') ? 'Presente' : 'Present'}</span>
              <h3 className="text-lg font-medium">{t(`${base}.timeline_2019_title`)}</h3>
              <p className="text-zinc-300">{t(`${base}.timeline_2019_desc`)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-zinc-900/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-200">{t(`${base}.references_title`)}</h2>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.official_docs_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://eng.uber.com/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Engineering Blog</a></li>
              <li><a href="https://uber.github.io/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Open Source</a></li>
              <li><a href="https://developer.uber.com/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Uber Developer Platform</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://eng.uber.com/h3/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">H3: Uber's Hexagonal Hierarchical Spatial Index</a></li>
              <li><a href="https://eng.uber.com/marketplace-real-time-pricing/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Marketplace Real-time Pricing</a></li>
              <li><a href="https://eng.uber.com/engineering-an-efficient-route/" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Engineering Efficient Route Planning</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.open_source_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://github.com/uber/h3" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">H3 - Geospatial Indexing System</a></li>
              <li><a href="https://github.com/uber/cadence" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Cadence - Workflow Engine</a></li>
              <li><a href="https://github.com/uber-go/zap" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">Zap - Logging Framework</a></li>
            </ul>
          </div>

          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-zinc-200 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li><a href="https://www.youtube.com/watch?v=nuiLcWE8sPA" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - Uber's Marketplace Platform</a></li>
              <li><a href="https://www.youtube.com/watch?v=kb-m2fasdDY" className="text-zinc-400 hover:underline" target="_blank" rel="noopener noreferrer">StrangeLoop - Uber's Real-time Tech Stack</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Uber; 