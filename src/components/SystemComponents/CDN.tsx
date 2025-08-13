import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function CDN() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          CDN (Content Delivery Network)
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('components.cdn.what_is_title')}
        </h2>

        <p className="text-xl text-zinc-300 mb-12">
          {t('components.cdn.what_is_description')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('components.cdn.benefits_title')}
        </h2>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.cdn.benefit_latency_title')}</h3>
            <p className="text-zinc-200">
              {t('components.cdn.benefit_latency_desc')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.cdn.benefit_load_title')}</h3>
            <p className="text-zinc-200">
              {t('components.cdn.benefit_load_desc')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-200 mb-4">{t('components.cdn.benefit_availability_title')}</h3>
            <p className="text-zinc-200">
              {t('components.cdn.benefit_availability_desc')}
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded p-4 mt-8">
          <p className="font-medium text-blue-200 mb-2">{t('components.cdn.example_label')}</p>
          <p className="text-zinc-300">
            {t('components.cdn.example_text')}
          </p>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">
            {t('components.cdn.simulator_title')}
          </h2>
          <p className="text-zinc-300 mb-4">
            {t('components.cdn.simulator_description')}
          </p>
          <Link 
            to="/componentes/cdn/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('components.cdn.access_simulator')}
          </Link>
        </div>
      </div>
    </div>
  );
} 