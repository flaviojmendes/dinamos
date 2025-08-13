import { useTranslation } from 'react-i18next';

export default function Introduction() {
  const { t } = useTranslation();
  const k = (key: string) => t([`content.intro.${key}`, `content.sd101.intro.${key}`]);
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-400">
          {k('title')}
        </h1>

        <p className="text-xl text-zinc-300 mb-12">
          {k('lead')}
        </p>

        <h2 className="text-3xl font-bold mb-6 text-blue-300">
          {k('about_title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>{k('p1')}</p>
          <p>{k('p2')}</p>
          <p>{k('p3')}</p>
          <p>{k('p4')}</p>
          <p>{k('p5')}</p>
          <p>{k('p6')}</p>
          <p>{k('p7')}</p>
          <p>{k('p8')}</p>
          <p>{k('p9')}</p>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-blue-300">
          {k('motivation_title')}
        </h2>

        <div className="space-y-6 text-zinc-200">
          <p>{k('m1')}</p>
          <p>{k('m2')}</p>
          <p>{k('m3')}</p>
          <p className="text-xl font-medium text-blue-200 border-l-4 border-blue-500 pl-4">{k('m4')}</p>
        </div>
      </div>
    </div>
  );
} 