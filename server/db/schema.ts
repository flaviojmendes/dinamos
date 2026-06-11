import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  jsonb,
  doublePrecision,
  unique,
  index,
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
// New table (not in the Python backend): persists runtime config as key/value
// pairs, since serverless functions are stateless across invocations.

export const appSettings = pgTable('app_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ==================== Editor Game Mode ====================
// A "match" of the /editor game: the admin defines a starting architecture,
// lock rules, a load/chaos timeline and a countdown. Every logged-in player
// gets their own copy of the architecture (game_players) and is ranked by the
// score they compute locally from the deterministic simulator.

export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  // Short shareable slug used in the match URL (/editor/game/:code).
  code: varchar('code', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 120 }),
  status: varchar('status', { length: 20 }).notNull().default('lobby'),
  seed: integer('seed').notNull().default(1),
  // Countdown target; players wait in the lobby until this time.
  startsAt: timestamp('starts_at', { withTimezone: true }),
  // { nodes: [{ id, position, config }], edges: [{ id, source, target, ... }] }
  startingArchitecture: jsonb('starting_architecture'),
  // Ids of starting components players are not allowed to delete.
  lockedNodeIds: jsonb('locked_node_ids'),
  allowDeleteStarting: boolean('allow_delete_starting').default(true),
  // Broadcast traffic profile: { type: LoadProfileType }
  loadProfile: jsonb('load_profile'),
  // Broadcast chaos timeline (match-time scheduled events).
  chaosEvents: jsonb('chaos_events'),
  // Weights/targets used to turn metrics into a score.
  scoringConfig: jsonb('scoring_config'),
  budget: jsonb('budget'),
  durationSec: integer('duration_sec'),
  // Round-based play. `rounds` is an array of per-round config:
  // { name?, intervalSec, durationSec, loadProfile, chaosEvents, scoringConfig, weight }
  // The active round's loadProfile/chaosEvents/scoringConfig are mirrored into
  // the live columns above so the existing client engine keeps working.
  rounds: jsonb('rounds'),
  // Round lifecycle phase: 'lobby' | 'interval' | 'round' | 'ended'.
  phase: varchar('phase', { length: 20 }).notNull().default('lobby'),
  // 1-based index of the active/last round (0 = no round started yet).
  currentRound: integer('current_round').notNull().default(0),
  roundStartedAt: timestamp('round_started_at', { withTimezone: true }),
  roundEndsAt: timestamp('round_ends_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  // Latest admin broadcast shown to all players in the match.
  announcement: text('announcement'),
  announcementAt: timestamp('announcement_at', { withTimezone: true }),
  createdBy: varchar('created_by', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const gamePlayers = pgTable(
  'game_players',
  {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id')
      .notNull()
      .references(() => gameSessions.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    architecture: jsonb('architecture'),
    // Server-computed weighted aggregate across rounds.
    score: doublePrecision('score').default(0),
    scoreBreakdown: jsonb('score_breakdown'),
    // Per-round results keyed by round index:
    // { [roundIndex]: { score, breakdown, metrics } }
    roundScores: jsonb('round_scores'),
    // Latest "golden signals" snapshot: latency, traffic, errors, saturation.
    metrics: jsonb('metrics'),
    lastSubmittedAt: timestamp('last_submitted_at', { withTimezone: true }),
  },
  (t) => ({
    sessionUser: unique('game_players_session_user_unique').on(
      t.sessionId,
      t.userId
    ),
  })
);

// ==================== Content (CMS) ====================
// Lesson pages, formerly static MDX files under src/content/. Each row holds
// both language bodies (raw MDX source) plus the routing/registry metadata
// previously kept in src/config/contentManifest.ts. Rendered at runtime by the
// browser (see src/components/Common/MdxRenderer.tsx) and managed via the admin
// CMS (/admin/content).

export const contentModules = pgTable('content_modules', {
  id: serial('id').primaryKey(),
  // Stable string key referenced by content_pages.module_id (e.g. "components").
  key: varchar('key', { length: 50 }).notNull().unique(),
  label: varchar('label', { length: 200 }).notNull(),
  // Learning tier: FOUNDATIONAL | CORE | ADVANCED | APPLIED | TOOLS.
  tier: varchar('tier', { length: 20 }).notNull().default('CORE'),
  // Index/landing path for the module.
  base: varchar('base', { length: 255 }).notNull(),
  // Optional explicit lesson paths for modules without a shared URL prefix.
  paths: jsonb('paths'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const contentPages = pgTable('content_pages', {
  id: serial('id').primaryKey(),
  // Internal slug, decoupled from the URL (e.g. "components/cache").
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  // Public URL, preserved byte-for-byte (progress is keyed by pathname).
  path: varchar('path', { length: 255 }).notNull().unique(),
  // Registry module id (e.g. "components", "design"); drives sidebar/search.
  moduleId: varchar('module_id', { length: 50 }),
  orderIndex: integer('order_index').notNull().default(0),
  // Optional key into the frontend SIMULATOR_REGISTRY to attach an interactive
  // simulator at <path>/simulator.
  simulatorKey: varchar('simulator_key', { length: 120 }),
  published: boolean('published').notNull().default(true),
  titleEn: varchar('title_en', { length: 500 }),
  titlePt: varchar('title_pt', { length: 500 }),
  bodyEn: text('body_en'),
  bodyPt: text('body_pt'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Per-user personal notes attached to a content page. Any logged-in user can
// create, edit and delete their own annotations; they are private to that user
// and keyed by the content slug so they reappear whenever the page is reopened.
export const contentAnnotations = pgTable(
  'content_annotations',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    // Content slug this note belongs to (e.g. "components/cache").
    slug: varchar('slug', { length: 255 }).notNull(),
    // Public URL captured at creation time, for "my notes" linking/back-nav.
    path: varchar('path', { length: 255 }),
    // 'text' = written note, 'drawing' = Excalidraw scene.
    kind: varchar('kind', { length: 20 }).notNull().default('text'),
    // Text body (null for drawing-only notes).
    body: text('body'),
    // Excalidraw scene + preview: { elements, appState, files?, preview }.
    drawing: jsonb('drawing'),
    // Text-quote/position anchor when the note is attached to a selection:
    // { quote, prefix, suffix, start, end }. Null for page-level notes.
    anchor: jsonb('anchor'),
    // Optional highlight color tag (e.g. "amber", "green").
    color: varchar('color', { length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userSlugIdx: index('content_annotations_user_slug_idx').on(t.userId, t.slug),
  })
);

// Per-user lesson completion ("mark as done"). Keyed by URL pathname so it maps
// 1:1 to the legacy localStorage `content-progress` object. `completed` is kept
// as an explicit flag (rather than presence/absence of a row) so un-marking a
// lesson is recorded too, matching the previous client-side behaviour.
export const contentProgress = pgTable(
  'content_progress',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    // Public URL pathname this progress belongs to (e.g. "/components/cache").
    path: varchar('path', { length: 255 }).notNull(),
    completed: boolean('completed').notNull().default(true),
    // When the lesson was (last) marked complete/incomplete.
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userPathUnique: unique('content_progress_user_path_unique').on(t.userId, t.path),
    userIdx: index('content_progress_user_idx').on(t.userId),
  })
);

// ==================== Announcements ====================
// Admin-authored broadcast shown to users as a modal (e.g. "new content
// available"). Each row carries both language bodies as Markdown. The active
// announcement is the most recently published row a given user has not yet
// acknowledged; acknowledgements are recorded per-user so the modal never
// reappears once dismissed. Editing a published row keeps its id (so prior
// acks still suppress it); admins can "reset acks" to re-trigger it for everyone.
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  titleEn: varchar('title_en', { length: 300 }),
  titlePt: varchar('title_pt', { length: 300 }),
  // Markdown source rendered client-side (same renderer as lesson pages).
  bodyEn: text('body_en'),
  bodyPt: text('body_pt'),
  published: boolean('published').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Per-user acknowledgement of an announcement. Presence of a row means the user
// dismissed that announcement, so it is never shown to them again.
export const announcementAcks = pgTable(
  'announcement_acks',
  {
    id: serial('id').primaryKey(),
    announcementId: integer('announcement_id')
      .notNull()
      .references(() => announcements.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    announcementUserUnique: unique('announcement_acks_announcement_user_unique').on(
      t.announcementId,
      t.userId
    ),
    userIdx: index('announcement_acks_user_idx').on(t.userId),
  })
);

// Per-user "received" impression of an announcement: a row is written the first
// time the modal is actually shown to a user (before they dismiss it). One row
// per (announcement, user); together with announcement_acks this powers the
// received-vs-acknowledged analytics. An acknowledgement also implies receipt,
// so the analytics union both tables when counting reach.
export const announcementViews = pgTable(
  'announcement_views',
  {
    id: serial('id').primaryKey(),
    announcementId: integer('announcement_id')
      .notNull()
      .references(() => announcements.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    seenAt: timestamp('seen_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    announcementUserUnique: unique('announcement_views_announcement_user_unique').on(
      t.announcementId,
      t.userId
    ),
    userIdx: index('announcement_views_user_idx').on(t.userId),
  })
);

// Anonymized page-view log used purely for aggregate analytics ("most visited
// modules/pages"). Privacy by design: we never store the user id here. Instead
// we keep a one-way hash of an opaque visitor key (the Firebase uid for signed-in
// users, or a client-generated anonymous id otherwise), so the admin dashboard
// can compute total views AND distinct-visitor counts without ever being able to
// reverse a row back to a person.
export const contentViews = pgTable(
  'content_views',
  {
    id: serial('id').primaryKey(),
    // Public URL pathname that was viewed (e.g. "/components/cache").
    path: varchar('path', { length: 255 }).notNull(),
    // sha256(ANALYTICS_SALT + visitorKey). Used only for count(distinct ...).
    visitorHash: varchar('visitor_hash', { length: 64 }).notNull(),
    // Whether the visitor was authenticated at view time (no identity beyond this).
    isAuthed: boolean('is_authed').notNull().default(false),
    viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pathIdx: index('content_views_path_idx').on(t.path),
    viewedAtIdx: index('content_views_viewed_at_idx').on(t.viewedAt),
  })
);
