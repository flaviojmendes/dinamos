import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Cryptography() {
  const { t } = useTranslation();
  const base = 'cryptography';

  const symmetricAlgorithms = t(`${base}.symmetric_algorithms`, { returnObjects: true }) as string[];
  const asymmetricAlgorithms = t(`${base}.asymmetric_algorithms`, { returnObjects: true }) as string[];
  const hashAlgorithms = t(`${base}.hash_algorithms`, { returnObjects: true }) as string[];
  const lifecycleItems = t(`${base}.lifecycle_items`, { returnObjects: true }) as string[];
  const bestPracticesItems = t(`${base}.best_practices_items`, { returnObjects: true }) as string[];
  const tlsSslItems = t(`${base}.tls_ssl_items`, { returnObjects: true }) as string[];
  const otherProtocolsItems = t(`${base}.other_protocols_items`, { returnObjects: true }) as string[];
  const dontItems = t(`${base}.dont_items`, { returnObjects: true }) as string[];
  const doItems = t(`${base}.do_items`, { returnObjects: true }) as string[];
  const considerItems = t(`${base}.consider_items`, { returnObjects: true }) as string[];

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
          <Link
            to="/seguranca/criptografia/simulador"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t(`${base}.simulator_button`)}
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-indigo-400">
                {t(`${base}.info_banner`)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Fundamentos da Criptografia */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.fundamentals_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.confidentiality_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.confidentiality_description`)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.integrity_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.integrity_description`)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">{t(`${base}.authenticity_title`)}</h3>
                  <p className="text-zinc-400">
                    {t(`${base}.authenticity_description`)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tipos de Criptografia */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.types_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.symmetric_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.symmetric_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.symmetric_algorithms_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {symmetricAlgorithms.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-b border-zinc-800 pb-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.asymmetric_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.asymmetric_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.asymmetric_algorithms_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {asymmetricAlgorithms.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">{t(`${base}.hash_title`)}</h3>
                  <p className="text-zinc-300 mb-4">
                    {t(`${base}.hash_description`)}
                  </p>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-purple-300 mb-2">{t(`${base}.hash_algorithms_title`)}</h4>
                    <ul className="list-disc list-inside text-zinc-400 space-y-2">
                      {hashAlgorithms.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gerenciamento de Chaves */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.key_management_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.lifecycle_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {lifecycleItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.best_practices_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {bestPracticesItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Protocolos de Segurança */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.security_protocols_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.tls_ssl_title`)}</h3>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <p className="text-zinc-300 mb-4">
                      {t(`${base}.tls_ssl_description`)}
                    </p>
                    <ul className="text-zinc-400 space-y-2">
                      {tlsSslItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.other_protocols_title`)}</h3>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <ul className="text-zinc-400 space-y-2">
                      {otherProtocolsItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementação Segura */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.secure_implementation_title`)}</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-zinc-300">
                  {t(`${base}.implementation_intro`)}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.dont_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {dontItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-green-400 mb-3">{t(`${base}.do_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {doItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.consider_title`)}</h3>
                    <ul className="text-zinc-400 space-y-2">
                      {considerItems.map((item, idx) => (
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