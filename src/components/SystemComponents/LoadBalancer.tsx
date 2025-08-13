import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function LoadBalancer() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          {t('components.load_balancer_page.title')}
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          {t('components.load_balancer_page.intro1')}
        </p>

        <p className="text-zinc-200 mb-12">
          {t('components.load_balancer_page.intro2')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('components.load_balancer_page.algos_title')}
        </h2>

        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.load_balancer_page.rr_title')}</h3>
            <p className="text-zinc-200">
              {t('components.load_balancer_page.rr_p')}
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">{t('components.load_balancer_page.how_it_works')}</p>
              <p className="text-zinc-300">
                {t('components.load_balancer_page.rr_example')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.load_balancer_page.hashing_title')}</h3>
            <p className="text-zinc-200">
              {t('components.load_balancer_page.hashing_p')}
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">{t('components.load_balancer_page.use_case')}</p>
              <p className="text-zinc-300">
                {t('components.load_balancer_page.hashing_example')}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.load_balancer_page.least_title')}</h3>
            <p className="text-zinc-200">
              {t('components.load_balancer_page.least_p')}
            </p>
            <div className="mt-4 bg-zinc-800 rounded p-4">
              <p className="font-medium text-blue-200 mb-2">{t('components.load_balancer_page.advantage')}</p>
              <p className="text-zinc-300">
                {t('components.load_balancer_page.least_example')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            {t('components.load_balancer.simulator_title')}
          </h2>
          <p className="text-zinc-300 mb-4">
            {t('components.load_balancer.simulator_description')}
          </p>
          <Link
            to="/componentes/load-balancer/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('components.load_balancer.access_simulator')}
          </Link>
        </div>
      </div>
    </div>
  );
} 