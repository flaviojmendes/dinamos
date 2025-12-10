import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TermsAndConditionsPage: React.FC = () => {
  const { t } = useTranslation();

  const acceptanceParagraphs = t('terms.sections.acceptance.paragraphs', { returnObjects: true }) as string[];
  const descriptionItems = t('terms.sections.description.items', { returnObjects: true }) as string[];
  const accountsItems = t('terms.sections.accounts.items', { returnObjects: true }) as string[];
  const subscriptionItems = t('terms.sections.subscription.items', { returnObjects: true }) as string[];
  const cancellationItems = t('terms.sections.cancellation.items', { returnObjects: true }) as string[];
  const ipItems = t('terms.sections.ip_rights.items', { returnObjects: true }) as string[];
  const conductItems = t('terms.sections.conduct.items', { returnObjects: true }) as string[];
  const availabilityItems = t('terms.sections.availability.items', { returnObjects: true }) as string[];
  const disclaimerItems = t('terms.sections.disclaimer.items', { returnObjects: true }) as string[];
  const liabilityItems = t('terms.sections.liability.items', { returnObjects: true }) as string[];
  const indemnificationItems = t('terms.sections.indemnification.items', { returnObjects: true }) as string[];
  const terminationItems = t('terms.sections.termination.items', { returnObjects: true }) as string[];
  const changesItems = t('terms.sections.changes.items', { returnObjects: true }) as string[];
  const contactItems = t('terms.sections.contact.items', { returnObjects: true }) as string[];
  const descriptionIntro = t('terms.sections.description.intro');
  const accountsIntro = t('terms.sections.accounts.intro');
  const subscriptionIntro = t('terms.sections.subscription.intro');
  const cancellationIntro = t('terms.sections.cancellation.intro');
  const subscriptionNote = t('terms.sections.subscription.note');
  const cancellationNote = t('terms.sections.cancellation.note');
  const ipIntro = t('terms.sections.ip_rights.intro');
  const conductIntro = t('terms.sections.conduct.intro');
  const availabilityIntro = t('terms.sections.availability.intro');
  const availabilityNote = t('terms.sections.availability.note');
  const privacyParagraphs = t('terms.sections.privacy.paragraphs', { returnObjects: true }) as string[];
  const disclaimerIntro = t('terms.sections.disclaimer.intro');
  const liabilityIntro = t('terms.sections.liability.intro');
  const liabilityNote = t('terms.sections.liability.note');
  const indemnificationIntro = t('terms.sections.indemnification.intro');
  const terminationIntro = t('terms.sections.termination.intro');
  const terminationNote = t('terms.sections.termination.note');
  const governingLawParagraphs = t('terms.sections.governing_law.paragraphs', { returnObjects: true }) as string[];
  const changesIntro = t('terms.sections.changes.intro');
  const changesNote = t('terms.sections.changes.note');
  const contactIntro = t('terms.sections.contact.intro');
  const severabilityParagraphs = t('terms.sections.severability.paragraphs', { returnObjects: true }) as string[];

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
            {t('terms.links.back_home')}
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {t('terms.title')}
          </h1>
          <p className="text-zinc-400">
            <span className="font-semibold text-white">{t('terms.last_updated_label')}</span>{' '}
            {t('terms.last_updated_date')}
          </p>
        </motion.div>

        <div className="space-y-10 text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.acceptance.title')}</h2>
            {acceptanceParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.description.title')}</h2>
            <p>{descriptionIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {descriptionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.accounts.title')}</h2>
            <p>{accountsIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {accountsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.subscription.title')}</h2>
            <p>{subscriptionIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {subscriptionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{subscriptionNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.cancellation.title')}</h2>
            <p>{cancellationIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {cancellationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{cancellationNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.ip_rights.title')}</h2>
            <p>{ipIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {ipItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.conduct.title')}</h2>
            <p>{conductIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {conductItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.availability.title')}</h2>
            <p>{availabilityIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {availabilityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{availabilityNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.privacy.title')}</h2>
            {privacyParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.disclaimer.title')}</h2>
            <p>{disclaimerIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {disclaimerItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.liability.title')}</h2>
            <p>{liabilityIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {liabilityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{liabilityNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.indemnification.title')}</h2>
            <p>{indemnificationIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {indemnificationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.termination.title')}</h2>
            <p>{terminationIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {terminationItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{terminationNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.governing_law.title')}</h2>
            {governingLawParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.changes.title')}</h2>
            <p>{changesIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {changesItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-zinc-400">{changesNote}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.contact.title')}</h2>
            <p>{contactIntro}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {contactItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">{t('terms.sections.severability.title')}</h2>
            {severabilityParagraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex justify-center gap-4 flex-wrap text-sm">
            <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
              {t('terms.links.privacy')}
            </a>
            <span className="text-zinc-500">•</span>
            <a href="/cookie-policy.html" className="text-blue-400 hover:text-blue-300 underline">
              {t('terms.links.cookies')}
            </a>
            <span className="text-zinc-500">•</span>
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
              {t('terms.links.back_home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

