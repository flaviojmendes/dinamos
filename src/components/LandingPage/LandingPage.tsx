import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, GitBranch, Github, Globe, Layers, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../utils/analytics';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher, Footer } from '../Common';
import Brand from '../Common/Brand';
import ThemeToggle from '../Common/ThemeToggle';
import SystemTopology from './landing/SystemTopology';
import SimulatorShowcase from './SimulatorShowcase';
import './landing.css';

const REPO_URL = 'https://github.com/flaviojmendes/dinamos';

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" />
    </svg>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const [signingIn, setSigningIn] = useState<null | 'google' | 'github'>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async (provider: 'google' | 'github') => {
    if (signingIn) return;
    setAuthError(null);
    setSigningIn(provider);
    try {
      trackEvent('User', `Landing sign in with ${provider}`);
      if (provider === 'google') await signInWithGoogle();
      else await signInWithGithub();
    } catch {
      setAuthError(provider === 'google' ? 'auth.error_google' : 'auth.error_github');
    } finally {
      setSigningIn(null);
    }
  };

  const signInButtons = (
    <div className="dinamos-auth-actions">
      {(['google', 'github'] as const).map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => handleSignIn(provider)}
          disabled={signingIn !== null}
          aria-busy={signingIn === provider}
          className={`dinamos-button ${provider === 'google' ? 'dinamos-button-primary' : ''}`}
        >
          {signingIn === provider ? (
            <span className="dinamos-loading-dot" aria-hidden="true" />
          ) : provider === 'google' ? <GoogleMark /> : <Github size={18} aria-hidden="true" />}
          {t(`auth.login_${provider}`)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dinamos-landing">
      <a href="#dinamos-content" className="dinamos-skip-link">{t('landing.skip_content')}</a>
      <header className="dinamos-header">
        <div className="dinamos-container dinamos-header-inner">
          <Brand linked />
          <nav className="dinamos-nav" aria-label={t('landing.navigation')}>
            <a href="#simulators">{t('landing.nav_simulators')}</a>
            <a href="#journey">{t('landing.journey_label')}</a>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
          </nav>
          <div className="dinamos-header-actions">
            <ThemeToggle />
            <LanguageSwitcher />
            <a href="#signin" className="dinamos-button dinamos-button-small" onClick={() => trackEvent('User', 'Header Sign In click')}>
              {t('landing.header_signin')} <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <section className="dinamos-container dinamos-hero" id="dinamos-content" tabIndex={-1} aria-labelledby="dinamos-title">
        <div className="dinamos-hero-copy">
          <p className="dinamos-eyebrow"><span aria-hidden="true" />{t('landing.hero_eyebrow')}</p>
          <h1 id="dinamos-title">
            {t('landing.hero_title_start')}{' '}
            <span className="dinamos-hero-accent">{t('landing.hero_title_accent')}</span>
          </h1>
          <p className="dinamos-lead">{t('landing.hero_subtitle')}</p>
          <div className="dinamos-hero-actions">
            <a href="#signin" className="dinamos-button dinamos-button-primary">{t('landing.start_learning')} <ArrowRight size={18} aria-hidden="true" /></a>
            <a href="#simulators" className="dinamos-text-link">{t('landing.hero_explore')} <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <p className="dinamos-hero-note"><Check size={15} aria-hidden="true" />{t('landing.hero_trust')}</p>
          <a className="dinamos-family-link" href="https://trilha.info" target="_blank" rel="noopener noreferrer">
            {t('landing.family_prefix')} <strong>Trilha<span>.Info</span></strong> <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <figure className="dinamos-system">
          <div className="dinamos-system-heading"><Network size={17} aria-hidden="true" /><span>{t('landing.system_example')}</span><span className="dinamos-demo-tag">{t('landing.system_demo')}</span></div>
          <SystemTopology copy={{
            nodeClient: t('landing.topology_node_client'),
            nodeLb: t('landing.topology_node_lb'),
            nodeCache: t('landing.topology_node_cache'),
            nodeDb: t('landing.topology_node_db'),
            description: t('landing.topology_description'),
          }} />
          <figcaption><span className="dinamos-route-dot" aria-hidden="true" />{t('landing.system_caption')}</figcaption>
        </figure>
      </section>

      <div className="dinamos-container dinamos-proof">
        <span><Network size={18} aria-hidden="true" />{t('landing.stat_simulators_value')} {t('landing.stat_simulators_label')}</span>
        <span><Globe size={18} aria-hidden="true" />{t('landing.stat_cases_value')} {t('landing.stat_cases_label')}</span>
        <span><Github size={18} aria-hidden="true" />{t('landing.free_and_open')}</span>
      </div>

      <section className="dinamos-container dinamos-section" id="simulators" aria-labelledby="simulators-title">
        <div className="dinamos-section-heading">
          <div><h2 id="simulators-title">{t('landing.simulators_title')}</h2><p>{t('landing.simulators_subtitle')}</p></div>
          <a href="#signin" className="dinamos-text-link">{t('landing.open_simulators')} <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <SimulatorShowcase />
      </section>

      <section className="dinamos-journey-section" id="journey" aria-labelledby="journey-title">
        <div className="dinamos-container dinamos-journey-layout">
          <div className="dinamos-journey-intro">
            <span className="dinamos-section-icon"><GitBranch size={24} aria-hidden="true" /></span>
            <h2 id="journey-title">{t('landing.journey_title')}</h2>
            <p>{t('landing.journey_subtitle')}</p>
            <a href="#signin" className="dinamos-button">{t('landing.start_journey')} <ArrowRight size={17} aria-hidden="true" /></a>
            <p className="dinamos-journey-note">{t('landing.journey_note')}</p>
          </div>
          <ol className="dinamos-journey-list">
            {['fundamentals', 'design_principles', 'advanced_topics', 'real_cases'].map((prefix, index) => (
              <li key={prefix}>
                <span className={`dinamos-step ${index === 0 ? 'dinamos-step-current' : ''}`}>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{t(`landing.journey_${prefix}_title`)}</h3><p>{t(`landing.journey_${prefix}_description`)}</p>
                  <ul>{[1, 2, 3].map(n => <li key={n}>{t(`landing.journey_${prefix}_item${n}`)}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dinamos-container dinamos-section dinamos-about-grid" aria-label={t('landing.about_project')}>
        <div className="dinamos-author">
          <div className="dinamos-about-heading"><Layers size={21} aria-hidden="true" /><h2>{t('landing.teacher_title')}</h2></div>
          <p>{t('landing.teacher_about_me_text1')}</p>
          <p>{t('landing.teacher_about_me_text2')}</p>
          <a href="https://github.com/flaviojmendes" target="_blank" rel="noopener noreferrer" className="dinamos-text-link">Flávio Mendes <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="dinamos-open-source">
          <div className="dinamos-about-heading"><Github size={21} aria-hidden="true" /><h2>{t('landing.open_source_title')}</h2></div>
          <p>{t('landing.open_source_subtitle')}</p>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="dinamos-button">{t('landing.open_source_cta')} <ArrowUpRight size={17} aria-hidden="true" /></a>
          <span className="dinamos-contribution-note"><GitBranch size={15} aria-hidden="true" />{t('landing.open_source_contribute')}</span>
        </div>
      </section>

      <section className="dinamos-container dinamos-signin-section" id="signin" aria-labelledby="signin-title">
        <div className="dinamos-signin-copy">
          <p className="dinamos-signin-free"><span aria-hidden="true" />{t('landing.free_badge')}</p>
          <h2 id="signin-title">{t('landing.cta_free_title')}</h2>
          <p>{t('landing.free_description')}</p>
          <ul>{[1, 2, 3].map(n => <li key={n}><Check size={17} aria-hidden="true" />{t(`landing.what_you_receive_item${n}`)}</li>)}</ul>
        </div>
        <div className="dinamos-signin-form">
          <h3>{t('landing.signin_title')}</h3>
          <p>{t('landing.signin_subtitle')}</p>
          {authError && <p className="dinamos-auth-error" role="alert">{t(authError)}</p>}
          {signInButtons}
          <p className="dinamos-signin-note">{t('landing.signin_note')} <Link to="/privacy-policy">{t('footer.privacy_policy')}</Link>.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
