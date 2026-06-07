import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CanaryDeployment() {
  const { t } = useTranslation();
  
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-brand-600 dark:text-brand-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('canary_deployment.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-300"
        >
          {t('canary_deployment.intro')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Concept and How it Works */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('canary_deployment.how_it_works.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {t('canary_deployment.how_it_works.text')}
            </p>
            
            {/* Visual Flow Diagram */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('canary_deployment.diagram.users')}</span>
                </div>
                
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-lg bg-yellow-500 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t('canary_deployment.diagram.router')}</span>
                </div>
                
                <svg className="w-8 h-8 text-slate-400 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">v1</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">v2</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">5%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('canary_deployment.origin.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {t('canary_deployment.origin.text')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('canary_deployment.phases.title')}
            </h2>
            <div className="space-y-4">
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.phases.deploy.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.phases.deploy.desc')}</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.phases.route.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.phases.route.desc')}</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.phases.monitor.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.phases.monitor.desc')}</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.phases.expand.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.phases.expand.desc')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Benefits, Challenges, and Considerations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('canary_deployment.benefits.title')}
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.benefits.items.risk_reduction.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.benefits.items.risk_reduction.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.benefits.items.quick_rollback.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.benefits.items.quick_rollback.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.benefits.items.real_testing.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.benefits.items.real_testing.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.benefits.items.gradual_rollout.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.benefits.items.gradual_rollout.desc')}</p>
                </div>
              </motion.li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('canary_deployment.challenges.title')}
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
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.challenges.items.complexity.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.challenges.items.complexity.desc')}</p>
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
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.challenges.items.monitoring.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.challenges.items.monitoring.desc')}</p>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <svg className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-200">{t('canary_deployment.challenges.items.db_compat.title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{t('canary_deployment.challenges.items.db_compat.desc')}</p>
                </div>
              </motion.li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-4">
              {t('canary_deployment.vs_blue_green.title')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-slate-600 dark:text-slate-300">{t('canary_deployment.vs_blue_green.aspect')}</th>
                    <th className="text-left py-2 text-orange-500">{t('canary_deployment.vs_blue_green.canary')}</th>
                    <th className="text-left py-2 text-blue-500">{t('canary_deployment.vs_blue_green.blue_green')}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-500 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-2">{t('canary_deployment.vs_blue_green.traffic')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.traffic_canary')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.traffic_bg')}</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-2">{t('canary_deployment.vs_blue_green.risk')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.risk_canary')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.risk_bg')}</td>
                  </tr>
                  <tr>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.rollback')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.rollback_canary')}</td>
                    <td className="py-2">{t('canary_deployment.vs_blue_green.rollback_bg')}</td>
                  </tr>
                </tbody>
              </table>
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
          to="/principios-design/canary-deployment/simulator"
          className="inline-flex items-center gap-2 font-sans px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('canary_deployment.cta_simulator')}
        </Link>
      </motion.div>
    </div>
  );
}
