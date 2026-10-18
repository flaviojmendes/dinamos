// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import enAdmin from '../../../locales/en/namespaces/admin.json';
import ptAdmin from '../../../locales/pt/namespaces/admin.json';

const auth = vi.hoisted(() => ({ appUser: { id: 'admin-1', role: 'Admin' } as { id: string; role: string } | null }));
const api = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));
const publicSettings = vi.hoisted(() => ({ publish: vi.fn() }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../../utils/api', () => ({ default: api }));
vi.mock('../../components/Navbar', () => ({ default: () => null }));
vi.mock('../../../hooks/usePublicSettings', () => ({ publishPublicSettings: publicSettings.publish }));

import AdminSettings from '../AdminSettings';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function renderSettings(language: 'en' | 'pt' = 'en') {
  const i18n = createInstance();
  await i18n.init({
    lng: language,
    fallbackLng: false,
    initImmediate: false,
    resources: { en: { translation: { admin: enAdmin } }, pt: { translation: { admin: ptAdmin } } },
    interpolation: { escapeValue: false },
  });
  const view = () => <I18nextProvider i18n={i18n}><AdminSettings /></I18nextProvider>;
  return { ...render(view()), refresh: view, i18n };
}

beforeEach(() => {
  vi.clearAllMocks();
  auth.appUser = { id: 'admin-1', role: 'Admin' };
  api.get.mockReset().mockResolvedValue({ data: { dioramas_enabled: false } });
  api.put.mockReset().mockResolvedValue({ data: { dioramas_enabled: true } });
});

describe('global lesson-diorama settings', () => {
  it.each([null, { id: 'learner', role: 'User' }, { id: 'tutor', role: 'Tutor' }])('does not request admin settings for an unauthorized profile (%j)', async profile => {
    auth.appUser = profile;
    await renderSettings('pt');
    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
    expect(api.put).not.toHaveBeenCalled();
  });

  it('keeps the switch disabled while loading and uses a persisted false value', async () => {
    const load = deferred<{ data: { dioramas_enabled: boolean } }>();
    api.get.mockReturnValueOnce(load.promise);
    await renderSettings();
    const toggle = screen.getByRole('switch', { name: 'Lesson dioramas' });
    expect(toggle).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Loading settings…');
    expect(api.get).toHaveBeenCalledWith('/api/admin/settings');
    await act(async () => load.resolve({ data: { dioramas_enabled: false } }));
    expect(toggle).toBeEnabled();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAccessibleDescription(/every lesson for all users/);
    expect(screen.getByRole('status')).toHaveTextContent('Dioramas are disabled.');
  });

  it('waits for server acknowledgment before changing or publishing the value, and can re-enable', async () => {
    api.get.mockResolvedValueOnce({ data: { dioramas_enabled: true } });
    const save = deferred<{ data: { dioramas_enabled: boolean } }>();
    api.put.mockReturnValueOnce(save.promise);
    await renderSettings();
    const toggle = screen.getByRole('switch', { name: 'Lesson dioramas' });
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(toggle);
    expect(api.put).toHaveBeenCalledWith('/api/admin/settings', { dioramas_enabled: false });
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Saving…');
    expect(publicSettings.publish).not.toHaveBeenCalled();
    await act(async () => save.resolve({ data: { dioramas_enabled: false } }));
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toBeEnabled();
    expect(publicSettings.publish).toHaveBeenLastCalledWith({ dioramas_enabled: false });
    expect(screen.getByRole('status')).toHaveTextContent('Dioramas disabled for everyone.');
    fireEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'));
    expect(api.put).toHaveBeenLastCalledWith('/api/admin/settings', { dioramas_enabled: true });
    expect(publicSettings.publish).toHaveBeenLastCalledWith({ dioramas_enabled: true });
    expect(screen.getByRole('status')).toHaveTextContent('Dioramas enabled for everyone.');
  });

  it('retains the persisted value and reports a save failure without publishing', async () => {
    api.put.mockRejectedValueOnce(new Error('Server unavailable'));
    await renderSettings();
    const toggle = screen.getByRole('switch', { name: 'Lesson dioramas' });
    await waitFor(() => expect(toggle).toBeEnabled());
    fireEvent.click(toggle);
    expect(await screen.findByRole('alert')).toHaveTextContent('The previous setting has been kept.');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toBeEnabled();
    expect(publicSettings.publish).not.toHaveBeenCalled();
  });

  it('requires a known boolean setting and retries a failed load before enabling edits', async () => {
    api.get.mockRejectedValueOnce(new Error('Load unavailable')).mockResolvedValueOnce({ data: { dioramas_enabled: true } });
    await renderSettings();
    const toggle = screen.getByRole('switch', { name: 'Lesson dioramas' });
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the current setting.');
    expect(toggle).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('rejects malformed responses instead of treating a string as an enabled setting', async () => {
    api.get.mockResolvedValueOnce({ data: { dioramas_enabled: 'true' } });
    await renderSettings();
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the current setting.');
    expect(screen.getByRole('switch', { name: 'Lesson dioramas' })).toBeDisabled();
    expect(publicSettings.publish).not.toHaveBeenCalled();
  });

  it('ignores an outstanding save after administrator access is lost', async () => {
    const save = deferred<{ data: { dioramas_enabled: boolean } }>();
    api.put.mockReturnValueOnce(save.promise);
    const { rerender, refresh } = await renderSettings();
    const toggle = screen.getByRole('switch', { name: 'Lesson dioramas' });
    await waitFor(() => expect(toggle).toBeEnabled());
    fireEvent.click(toggle);
    auth.appUser = null;
    rerender(refresh());
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    await act(async () => save.resolve({ data: { dioramas_enabled: true } }));
    expect(publicSettings.publish).not.toHaveBeenCalled();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it.each([
    { language: 'en' as const, label: 'Lesson dioramas', heading: 'System settings', free: 'Free platform', feature: 'Automatic progress saving', absent: 'Plataforma gratuita' },
    { language: 'pt' as const, label: 'Dioramas das aulas', heading: 'Configurações do sistema', free: 'Plataforma gratuita', feature: 'Salvamento automático do progresso', absent: 'Free platform' },
  ])('localizes the setting and existing free-platform information ($language)', async copy => {
    await renderSettings(copy.language);
    await waitFor(() => expect(screen.getByRole('switch', { name: copy.label })).toBeEnabled());
    expect(screen.getByRole('heading', { name: copy.heading })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: copy.free })).toBeInTheDocument();
    expect(screen.getByText(copy.feature)).toBeInTheDocument();
    expect(screen.queryByText(copy.absent)).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('admin.settings.');
    expect(enAdmin.settings).toEqual(expect.objectContaining(Object.fromEntries(Object.keys(ptAdmin.settings).map(key => [key, expect.anything()]))));
  });
});
