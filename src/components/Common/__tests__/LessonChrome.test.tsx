// @vitest-environment jsdom
import { useRef, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const locale = vi.hoisted(() => ({ language: 'pt' }));
const progress = vi.hoisted(() => ({ complete: vi.fn(), incomplete: vi.fn() }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: locale,
    t: (key: string, options?: Record<string, unknown>) => {
      if (key === 'content.reading_time') return `${options?.minutes} min de leitura`;
      const messages: Record<string, string> = {
        'content.mark_complete': 'Marcar como concluído',
        'content.completed_label': 'Concluído',
        'content.mark_incomplete': 'Marcar como não concluído',
      };
      return messages[key] || options?.defaultValue || key;
    },
  }),
}));
vi.mock('../../../hooks/useContentProgress', () => ({
  useContentProgress: () => {
    const [completed, setCompleted] = useState(false);
    return {
      isCompleted: () => completed,
      markAsCompleted: (...args: unknown[]) => { progress.complete(...args); setCompleted(true); },
      markAsIncomplete: (...args: unknown[]) => { progress.incomplete(...args); setCompleted(false); },
    };
  },
}));
vi.mock('../../../config/contentRegistry', () => {
  const items = [
    { path: '/theory/first', moduleId: 'theory', titleEn: 'First lesson', titlePt: 'Primeira aula' },
    { path: '/theory/current', moduleId: 'theory', titleEn: 'Distributed Challenges', titlePt: 'Desafios de Sistemas Distribuídos' },
    { path: '/theory/last', moduleId: 'theory', titleEn: 'Network partitions', titlePt: 'Partições de rede' },
  ];
  return {
    getItem: (path: string) => items.find((item) => item.path === path),
    titleForPath: (path: string, language: string) => {
      const item = items.find(item => item.path === path);
      return language.startsWith('pt') ? item?.titlePt : item?.titleEn;
    },
    getModule: () => ({ id: 'theory', label: 'Theory', base: '/theory' }),
    moduleSequence: () => items,
    relatedItems: () => [],
    menuKey: () => 'menu.missing.name',
    fallbackLabel: () => 'English fallback',
  };
});

import ReadingTime from '../ReadingTime';
import CompletionButton from '../CompletionButton';
import { ContentBreadcrumb, ContentFooterNav } from '../ContentNav';

beforeEach(() => {
  locale.language = 'pt';
  vi.clearAllMocks();
});

describe('lesson reading controls', () => {
  it('updates reading time when lesson prose arrives and excludes code samples and outline links', async () => {
    function Lesson({ loaded }: { loaded: boolean }) {
      const ref = useRef<HTMLDivElement>(null);
      return <>
        <ReadingTime contentRef={ref} />
        <div ref={ref}>
          <article>
            {loaded && <p>{'prose '.repeat(230)}</p>}
            <pre>{'code '.repeat(1000)}</pre>
            <nav>{'outline '.repeat(1000)}</nav>
          </article>
          <aside>{'sidebar '.repeat(1000)}</aside>
        </div>
      </>;
    }
    const { rerender } = render(<Lesson loaded={false} />);
    expect(screen.getByText('1 min de leitura')).toBeInTheDocument();
    rerender(<Lesson loaded />);
    await waitFor(() => expect(screen.getByText('2 min de leitura')).toBeInTheDocument());
  });

  it('keeps the completion toggle reversible and passes child progress paths', () => {
    render(<CompletionButton path="/theory/current" childPaths={['/theory/child']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Marcar como concluído' }));
    expect(progress.complete).toHaveBeenCalledWith('/theory/current', ['/theory/child']);
    const completed = screen.getByRole('button', { name: 'Concluído. Marcar como não concluído' });
    expect(completed).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(completed);
    expect(progress.incomplete).toHaveBeenCalledWith('/theory/current', ['/theory/child']);
    expect(screen.getByRole('button', { name: 'Marcar como concluído' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses localized registry titles in breadcrumbs and previous/next navigation', () => {
    const { rerender } = render(<MemoryRouter>
      <ContentBreadcrumb path="/theory/current" />
      <ContentFooterNav path="/theory/current" />
    </MemoryRouter>);
    expect(screen.getByText('Desafios de Sistemas Distribuídos')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Primeira aula/ })).toHaveAttribute('rel', 'prev');
    expect(screen.getByRole('link', { name: /Partições de rede/ })).toHaveAttribute('rel', 'next');
    locale.language = 'en';
    rerender(<MemoryRouter><ContentBreadcrumb path="/theory/current" /></MemoryRouter>);
    expect(screen.getByText('Distributed Challenges')).toHaveAttribute('aria-current', 'page');
  });
});
