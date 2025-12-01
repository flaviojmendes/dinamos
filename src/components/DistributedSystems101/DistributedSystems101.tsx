import { useTranslation } from 'react-i18next';

export default function DistributedSystems101() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('content.ds101.title')}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {t('content.ds101.intro_lead')} 
          <span className="italic">{t('content.ds101.intro_q1')}</span> {t('common.and') || ''} 
          <span className="italic">{t('content.ds101.intro_q2')}</span>
        </p>

        <div className="relative w-full aspect-video mb-12">
          <iframe
            src="https://www.youtube.com/embed/yj9jIfi3iR4"
            title={t('content.ds101.video_title')}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('content.ds101.definition_intro')}
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-4 my-8 text-xl font-medium text-brand-600 dark:text-brand-200 italic">
            {t('content.ds101.definition_quote')}
          </blockquote>

          <p>
            {t('content.ds101.metaphor_intro')}
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('content.ds101.section1_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('content.ds101.section1_intro')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section1_items_1')}</li>
            <li>{t('content.ds101.section1_items_2')}</li>
            <li>{t('content.ds101.section1_items_3')}</li>
            <li>{t('content.ds101.section1_items_4')}</li>
          </ul>

          <p>
            {t('content.ds101.section1_conclusion')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section1_points_1')}</li>
            <li>{t('content.ds101.section1_points_2')}</li>
            <li>{t('content.ds101.section1_points_3')}</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('content.ds101.section2_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('content.ds101.section2_intro')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section2_items_1')}</li>
            <li>{t('content.ds101.section2_items_2')}</li>
          </ul>

          <p>
            {t('content.ds101.section2_desc')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section2_points_1')}</li>
            <li>{t('content.ds101.section2_points_2')}</li>
            <li>{t('content.ds101.section2_points_3')}</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('content.ds101.section3_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('content.ds101.section3_intro')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section3_items_1')}</li>
            <li>{t('content.ds101.section3_items_2')}</li>
            <li>{t('content.ds101.section3_items_3')}</li>
            <li>{t('content.ds101.section3_items_4')}</li>
          </ul>

          <p>
            {t('content.ds101.section3_desc')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section3_points_1')}</li>
            <li>{t('content.ds101.section3_points_2')}</li>
            <li>{t('content.ds101.section3_points_3')}</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('content.ds101.section4_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <p>
            {t('content.ds101.section4_intro')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section4_items_1')}</li>
            <li>{t('content.ds101.section4_items_2')}</li>
            <li>{t('content.ds101.section4_items_3')}</li>
          </ul>

          <p>
            {t('content.ds101.section4_desc')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('content.ds101.section4_points_1')}</li>
            <li>{t('content.ds101.section4_points_2')}</li>
            <li>{t('content.ds101.section4_points_3')}</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300">
          {t('content.ds101.conclusion_title')}
        </h2>

        <div className="space-y-6 text-slate-700 dark:text-slate-200">
          <ul className="list-disc list-inside space-y-4 ml-4">
            <li>{t('content.ds101.conclusion_point_1')}</li>
            <li>{t('content.ds101.conclusion_point_2')}</li>
            <li>{t('content.ds101.conclusion_point_3')}</li>
          </ul>

          <p className="text-xl font-medium text-brand-600 dark:text-brand-200 border-l-4 border-blue-500 pl-4 mt-8">
            {t('content.ds101.conclusion_para')}
          </p>
        </div>
      </div>
    </div>
  );
} 