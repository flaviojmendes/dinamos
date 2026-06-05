// Common types used across the application

export interface Challenge {
  id: string
  title: string
  subtitle?: string
  description: string
  difficulty: string
  category: string
  initial_requirements?: string
  attempts_count?: number
  order?: number
  evaluation_prompt?: string
  video_solution_url?: string
  video_solution_release_date?: string
}

export interface DiagramElement {
  type: string
  text?: string
  [key: string]: any
}

export interface Diagram {
  elements: DiagramElement[]
  appState?: any
}

export interface SolutionSubmission {
  challengeId: string
  textProposal: string
  diagram: Diagram
  audioTranscription?: string
}

export interface FeedbackData {
  strengths: string[]
  suggestions: string[]
}

export interface Solution {
  id: number
  challenge_id: string
  created_at: string
  feedback?: FeedbackData
  score?: number
  status: string
}

export type UserRole = 'Estudante' | 'Tutor' | 'Admin';

export interface Permission {
  code: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  color: string;
  description?: string;
  permissions: string[];
}

export interface User {
  id: string
  email: string
  nickname: string
  role: string // Kept for backward compatibility but could be dynamic
  role_color?: string // New field for dynamic colors
  role_id?: number
  permissions?: string[] // Codes
  avatar_image?: string
  github_username?: string
  is_subscribed?: boolean
  subscribed_at?: string
  stripe_customer_id?: string
  tokens?: number
  onboarding_completed?: boolean
  created_at?: string
  updated_at?: string
  // Quiz stats (available in admin endpoints)
  avg_quiz_score?: number
  quizzes_completed?: number
}

export interface ForumTopic {
  id: number
  title: string
  content: string
  user_id: string
  category: string  // Changed to string to support dynamic categories
  created_at: string
  updated_at?: string
  upvotes: number
  has_voted?: boolean
  comment_count?: number
  author?: {
    nickname: string
    avatar_image?: string
    role: string
    role_color?: string
  }
}

export interface ForumMessage {
  id: number
  topic_id: number
  parent_id?: number | null  // ID of parent message for nested replies
  user_id: string
  content: string
  diagram_data?: Diagram
  created_at: string
  updated_at?: string
  upvotes: number
  has_voted?: boolean
  author?: {
    nickname: string
    avatar_image?: string
    role: string
    role_color?: string
  }
  replies?: ForumMessage[]  // Nested replies
  depth?: number  // Depth level (0 = top-level, 1 = reply, 2 = reply to reply)
}

export interface ForumCategory {
  id: number
  name: string
  color: string
  description?: string
  order: number
  created_at?: string
  updated_at?: string
}

// Poll types
export interface PollOption {
  id: number
  poll_id: number
  text: string
  order: number
  vote_count?: number
  percentage?: number
}

export interface Poll {
  id: number
  topic_id: number
  question: string
  allow_multiple: boolean
  is_closed: boolean
  ends_at?: string | null
  total_votes: number
  created_at: string
  options: PollOption[]
  user_votes: number[]  // Option IDs the user voted for
}

export type NotificationType = 'reply' | 'mention' | 'system' | 'achievement';

export interface Notification {
  id: number
  user_id: string
  type: NotificationType
  title: string
  message: string
  link_type?: string | null  // topic, message, challenge, etc.
  link_id?: number | null
  actor_id?: string | null
  actor_nickname?: string | null
  actor_avatar?: string | null
  is_read: boolean
  read_at?: string | null
  created_at: string
}

// Quiz types
export interface QuizOption {
  id: number
  question_id: number
  option_text: string
  is_correct?: boolean  // Only shown after answering
  order: number
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question_text: string
  explanation?: string | null  // Shown after answering
  order: number
  options: QuizOption[]
}

export interface Quiz {
  id: number
  title: string
  theme: string
  description?: string | null
  time_limit_seconds: number
  is_published: boolean
  order: number
  question_count: number
  questions?: QuizQuestion[]
  user_best_percentage?: number | null
  user_attempts_count?: number
  created_at: string
  updated_at?: string
}

export interface QuizAnswer {
  question_id: number
  selected_option_id: number | null
  is_correct?: boolean
  time_taken_seconds: number
}

export interface QuizAttempt {
  id: number
  quiz_id: number
  user_id: string
  score: number
  total_questions: number
  percentage: number
  answers: QuizAnswer[]
  started_at: string
  completed_at?: string | null
  quiz?: Quiz
}

export interface QuizLeaderboardEntry {
  user_id: string
  nickname: string
  avatar_image?: string | null
  best_percentage: number
  first_achieved: string
  rank: number
}

export interface QuizStats {
  total_attempts: number
  quizzes_completed: number
  average_percentage: number
  best_percentage: number
  total_correct_answers: number
  total_questions_answered: number
}

// Global Leaderboard types
export interface LeaderboardEntry {
  rank: number
  user_id: string
  nickname: string | null
  avatar_image: string | null
  coins: number
  avg_quiz_score: number
  quizzes_completed: number
  total_correct_answers: number
  ranking_score: number
}

export interface UserRanking extends LeaderboardEntry {
  message?: string
}
