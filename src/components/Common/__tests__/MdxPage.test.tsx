// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const delivery = vi.hoisted(() => ({
  loadPageBody: vi.fn(),
  shouldUseContentApi: vi.fn(() => false),
}));
vi.mock('../../../contentDelivery', () => ({
  loadPageBody: delivery.loadPageBody,
  shouldUseContentApi: delivery.shouldUseContentApi,
}));

const api = vi.hoisted(() => ({ post: vi.fn().mockResolvedValue({}) }));
vi.mock('../../../app/utils/api', () => ({ default: api }));

const i18n = vi.hoisted(() => ({ language: 'en' }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n }),
}));

const pathname = vi.hoisted(() => ({ value: '/p1' }));
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: pathname.value }),
}));

vi.mock('../MdxRenderer', () => ({
  default: ({ source }: { source: string }) => <div data-testid="mdx">{source}</div>,
  mdxCacheKey: () => 'cache-key',
}));

vi.mock('../ContentAnnotations', () => ({
  default: () => null,
}));

import MdxPage from '../MdxPage';

beforeEach(() => {
  vi.clearAllMocks();
  pathname.value = '/p1';
  i18n.language = 'en';
  delivery.shouldUseContentApi.mockReturnValue(false);
  delivery.loadPageBody.mockResolvedValue('# Hello');
  sessionStorage.clear();
});

describe('MdxPage', () => {
  it('loads lesson bodies through the delivery module', async () => {
    render(<MdxPage slug="s1" />);
    await waitFor(() => expect(screen.getByTestId('mdx')).toHaveTextContent('# Hello'));
    expect(delivery.loadPageBody).toHaveBeenCalledWith({
      path: '/p1',
      lang: 'en',
      forceApi: false,
    });
  });

  it('reloads the body when the locale changes', async () => {
    delivery.loadPageBody.mockResolvedValueOnce('# EN').mockResolvedValueOnce('# PT');

    const { rerender } = render(<MdxPage slug="s1" />);
    await waitFor(() => expect(screen.getByTestId('mdx')).toHaveTextContent('# EN'));

    i18n.language = 'pt';
    rerender(<MdxPage slug="s1" />);
    await waitFor(() =>
      expect(delivery.loadPageBody).toHaveBeenLastCalledWith({
        path: '/p1',
        lang: 'pt',
        forceApi: false,
      })
    );
  });

  it('keeps view tracking on the authenticated API', async () => {
    render(<MdxPage slug="s1" />);
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/views', expect.any(Object)));
  });

  it('uses API bodies after admin reload forces API mode', async () => {
    delivery.shouldUseContentApi.mockReturnValue(true);
    render(<MdxPage slug="s1" />);
    await waitFor(() => expect(delivery.loadPageBody).toHaveBeenCalledWith({
      path: '/p1',
      lang: 'en',
      forceApi: true,
    }));
  });
});
