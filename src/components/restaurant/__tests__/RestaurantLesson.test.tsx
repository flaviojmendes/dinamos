// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { getLessonVisual, type LessonVisual } from '../visualModel';
import { restaurantConcepts } from '../learningModel';

const locale = vi.hoisted(() => ({ language: 'pt' }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: locale }) }));

const scene = vi.hoisted(() => ({ failed: false, props: null as null | { step: number; level: number; visual?: LessonVisual; playing: boolean; reducedMotion: boolean; onStepComplete: () => void } }));
vi.mock('../RestaurantScene', () => ({ default: (props: NonNullable<typeof scene.props>) => {
  if (scene.failed) throw new Error('Scene chunk unavailable');
  scene.props = props;
  return <div data-testid="scene" data-playing={props.playing} data-step={props.step} />;
} }));

import RestaurantLesson from '../RestaurantLesson';

let intersection: (entries: { isIntersecting: boolean }[]) => void;
let motionChanged: () => void;
let reduced = false;

const pages = [
  { slug: 'intro', path: '/intro' },
  { slug: 'distributed-systems-101', path: '/sistemas-distribuidos-101' },
  { slug: 'system-design-101', path: '/system-design-101' },
  { slug: 'components/cache', path: '/componentes/cache' },
];

function renderLesson(overrides: Partial<ComponentProps<typeof RestaurantLesson>> = {}) {
  const props = { slug: 'intro', path: '/intro', pages, progress: {}, onComplete: vi.fn(), ...overrides };
  return { ...render(<RestaurantLesson {...props} />), props };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  locale.language = 'pt';
  scene.props = null;
  scene.failed = false;
  reduced = false;
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  vi.stubGlobal('matchMedia', () => ({
    get matches() { return reduced; },
    addEventListener: (_event: string, callback: () => void) => { motionChanged = callback; },
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof intersection) { intersection = callback; }
    observe() { intersection([{ isIntersecting: true }]); }
    disconnect() {}
  });
});

