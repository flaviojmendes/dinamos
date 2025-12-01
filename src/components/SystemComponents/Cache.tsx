import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function CacheComponent() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('components.cache.title')}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {t('components.cache.intro')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.cache.memcached_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('components.cache.memcached_p1')}
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-4">
            <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.common.example')}</p>
            <p>
              {t('components.cache.memcached_example', { defaultValue: 'A news site can cache latest headlines in Memcached to speed up page loads.' })}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.cache.redis_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('components.cache.redis_p1')}
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-4">
            <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.common.example')}</p>
            <p>
              {t('components.cache.redis_example', { defaultValue: 'A group chat app can use Redis lists to keep recent messages while optionally persisting to disk.' })}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-6">{t('components.cache.compare_title')}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.cache.simplicity_label')}</h4>
                <p>
                  {t('components.cache.simplicity_desc')}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.cache.datatypes_label')}</h4>
                <p>
                  {t('components.cache.datatypes_desc')}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.cache.persistence_label')}</h4>
                <p>
                  {t('components.cache.persistence_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.cache.dist_vs_local_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.cache.local_cache_label')}</h4>
              <p>
                {t('components.cache.local_cache_desc')}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.cache.distributed_cache_label')}</h4>
              <p>
                {t('components.cache.distributed_cache_desc')}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-4">
            <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.common.example')}</p>
            <p>
              {t('components.cache.distributed_example', { defaultValue: 'Using Redis as a distributed cache across multiple app servers to ensure all read the same cached data.' })}
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300 mb-4">
            {t('components.cache.simulator_title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {t('components.cache.simulator_description')}
          </p>
          <Link 
            to="/componentes/cache/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('components.cache.access_simulator')}
          </Link>
        </div>
      </div>
    </div>
  );
} 