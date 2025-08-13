import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Replicacao() {
  const { t } = useTranslation();

  const tStr = (key: string): string => {
    const value = t(key);
    return value === key ? t(key, { lng: 'en' }) : value;
  };

  const tArr = (key: string): string[] => {
    const raw = t(key, { returnObjects: true }) as unknown;
    if (Array.isArray(raw)) return raw as string[];
    const rawEn = t(key, { returnObjects: true, lng: 'en' }) as unknown;
    return Array.isArray(rawEn) ? (rawEn as string[]) : [];
  };

  const types = tArr('design_principles.availability.replication.types');
  const benefits = tArr('design_principles.availability.replication.benefits');
  const best = tArr('design_principles.availability.replication.best');

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">{tStr('design_principles.availability.replication.title')}</h1>
            <p className="text-zinc-400">
              {tStr('design_principles.availability.replication.intro')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">{tStr('design_principles.availability.replication.what_title')}</h2>
            <p className="text-zinc-300 mb-4">
              {tStr('design_principles.availability.replication.what_p')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{tStr('design_principles.availability.replication.types_title')}</h3>
              <div className="space-y-4">
                {types.map((li, idx) => (
                  <div key={idx}>
                    <h4 className="text-blue-400 font-medium mb-2">{li.split(':')[0]}</h4>
                    <p className="text-zinc-300 text-sm">{li.split(':').slice(1).join(':').trim()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">{tStr('design_principles.availability.replication.benefits_title')}</h3>
              <ul className="space-y-3 text-zinc-300 text-sm">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{tStr('design_principles.availability.replication.real_world_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {tStr('design_principles.availability.replication.real_world_p')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{tStr('design_principles.availability.replication.best_title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {best.map((b, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-blue-400 mr-2">{idx + 1}.</span>
                  <p className="text-zinc-300">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3">{tStr('design_principles.availability.replication.explore_title')}</h3>
            <p className="text-zinc-300 mb-4">
              {tStr('design_principles.availability.replication.explore_p')}
            </p>
            <Link 
              to="/principios-design/disponibilidade/simulator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {tStr('design_principles.availability.replication.explore_cta')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 