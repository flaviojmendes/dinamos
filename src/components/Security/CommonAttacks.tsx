import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CommonAttacks() {
  const { t } = useTranslation();
  const base = 'common_attacks';

  const networkAttacks = t(`${base}.network_attacks`, { returnObjects: true }) as string[];
  const applicationAttacks = t(`${base}.application_attacks`, { returnObjects: true }) as string[];
  const authenticationAttacks = t(`${base}.authentication_attacks`, { returnObjects: true }) as string[];
  const ddosTypes = t(`${base}.ddos_types`, { returnObjects: true }) as Array<{name: string, description: string}>;
  const ddosMitigation = t(`${base}.ddos_mitigation`, { returnObjects: true }) as string[];
  const mitmTechniques = t(`${base}.mitm_techniques`, { returnObjects: true }) as string[];
  const mitmPrevention = t(`${base}.mitm_prevention`, { returnObjects: true }) as string[];
  const sqlPrevention = t(`${base}.sql_prevention`, { returnObjects: true }) as string[];
  const xssPrevention = t(`${base}.xss_prevention`, { returnObjects: true }) as string[];
  const bruteForceMitigation = t(`${base}.brute_force_mitigation`, { returnObjects: true }) as string[];
  const sessionHijackingMitigation = t(`${base}.session_hijacking_mitigation`, { returnObjects: true }) as string[];
  const credentialStuffingMitigation = t(`${base}.credential_stuffing_mitigation`, { returnObjects: true }) as string[];
  const preventionPractices = t(`${base}.prevention_practices`, { returnObjects: true }) as string[];
  const monitoringPractices = t(`${base}.monitoring_practices`, { returnObjects: true }) as string[];

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-red-400">
                {t(`${base}.warning_banner`)}
              </p>
            </div>
          </div>
        </div>

        {/* Attack Simulator Link */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 rounded-lg p-8 border border-red-500/20">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{t(`${base}.simulator_title`)}</h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
                  {t(`${base}.simulator_description`)}
                </p>
                <Link
                  to="/seguranca/ataques/simulador"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  {t(`${base}.simulator_button`)}
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Categorias de Ataques */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.categories_title`)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border-t-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-400 mb-3">{t(`${base}.network_attacks_title`)}</h3>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                  {networkAttacks.map((attack, index) => (
                    <li key={index}>• {attack}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border-t-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">{t(`${base}.application_attacks_title`)}</h3>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                  {applicationAttacks.map((attack, index) => (
                    <li key={index}>• {attack}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border-t-4 border-blue-500">
                <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-400 mb-3">{t(`${base}.authentication_attacks_title`)}</h3>
                <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                  {authenticationAttacks.map((attack, index) => (
                    <li key={index}>• {attack}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* DDoS Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.ddos_title`)}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <div className="space-y-6">
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.ddos_description`)}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.ddos_types_title`)}</h3>
                    <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                      {ddosTypes.map((type, index) => (
                        <li key={index}>
                          <span className="text-emerald-400 font-medium">{type.name}</span>
                          <p className="mt-1">{type.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.ddos_mitigation_title`)}</h3>
                    <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                      {ddosMitigation.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Man-in-the-Middle */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.mitm_title`)}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.mitm_how_works_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t(`${base}.mitm_description`)}
                    </p>
                    <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                      {mitmTechniques.map((technique, index) => (
                        <li key={index}>• {technique}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.mitm_prevention_title`)}</h3>
                    <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                      {mitmPrevention.map((prevention, index) => (
                        <li key={index}>• {prevention}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Injection Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.injection_title`)}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <div className="grid gap-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.sql_injection_title`)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.sql_vulnerability_title`)}</h4>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t(`${base}.sql_vulnerability_description`)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.sql_prevention_title`)}</h4>
                      <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                        {sqlPrevention.map((prevention, index) => (
                          <li key={index}>• {prevention}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.xss_title`)}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.xss_vulnerability_title`)}</h4>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t(`${base}.xss_vulnerability_description`)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.xss_prevention_title`)}</h4>
                      <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                        {xssPrevention.map((prevention, index) => (
                          <li key={index}>• {prevention}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authentication Attacks */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.auth_attacks_title`)}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.brute_force_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t(`${base}.brute_force_description`)}
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.brute_force_mitigation_title`)}</h4>
                    <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                      {bruteForceMitigation.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.session_hijacking_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t(`${base}.session_hijacking_description`)}
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.session_hijacking_mitigation_title`)}</h4>
                    <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                      {sessionHijackingMitigation.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-3">{t(`${base}.credential_stuffing_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t(`${base}.credential_stuffing_description`)}
                    </p>
                    <h4 className="text-lg font-medium text-white mb-2">{t(`${base}.credential_stuffing_mitigation_title`)}</h4>
                    <ul className="space-y-1 text-slate-500 dark:text-slate-400">
                      {credentialStuffingMitigation.map((mitigation, index) => (
                        <li key={index}>• {mitigation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">{t(`${base}.best_practices_title`)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">{t(`${base}.prevention_title`)}</h3>
                <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                  {preventionPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">{t(`${base}.monitoring_title`)}</h3>
                <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                  {monitoringPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 