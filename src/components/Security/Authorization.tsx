import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Authorization() {
  const { t } = useTranslation();
  const base = 'authorization';

  const rbacComponents = t(`${base}.rbac_components`, { returnObjects: true }) as string[];
  const abacAttributes = t(`${base}.abac_attributes`, { returnObjects: true }) as string[];
  const pbacCharacteristics = t(`${base}.pbac_characteristics`, { returnObjects: true }) as string[];
  const architectureItems = t(`${base}.architecture_items`, { returnObjects: true }) as string[];
  const challengesItems = t(`${base}.challenges_items`, { returnObjects: true }) as string[];
  const designItems = t(`${base}.design_items`, { returnObjects: true }) as string[];
  const implementationItems = t(`${base}.implementation_items`, { returnObjects: true }) as string[];
  const frameworksItems = t(`${base}.frameworks_items`, { returnObjects: true }) as string[];
  const protocolsItems = t(`${base}.protocols_items`, { returnObjects: true }) as string[];
  const servicesItems = t(`${base}.services_items`, { returnObjects: true }) as string[];

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
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-green-400">
                {t(`${base}.info_banner`)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Conceitos Fundamentais */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.fundamental_concepts_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.authorization_concept_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.authorization_concept_description`)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.permissions_concept_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.permissions_concept_description`)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.policies_concept_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.policies_concept_description`)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Modelos de Controle de Acesso */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.access_control_models_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.rbac_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.rbac_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.rbac_components_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {rbacComponents.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.abac_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.abac_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.abac_attributes_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {abacAttributes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.pbac_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.pbac_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.pbac_characteristics_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {pbacCharacteristics.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação em Sistemas Distribuídos */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.distributed_implementation_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.architecture_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {architectureItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.challenges_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {challengesItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.best_practices_title`)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-yellow-300 mb-2">{t(`${base}.design_title`)}</h4>
                      <ul className="text-zinc-400 space-y-2">
                        {designItems.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-yellow-300 mb-2">{t(`${base}.implementation_title`)}</h4>
                      <ul className="text-zinc-400 space-y-2">
                        {implementationItems.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ferramentas e Tecnologias */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.tools_technologies_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.frameworks_title`)}</h3>
                  <ul className="text-zinc-400 space-y-2">
                    {frameworksItems.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.protocols_title`)}</h3>
                  <ul className="text-zinc-400 space-y-2">
                    {protocolsItems.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.services_title`)}</h3>
                  <ul className="text-zinc-400 space-y-2">
                    {servicesItems.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 