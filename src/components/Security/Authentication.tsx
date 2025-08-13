import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Authentication() {
  const { t } = useTranslation();
  const base = 'authentication';

  const passwordAuthItems = t(`${base}.password_auth_items`, { returnObjects: true }) as string[];
  const tokenAuthItems = t(`${base}.token_auth_items`, { returnObjects: true }) as string[];
  const oauthItems = t(`${base}.oauth_items`, { returnObjects: true }) as string[];
  const mfaItems = t(`${base}.mfa_items`, { returnObjects: true }) as string[];
  const challengesItems = t(`${base}.challenges_items`, { returnObjects: true }) as string[];
  const bestPracticesItems = t(`${base}.best_practices_items`, { returnObjects: true }) as string[];
  const architectureItems = t(`${base}.architecture_items`, { returnObjects: true }) as string[];
  const securityItems = t(`${base}.security_items`, { returnObjects: true }) as string[];
  const experienceItems = t(`${base}.experience_items`, { returnObjects: true }) as string[];

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-zinc-400">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-blue-400">
                {t(`${base}.info_banner`)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Conceitos Básicos */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.basic_concepts_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6 space-y-4">
              <p className="text-zinc-300">
                {t(`${base}.basic_concepts_description`)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.identification_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.identification_description`)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.verification_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.verification_description`)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Métodos de Autenticação */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.authentication_methods_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.password_auth_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.password_auth_description`)}
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {passwordAuthItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.token_auth_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.token_auth_description`)}
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {tokenAuthItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Link 
                      to="/seguranca/tokens"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      {t(`${base}.token_auth_link`)}
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.oauth_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.oauth_description`)}
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {oauthItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.mfa_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.mfa_description`)}
                  </p>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {mfaItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Desafios e Boas Práticas */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.challenges_best_practices_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.challenges_title`)}</h3>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {challengesItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.best_practices_title`)}</h3>
                  <ul className="list-disc list-inside text-zinc-400 space-y-2">
                    {bestPracticesItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.implementation_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-300">
                  {t(`${base}.implementation_description`)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.architecture_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {architectureItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.security_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {securityItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.experience_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {experienceItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 