import { useTranslation } from 'react-i18next';

export default function SystemDesign101() {
  const { t } = useTranslation();
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          {t('content.sd101.title')}
        </h1>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('content.sd101.sec1.title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            {t('content.sd101.sec1.p1')}
          </p>

          <p>
            {t('content.sd101.sec1.p2')}
          </p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('content.sd101.sec2.title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            {t('content.sd101.sec2.p1')}
          </p>

          <p className="font-medium text-blue-200 mb-4">
            {t('content.sd101.sec2.lead')}
          </p>

          <ul className="list-disc list-inside space-y-4 ml-4">
            <li>
              <span className="font-medium text-blue-200">{t('content.sd101.sec2.bullets.scalability_title')}</span> {t('content.sd101.sec2.bullets.scalability_desc')}
            </li>
            <li>
              <span className="font-medium text-blue-200">{t('content.sd101.sec2.bullets.resilience_title')}</span> {t('content.sd101.sec2.bullets.resilience_desc')}
            </li>
            <li>
              <span className="font-medium text-blue-200">{t('content.sd101.sec2.bullets.efficiency_title')}</span> {t('content.sd101.sec2.bullets.efficiency_desc')}
            </li>
            <li>
              <span className="font-medium text-blue-200">{t('content.sd101.sec2.bullets.maintainability_title')}</span> {t('content.sd101.sec2.bullets.maintainability_desc')}
            </li>
            <li>
              <span className="font-medium text-blue-200">{t('content.sd101.sec2.bullets.ux_title')}</span> {t('content.sd101.sec2.bullets.ux_desc')}
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('content.sd101.sec3.title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            {t('content.sd101.sec3.intro')}
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-zinc-800 mt-6">
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.scalability_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.scalability_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.consistency_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.consistency_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.availability_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.availability_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.latency_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.latency_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.throughput_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.throughput_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.fault_tolerance_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.fault_tolerance_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.load_balancing_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.load_balancing_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.sharding_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.sharding_desc')}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec3.terms.replication_label')}</td>
                  <td className="p-4">{t('content.sd101.sec3.terms.replication_desc')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {t('content.sd101.sec4.title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>
            {t('content.sd101.sec4.intro')}
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-zinc-800 mt-6">
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.fundamentals_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.fundamentals_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.components_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.components_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.principles_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.principles_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.consistency_strategies_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.consistency_strategies_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.complex_design_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.complex_design_desc')}</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.monitoring_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.monitoring_desc')}</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-blue-200">{t('content.sd101.sec4.topics.interviews_label')}</td>
                  <td className="p-4">{t('content.sd101.sec4.topics.interviews_desc')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 