describe('restaurant lesson progression', () => {
  it('passes the current lesson and step visual script to the scene instead of a mode-wide animation', async () => {
    renderLesson({ slug: 'components/cache', path: '/componentes/cache' });
    await screen.findByTestId('scene');
    expect(scene.props?.visual).toEqual(getLessonVisual('components/cache', 0));
    expect(scene.props?.visual).toMatchObject({ from: 'stock', to: 'counter', cue: 'cache-fill' });
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }));
    expect(scene.props?.visual).toEqual(getLessonVisual('components/cache', 1));
    expect(scene.props?.visual).toMatchObject({ from: 'counter', to: 'pickup', cue: 'cache-hit' });
    expect(scene.props?.visual?.blocked).not.toBe(true);
    expect(scene.props?.visual?.fault).toBeUndefined();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }));
    expect(scene.props?.visual).toEqual(getLessonVisual('components/cache', 2));
    expect(scene.props?.visual?.cue).toBe('filter');
  });

  it('plays three finite teaching steps without awarding completion for watching', async () => {
    const { props } = renderLesson();
    await screen.findByTestId('scene');
    await waitFor(() => expect(scene.props?.playing).toBe(true));
    act(() => scene.props!.onStepComplete());
    expect(screen.getByTestId('scene')).toHaveAttribute('data-step', '1');
    act(() => scene.props!.onStepComplete());
    expect(screen.getByTestId('scene')).toHaveAttribute('data-step', '2');
    act(() => scene.props!.onStepComplete());
    expect(screen.getByTestId('scene')).toHaveAttribute('data-playing', 'false');
    expect(screen.getByRole('button', { name: 'Ver novamente' })).toBeInTheDocument();
    expect(props.onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Ver novamente' }));
    expect(scene.props?.step).toBe(0);
    expect(scene.props?.playing).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Concluir aula e evoluir' }));
    expect(props.onComplete).toHaveBeenCalledTimes(1);
    expect(props.onComplete).toHaveBeenCalledWith('/intro');
  });

  it('builds from persisted progress and reflects an existing completion undo', async () => {
    const { rerender, props } = renderLesson();
    await screen.findByTestId('scene');
    expect(screen.getByText('Nível 1')).toBeInTheDocument();
    rerender(<RestaurantLesson {...props} progress={{ '/intro': { completed: true } }} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    expect(screen.getByText('Nível 3')).toBeInTheDocument();
    expect(screen.getByText('Conceito aprendido')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Concluir aula e evoluir' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Nova etapa construída: Hora do almoço');
    rerender(<RestaurantLesson {...props} progress={{ '/intro': { completed: false } }} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('Nível 1')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it.each([
    { lang: 'pt', lesson: 'Conceito incorporado: Introdução', stage: 'Nova etapa construída: Cozinha em ritmo' },
    { lang: 'en', lesson: 'Concept added: Introduction', stage: 'New stage built: Kitchen in rhythm' },
  ])('distinguishes a learned concept from a newly built stage ($lang)', async ({ lang, lesson, stage }) => {
    locale.language = lang;
    const course = Object.values(restaurantConcepts).map(({ slug, path }) => ({ slug, path }));
    const { rerender, props } = renderLesson({ pages: course });
    await screen.findByTestId('scene');
    rerender(<RestaurantLesson {...props} progress={{ '/intro': { completed: true } }} />);
    expect(scene.props?.level).toBe(1);
    expect(screen.getByRole('status')).toHaveTextContent(lesson);
    expect(screen.getByRole('status')).not.toHaveTextContent(stage);
    const expandedProgress = Object.fromEntries(course.slice(0, 4).map(({ path }) => [path, { completed: true }]));
    rerender(<RestaurantLesson {...props} progress={expandedProgress} />);
    expect(scene.props?.level).toBe(2);
    expect(screen.getByRole('status')).toHaveTextContent(stage);
    expect(screen.getByRole('status')).not.toHaveTextContent(lesson);
    rerender(<RestaurantLesson {...props} progress={{}} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('pauses outside the viewport and in a hidden tab', async () => {
    renderLesson();
    await screen.findByTestId('scene');
    await waitFor(() => expect(scene.props?.playing).toBe(true));
    act(() => intersection([{ isIntersecting: false }]));
    expect(scene.props?.playing).toBe(false);
    act(() => intersection([{ isIntersecting: true }]));
    expect(scene.props?.playing).toBe(true);
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    fireEvent(document, new Event('visibilitychange'));
    expect(scene.props?.playing).toBe(false);
  });

  it('provides manual scene steps when reduced motion is requested or enabled later', async () => {
    reduced = true;
    renderLesson();
    await screen.findByTestId('scene');
    expect(scene.props?.playing).toBe(false);
    expect(scene.props?.reducedMotion).toBe(true);
    expect(screen.queryByRole('button', { name: 'Reproduzir demonstração' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }));
    expect(scene.props?.step).toBe(1);
    expect(scene.props?.playing).toBe(false);
    act(() => { reduced = false; motionChanged(); });
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir demonstração' }));
    expect(scene.props?.playing).toBe(true);
    act(() => { reduced = true; motionChanged(); });
    expect(scene.props?.playing).toBe(false);
  });

  it('keeps the reading preference and updates all game controls with the locale', async () => {
    const { rerender, props } = renderLesson();
    await screen.findByTestId('scene');
    fireEvent.click(screen.getByRole('button', { name: 'Recolher restaurante' }));
    expect(screen.queryByTestId('scene')).not.toBeInTheDocument();
    expect(localStorage.getItem('dinamos-restaurant-expanded')).toBe('false');
    locale.language = 'en';
    rerender(<RestaurantLesson {...props} />);
    expect(screen.getByText('Dinamos Burger Restaurant')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open restaurant' }));
    await screen.findByTestId('scene');
    expect(screen.getByRole('button', { name: 'Complete lesson and grow' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Demonstration steps' })).toBeInTheDocument();
    expect(screen.queryByText('Seu restaurante')).not.toBeInTheDocument();
  });

  it('retains the teaching steps when the optional 3D scene cannot load', async () => {
    scene.failed = true;
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderLesson();
    expect(await screen.findByText('Explore a hamburgueria pelas etapas abaixo.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }));
    expect(screen.getByText('Etapa 2 de 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Concluir aula e evoluir' })).toBeInTheDocument();
    errorLog.mockRestore();
  });
});
