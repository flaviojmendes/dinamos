import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  const infoItems = t('privacy_policy.sections.info_collection.items', { returnObjects: true }) as string[];
  const useItems = t('privacy_policy.sections.use_info.items', { returnObjects: true }) as string[];
  const sharingItems = t('privacy_policy.sections.sharing.items', { returnObjects: true }) as string[];
  const rightsItems = t('privacy_policy.sections.rights.items', { returnObjects: true }) as string[];
  const contactItems = t('privacy_policy.sections.contact.items', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 space-y-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('privacy_policy.links.back_home')}
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {t('privacy_policy.title')}
          </h1>
          <p className="text-zinc-400">
            <span className="font-semibold text-white">{t('privacy_policy.last_updated_label')}</span>{' '}
            {t('privacy_policy.last_updated_date')}
          </p>
        </motion.div>

        <div className="space-y-10 text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.info_collection.title')}
            </h2>
            <p>{t('privacy_policy.sections.info_collection.description')}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {infoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.use_info.title')}
            </h2>
            <p>{t('privacy_policy.sections.use_info.description')}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {useItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.sharing.title')}
            </h2>
            <p>{t('privacy_policy.sections.sharing.description')}</p>
            <p>{t('privacy_policy.sections.sharing.items_title')}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {sharingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.security.title')}
            </h2>
            <p>{t('privacy_policy.sections.security.description')}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.rights.title')}
            </h2>
            <p>{t('privacy_policy.sections.rights.description')}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {rightsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.cookies.title')}
            </h2>
            <p>
              {t('privacy_policy.sections.cookies.description')}{' '}
              <a
                href="/cookie-policy.html"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {t('privacy_policy.links.cookies')}
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('privacy_policy.sections.contact.title')}
            </h2>
            <p>{t('privacy_policy.sections.contact.description')}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {contactItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex justify-center gap-4 flex-wrap text-sm">
            <a href="/terms-and-conditions" className="text-blue-400 hover:text-blue-300 underline">
              {t('privacy_policy.links.terms')}
            </a>
            <span className="text-zinc-500">•</span>
            <a href="/cookie-policy.html" className="text-blue-400 hover:text-blue-300 underline">
              {t('privacy_policy.links.cookies')}
            </a>
            <span className="text-zinc-500">•</span>
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
              {t('privacy_policy.links.back_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

