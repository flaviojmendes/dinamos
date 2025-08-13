import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SystemComponents() {
  const { t } = useTranslation();
  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-black">
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('components.overview_title')}
          </h1>
          <p className="text-lg text-zinc-400">
            {t('components.overview_subtitle')}
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
              {t('components.banner_text')}
            </p>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Database */}
          <Link 
            to="/componentes/banco-dados"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm8 13c.8 0 1.5-.7 1.5-1.5S12.8 17 12 17s-1.5.7-1.5 1.5S11.2 20 12 20z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {t('components.cards.databases.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.databases.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {t('components.cards.databases.badges.persistence')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.databases.badges.data')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Cache */}
          <Link 
            to="/componentes/cache"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {t('components.cards.cache.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.cache.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                    {t('components.cards.cache.badges.performance')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.cache.badges.speed')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Load Balancer */}
          <Link 
            to="/componentes/load-balancer"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {t('components.cards.load_balancer.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.load_balancer.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                    {t('components.cards.load_balancer.badges.distribution')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.load_balancer.badges.scalability')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Message Queue */}
          <Link 
            to="/componentes/message-queue"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {t('components.cards.message_queue.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.message_queue.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.message_queue.badges.async')}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                    {t('components.cards.message_queue.badges.messaging')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* CDN */}
          <Link 
            to="/componentes/cdn"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                  {t('components.cards.cdn.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.cdn.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded">
                    {t('components.cards.cdn.badges.global')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.cdn.badges.content')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* API Gateway */}
          <Link 
            to="/componentes/api-gateway"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {t('components.cards.api_gateway.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.api_gateway.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                    {t('components.cards.api_gateway.badges.routing')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.api_gateway.badges.security')}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Firewall */}
          <Link 
            to="/componentes/firewall"
            className="group bg-zinc-900/50 rounded-lg p-6 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {t('components.cards.firewall.title')}
                </h2>
                <p className="text-zinc-400 mb-4">
                  {t('components.cards.firewall.description')}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                    {t('components.cards.firewall.badges.security')}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    {t('components.cards.api_gateway.badges.control')}
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