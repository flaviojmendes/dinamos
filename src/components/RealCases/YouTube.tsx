import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const YouTube: React.FC = () => {
  const { t } = useTranslation();
  const base = 'youtube';

  const functionalItems = t(`${base}.functional_items`, { returnObjects: true }) as string[];
  const nonFunctionalItems = t(`${base}.non_functional_items`, { returnObjects: true }) as string[];
  const uploadPipelineItems = t(`${base}.upload_pipeline_items`, { returnObjects: true }) as string[];
  const videoProcessingItems = t(`${base}.video_processing_items`, { returnObjects: true }) as string[];
  const videoStorageItems = t(`${base}.video_storage_items`, { returnObjects: true }) as string[];
  const databaseItems = t(`${base}.database_items`, { returnObjects: true }) as string[];
  const cdnInfrastructureItems = t(`${base}.cdn_infrastructure_items`, { returnObjects: true }) as string[];
  const loadBalancingFactors = t(`${base}.load_balancing_factors`, { returnObjects: true }) as string[];
  const featuresList = t(`${base}.features_list`, { returnObjects: true }) as string[];
  const earlyDaysReasons = t(`${base}.early_days_reasons`, { returnObjects: true }) as string[];
  const googleAcquisitionReasons = t(`${base}.google_acquisition_reasons`, { returnObjects: true }) as string[];
  const scalingPeriodReasons = t(`${base}.scaling_period_reasons`, { returnObjects: true }) as string[];
  const modernEraReasons = t(`${base}.modern_era_reasons`, { returnObjects: true }) as string[];
  const keyLearningsItems = t(`${base}.key_learnings_items`, { returnObjects: true }) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
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
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.users`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.users_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.uploads`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.uploads_desc`)}</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{t(`${base}.metrics.views`)}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{t(`${base}.metrics.views_desc`)}</div>
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
        
        {/* Video Upload & Processing */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.upload_processing_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.upload_pipeline_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {uploadPipelineItems.map((item, idx) => (
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

        {/* Storage System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.storage_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.video_storage_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {videoStorageItems.map((item, idx) => (
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

        {/* CDN and Video Delivery */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.cdn_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.cdn_infrastructure_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              {cdnInfrastructureItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>{t(`${base}.cdn_infrastructure_items[3]`)}
                <ul className="list-disc list-inside ml-6 mt-2">
                  {loadBalancingFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Recommendation System */}
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.recommendation_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-200">{t(`${base}.ml_architecture_title`)}</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li>{t(`${base}.two_phase_desc`)}
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>{t(`${base}.candidate_generation`)}</li>
                  <li>{t(`${base}.ranking`)}</li>
                </ul>
              </li>
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
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.storage_challenge_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.storage_challenge_text`)}
            </p>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.processing_challenge_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.processing_challenge_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.bandwidth_challenge_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.bandwidth_challenge_text`)}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.consistency_challenge_title`)}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {t(`${base}.consistency_challenge_text`)}
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Evolution Diagrams */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">{t(`${base}.evolution_diagrams_title`)}</h2>
        
        {/* 2005: Monolithic Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.arch_2005_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 200">
              {/* Users */}
              <g transform="translate(50,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.users_label`)}</text>
              </g>
              {/* Web Server */}
              <g transform="translate(250,80)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.web_server_label`)}</text>
              </g>
              {/* MySQL */}
              <g transform="translate(470,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.mysql_label`)}</text>
              </g>
              {/* Storage */}
              <g transform="translate(670,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.storage_label`)}</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="100" x2="250" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="100" x2="470" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="100" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* 2008: Distributed Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.arch_2008_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 300">
              {/* Users */}
              <g transform="translate(50,140)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.users_label`)}</text>
              </g>
              {/* Load Balancer */}
              <g transform="translate(250,140)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.load_balancer_label`)}</text>
              </g>
              {/* Web Servers */}
              <g transform="translate(470,80)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.web_server_label`)}</text>
              </g>
              <g transform="translate(470,140)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.web_server_label`)}</text>
              </g>
              <g transform="translate(470,200)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.web_server_label`)}</text>
              </g>
              {/* BigTable */}
              <g transform="translate(670,110)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.bigtable_label`)}</text>
              </g>
              {/* GFS */}
              <g transform="translate(670,170)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.gfs_label`)}</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="160" x2="250" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="160" x2="470" y2="220" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="160" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="220" x2="670" y2="130" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="100" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="160" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="220" x2="670" y2="190" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* 2020+: Modern Architecture */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.arch_2020_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <svg className="w-full max-w-2xl mx-auto" viewBox="0 0 800 400">
              {/* Users */}
              <g transform="translate(50,180)">
                <rect width="100" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="50" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.users_label`)}</text>
              </g>
              {/* CDN */}
              <g transform="translate(250,180)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.global_cdn_label`)}</text>
              </g>
              {/* Load Balancer */}
              <g transform="translate(450,180)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.load_balancer_label`)}</text>
              </g>
              {/* Microservices */}
              <g transform="translate(650,80)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.upload_service_label`)}</text>
              </g>
              <g transform="translate(650,140)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.transcode_label`)}</text>
              </g>
              <g transform="translate(650,200)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.ml_service_label`)}</text>
              </g>
              <g transform="translate(650,260)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.analytics_label`)}</text>
              </g>
              <g transform="translate(650,320)">
                <rect width="120" height="40" rx="5" fill="#374151" stroke="#EF4444" strokeWidth="2"/>
                <text x="60" y="25" textAnchor="middle" fill="white" fontSize="14">{t(`${base}.search_label`)}</text>
              </g>
              {/* Connections */}
              <line x1="150" y1="200" x2="250" y2="200" stroke="#EF4444" strokeWidth="2"/>
              <line x1="370" y1="200" x2="450" y2="200" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="100" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="160" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="220" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="280" stroke="#EF4444" strokeWidth="2"/>
              <line x1="570" y1="200" x2="650" y2="340" stroke="#EF4444" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Architectural Journey */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-6 space-y-6 mb-8">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">{t(`${base}.architectural_journey_title`)}</h2>
        
        {/* 2005-2006: Early Days */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.early_days_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.monolithic_architecture_title`)}</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {t(`${base}.early_days_text`)}
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  {earlyDaysReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-slate-500 dark:text-slate-400 italic">
                "{t(`${base}.early_days_quote`)}"
              </p>
            </div>
          </div>
        </div>

        {/* 2006-2008: Google Acquisition and Scale */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.google_acquisition_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.distributed_transition_title`)}</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {t(`${base}.google_acquisition_text`)}
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  {googleAcquisitionReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-slate-500 dark:text-slate-400 italic">
                "{t(`${base}.google_acquisition_quote`)}"
              </p>
            </div>
          </div>
        </div>

        {/* 2008-2015: Scaling Challenges */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.scaling_challenges_period_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.evolution_optimization_title`)}</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {t(`${base}.scaling_period_text`)}
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  {scalingPeriodReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-slate-500 dark:text-slate-400 italic">
                "{t(`${base}.scaling_period_quote`)}"
              </p>
            </div>
          </div>
        </div>

        {/* 2015-Present: Modern Era */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-red-400">{t(`${base}.modern_era_title`)}</h3>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.modern_innovations_title`)}</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {t(`${base}.modern_era_text`)}
                </p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  {modernEraReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-l-4 border-red-500/20 pl-4 mt-4">
              <p className="text-slate-500 dark:text-slate-400 italic">
                "{t(`${base}.modern_era_quote`)}"
              </p>
            </div>
          </div>
        </div>

        {/* Key Learnings */}
        <div className="mt-8 bg-gradient-to-r from-red-500/10 to-red-700/10 rounded-lg p-6">
          <h3 className="text-xl font-medium text-red-400 mb-4">{t(`${base}.key_learnings_title`)}</h3>
          <ul className="space-y-3">
            {keyLearningsItems.map((learning, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-600 dark:text-slate-300">
                  {learning}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="bg-gradient-to-r from-red-500/10 to-red-700/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">{t(`${base}.evolution_timeline_title`)}</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2005</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2005`)}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2006</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2006`)}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2008</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2008`)}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2012</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2012`)}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2015</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2015`)}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-24 flex-shrink-0 text-red-400">2020+</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-slate-600 dark:text-slate-300">
              {t(`${base}.timeline_2020`)}
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
              <li><a href="https://www.youtube.com/howyoutubeworks" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">How YouTube Works - Official</a></li>
              <li><a href="https://blog.youtube/inside-youtube/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">YouTube Engineering Blog</a></li>
              <li><a href="https://research.google/pubs/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Research Publications</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.technical_articles_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://highscalability.com/youtube-architecture/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">High Scalability - YouTube Architecture</a></li>
              <li><a href="https://developers.google.com/youtube/v3/getting-started" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">YouTube API Documentation</a></li>
              <li><a href="https://www.youtube.com/creators/how-things-work/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">YouTube Creator Technical Resources</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.conferences_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://www.youtube.com/watch?v=w5WVu624fY8" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Google I/O - YouTube Infrastructure</a></li>
              <li><a href="https://www.youtube.com/watch?v=5yDO-tmIoXY" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">QCon - YouTube Scalability</a></li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-400 mb-2">{t(`${base}.statistics_title`)}</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><a href="https://www.youtube.com/about/press/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">YouTube Press Statistics</a></li>
              <li><a href="https://www.statista.com/statistics/259477/hours-of-video-uploaded-to-youtube-every-minute/" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">Statista - YouTube Growth Statistics</a></li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default YouTube; 
