import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RealCases: React.FC = () => {
  const { t } = useTranslation();
  const base = 'real_cases';

  const benefits = t(`${base}.benefits`, { returnObjects: true }) as {
    practical_learning: { title: string; desc: string };
    technical_evolution: { title: string; desc: string };
    valuable_insights: { title: string; desc: string };
  };

  const cases = t(`${base}.cases`, { returnObjects: true }) as {
    netflix: { title: string; desc: string };
    uber: { title: string; desc: string };
    whatsapp: { title: string; desc: string };
    spotify: { title: string; desc: string };
  };

  const decisions = t(`${base}.decisions`, { returnObjects: true }) as {
    netflix_open_connect: string;
    whatsapp_erlang: string;
    uber_geolocation: string;
    spotify_microservices: string;
    youtube_vitess: string;
    bitly_consistency: string;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {t(`${base}.title`)}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {t(`${base}.subtitle`)}
        </p>
      </div>

      {/* Key Benefits Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          {t(`${base}.why_study_title`)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="text-brand-600 dark:text-brand-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-brand-600 dark:text-brand-400 mb-2">{benefits.practical_learning.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {benefits.practical_learning.desc}
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="text-brand-600 dark:text-brand-400 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-medium text-brand-600 dark:text-brand-400 mb-2">{benefits.technical_evolution.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {benefits.technical_evolution.desc}
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="text-brand-600 dark:text-brand-400 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-medium text-brand-600 dark:text-brand-400 mb-2">{benefits.valuable_insights.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">
              {benefits.valuable_insights.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          {t(`${base}.featured_title`)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/casos-reais/netflix" className="group">
            <div className="bg-gradient-to-br from-red-500/10 to-red-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-red-500/20 hover:to-red-700/20">
              <h3 className="text-xl font-medium text-red-400 mb-2">{cases.netflix.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {cases.netflix.desc}
              </p>
              <div className="text-red-400 group-hover:translate-x-2 transition-transform">
                {t(`${base}.explore_button`)}
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/uber" className="group">
            <div className="bg-gradient-to-br from-zinc-500/10 to-zinc-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-zinc-500/20 hover:to-zinc-700/20">
              <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mb-2">{cases.uber.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {cases.uber.desc}
              </p>
              <div className="text-slate-700 dark:text-slate-200 group-hover:translate-x-2 transition-transform">
                {t(`${base}.explore_button`)}
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/whatsapp" className="group">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-emerald-500/20 hover:to-emerald-700/20">
              <h3 className="text-xl font-medium text-emerald-400 mb-2">{cases.whatsapp.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {cases.whatsapp.desc}
              </p>
              <div className="text-emerald-400 group-hover:translate-x-2 transition-transform">
                {t(`${base}.explore_button`)}
              </div>
            </div>
          </Link>
          <Link to="/casos-reais/spotify" className="group">
            <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:from-green-500/20 hover:to-green-700/20">
              <h3 className="text-xl font-medium text-green-400 mb-2">{cases.spotify.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {cases.spotify.desc}
              </p>
              <div className="text-green-400 group-hover:translate-x-2 transition-transform">
                {t(`${base}.explore_button`)}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Technical Decisions Section */}
      <section className="bg-white dark:bg-slate-900/50 rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-8">
          {t(`${base}.tech_decisions_title`)}
        </h2>
        <div className="space-y-6">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-400 font-medium">Netflix</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Open Connect</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.netflix_open_connect}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-400 font-medium">WhatsApp</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Erlang</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.whatsapp_erlang}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Uber</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Geolocalização</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.uber_geolocation}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-400 font-medium">Spotify</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Microsserviços</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.spotify_microservices}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-400 font-medium">YouTube</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Vitess</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.youtube_vitess}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-brand-600 dark:text-brand-400 font-medium">Bit.ly</span>
              <span className="text-zinc-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Consistência</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {decisions.bitly_consistency}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default RealCases; 