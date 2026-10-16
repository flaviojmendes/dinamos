import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SIMULATORS = ['cache', 'load-balancer', 'circuit-breaker', 'kafka', 'consistent-hashing', 'rag-pipeline'] as const;
type SimulatorId = typeof SIMULATORS[number];

export default function SimulatorShowcase() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<SimulatorId>('cache');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const language = (i18n.resolvedLanguage || i18n.language || 'pt').startsWith('en') ? 'en' : 'pt';

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % SIMULATORS.length; break;
      case 'ArrowLeft': next = (index - 1 + SIMULATORS.length) % SIMULATORS.length; break;
      case 'Home': next = 0; break;
      case 'End': next = SIMULATORS.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(SIMULATORS[next]);
    tabs.current[next]?.focus();
  }

  return (
    <div className="dinamos-showcase">
      <div className="dinamos-simulator-tabs" role="tablist" aria-label={t('landing.showcase.selector_label')}>
        {SIMULATORS.map((id, index) => (
          <button
            key={id}
            ref={element => { tabs.current[index] = element; }}
            type="button"
            role="tab"
            id={`simulator-tab-${id}`}
            aria-controls={`simulator-panel-${id}`}
            aria-selected={active === id}
            tabIndex={active === id ? 0 : -1}
            onClick={() => setActive(id)}
            onKeyDown={event => handleKeyDown(event, index)}
          >
            <span className="dinamos-simulator-tab-category">{t(`landing.showcase.items.${id}.category`)}</span>
            <span>{t(`landing.showcase.items.${id}.title`)}</span>
          </button>
        ))}
      </div>

      {SIMULATORS.map(id => (
        <div
          key={id}
          role="tabpanel"
          id={`simulator-panel-${id}`}
          aria-labelledby={`simulator-tab-${id}`}
          hidden={active !== id}
          tabIndex={0}
          className="dinamos-simulator-panel"
        >
          {active === id && (
            <>
              <figure className="dinamos-simulator-snapshot">
                <a
                  className="dinamos-simulator-image"
                  href={`/simulators/previews/${language}/${id}${id === 'cache' || id === 'consistent-hashing' ? '-full' : ''}.webp`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('landing.showcase.expand_preview', { simulator: t(`landing.showcase.items.${id}.title`) })}
                >
                  <img
                    key={`${language}-${id}`}
                    src={`/simulators/previews/${language}/${id}.webp`}
                    alt={t(`landing.showcase.items.${id}.alt`)}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <ArrowUpRight className="dinamos-simulator-expand" size={18} aria-hidden="true" />
                </a>
                <figcaption><span aria-hidden="true" />{t('landing.showcase.preview_label')}</figcaption>
              </figure>
              <div className="dinamos-simulator-detail">
                <h3>{t(`landing.showcase.items.${id}.title`)}</h3>
                <p>{t(`landing.showcase.items.${id}.description`)}</p>
                <dl>
                  <div><dt>{t('landing.showcase.controls_label')}</dt><dd>{t(`landing.showcase.items.${id}.controls`)}</dd></div>
                  <div><dt>{t('landing.showcase.observe_label')}</dt><dd>{t(`landing.showcase.items.${id}.observe`)}</dd></div>
                </dl>
                <a href="#signin" className="dinamos-button dinamos-button-primary">
                  {t('landing.try_simulator')} <ArrowRight size={17} aria-hidden="true" />
                </a>
                <p className="dinamos-simulator-signin-note"><Check size={14} aria-hidden="true" />{t('landing.showcase.signin_note')}</p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
