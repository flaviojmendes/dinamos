import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SecurityOverview() {
  const { t } = useTranslation();
  const base = 'security';

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t(`${base}.title`)}
          </h1>
          <p className="text-lg text-zinc-400">
            {t(`${base}.subtitle`)}
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <div className="text-blue-400 mt-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-blue-300">
              {t(`${base}.info_banner`)}
            </p>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication */}
          <Link 
            to="/seguranca/autenticacao"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {t(`${base}.topics.authentication.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.authentication.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    {t(`${base}.topics.authentication.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.authentication.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Authorization */}
          <Link 
            to="/seguranca/autorizacao"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {t(`${base}.topics.authorization.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.authorization.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {t(`${base}.topics.authorization.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.authorization.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Cryptography */}
          <Link 
            to="/seguranca/criptografia"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {t(`${base}.topics.cryptography.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.cryptography.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                    {t(`${base}.topics.cryptography.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.cryptography.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Tokens & JWT */}
          <Link 
            to="/seguranca/tokens"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {t(`${base}.topics.tokens.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.tokens.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.tokens.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    {t(`${base}.topics.tokens.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* SSL/TLS */}
          <Link 
            to="/seguranca/ssl-tls"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {t(`${base}.topics.ssl_tls.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.ssl_tls.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {t(`${base}.topics.ssl_tls.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.ssl_tls.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Common Attacks */}
          <Link 
            to="/seguranca/ataques"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {t(`${base}.topics.attacks.title`)}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t(`${base}.topics.attacks.description`)}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                    {t(`${base}.topics.attacks.tag1`)}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t(`${base}.topics.attacks.tag2`)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 