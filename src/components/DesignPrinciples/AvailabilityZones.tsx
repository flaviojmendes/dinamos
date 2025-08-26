import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AvailabilityZones() {
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

  const tObj = (key: string): any => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) || typeof value === 'object' ? value : t(key, { returnObjects: true, lng: 'en' });
  };

  const howWorksItems = tArr('design_principles.availability.availability_zones.how_works_items');
  const benefits = tObj('design_principles.availability.availability_zones.benefits');
  const realWorldItems = tArr('design_principles.availability.availability_zones.real_world_items');
  const bestPractices = tObj('design_principles.availability.availability_zones.best_practices');

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">{tStr('design_principles.availability.availability_zones.title')}</h1>
          <p className="text-lg text-zinc-400">
            {tStr('design_principles.availability.availability_zones.intro')}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* How it Works */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">{tStr('design_principles.availability.availability_zones.how_works_title')}</h2>
              <p className="text-zinc-400 mb-4">
                {tStr('design_principles.availability.availability_zones.how_works_intro')}
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 mb-4">
                {howWorksItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="text-zinc-400">
                {tStr('design_principles.availability.availability_zones.how_works_outro')}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">{tStr('design_principles.availability.availability_zones.benefits_title')}</h2>
              <div className="space-y-4">
                {benefits.map((benefit: any, idx: number) => (
                  <div key={idx} className="bg-zinc-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2 text-green-400">{benefit.title}</h3>
                    <p className="text-sm text-zinc-400">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Real World Example */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">{tStr('design_principles.availability.availability_zones.real_world_title')}</h2>
              <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium mb-2">{tStr('design_principles.availability.availability_zones.real_world_example_title')}</h3>
                <p className="text-zinc-400 mb-4">
                  {tStr('design_principles.availability.availability_zones.real_world_intro')}
                </p>
                <ul className="list-disc list-inside text-zinc-400 space-y-2">
                  {realWorldItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-zinc-400">
                {tStr('design_principles.availability.availability_zones.real_world_outro')}
              </p>
            </div>

            {/* Best Practices */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">{tStr('design_principles.availability.availability_zones.best_practices_title')}</h2>
              <ul className="space-y-4">
                {bestPractices.map((practice: any, idx: number) => (
                  <li key={idx} className="bg-zinc-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2 text-green-400">{practice.title}</h3>
                    <p className="text-sm text-zinc-400">
                      {practice.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Simulator Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Link
            to="/principios-design/disponibilidade/simulator"
            className="block bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-6 text-center"
          >
            <h2 className="text-xl font-semibold mb-2">
              {tStr('design_principles.availability.availability_zones.simulator_title')}
            </h2>
            <p className="text-zinc-200">
              {tStr('design_principles.availability.availability_zones.simulator_description')}
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 