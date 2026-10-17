import { useEffect, useRef, useState } from 'react';
import { RotateCcw, RotateCw, ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { LessonVisual } from './visualModel';
import type { SceneMode, Station } from './learningModel';
import './scene.css';
import { createRestaurantWorld, type RestaurantWorld } from './restaurantWorld';

export interface RestaurantSceneProps {
  visual?: LessonVisual;
  locale?: 'pt' | 'en';
  mode: SceneMode;
  focus: Station;
  step: 0 | 1 | 2;
  level: number;
  playing: boolean;
  reducedMotion: boolean;
  onStepComplete?: () => void;
  onUnavailable?: () => void;
  labels?: Record<Station, string>;
  ariaLabel?: string;
}

/** The renderer lives only in the lesson chunk. Its text equivalent is the step narration. */
export default function RestaurantScene(props: RestaurantSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const world = useRef<RestaurantWorld | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [backend, setBackend] = useState('three');
  const [unavailable, setUnavailable] = useState(false);
  const { i18n } = useTranslation();
  const pt = (i18n.resolvedLanguage || i18n.language).startsWith('pt');
  const copy = pt ? {
    left: 'Girar para a esquerda', right: 'Girar para a direita', zoom: 'Alternar aproximação',
    unavailable: 'A cena 3D não está disponível neste dispositivo. Você pode acompanhar o conceito pelas etapas abaixo.',
  } : {
    left: 'Rotate left', right: 'Rotate right', zoom: 'Toggle zoom',
    unavailable: 'The 3D scene is unavailable on this device. Follow the concept through the steps below.',
  };

  useEffect(() => {
    if (!host.current) return;
    let disposed = false;
    try {
      world.current = createRestaurantWorld(host.current, {
        ...latest.current,
        onStepComplete: () => latest.current.onStepComplete?.(),
        onUnavailable: () => { if (!disposed) { setUnavailable(true); latest.current.onUnavailable?.(); } },
      });
      setBackend(world.current.backend === 'webgl' ? 'three-webgl' : 'three-svg');
    } catch {
      setUnavailable(true); latest.current.onUnavailable?.();
    }
    return () => { disposed = true; world.current?.dispose(); world.current = null; };
  }, []);

  useEffect(() => { world.current?.update(props); }, [props.mode, props.focus, props.step, props.level, props.playing, props.reducedMotion, props.visual, props.locale]);

  return <div className="restaurant-world" data-renderer={unavailable ? 'unavailable' : backend}>
    <div ref={host} className="restaurant-world-canvas" role="img" aria-label={props.ariaLabel} />
    {unavailable ? <div className="restaurant-world-unavailable" role="status">
      <div className="restaurant-world-fallback-route" aria-hidden="true">
        {[props.labels?.entrance, props.labels?.counter, props.labels?.[props.focus]].map((label, index) => <span key={index}>{label}</span>)}
      </div>
      <p>{copy.unavailable}</p>
    </div> : <div className="restaurant-camera-controls">
      <button type="button" title={copy.left} aria-label={copy.left} onClick={() => world.current?.rotate(-1)}><RotateCcw size={16} /></button>
      <button type="button" title={copy.right} aria-label={copy.right} onClick={() => world.current?.rotate(1)}><RotateCw size={16} /></button>
      <button type="button" title={copy.zoom} aria-label={copy.zoom} onClick={() => world.current?.zoom()}><ZoomIn size={16} /></button>
    </div>}
  </div>;
}
