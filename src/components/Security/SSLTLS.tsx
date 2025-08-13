import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SSLTLS() {
  const { t } = useTranslation();
  const base = 'ssl_tls';

  const sslTlsFeatures = t(`${base}.ssl_tls_features`, { returnObjects: true }) as string[];
  const evolutionVersions = t(`${base}.evolution_versions`, { returnObjects: true }) as Array<{version: string, status: string, color: string}>;
  const handshakeSteps = t(`${base}.handshake_steps`, { returnObjects: true }) as Array<{title: string, description: string, items: string[]}>;
  const certificateStructureItems = t(`${base}.certificate_structure_items`, { returnObjects: true }) as string[];
  const certificateTypes = t(`${base}.certificate_types`, { returnObjects: true }) as Array<{name: string, description: string}>;
  const cipherComponents = t(`${base}.cipher_components`, { returnObjects: true }) as Array<{title: string, algorithms: string[]}>;
  const configurationItems = t(`${base}.configuration_items`, { returnObjects: true }) as string[];
  const certificatesItems = t(`${base}.certificates_items`, { returnObjects: true }) as string[];
  const monitoringItems = t(`${base}.monitoring_items`, { returnObjects: true }) as string[];
  const commonThreatsItems = t(`${base}.common_threats_items`, { returnObjects: true }) as string[];
  const mitigationsItems = t(`${base}.mitigations_items`, { returnObjects: true }) as string[];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'border-red-500';
      case 'yellow': return 'border-yellow-500';
      case 'green': return 'border-green-500';
      case 'blue': return 'border-blue-500';
      default: return 'border-gray-500';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-400';
      case 'yellow': return 'text-yellow-400';
      case 'green': return 'text-green-400';
      case 'blue': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStepColor = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'yellow'];
    return colors[index % colors.length];
  };

  const getStepColorClass = (index: number) => {
    const color = getStepColor(index);
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'purple': return 'bg-purple-500/20 text-purple-400';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStepTextColor = (index: number) => {
    const color = getStepColor(index);
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'yellow': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-zinc-400 mb-6">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-emerald-400">
                {t(`${base}.info_banner`)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Visão Geral */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.overview_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.what_is_ssl_tls_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.what_is_ssl_tls_description`)}
                  </p>
                  <ul className="mt-4 space-y-2 text-zinc-400 list-disc pl-6">
                    {sslTlsFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.evolution_title`)}</h3>
                  <div className="space-y-4">
                    {evolutionVersions.map((version, index) => (
                      <div key={index} className={`border-l-2 ${getColorClass(version.color)} pl-4`}>
                        <p className={`${getTextColor(version.color)} font-medium`}>{version.version}</p>
                        <p className="text-zinc-400 text-sm">{version.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Como Funciona */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.how_it_works_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-emerald-400 mb-4">{t(`${base}.tls_handshake_title`)}</h3>
                <div className="grid gap-4">
                  {handshakeSteps.map((step, index) => (
                    <div key={index} className="bg-zinc-800 p-6 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 ${getStepColorClass(index)} rounded-full flex items-center justify-center`}>{index + 1}</div>
                        <div>
                          <h4 className={`text-lg font-medium ${getStepTextColor(index)} mb-2`}>{step.title}</h4>
                          <p className="text-zinc-400">
                            {step.description}
                          </p>
                          <ul className="mt-2 space-y-1 text-zinc-400 list-disc pl-6">
                            {step.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certificados Digitais */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.digital_certificates_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.certificate_structure_title`)}</h3>
                    <ul className="space-y-2 text-zinc-400">
                      {certificateStructureItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.certificate_types_title`)}</h3>
                    <ul className="space-y-4 text-zinc-400">
                      {certificateTypes.map((type, index) => (
                        <li key={index}>
                          <span className="text-emerald-400 font-medium">{type.name}</span>
                          <p className="mt-1">{type.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cipher Suites */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.cipher_suites_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-400">
                  {t(`${base}.cipher_suites_description`)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {cipherComponents.map((component, index) => {
                    const colors = ['blue', 'green', 'purple', 'yellow'];
                    const color = colors[index % colors.length];
                    return (
                      <div key={index} className="bg-zinc-800 p-6 rounded-lg">
                        <h3 className={`text-xl font-semibold text-${color}-400 mb-3`}>{component.title}</h3>
                        <ul className="space-y-2 text-zinc-400">
                          {component.algorithms.map((algorithm, algorithmIndex) => (
                            <li key={algorithmIndex}>• {algorithm}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Melhores Práticas */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.best_practices_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.configuration_title`)}</h3>
                  <ul className="space-y-2 text-zinc-400">
                    {configurationItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.certificates_title`)}</h3>
                  <ul className="space-y-2 text-zinc-400">
                    {certificatesItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.monitoring_title`)}</h3>
                  <ul className="space-y-2 text-zinc-400">
                    {monitoringItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Considerações de Segurança */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.security_considerations_title`)}</h2>
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.common_threats_title`)}</h3>
                    <ul className="space-y-2 text-zinc-400">
                      {commonThreatsItems.map((threat, index) => (
                        <li key={index}>• {threat}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.mitigations_title`)}</h3>
                    <ul className="space-y-2 text-zinc-400">
                      {mitigationsItems.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
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