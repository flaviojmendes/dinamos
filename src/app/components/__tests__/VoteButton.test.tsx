// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const api = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('../../utils/api', () => ({ apiClient: api }));

import VoteButton from '../VoteButton';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('VoteButton', () => {
  it('renders the initial vote count', () => {
    render(<VoteButton id={1} type="topic" initialUpvotes={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('posts a vote and updates the count from the response', async () => {
    api.post.mockResolvedValue({ data: { upvotes: 6, has_voted: true } });
    render(<VoteButton id={42} type="topic" initialUpvotes={5} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(screen.getByText('6')).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/api/forum/vote', { topic_id: 42 });
  });

  it('sends message_id payload for message votes', async () => {
    api.post.mockResolvedValue({ data: { upvotes: 1, has_voted: true } });
    render(<VoteButton id={7} type="message" initialUpvotes={0} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/forum/vote', { message_id: 7 }));
  });

  it('keeps the count unchanged when the request fails', async () => {
    api.post.mockRejectedValue(new Error('boom'));
    render(<VoteButton id={1} type="topic" initialUpvotes={5} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
