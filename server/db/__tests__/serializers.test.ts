import { describe, it, expect } from 'vitest';
import {
  toIso,
  userToDict,
  roleToDict,
  authorToDict,
  challengeToDict,
  solutionToDict,
  forumCategoryToDict,
  forumTopicToDict,
  forumMessageToDict,
  notificationToDict,
  quizOptionToDict,
  quizQuestionToDict,
  quizToDict,
  quizAttemptToDict,
  pollOptionToDict,
  pollToDict,
  type UserRow,
  type RoleRow,
} from '../serializers';

describe('toIso', () => {
  it('returns null for nullish values', () => {
    expect(toIso(null)).toBeNull();
    expect(toIso(undefined)).toBeNull();
    expect(toIso('')).toBeNull();
  });

  it('serializes a Date to an ISO string', () => {
    const d = new Date('2024-01-02T03:04:05.000Z');
    expect(toIso(d)).toBe('2024-01-02T03:04:05.000Z');
  });

  it('normalizes an ISO-ish string', () => {
    expect(toIso('2024-01-02T03:04:05Z')).toBe('2024-01-02T03:04:05.000Z');
  });

  it('falls back to the raw string when it cannot be parsed', () => {
    expect(toIso('not-a-date')).toBe('not-a-date');
  });
});

