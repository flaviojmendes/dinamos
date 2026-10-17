import { Component, lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Pause, Play, RotateCcw, Sparkles, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getConcept, getRestaurantProgress, restaurantStages } from './learningModel';
import { getLessonVisual } from './visualModel';
import { restaurantCopy } from './copy';
import { restaurantPropNames } from './restaurantObjects';
import './restaurant.css';

const RestaurantScene = lazy(() => import('./RestaurantScene'));

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

interface Props {
  slug: string;
  path: string;
  pages: readonly { slug: string; path: string }[];
  progress: Readonly<Record<string, { completed: boolean } | undefined>>;
  onComplete: (path: string) => void;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function readExpanded() {
  try { return localStorage.getItem('dinamos-restaurant-expanded') !== 'false'; }
  catch { return true; }
}

/** Course progress builds the restaurant. Demonstration controls only explore a concept. */
export default function RestaurantLesson({ slug, path, pages, progress, onComplete }: Props) {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language).startsWith('pt') ? 'pt' : 'en';
  const copy = restaurantCopy[lang];
  const concept = getConcept(slug);
  const restaurant = useMemo(() => getRestaurantProgress(pages, progress), [pages, progress]);
  const currentStage = restaurantStages[restaurant.level - 1];
  const nextStage = restaurantStages[restaurant.level];
  const completed = progress[path]?.completed === true;
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(readExpanded);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const visual = useMemo(() => getLessonVisual(slug, step), [slug, step]);
  const [running, setRunning] = useState(() => !reducedMotion);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const [celebration, setCelebration] = useState<'lesson' | 'level' | null>(null);
  const lastCompleted = useRef(restaurant.completed);
  const lastLevel = useRef(restaurant.level);
  const sceneFrame = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!expanded || !sceneFrame.current) { setVisible(false); return; }
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(sceneFrame.current);
    return () => observer.disconnect();
  }, [expanded, concept]);

  useEffect(() => { if (reducedMotion) setRunning(false); }, [reducedMotion]);

  useEffect(() => {
    const grew = restaurant.completed > lastCompleted.current;
    const newLevel = restaurant.level > lastLevel.current;
    if (restaurant.completed < lastCompleted.current) setCelebration(null);
    lastCompleted.current = restaurant.completed;
    lastLevel.current = restaurant.level;
    if (!grew && !newLevel) return;
    setCelebration(newLevel ? 'level' : 'lesson');
    const timer = window.setTimeout(() => setCelebration(null), 3200);
    return () => window.clearTimeout(timer);
  }, [restaurant.completed, restaurant.level]);

  const finishStep = useCallback(() => {
    if (step === 2) setRunning(false);
    else setStep((step + 1) as 1 | 2);
  }, [step]);
  const stopPlayback = useCallback(() => setRunning(false), []);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    try { localStorage.setItem('dinamos-restaurant-expanded', String(next)); } catch { /* Optional reading preference. */ }
  };

  const chooseStep = (next: 0 | 1 | 2) => {
    setRunning(false);
    setStep(next);
  };

  const togglePlayback = () => {
    if (running) { setRunning(false); return; }
    if (step === 2) setStep(0);
    setRunning(true);
  };

  if (!concept) return null;
  const active = concept.steps[step];
  const remaining = restaurant.nextTarget === null ? 0 : Math.max(0, restaurant.nextTarget - restaurant.completed);

  return <section className="restaurant-lesson" aria-label={copy.name} data-reading-time-ignore data-celebrating={celebration || undefined}>
    <div className="restaurant-heading">
      <div className="restaurant-heading-main">
        <Store size={19} aria-hidden="true" />
        <strong>{copy.name}</strong>
        <span className="restaurant-level">{copy.level} {restaurant.level}</span>
      </div>
      <button className="restaurant-collapse restaurant-icon-button" type="button" onClick={toggleExpanded} aria-expanded={expanded} aria-controls={panelId} aria-label={expanded ? copy.collapse : copy.expand} title={expanded ? copy.collapse : copy.expand}>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </div>

    <div id={panelId} hidden={!expanded}>
      {expanded && <>
        <div className="restaurant-scene-frame" ref={sceneFrame}>
          <div className="restaurant-scene-label"><span className="restaurant-scene-dot" />{copy.preview}</div>
          <SceneBoundary onUnavailable={stopPlayback} fallback={<div className="restaurant-scene-loading" role="img" aria-label={copy.scene + concept.title[lang]}><Store size={54} aria-hidden="true" /><span>{copy.unavailable}</span></div>}>
            <Suspense fallback={<div className="restaurant-scene-loading" role="status"><Store size={30} aria-hidden="true" /><span>{copy.loading}</span></div>}>
              <RestaurantScene mode={concept.mode} focus={active.focus} step={step} visual={visual} locale={lang} level={restaurant.level}
                playing={running && visible && documentVisible && !reducedMotion} reducedMotion={reducedMotion}
                onStepComplete={finishStep} onUnavailable={stopPlayback} labels={copy.stations} ariaLabel={copy.scene + concept.title[lang]} />
            </Suspense>
          </SceneBoundary>
          <span className="restaurant-station-label">{copy.stations[active.focus]}</span>
        </div>

        {visual && <div className="restaurant-object-note">
          <span>{copy.inScene}</span><strong>{restaurantPropNames[lang][visual.prop]}{visual.detail ? ` ${visual.detail}` : ''}</strong>
          <span>{visual.from === visual.to ? copy.stations[visual.to] : `${copy.stations[visual.from]} → ${copy.stations[visual.to]}`}</span>
        </div>}

        <div className="restaurant-demonstration">
          <div className="restaurant-playback">
            <div className="restaurant-step-list" role="group" aria-label={copy.controls}>
              {concept.steps.map((item, index) => <button key={index} type="button" className="restaurant-step-button" aria-label={`${copy.step} ${index + 1}: ${item.title[lang]}`} aria-current={step === index ? 'step' : undefined} onClick={() => chooseStep(index as 0 | 1 | 2)}>
                <span>{index + 1}</span>
                <span className="restaurant-step-button-text">{item.title[lang]}</span>
              </button>)}
            </div>
            <div className="restaurant-playback-actions">
              <button type="button" className="restaurant-icon-button" disabled={step === 0} aria-label={copy.previous} title={copy.previous} onClick={() => chooseStep((step - 1) as 0 | 1)}><ArrowLeft size={17} aria-hidden="true" /></button>
              {!reducedMotion && <button type="button" className="restaurant-icon-button restaurant-play-button" aria-label={running ? copy.pause : step === 2 ? copy.replay : copy.play} title={running ? copy.pause : step === 2 ? copy.replay : copy.play} onClick={togglePlayback}>
                {running ? <Pause size={17} aria-hidden="true" /> : step === 2 ? <RotateCcw size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
              </button>}
              <button type="button" className="restaurant-icon-button" disabled={step === 2} aria-label={copy.next} title={copy.next} onClick={() => chooseStep((step + 1) as 1 | 2)}><ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          </div>

          <div className="restaurant-narration" aria-live="polite" aria-atomic="true">
            <span className="restaurant-step-count">{copy.step} {step + 1} {copy.stepOf} 3</span>
            <strong>{active.title[lang]}</strong>
            <p>{active.description[lang]}</p>
          </div>
          {reducedMotion && <p className="restaurant-reduced-note">{copy.reduced}</p>}
        </div>

        <div className="restaurant-growth">
          <div className="restaurant-growth-heading">
            <div><span className="restaurant-eyebrow">{copy.built}</span><strong>{currentStage.title[lang]}</strong></div>
            <span className="restaurant-growth-count"><b>{restaurant.completed}</b><span> / {restaurant.total}</span><span className="restaurant-growth-count-label">{restaurant.completed === 1 ? copy.lesson : copy.lessons}</span></span>
          </div>
          <div className="restaurant-progress" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(restaurant.percent)} aria-valuetext={`${restaurant.completed} / ${restaurant.total}`}>
            <span style={{ transform: `scaleX(${restaurant.percent / 100})` }} />
          </div>
          <ol className="restaurant-stage-rail" aria-label={copy.progress}>
            {restaurantStages.map((stage) => <li key={stage.level} data-unlocked={stage.level <= restaurant.level} aria-current={stage.level === restaurant.level ? 'step' : undefined} title={`${stage.title[lang]} · ${stage.level <= restaurant.level ? copy.unlocked : copy.locked}`}>
              <span className="restaurant-stage-dot">{stage.level < restaurant.level ? <Check size={11} aria-hidden="true" /> : stage.level}</span><span>{stage.title[lang]}</span>
            </li>)}
          </ol>
          <div className="restaurant-growth-footer">
            <p>{nextStage ? <>{remaining} {remaining === 1 ? copy.remaining : copy.remainingPlural} <strong>{nextStage.title[lang]}</strong></> : copy.fullyBuilt}</p>
            {completed ? <span className="restaurant-completed"><Check size={16} aria-hidden="true" />{copy.completed}</span> : <button type="button" className="restaurant-complete-button" onClick={() => onComplete(path)}><Check size={16} aria-hidden="true" />{copy.complete}</button>}
          </div>
          <div className="restaurant-celebration" role="status" aria-live="polite">{celebration && <><Sparkles size={17} aria-hidden="true" />{celebration === 'level' ? `${copy.stageBuilt}: ${currentStage.title[lang]}` : `${copy.lessonAdded}: ${concept.title[lang]}`}</>}</div>
          <p className="restaurant-preview-note">{copy.previewNote}</p>
        </div>
      </>}
    </div>
  </section>;
}
