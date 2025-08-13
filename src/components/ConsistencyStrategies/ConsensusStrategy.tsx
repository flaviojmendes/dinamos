import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ConsensusStrategy() {
  const { t } = useTranslation();
  const raftPoints = t('design_principles.consistency_strategies.consensus.raft_points', { returnObjects: true }) as string[];
  const paxosPhases = t('design_principles.consistency_strategies.consensus.paxos_phases', { returnObjects: true }) as string[];
  const zkFeatures = t('design_principles.consistency_strategies.consensus.zookeeper_features', { returnObjects: true }) as string[];
  const advantages = t('design_principles.consistency_strategies.consensus.advantages_list', { returnObjects: true }) as string[];
  const disadvantages = t('design_principles.consistency_strategies.consensus.disadvantages_list', { returnObjects: true }) as string[];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          {t('design_principles.consistency_strategies.consensus.title')}
        </h1>
        <p className="text-xl text-zinc-300">
          {t('design_principles.consistency_strategies.consensus.intro')}
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200">{t('design_principles.consistency_strategies.consensus.what_is_title')}</h2>
        <p className="text-zinc-300">
          {t('design_principles.consistency_strategies.consensus.what_is_p')}
        </p>
      </div>

      {/* Raft Protocol */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.consistency_strategies.consensus.raft_title')}</h2>
        <p className="text-zinc-300">
          {t('design_principles.consistency_strategies.consensus.raft_intro')}
        </p>
        <ul className="list-disc list-inside text-zinc-300 space-y-2">
          {raftPoints.map((item, idx) => (
            <li key={`raft-${idx}`}>{item}</li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">{t('design_principles.consistency_strategies.consensus.raft_example_title')}</h3>
          <p className="text-zinc-300">
            {t('design_principles.consistency_strategies.consensus.raft_example_p')}
          </p>
        </div>
      </div>

      {/* Paxos Protocol */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.consistency_strategies.consensus.paxos_title')}</h2>
        <p className="text-zinc-300">
          {t('design_principles.consistency_strategies.consensus.paxos_intro')}
        </p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">{t('design_principles.consistency_strategies.consensus.paxos_how_title')}</h3>
          <p className="text-zinc-300">
            {t('design_principles.consistency_strategies.consensus.paxos_phases_intro')}
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            {paxosPhases.map((item, idx) => (
              <li key={`paxos-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ZooKeeper */}
      <div className="bg-zinc-900 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.consistency_strategies.consensus.zookeeper_title')}</h2>
        <p className="text-zinc-300">
          {t('design_principles.consistency_strategies.consensus.zookeeper_intro')}
        </p>
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-blue-400 mb-2">{t('design_principles.consistency_strategies.consensus.zookeeper_features_title')}</h3>
          <ul className="list-disc list-inside text-zinc-300 space-y-2">
            {zkFeatures.map((item, idx) => (
              <li key={`zk-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-zinc-200 mb-4">{t('design_principles.consistency_strategies.consensus.pros_cons_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">{t('design_principles.consistency_strategies.consensus.advantages_title')}</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              {advantages.map((item, idx) => (
                <li key={`adv-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-2">{t('design_principles.consistency_strategies.consensus.disadvantages_title')}</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              {disadvantages.map((item, idx) => (
                <li key={`dis-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Link to Simulator */}
      <div className="bg-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-200 mb-2">{t('design_principles.consistency_strategies.consensus.cta_title')}</h2>
            <p className="text-zinc-300">
              {t('design_principles.consistency_strategies.consensus.cta_p')}
            </p>
          </div>
          <Link
            to="simulador"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('design_principles.consistency_strategies.consensus.cta_button')}
          </Link>
        </div>
      </div>
    </div>
  );
} 