describe('userToDict', () => {
  const baseUser: UserRow = {
    id: 'u1',
    email: 'a@b.com',
    nickname: 'Ana',
    role: null,
    roleId: 2,
    avatarImage: null,
    githubUsername: null,
    tokens: null,
    onboardingCompleted: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: null,
  };

  it('prefers the role row name/color over the user string role', () => {
    const role: RoleRow = { id: 2, name: 'Admin', color: '#fff', description: null };
    const dto = userToDict(baseUser, role, ['MANAGE_USERS']);
    expect(dto.role).toBe('Admin');
    expect(dto.role_color).toBe('#fff');
    expect(dto.permissions).toEqual(['MANAGE_USERS']);
  });

  it('applies sensible defaults when role and optional fields are missing', () => {
    const dto = userToDict(baseUser, null, []);
    expect(dto.role).toBe('Estudante');
    expect(dto.role_color).toBe('#3B82F6');
    expect(dto.tokens).toBe(0);
    expect(dto.onboarding_completed).toBe(false);
    expect(dto.updated_at).toBeNull();
    expect(dto.created_at).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('roleToDict', () => {
  it('maps a role row plus its permission codes', () => {
    const role: RoleRow = { id: 1, name: 'Mod', color: '#0f0', description: 'desc' };
    expect(roleToDict(role, ['A', 'B'])).toEqual({
      id: 1,
      name: 'Mod',
      color: '#0f0',
      description: 'desc',
      permissions: ['A', 'B'],
    });
  });
});

describe('authorToDict', () => {
  it('returns undefined when there is no user', () => {
    expect(authorToDict(null, '#000')).toBeUndefined();
  });

  it('defaults the role color when not provided', () => {
    const dto = authorToDict({ nickname: 'X', avatarImage: null, role: 'Estudante' }, null);
    expect(dto).toEqual({
      nickname: 'X',
      avatar_image: null,
      role: 'Estudante',
      role_color: '#3B82F6',
    });
  });
});

describe('solutionToDict', () => {
  it('parses embedded JSON columns and tolerates malformed JSON', () => {
    const dto = solutionToDict({
      id: 1,
      challengeId: 'c1',
      userId: 'u1',
      diagramData: '{"nodes":[1,2]}',
      feedback: 'not-json',
      createdAt: null,
      updatedAt: null,
    });
    expect(dto.diagram_data).toEqual({ nodes: [1, 2] });
    expect(dto.feedback).toBeNull();
    expect(dto.challenge_id).toBe('c1');
  });
});

describe('challengeToDict', () => {
  it('maps a challenge row to snake_case', () => {
    const dto = challengeToDict({
      id: 'c1',
      title: 'T',
      subtitle: 's',
      description: 'd',
      difficulty: 'easy',
      category: 'cat',
      order: 1,
      evaluationPrompt: 'p',
      initialRequirements: 'r',
      videoSolutionUrl: 'http://v',
      videoSolutionReleaseDate: new Date('2024-01-01T00:00:00Z'),
    });
    expect(dto.evaluation_prompt).toBe('p');
    expect(dto.video_solution_release_date).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('forum serializers', () => {
  it('maps category, topic and message rows', () => {
    expect(forumCategoryToDict({ id: 1, name: 'G', color: '#fff', description: 'd', order: 1, createdAt: null, updatedAt: null }).name).toBe('G');

    const topic = forumTopicToDict({ id: 2, title: 'T', content: 'c', userId: 'u1', category: 'G', upvotes: null, createdAt: null, updatedAt: null });
    expect(topic.upvotes).toBe(0);

    const msg = forumMessageToDict({ id: 3, topicId: 2, parentId: null, userId: 'u1', content: 'hi', diagramData: '{"a":1}', upvotes: 5, createdAt: null, updatedAt: null });
    expect(msg.diagram_data).toEqual({ a: 1 });
    expect(msg.upvotes).toBe(5);
  });
});

describe('notificationToDict', () => {
  it('maps a notification row', () => {
    const dto = notificationToDict({
      id: 1,
      userId: 'u1',
      type: 'reply',
      title: 'T',
      message: 'M',
      linkType: 'topic',
      linkId: 9,
      actorId: 'u2',
      actorNickname: 'Bob',
      actorAvatar: null,
      isRead: false,
      readAt: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    });
    expect(dto.is_read).toBe(false);
    expect(dto.actor_nickname).toBe('Bob');
    expect(dto.created_at).toBe('2024-01-01T00:00:00.000Z');
  });
});

describe('quizAttemptToDict', () => {
  it('parses answers JSON and defaults to []', () => {
    const dto = quizAttemptToDict({ id: 1, quizId: 5, userId: 'u1', score: 3, totalQuestions: 5, percentage: 60, answers: '[{"q":1}]', startedAt: null, completedAt: null });
    expect(dto.answers).toEqual([{ q: 1 }]);
    const dto2 = quizAttemptToDict({ id: 2, quizId: 5, userId: 'u1', score: 0, totalQuestions: 0, percentage: 0, answers: null, startedAt: null, completedAt: null });
    expect(dto2.answers).toEqual([]);
  });
});

describe('quiz serializers', () => {
  const question = {
    id: 10,
    quizId: 5,
    questionText: 'Q?',
    explanation: 'because',
    order: 1,
  };
  const options = [
    { id: 1, questionId: 10, optionText: 'A', order: 1, isCorrect: true },
    { id: 2, questionId: 10, optionText: 'B', order: 2, isCorrect: false },
  ];

  it('hides correctness and explanation when hideCorrect is set', () => {
    const dto = quizQuestionToDict(question, options, true) as any;
    expect(dto.explanation).toBeNull();
    expect(dto.options[0]).not.toHaveProperty('is_correct');
  });

  it('exposes correctness and explanation by default', () => {
    const opt = quizOptionToDict(options[0]) as any;
    expect(opt.is_correct).toBe(true);
    const dto = quizQuestionToDict(question, options) as any;
    expect(dto.explanation).toBe('because');
  });

  it('includes nested questions only when provided', () => {
    const without = quizToDict({ id: 5, title: 'T' }, 2) as any;
    expect(without).not.toHaveProperty('questions');
    expect(without.question_count).toBe(2);

    const withQ = quizToDict({ id: 5, title: 'T' }, 2, [{ question, options }]) as any;
    expect(withQ.questions).toHaveLength(1);
  });
});

describe('poll serializers', () => {
  it('computes per-option percentages from total votes', () => {
    const options = [
      { id: 1, pollId: 9, text: 'Yes', order: 1, voteCount: 3 },
      { id: 2, pollId: 9, text: 'No', order: 2, voteCount: 1 },
    ];
    const dto = pollToDict({ id: 9, topicId: 1, question: 'Q' }, options, [1]) as any;
    expect(dto.total_votes).toBe(4);
    expect(dto.options[0].percentage).toBe(75);
    expect(dto.options[1].percentage).toBe(25);
    expect(dto.user_votes).toEqual([1]);
  });

  it('omits results and avoids divide-by-zero when requested', () => {
    const opt = pollOptionToDict({ id: 1, pollId: 9, text: 'Yes', order: 1 }, 0, false) as any;
    expect(opt).not.toHaveProperty('vote_count');
    expect(opt).not.toHaveProperty('percentage');
  });
});
