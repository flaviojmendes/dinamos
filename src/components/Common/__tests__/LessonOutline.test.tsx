// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LessonOutline from '../LessonOutline';
import { clearGeneratedHeadingIds, collectLessonHeadings } from '../lessonOutlineHeadings';

const locale = vi.hoisted(() => ({ language: 'pt-BR' }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: locale,
    t: (_key: string, options: { defaultValue: string }) => options.defaultValue,
  }),
}));

let fixture: HTMLElement;
const observers: Array<{
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

beforeEach(() => {
  locale.language = 'pt-BR';
  fixture = document.createElement('main');
  document.body.append(fixture);
  observers.length = 0;
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
      observers.push({ callback, options, observe: this.observe, disconnect: this.disconnect });
    }
    observe = vi.fn();
    disconnect = vi.fn();
  });
  window.history.replaceState({ from: 'lesson' }, '', '/lesson?lang=pt');
});

afterEach(() => {
  fixture.remove();
  vi.unstubAllGlobals();
});

function articleWith(body: string) {
  const article = document.createElement('article');
  article.innerHTML = body;
  fixture.append(article);
  return article;
}

describe('lesson heading collection', () => {
  it('uses stable unique IDs without taking authored IDs or grid headings', () => {
    const article = articleWith(`
      <h2>Partições de rede</h2><h2>Partições de rede</h2>
      <h2 id="lesson-particoes-de-rede">A preserved author anchor</h2>
      <div data-lesson-grid><h2>Compact card</h2></div>
      <h2> </h2>
    `);
    const generated = new Map<HTMLHeadingElement, string>();
    const first = collectLessonHeadings(article, generated);
    expect(first.map(({ id }) => id)).toEqual([
      'lesson-particoes-de-rede-2', 'lesson-particoes-de-rede-3', 'lesson-particoes-de-rede',
    ]);
    expect(first.map(({ label }) => label)).toEqual([
      'Partições de rede', 'Partições de rede', 'A preserved author anchor',
    ]);
    expect(collectLessonHeadings(article, generated).map(({ id }) => id))
      .toEqual(first.map(({ id }) => id));
    const inserted = document.createElement('h2');
    inserted.textContent = 'Partições de rede';
    article.prepend(inserted);
    expect(collectLessonHeadings(article, generated).slice(1).map(({ id }) => id))
      .toEqual(first.map(({ id }) => id));
    expect(article.querySelector('[data-lesson-grid] h2')).not.toHaveAttribute('id');

    clearGeneratedHeadingIds(generated);
    expect(article.querySelectorAll('h2[id]')).toHaveLength(1);
    expect(article.querySelector('[id]')).toHaveAttribute('id', 'lesson-particoes-de-rede');
  });

  it('avoids IDs used outside the article and preserves changes made by other code', () => {
    fixture.id = 'lesson-section';
    const article = articleWith('<h2>!!!</h2><h2 id="custom">Custom</h2>');
    const generated = new Map<HTMLHeadingElement, string>();
    const headings = collectLessonHeadings(article, generated);
    expect(headings[0].id).toBe('lesson-section-2');
    headings[0].element.id = 'changed-by-author';
    clearGeneratedHeadingIds(generated);
    expect(headings[0].element.id).toBe('changed-by-author');
    expect(headings[1].element.id).toBe('custom');
  });
});

