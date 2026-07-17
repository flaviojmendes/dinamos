import { describe, it, expect } from 'vitest';
import enEditor from '../../locales/en/namespaces/editor.json';
import ptEditor from '../../locales/pt/namespaces/editor.json';
import enChallenges from '../../locales/en/namespaces/challenges.json';
import ptChallenges from '../../locales/pt/namespaces/challenges.json';
import enOnboarding from '../../locales/en/namespaces/onboarding.json';
import ptOnboarding from '../../locales/pt/namespaces/onboarding.json';

const requiredGameKeys = [
  'generate_stage',
  'rotate_stage',
  'copy_stage',
  'retry',
  'sync_offline',
  'leaderboard',
  'verified',
] as const;

describe('inclusive UX locale parity', () => {
  it('includes arena game keys in EN and PT editor namespaces', () => {
    for (const key of requiredGameKeys) {
      expect(enEditor.game).toHaveProperty(key);
      expect(ptEditor.game).toHaveProperty(key);
    }
  });

  it('includes challenge history and audio strings in both languages', () => {
    expect(enChallenges.history?.title).toBeTruthy();
    expect(ptChallenges.history?.title).toBeTruthy();
    expect(enChallenges.audio?.start).toBeTruthy();
    expect(ptChallenges.audio?.start).toBeTruthy();
  });

  it('includes onboarding steps in both languages', () => {
    expect(enOnboarding.welcome.title).toBeTruthy();
    expect(ptOnboarding.welcome.title).toBeTruthy();
    expect(enOnboarding.nav.finish).toBeTruthy();
    expect(ptOnboarding.nav.finish).toBeTruthy();
  });
});
