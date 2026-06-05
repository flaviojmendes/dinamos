import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ==================== Roles & Permissions ====================

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 20 }).notNull().default('#3B82F6'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: integer('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  })
);

// ==================== Users ====================

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  nickname: varchar('nickname', { length: 100 }),
  role: varchar('role', { length: 20 }).default('Estudante'),
  roleId: integer('role_id').references(() => roles.id),
  avatarImage: text('avatar_image'),
  githubUsername: varchar('github_username', { length: 255 }),
  isSubscribed: boolean('is_subscribed').default(false),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  tokens: integer('tokens').default(0),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tokenTransactions = pgTable('token_transactions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  amount: integer('amount').notNull(),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  relatedId: integer('related_id'),
  relatedType: varchar('related_type', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==================== Challenges & Solutions ====================

export const challenges = pgTable('challenges', {
  id: varchar('id', { length: 100 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  description: text('description').notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  order: integer('order').default(0),
  evaluationPrompt: text('evaluation_prompt'),
  initialRequirements: text('initial_requirements'),
  videoSolutionUrl: varchar('video_solution_url', { length: 255 }),
  videoSolutionReleaseDate: timestamp('video_solution_release_date', {
    withTimezone: true,
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export const solutions = pgTable('solutions', {
  id: serial('id').primaryKey(),
  challengeId: varchar('challenge_id', { length: 100 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  userEmail: varchar('user_email', { length: 255 }),
  step0Content: text('step_0_content'),
  step1Content: text('step_1_content'),
  step2Content: text('step_2_content'),
  step3Content: text('step_3_content'),
  textProposal: text('text_proposal'),
  diagramData: text('diagram_data'),
  audioTranscription: text('audio_transcription'),
  score: integer('score'),
  feedback: text('feedback'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ==================== Forum ====================

export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 20 }).notNull().default('#6B7280'),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumTopics = pgTable('forum_topics', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  upvotes: integer('upvotes').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumMessages = pgTable('forum_messages', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id').notNull(),
  parentId: integer('parent_id'),
  userId: varchar('user_id', { length: 255 }).notNull(),
  content: text('content').notNull(),
  diagramData: text('diagram_data'),
  upvotes: integer('upvotes').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  topicId: integer('topic_id'),
  messageId: integer('message_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==================== Notifications ====================

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('system'),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  linkType: varchar('link_type', { length: 50 }),
  linkId: integer('link_id'),
  actorId: varchar('actor_id', { length: 255 }),
  actorNickname: varchar('actor_nickname', { length: 100 }),
  actorAvatar: text('actor_avatar'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==================== Quizzes ====================

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  theme: varchar('theme', { length: 100 }).notNull(),
  description: text('description'),
  timeLimitSeconds: integer('time_limit_seconds').notNull().default(30),
  isPublished: boolean('is_published').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  explanation: text('explanation'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const quizOptions = pgTable('quiz_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id')
    .notNull()
    .references(() => quizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  order: integer('order').default(0),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  score: integer('score').notNull().default(0),
  totalQuestions: integer('total_questions').notNull().default(0),
  percentage: integer('percentage').notNull().default(0),
  answers: text('answers'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// ==================== Polls ====================

export const polls = pgTable('polls', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .notNull()
    .unique()
    .references(() => forumTopics.id, { onDelete: 'cascade' }),
  question: varchar('question', { length: 500 }).notNull(),
  allowMultiple: boolean('allow_multiple').default(false),
  isClosed: boolean('is_closed').default(false),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const pollOptions = pgTable('poll_options', {
  id: serial('id').primaryKey(),
  pollId: integer('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  text: varchar('text', { length: 255 }).notNull(),
  order: integer('order').default(0),
  voteCount: integer('vote_count').default(0),
});

export const pollVotes = pgTable('poll_votes', {
  id: serial('id').primaryKey(),
  pollId: integer('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  optionId: integer('option_id')
    .notNull()
    .references(() => pollOptions.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==================== App Settings ====================
// New table (not in the Python backend): persists runtime config such as
// FREE_ACCESS_MODE, since serverless functions are stateless across invocations.

export const appSettings = pgTable('app_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
