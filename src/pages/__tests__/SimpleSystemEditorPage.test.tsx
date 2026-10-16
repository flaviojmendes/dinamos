// @vitest-environment jsdom
import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import { AxiosHeaders } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import SimpleSystemEditorPage from '../SimpleSystemEditorPage';
import { apiClient } from '../../app/utils/api';

vi.mock('../../app/utils/api', () => ({ apiClient: { get: vi.fn() } }));
vi.mock('../../components/SystemEditor/SystemEditorV2', () => ({ default: ({ initialDesign }: { initialDesign: { label: string } | null }) => {
  // The real editor hydrates once per mount; reproduce that lifecycle here.
  const hydrated = useRef(initialDesign);
  return <div>{hydrated.current?.label ?? 'Fresh editor'}</div>;
} }));

function mount() {
  render(<MemoryRouter initialEntries={['/editor?design=A']}>
    <Link to="/editor">Fresh</Link><Link to="/editor?design=B">Other</Link>
    <SimpleSystemEditorPage />
  </MemoryRouter>);
}
const response = { data: { design: { label: 'Design A' } }, status: 200, statusText: 'OK', headers: {}, config: { headers: new AxiosHeaders() } };

describe('saved architecture navigation', () => {
  it('starts fresh when the saved design query is removed', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(response);
    mount();
    expect(await screen.findByText('Design A')).toBeVisible();
    fireEvent.click(screen.getByRole('link', { name: 'Fresh' }));
    expect(await screen.findByText('Fresh editor')).toBeVisible();
    expect(screen.queryByText('Design A')).toBeNull();
  });
  it('does not substitute the previously loaded design when another ID is unavailable', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce(response).mockRejectedValueOnce(new Error('Not found'));
    mount();
    expect(await screen.findByText('Design A')).toBeVisible();
    fireEvent.click(screen.getByRole('link', { name: 'Other' }));
    expect(await screen.findByText('Fresh editor')).toBeVisible();
    expect(screen.queryByText('Design A')).toBeNull();
  });
});
