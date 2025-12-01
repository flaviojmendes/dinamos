import { useTranslation } from 'react-i18next';

export default function Database() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('components.database.title')}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {t('components.database.intro')}
        </p>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.database.relational_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('components.database.relational_p1')}
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.database.advantages')}</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('components.database.relational_adv_1')}</li>
              <li>{t('components.database.relational_adv_2')}</li>
              <li>{t('components.database.relational_adv_3')}</li>
              <li>{t('components.database.relational_adv_4')}</li>
            </ul>

            <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mt-6 mb-4">{t('components.database.limitations')}</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('components.database.relational_lim_1')}</li>
              <li>{t('components.database.relational_lim_2')}</li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mt-4">
            <p className="font-medium text-brand-600 dark:text-brand-200">{t('components.database.examples_label')}</p>
            <p>{t('components.database.examples_sql')}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.database.nosql_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('components.database.nosql_p1')}
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.database.advantages')}</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('components.database.nosql_adv_1')}</li>
              <li>{t('components.database.nosql_adv_2')}</li>
              <li>{t('components.database.nosql_adv_3')}</li>
            </ul>

            <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mt-6 mb-4">{t('components.database.limitations')}</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('components.database.nosql_lim_1')}</li>
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mt-4 space-y-4">
            <div>
              <p className="font-medium text-brand-600 dark:text-brand-200">{t('components.database.nosql_mongo_label')}</p>
              <p>{t('components.database.nosql_mongo_desc')}</p>
            </div>
            <div>
              <p className="font-medium text-brand-600 dark:text-brand-200">{t('components.database.nosql_cassandra_label')}</p>
              <p>{t('components.database.nosql_cassandra_desc')}</p>
            </div>
            <div>
              <p className="font-medium text-brand-600 dark:text-brand-200">{t('components.database.nosql_redis_label')}</p>
              <p>{t('components.database.nosql_redis_desc')}</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('components.database.shard_part_rep_title')}
        </h2>

        <div className="space-y-8 text-slate-700 dark:text-slate-200">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.database.sharding_title')}</h3>
            <p className="mb-4">
              {t('components.database.sharding_p1')}
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-4">
              <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.database.example')}</p>
              <p>
                {t('components.database.sharding_example')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.database.partitioning_title')}</h3>
            <p className="mb-4">
              {t('components.database.partitioning_p1')}
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-4">
              <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.database.example')}</p>
              <p>
                {t('components.database.partitioning_example')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-200 mb-4">{t('components.database.replication_title')}</h3>
            <p className="mb-4">
              {t('components.database.replication_p1')}
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.database.sync_rep_label')}</h4>
                <p>
                  {t('components.database.sync_rep_desc')}
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-2">
                  <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.database.example')}</p>
                  <p>
                    {t('components.database.sync_rep_example')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-brand-600 dark:text-brand-200 mb-2">{t('components.database.async_rep_label')}</h4>
                <p>
                  {t('components.database.async_rep_desc')}
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mt-2">
                  <p className="font-medium text-brand-600 dark:text-brand-200 mb-2">{t('components.database.example')}</p>
                  <p>
                    {t('components.database.async_rep_example')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 