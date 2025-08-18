import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Common/Typography';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TheoreticalFoundations: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h1" className="mb-8 text-center">
            {t('menu.theoretical_foundations.name')}
          </Typography>
          
          <Typography variant="p" className="text-xl mb-12 text-center text-gray-300">
            {t('theoretical_foundations_main.subtitle')}
          </Typography>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8 rounded-lg border border-purple-700/50 mb-12">
            <Typography variant="h2" className="mb-6 text-center text-purple-300">
              {t('theoretical_foundations_main.hero.title')}
            </Typography>
            <Typography variant="p" className="text-lg text-center leading-relaxed">
              {t('theoretical_foundations_main.hero.description')}
            </Typography>
          </div>

          {/* Main Content */}
          <div className="bg-zinc-800/20 p-8 rounded-lg border border-zinc-700/50">
            <article className="prose prose-invert prose-lg max-w-none">
              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph1')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph2')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph3')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph4')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph5')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph6')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph7')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph8')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph9')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph10')}
              </Typography>

              <Typography variant="p" className="mb-6 leading-relaxed text-gray-200 text-justify">
                {t('theoretical_foundations_main.paragraph11')}
              </Typography>

              {/* Conclusion with subtle emphasis */}
              <div className="mt-8 pt-6 border-t border-zinc-600/50">
                <Typography variant="p" className="leading-relaxed text-gray-100 font-medium text-justify">
                  {t('theoretical_foundations_main.conclusion')}
                </Typography>
              </div>
            </article>
          </div>

          {/* Navigation to Sub-Topics */}
          <div className="mt-16">
            <Typography variant="h2" className="mb-8 text-center">
              {t('theoretical_foundations_main.explore_topics')}
            </Typography>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/theoretical-foundations/cap-theorem" className="group">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-purple-500 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="text-3xl mb-4">🔗</div>
                  <Typography variant="h3" className="mb-3 text-purple-400 group-hover:text-purple-300">
                    {t('menu.theoretical_foundations.cap_theorem.name')}
                  </Typography>
                  <Typography variant="p" className="text-sm text-gray-400">
                    {t('menu.theoretical_foundations.cap_theorem.description')}
                  </Typography>
                </div>
              </Link>

              <Link to="/theoretical-foundations/consistency-models" className="group">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-yellow-500 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="text-3xl mb-4">⚖️</div>
                  <Typography variant="h3" className="mb-3 text-yellow-400 group-hover:text-yellow-300">
                    {t('menu.theoretical_foundations.consistency_models.name')}
                  </Typography>
                  <Typography variant="p" className="text-sm text-gray-400">
                    {t('menu.theoretical_foundations.consistency_models.description')}
                  </Typography>
                </div>
              </Link>

              <Link to="/theoretical-foundations/distributed-challenges" className="group">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-red-500 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="text-3xl mb-4">⚠️</div>
                  <Typography variant="h3" className="mb-3 text-red-400 group-hover:text-red-300">
                    {t('menu.theoretical_foundations.distributed_challenges.name')}
                  </Typography>
                  <Typography variant="p" className="text-sm text-gray-400">
                    {t('menu.theoretical_foundations.distributed_challenges.description')}
                  </Typography>
                </div>
              </Link>

              <Link to="/theoretical-foundations/network-partitions" className="group">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-blue-500 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className="text-3xl mb-4">🌐</div>
                  <Typography variant="h3" className="mb-3 text-blue-400 group-hover:text-blue-300">
                    {t('menu.theoretical_foundations.network_partitions.name')}
                  </Typography>
                  <Typography variant="p" className="text-sm text-gray-400">
                    {t('menu.theoretical_foundations.network_partitions.description')}
                  </Typography>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TheoreticalFoundations;