describe('LessonOutline', () => {
  it('observes asynchronously compiled content and excludes small card headings', async () => {
    const article = articleWith('');
    const containerRef = { current: article };
    const { container } = render(<LessonOutline containerRef={containerRef} contentKey="lesson:pt" />);
    expect(container).toBeEmptyDOMElement();
    article.innerHTML = '<h2>Primeiro</h2><div data-lesson-grid><h2>Cartão</h2></div><h2>Segundo</h2>';
    await waitFor(() => expect(screen.getAllByRole('navigation')).toHaveLength(2));
    expect(screen.queryByRole('link', { name: 'Cartão' })).not.toBeInTheDocument();
    expect(observers.at(-1)?.options.root).toBe(fixture);
    expect(observers.at(-1)?.observe).toHaveBeenCalledTimes(2);
    expect(article.textContent).toBe('PrimeiroCartãoSegundo');
  });

  it('navigates in the scrolling main, respects reduced motion, and preserves history state', async () => {
    const article = articleWith('<h2>Primeiro</h2><h2>Segundo</h2>');
    const target = article.querySelectorAll('h2')[1];
    target.scrollIntoView = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const { container } = render(<LessonOutline containerRef={{ current: article }} contentKey="lesson:pt" />);
    const details = container.querySelector('details')!;
    details.open = true;
    fireEvent.click(within(details).getByRole('link', { name: 'Segundo' }));
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    expect(window.location.hash).toBe('#lesson-segundo');
    expect(window.location.search).toBe('?lang=pt');
    expect(window.history.state).toEqual({ from: 'lesson' });
    expect(details).not.toHaveAttribute('open');
    expect(target).toHaveFocus();
    expect(screen.getAllByRole('link', { name: 'Segundo' })[0]).toHaveAttribute('aria-current', 'location');
  });

  it('updates the current section from intersection events and disconnects on content changes', async () => {
    const article = articleWith('<h2>First</h2><h2>Second</h2>');
    const headings = article.querySelectorAll('h2');
    let secondTop = 300;
    headings[0].getBoundingClientRect = () => ({ top: -100 } as DOMRect);
    headings[1].getBoundingClientRect = () => ({ top: secondTop } as DOMRect);
    const containerRef = { current: article };
    const { rerender, unmount } = render(<LessonOutline containerRef={containerRef} contentKey="first:en" />);
    expect(screen.getAllByRole('link', { name: 'First' })[0]).toHaveAttribute('aria-current', 'location');
    secondTop = 70;
    act(() => observers.at(-1)!.callback([], {} as IntersectionObserver));
    expect(screen.getAllByRole('link', { name: 'Second' })[0]).toHaveAttribute('aria-current', 'location');
    const previous = observers.at(-1)!;

    article.innerHTML = '<h2 id="authored">Replacement</h2><h2>Next</h2>';
    locale.language = 'en';
    rerender(<LessonOutline containerRef={containerRef} contentKey="replacement:en" />);
    expect(previous.disconnect).toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: 'First' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('navigation', { name: 'On this page' })).toHaveLength(2);
    const active = observers.at(-1)!;
    unmount();
    expect(active.disconnect).toHaveBeenCalled();
    expect(article.querySelectorAll('h2[id]')).toHaveLength(1);
    expect(article.querySelector('[id]')).toHaveAttribute('id', 'authored');

    article.innerHTML = '<h2>After unmount</h2><h2>Unobserved</h2>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(article.querySelectorAll('[id]')).toHaveLength(0);
  });

  it('tracks a large scroll jump without an intersection event and cancels pending work on cleanup', () => {
    const article = articleWith('<h2>First</h2><h2>Second</h2>');
    const headings = article.querySelectorAll('h2');
    let firstTop = -400;
    let secondTop = 40;
    headings[0].getBoundingClientRect = () => ({ top: firstTop } as DOMRect);
    headings[1].getBoundingClientRect = () => ({ top: secondTop } as DOMRect);
    const frames: FrameRequestCallback[] = [];
    const requestFrame = vi.fn((callback: FrameRequestCallback) => frames.push(callback));
    const cancelFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    vi.stubGlobal('cancelAnimationFrame', cancelFrame);
    const { unmount } = render(<LessonOutline containerRef={{ current: article }} contentKey="scroll:en" />);
    expect(screen.getAllByRole('link', { name: 'Second' })[0]).toHaveAttribute('aria-current', 'location');

    // Scroll directly to the top: neither heading enters the narrow IO band.
    firstTop = 220;
    secondTop = 900;
    fireEvent.scroll(fixture);
    fireEvent.scroll(fixture);
    expect(requestFrame).toHaveBeenCalledTimes(1);
    act(() => frames[0](0));
    expect(screen.getAllByRole('link', { name: 'First' })[0]).toHaveAttribute('aria-current', 'location');
    fireEvent.scroll(fixture);
    unmount();
    expect(cancelFrame).toHaveBeenCalledWith(2);
    fireEvent.scroll(fixture);
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });
});
