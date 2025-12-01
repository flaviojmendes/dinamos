import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Firewall() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('components.firewall.title')}
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.firewall.what_is_title')}
        </h2>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {t('components.firewall.what_is_p')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.firewall.features_title')}
        </h2>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.firewall.filtering_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.firewall.filtering_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.firewall.stateful_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.firewall.stateful_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.firewall.ips_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.firewall.ips_p')}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.firewall.types_title')}
        </h2>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.firewall.net_fw_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.firewall.net_fw_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.firewall.app_fw_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.firewall.app_fw_p')}
            </p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-8">
          <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.common.example')}</p>
          <p className="text-slate-600 dark:text-slate-300">
            {t('components.firewall.example_text')}
          </p>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300 mb-4">
            {t('components.firewall.simulator_title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {t('components.firewall.simulator_description')}
          </p>
          <Link 
            to="/componentes/firewall/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('components.firewall.access_simulator')}
          </Link>
        </div>
      </div>
    </div>
  );
} 