// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const embed = vi.hoisted(() => ({
  complete: vi.fn(),
  hasProgress: false,
  pages: [{ slug: 'intro', path: '/intro' }],
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../../../contexts/ContentContext', () => ({ useContent: () => ({ pages: embed.pages }) }));
vi.mock('../../../hooks/useContentProgress', () => ({
  useOptionalContentProgress: () => embed.hasProgress ? { progress: {}, markAsCompleted: embed.complete } : null,
}));
vi.mock('../../restaurant/RestaurantLesson', () => ({
  default: ({ slug, path, onComplete }: { slug: string; path: string; onComplete: (path: string) => void }) => <button onClick={() => onComplete(path)}>Restaurant: {slug}</button>,
}));

import BurgerAnalogy from '../BurgerAnalogy';

beforeEach(() => { vi.clearAllMocks(); embed.hasProgress = false; });

describe('BurgerAnalogy', () => {
  it('keeps written examples readable outside the application and in CMS previews', () => {
    const { rerender } = render(<BurgerAnalogy text="Our kitchen handles the orders." />);
    expect(screen.getByText('Our kitchen handles the orders.')).toBeInTheDocument();
    rerender(<MemoryRouter initialEntries={['/intro']}><BurgerAnalogy text="Our kitchen handles the orders." /></MemoryRouter>);
    expect(screen.getByText('Our kitchen handles the orders.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('only mounts a game for an exact published lesson path with shared progress', async () => {
    embed.hasProgress = true;
    render(<MemoryRouter initialEntries={['/intro']}><BurgerAnalogy text="A shared restaurant." /></MemoryRouter>);
    const complete = await screen.findByRole('button', { name: 'Restaurant: intro' });
    fireEvent.click(complete);
    expect(embed.complete).toHaveBeenCalledWith('/intro');
    expect(screen.getByText('A shared restaurant.')).toBeInTheDocument();
  });

  it('does not attach a lesson game to an admin or unrelated route', () => {
    embed.hasProgress = true;
    render(<MemoryRouter initialEntries={['/admin/content/intro']}><BurgerAnalogy text="Author preview." /></MemoryRouter>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Author preview.')).toBeInTheDocument();
  });
});
