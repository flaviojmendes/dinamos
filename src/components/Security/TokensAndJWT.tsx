import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TokensAndJWT() {
  const { t } = useTranslation();
  const base = 'tokens_and_jwt';

  const tokenBenefits = t(`${base}.token_benefits`, { returnObjects: true }) as string[];
  const jwtFeatures = t(`${base}.jwt_features`, { returnObjects: true }) as string[];
  const registeredClaims = t(`${base}.registered_claims`, { returnObjects: true }) as Array<{code: string, name: string, description: string}>;
  const publicClaimsItems = t(`${base}.public_claims_items`, { returnObjects: true }) as string[];
  const privateClaimsItems = t(`${base}.private_claims_items`, { returnObjects: true }) as string[];
  const payloadOptimizationItems = t(`${base}.payload_optimization_items`, { returnObjects: true }) as string[];
  const transmissionSecurityItems = t(`${base}.transmission_security_items`, { returnObjects: true }) as string[];
  const lifecycleManagementItems = t(`${base}.lifecycle_management_items`, { returnObjects: true }) as string[];
  const dataProtectionItems = t(`${base}.data_protection_items`, { returnObjects: true }) as string[];
  const xssProtectionItems = t(`${base}.xss_protection_items`, { returnObjects: true }) as string[];
  const csrfProtectionItems = t(`${base}.csrf_protection_items`, { returnObjects: true }) as string[];
  const tokenTheftProtectionItems = t(`${base}.token_theft_protection_items`, { returnObjects: true }) as string[];

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
          <Link
            to="/seguranca/tokens/simulador"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t(`${base}.simulator_button`)}
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <div className="text-brand-600 dark:text-brand-400 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-brand-600 dark:text-brand-300">
              {t(`${base}.info_banner`)}
            </p>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.fundamentals_title`)}
            </h2>
            <h3 className="text-2xl font-semibold text-brand-600 dark:text-brand-400 mb-4">{t(`${base}.what_are_tokens_title`)}</h3>
            <p>
              {t(`${base}.tokens_description`)}
            </p>
            <ul className="list-disc pl-6 text-slate-500 dark:text-slate-400 space-y-2 mt-4">
              {tokenBenefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>

          {/* JWT Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.jwt_section_title`)}
            </h2>
            <h3 className="text-2xl font-semibold text-brand-600 dark:text-brand-400 mb-4">{t(`${base}.jwt_standard_title`)}</h3>
            <p>
              {t(`${base}.jwt_description`)}
            </p>
            <ul className="list-disc pl-6 text-slate-500 dark:text-slate-400 space-y-2 mt-4 mb-8">
              {jwtFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 my-8">
              <h3 className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-6">{t(`${base}.jwt_anatomy_title`)}</h3>
              <div className="space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-brand-600 dark:text-brand-300 font-mono mb-4">1. {t(`${base}.header_title`)}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t(`${base}.header_description`)}
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-brand-600 dark:text-brand-200">
                      {"{ \"alg\": \"HS256\", \"typ\": \"JWT\" }"}
                    </code>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-green-300 font-mono mb-4">2. {t(`${base}.payload_title`)}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t(`${base}.payload_description`)}
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-green-200">
                      {`{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "exp": 1516239022
}`}
                    </code>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded">
                  <h4 className="text-xl font-semibold text-purple-300 font-mono mb-4">3. {t(`${base}.signature_title`)}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t(`${base}.signature_description`)}
                  </p>
                  <div className="bg-black/30 p-4 rounded">
                    <code className="text-sm text-purple-200">
                      HMACSHA256(
                        base64UrlEncode(header) + "." +
                        base64UrlEncode(payload),
                        secret
                      )
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Claims Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.claims_title`)}
            </h2>
            <p className="mb-6">
              {t(`${base}.claims_description`)}
            </p>
            
            <div className="grid gap-6 my-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-brand-600 dark:text-brand-300 mb-4">{t(`${base}.registered_claims_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {t(`${base}.registered_claims_description`)}
                </p>
                <ul className="grid grid-cols-2 gap-4 text-slate-500 dark:text-slate-400">
                  {registeredClaims.map((claim, index) => (
                    <li key={index} className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                      <code className="text-brand-600 dark:text-brand-300">{claim.code}</code> ({claim.name})
                      <p className="mt-1 text-sm">{claim.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-300 mb-4">{t(`${base}.public_claims_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.public_claims_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {publicClaimsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-purple-300 mb-4">{t(`${base}.private_claims_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.private_claims_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {privateClaimsItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.best_practices_title`)}
            </h2>
            
            <div className="space-y-6 my-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-2xl font-semibold text-green-300 mb-4">{t(`${base}.payload_optimization_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.payload_optimization_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {payloadOptimizationItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-2xl font-semibold text-brand-600 dark:text-brand-300 mb-4">{t(`${base}.transmission_security_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.transmission_security_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {transmissionSecurityItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-2xl font-semibold text-yellow-300 mb-4">{t(`${base}.lifecycle_management_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.lifecycle_management_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {lifecycleManagementItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-semibold text-red-300 mb-4">{t(`${base}.data_protection_title`)}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {t(`${base}.data_protection_description`)}
                </p>
                <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400 list-disc pl-6">
                  {dataProtectionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Implementation Flow */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.auth_flow_title`)}
            </h2>
            
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 my-8">
              <ol className="space-y-8">
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-blue-500/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-300 mb-2">{t(`${base}.initial_auth_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.initial_auth_description`)}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-300 mb-2">{t(`${base}.jwt_generation_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.jwt_generation_description`)}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">{t(`${base}.secure_storage_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.secure_storage_description`)}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-300 mb-2">{t(`${base}.authenticated_requests_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.authenticated_requests_description`)}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-6">
                  <div className="flex-none w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xl font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">{t(`${base}.validation_authorization_title`)}</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.validation_authorization_description`)}
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Security Considerations */}
          <section className="mt-12">
            <h2 className="text-3xl font-bold text-white border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              {t(`${base}.security_considerations_title`)}
            </h2>
            
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 my-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">{t(`${base}.risks_mitigations_title`)}</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">{t(`${base}.xss_attacks_title`)}</h4>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.xss_attacks_description`)}
                    </p>
                    <ul className="mt-2 space-y-1 text-slate-500 dark:text-slate-400 list-disc pl-6">
                      {xssProtectionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">{t(`${base}.csrf_title`)}</h4>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.csrf_description`)}
                    </p>
                    <ul className="mt-2 space-y-1 text-slate-500 dark:text-slate-400 list-disc pl-6">
                      {csrfProtectionItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-none">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-300 mb-2">{t(`${base}.token_theft_title`)}</h4>
                    <p className="text-slate-500 dark:text-slate-400">
                      {t(`${base}.token_theft_description`)}
                    </p>
                    <ul className="mt-2 space-y-1 text-slate-500 dark:text-slate-400 list-disc pl-6">
                      {tokenTheftProtectionItems.map((item, index) => (
                        <li key={index}>{item}</li>
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