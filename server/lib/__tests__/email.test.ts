import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

const send = vi.fn(async () => ({ id: 'mail_1' }));
const ResendCtor = vi.fn().mockImplementation(() => ({ emails: { send } }));
vi.mock('resend', () => ({ Resend: ResendCtor }));

let email: typeof import('../email');
beforeAll(async () => {
  process.env.RESEND_API_KEY = 'test-key';
  email = await import('../email');
});

beforeEach(() => {
  send.mockReset().mockResolvedValue({ id: 'mail_1' });
});

describe('sendForumReplyNotification', () => {
  const base = {
    topicAuthorEmail: 'a@x.com',
    topicAuthorNickname: 'Ana',
    topicTitle: 'Title',
    topicId: 1,
    replyAuthorNickname: 'Bob',
  };

  it('sends and returns true', async () => {
    expect(await email.sendForumReplyNotification(base)).toBe(true);
    expect(send).toHaveBeenCalledOnce();
  });

  it('returns false for a blank email', async () => {
    expect(await email.sendForumReplyNotification({ ...base, topicAuthorEmail: '   ' })).toBe(false);
  });

  it('returns false when sending throws', async () => {
    send.mockRejectedValueOnce(new Error('smtp down'));
    expect(await email.sendForumReplyNotification(base)).toBe(false);
  });
});

describe('sendMessageReplyNotification', () => {
  it('sends with truncated previews', async () => {
    const ok = await email.sendMessageReplyNotification({
      messageAuthorEmail: 'a@x.com',
      messageAuthorNickname: 'Ana',
      topicTitle: 'Title',
      topicId: 2,
      replyAuthorNickname: 'Bob',
      replyContent: 'r'.repeat(250),
      parentMessageContent: 'p'.repeat(200),
    });
    expect(ok).toBe(true);
  });

  it('returns false for a blank email', async () => {
    const ok = await email.sendMessageReplyNotification({
      messageAuthorEmail: '',
      messageAuthorNickname: 'Ana',
      topicTitle: 'T',
      topicId: 2,
      replyAuthorNickname: 'Bob',
      replyContent: 'r',
      parentMessageContent: 'p',
    });
    expect(ok).toBe(false);
  });
});

describe('sendSystemNotificationEmail', () => {
  it('sends with a CTA', async () => {
    const ok = await email.sendSystemNotificationEmail({
      recipientEmail: 'a@x.com',
      recipientNickname: 'Ana',
      subject: 'Subj',
      title: 'Title',
      message: 'Hello',
      ctaText: 'Go',
      ctaUrl: 'https://x.com',
    });
    expect(ok).toBe(true);
  });

  it('sends without a CTA', async () => {
    const ok = await email.sendSystemNotificationEmail({
      recipientEmail: 'a@x.com',
      recipientNickname: 'Ana',
      subject: 'Subj',
      title: 'Title',
      message: 'Hello',
    });
    expect(ok).toBe(true);
  });

  it('returns false when sending throws', async () => {
    send.mockRejectedValueOnce(new Error('boom'));
    const ok = await email.sendSystemNotificationEmail({
      recipientEmail: 'a@x.com',
      recipientNickname: 'Ana',
      subject: 'Subj',
      title: 'Title',
      message: 'Hello',
    });
    expect(ok).toBe(false);
  });
});
