// Serializers that reproduce the JSON shapes returned by the Python backend's
// `to_dict()` methods, so the existing frontend contract is preserved exactly.

type DateLike = Date | string | null | undefined;

export function toIso(value: DateLike): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  // neon-http may already return an ISO-ish string
  try {
    return new Date(value).toISOString();
  } catch {
    return typeof value === 'string' ? value : null;
  }
}

function parseJson(value: string | null | undefined): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// ==================== Users / Roles ====================

export interface RoleRow {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface UserRow {
  id: string;
  email: string;
  nickname: string | null;
  role: string | null;
  roleId: number | null;
  avatarImage: string | null;
  githubUsername: string | null;
  tokens: number | null;
  onboardingCompleted: boolean | null;
  createdAt: DateLike;
  updatedAt: DateLike;
}

export function userToDict(
  user: UserRow,
  role: RoleRow | null,
  permissionCodes: string[]
) {
  const roleName = role?.name ?? user.role ?? 'Estudante';
  const roleColor = role?.color ?? '#3B82F6';

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: roleName,
    role_color: roleColor,
    role_id: user.roleId,
    permissions: permissionCodes,
    avatar_image: user.avatarImage,
    github_username: user.githubUsername,
    tokens: user.tokens ?? 0,
    onboarding_completed: user.onboardingCompleted ?? false,
    created_at: toIso(user.createdAt),
    updated_at: toIso(user.updatedAt),
  };
}

export function roleToDict(role: RoleRow, permissionCodes: string[]) {
  return {
    id: role.id,
    name: role.name,
    color: role.color,
    description: role.description,
    permissions: permissionCodes,
  };
}

export interface AuthorRow {
  nickname: string | null;
  avatarImage: string | null;
  role: string | null;
  roleColor?: string | null;
}

export function authorToDict(
  user: { nickname: string | null; avatarImage: string | null; role: string | null } | null,
  roleColor: string | null
) {
  if (!user) return undefined;
  return {
    nickname: user.nickname,
    avatar_image: user.avatarImage,
    role: user.role,
    role_color: roleColor ?? '#3B82F6',
  };
}

// ==================== Challenges / Solutions ====================

export function challengeToDict(c: any) {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    difficulty: c.difficulty,
    category: c.category,
    order: c.order,
    evaluation_prompt: c.evaluationPrompt,
    initial_requirements: c.initialRequirements,
    video_solution_url: c.videoSolutionUrl,
    video_solution_release_date: toIso(c.videoSolutionReleaseDate),
  };
}

export function solutionToDict(s: any) {
  return {
    id: s.id,
    challenge_id: s.challengeId,
    user_id: s.userId,
    user_email: s.userEmail,
    step_0_content: s.step0Content,
    step_1_content: s.step1Content,
    step_2_content: s.step2Content,
    step_3_content: s.step3Content,
    text_proposal: s.textProposal,
    diagram_data: parseJson(s.diagramData),
    audio_transcription: s.audioTranscription,
    score: s.score,
    feedback: parseJson(s.feedback),
    status: s.status,
    created_at: toIso(s.createdAt),
    updated_at: toIso(s.updatedAt),
  };
}

// ==================== Forum ====================

export function forumCategoryToDict(c: any) {
  return {
    id: c.id,
    name: c.name,
    color: c.color,
    description: c.description,
    order: c.order,
    created_at: toIso(c.createdAt),
    updated_at: toIso(c.updatedAt),
  };
}

export function forumTopicToDict(t: any) {
  return {
    id: t.id,
    title: t.title,
    content: t.content,
    user_id: t.userId,
    category: t.category,
    upvotes: t.upvotes ?? 0,
    created_at: toIso(t.createdAt),
    updated_at: toIso(t.updatedAt),
  };
}

export function forumMessageToDict(m: any) {
  return {
    id: m.id,
    topic_id: m.topicId,
    parent_id: m.parentId,
    user_id: m.userId,
    content: m.content,
    diagram_data: parseJson(m.diagramData),
    upvotes: m.upvotes ?? 0,
    created_at: toIso(m.createdAt),
    updated_at: toIso(m.updatedAt),
  };
}

// ==================== Notifications ====================

export function notificationToDict(n: any) {
  return {
    id: n.id,
    user_id: n.userId,
    type: n.type,
    title: n.title,
    message: n.message,
    link_type: n.linkType,
    link_id: n.linkId,
    actor_id: n.actorId,
    actor_nickname: n.actorNickname,
    actor_avatar: n.actorAvatar,
    is_read: n.isRead,
    read_at: toIso(n.readAt),
    created_at: toIso(n.createdAt),
  };
}

// ==================== Quizzes ====================

export function quizOptionToDict(o: any, hideCorrect = false) {
  const result: Record<string, unknown> = {
    id: o.id,
    question_id: o.questionId,
    option_text: o.optionText,
    order: o.order,
  };
  if (!hideCorrect) result.is_correct = o.isCorrect;
  return result;
}

export function quizQuestionToDict(q: any, options: any[], hideCorrect = false) {
  return {
    id: q.id,
    quiz_id: q.quizId,
    question_text: q.questionText,
    explanation: hideCorrect ? null : q.explanation,
    order: q.order,
    options: options.map((o) => quizOptionToDict(o, hideCorrect)),
  };
}

export function quizToDict(
  q: any,
  questionCount: number,
  questions?: { question: any; options: any[] }[],
  hideCorrect = false
) {
  const result: Record<string, unknown> = {
    id: q.id,
    title: q.title,
    theme: q.theme,
    description: q.description,
    time_limit_seconds: q.timeLimitSeconds,
    is_published: q.isPublished,
    order: q.order,
    question_count: questionCount,
    created_at: toIso(q.createdAt),
    updated_at: toIso(q.updatedAt),
  };
  if (questions) {
    result.questions = questions.map((qq) =>
      quizQuestionToDict(qq.question, qq.options, hideCorrect)
    );
  }
  return result;
}

export function quizAttemptToDict(a: any) {
  return {
    id: a.id,
    quiz_id: a.quizId,
    user_id: a.userId,
    score: a.score,
    total_questions: a.totalQuestions,
    percentage: a.percentage,
    answers: parseJson(a.answers) ?? [],
    started_at: toIso(a.startedAt),
    completed_at: toIso(a.completedAt),
  };
}

// ==================== Polls ====================

export function pollOptionToDict(o: any, totalVotes = 0, includeResults = true) {
  const result: Record<string, unknown> = {
    id: o.id,
    poll_id: o.pollId,
    text: o.text,
    order: o.order,
  };
  if (includeResults) {
    result.vote_count = o.voteCount ?? 0;
    result.percentage =
      totalVotes > 0
        ? Math.round(((o.voteCount ?? 0) / totalVotes) * 100 * 10) / 10
        : 0;
  }
  return result;
}

export function pollToDict(
  poll: any,
  options: any[],
  userVotes: number[] = [],
  includeResults = true
) {
  const totalVotes = options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  return {
    id: poll.id,
    topic_id: poll.topicId,
    question: poll.question,
    allow_multiple: poll.allowMultiple,
    is_closed: poll.isClosed,
    ends_at: toIso(poll.endsAt),
    total_votes: totalVotes,
    created_at: toIso(poll.createdAt),
    options: options.map((o) => pollOptionToDict(o, totalVotes, includeResults)),
    user_votes: userVotes,
  };
}
