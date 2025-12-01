import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function MessageQueue() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('components.message_queue_page.title')}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {t('components.message_queue_page.intro')}
        </p>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.message_queue_page.kafka_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.message_queue_page.kafka_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.message_queue_page.rabbitmq_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.message_queue_page.rabbitmq_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.message_queue_page.sqs_title')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.message_queue_page.sqs_p')}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.message_queue_page.pubsub_title')}
        </h2>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.message_queue_page.pubsub_header')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.message_queue_page.pubsub_p')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.message_queue_page.fifo_header')}</h3>
            <p className="text-slate-700 dark:text-slate-200">
              {t('components.message_queue_page.fifo_p')}
            </p>
          </div>
        </div>

        <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
          <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300 mb-4">
            {t('components.message_queue.simulator_title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {t('components.message_queue.simulator_description')}
          </p>
          <Link 
            to="/componentes/message-queue/simulator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t('components.message_queue.access_simulator')}
          </Link>
        </div>
      </div>
    </div>
  );
} 