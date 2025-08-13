import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EventDriven() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const advantagesList = (t('design_principles.event_driven.advantages_list', { returnObjects: true }) as unknown as string[]) || [];
  const toolsList = (t('design_principles.event_driven.tools_list', { returnObjects: true }) as unknown as string[]) || [];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          {t('design_principles.event_driven.title')}
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          {t('design_principles.event_driven.intro')}
        </p>

        <div className="space-y-12">
          {/* Event Sourcing Section */}
          <section>
            <h2 className="text-3xl font-bold text-blue-300 mb-6">
              {t('design_principles.event_driven.event_sourcing_title')}
            </h2>
            
            <p className="text-zinc-300 mb-6">
              {t('design_principles.event_driven.event_sourcing_p')}
            </p>

            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">{t('design_principles.event_driven.advantages_title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                {advantagesList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">{t('design_principles.event_driven.example_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.event_driven.event_sourcing_example')}
              </p>
            </div>
          </section>

          {/* Distributed Event Systems Section */}
          <section>
            <h2 className="text-3xl font-bold text-blue-300 mb-6">
              {t('design_principles.event_driven.dist_events_title')}
            </h2>
            
            <p className="text-zinc-300 mb-6">
              {t('design_principles.event_driven.dist_events_p')}
            </p>

            <div className="bg-zinc-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">{t('design_principles.event_driven.tools_title')}</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                {toolsList.map((tool, idx) => (
                  <li key={idx}>{tool}</li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-200 mb-4">{t('design_principles.event_driven.dist_example_title')}</h3>
              <p className="text-zinc-300">
                {t('design_principles.event_driven.dist_example_p')}
              </p>
            </div>
          </section>

          {/* Simulator Link */}
          <div className="mt-16 p-6 bg-blue-900/20 rounded-lg border border-blue-800">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">
              {t('design_principles.event_driven.sim_title')}
            </h2>
            <p className="text-zinc-300 mb-4">
              {t('design_principles.event_driven.sim_desc')}
            </p>
            <button 
              onClick={() => navigate('/principios-design/eventos/simulator')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {t('design_principles.event_driven.sim_cta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 