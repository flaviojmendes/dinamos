import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';
import {
  getTopics,
  getTopic,
  getCategories,
  createTopic,
  createMessage,
  deleteTopic,
  deleteMessage,
  vote,
  getUserVotes,
  ForumTopic,
  ForumMessage,
  ForumCategory,
  TopicSortOrder,
  MessageSortOrder,
} from '../../services/forumService';

// Format relative time
function formatRelativeTime(dateString: string, t: (key: string) => string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('forum.time.just_now');
  if (diffMins < 60) return t('forum.time.minutes_ago').replace('{{count}}', diffMins.toString());
  if (diffHours < 24) return t('forum.time.hours_ago').replace('{{count}}', diffHours.toString());
  if (diffDays < 7) return t('forum.time.days_ago').replace('{{count}}', diffDays.toString());
  
  return date.toLocaleDateString();
}

// Helper to convert hex color to Tailwind-style classes
function getCategoryStyles(color: string) {
  return {
    bg: `rgba(${hexToRgb(color)}, 0.1)`,
    text: color,
    border: `rgba(${hexToRgb(color)}, 0.3)`,
  };
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '128, 128, 128';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// Markdown content renderer component
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-xl font-bold text-slate-100 mt-6 mb-3 pb-2 border-b border-slate-700">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold text-slate-100 mt-5 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-sm font-semibold text-slate-200 mt-3 mb-2">{children}</h4>,
        p: ({ children }) => <p className="my-3 leading-relaxed text-slate-300">{children}</p>,
        ul: ({ children }) => <ul className="my-4 ml-5 space-y-2 list-disc list-outside text-slate-300">{children}</ul>,
        ol: ({ children }) => <ol className="my-4 ml-5 space-y-2 list-decimal list-outside text-slate-300">{children}</ol>,
        li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
        em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
        code: ({ children, className }) => {
          const isBlock = className?.includes('language-');
          return isBlock ? (
            <code className={`${className} block`}>{children}</code>
          ) : (
            <code className="px-1.5 py-0.5 bg-slate-800 text-pink-400 rounded text-sm font-mono">{children}</code>
          );
        },
        pre: ({ children }) => <pre className="my-4 p-4 bg-slate-900 border border-slate-700 rounded-lg overflow-x-auto text-sm">{children}</pre>,
        a: ({ href, children }) => <a href={href} className="text-brand-400 hover:text-brand-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>,
        blockquote: ({ children }) => <blockquote className="my-4 pl-4 border-l-4 border-brand-500/50 text-slate-400 italic bg-slate-800/30 py-2 pr-4 rounded-r">{children}</blockquote>,
        hr: () => <hr className="my-6 border-slate-700" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// Avatar component
function Avatar({ src, name, roleColor, size = 'md' }: { src: string | null; name: string; roleColor: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10';
  
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2`}
        style={{ '--tw-ring-color': roleColor } as React.CSSProperties}
      />
    );
  }
  
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-semibold ring-2`}
      style={{ backgroundColor: roleColor, '--tw-ring-color': roleColor } as React.CSSProperties}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// Category Badge Component
function CategoryBadge({ name, color }: { name: string; color: string }) {
  const styles = getCategoryStyles(color);
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderColor: styles.border,
      }}
    >
      {name}
    </span>
  );
}

// Topic Card Component
function TopicCard({
  topic,
  onClick,
  onVote,
  isVoted,
  categories,
}: {
  topic: ForumTopic;
  onClick: () => void;
  onVote: () => void;
  isVoted: boolean;
  categories: ForumCategory[];
}) {
  const { t } = useTranslation();
  const category = categories.find(c => c.name === topic.category);
  const categoryColor = category?.color || '#6B7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            src={topic.author.avatar_image}
            name={topic.author.nickname}
            roleColor={topic.author.role_color}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CategoryBadge name={topic.category} color={categoryColor} />
              <span className="text-slate-500 text-sm">
                {formatRelativeTime(topic.created_at, t)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-brand-400 transition-colors truncate">
              {topic.title}
            </h3>
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">
              {topic.content}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-500">{t('forum.by')}</span>
                <span className="font-medium" style={{ color: topic.author.role_color }}>
                  {topic.author.nickname}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${topic.author.role_color}20`, color: topic.author.role_color }}
                >
                  {topic.author.role}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote();
            }}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
              isVoted
                ? 'bg-brand-500/20 text-brand-400'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isVoted ? 'scale-110' : ''}`}
              fill={isVoted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span className="text-sm font-medium">{topic.upvotes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// New Topic Form
function NewTopicForm({
  categories,
  onSubmit,
  onCancel,
}: {
  categories: ForumCategory[];
  onSubmit: (data: { title: string; content: string; category: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), category });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 p-6"
    >
      <h3 className="text-xl font-bold text-slate-100 mb-4">{t('forum.new_topic')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {t('forum.category')}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const styles = getCategoryStyles(cat.color);
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border`}
                  style={{
                    backgroundColor: isSelected ? styles.bg : 'rgba(51, 65, 85, 0.5)',
                    color: isSelected ? styles.text : '#94a3b8',
                    borderColor: isSelected ? styles.border : '#475569',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {t('forum.title')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('forum.title_placeholder')}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {t('forum.content')}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('forum.content_placeholder')}
            rows={5}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-slate-500 mt-1">{t('forum.markdown_supported')}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {t('forum.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim() || !category}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('forum.posting') : t('forum.post')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Message Component with nested reply support
function MessageCard({
  message,
  messages,
  onVote,
  onDelete,
  onReply,
  isVoted,
  canDelete,
  currentUserId,
  messageVotes,
  depth = 0,
}: {
  message: ForumMessage;
  messages: ForumMessage[];
  onVote: (messageId: number) => void;
  onDelete: (messageId: number) => void;
  onReply: (parentId: number) => void;
  isVoted: boolean;
  canDelete: boolean;
  currentUserId: string;
  messageVotes: Set<number>;
  depth?: number;
}) {
  const { t } = useTranslation();
  const childMessages = messages.filter(m => m.parent_id === message.id);
  const canReply = depth < 2; // Max 2 levels of nesting

  return (
    <div className={depth > 0 ? 'ml-8 border-l-2 border-slate-700/50 pl-4' : ''}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4"
      >
        <div className="flex gap-3">
          <Avatar
            src={message.author.avatar_image}
            name={message.author.nickname}
            roleColor={message.author.role_color}
            size={depth > 0 ? 'sm' : 'md'}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium" style={{ color: message.author.role_color }}>
                {message.author.nickname}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${message.author.role_color}20`, color: message.author.role_color }}
              >
                {message.author.role}
              </span>
              <span className="text-slate-500 text-sm">
                {formatRelativeTime(message.created_at, t)}
              </span>
            </div>
            <div className="text-slate-300">
              <MarkdownContent content={message.content} />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => onVote(message.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all text-sm ${
                  isVoted
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isVoted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span>{message.upvotes}</span>
              </button>
              {canReply && (
                <button
                  onClick={() => onReply(message.id)}
                  className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  {t('forum.reply')}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors text-sm"
                >
                  {t('forum.delete')}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Nested replies */}
      {childMessages.length > 0 && (
        <div className="mt-3 space-y-3">
          {childMessages.map((child) => (
            <MessageCard
              key={child.id}
              message={child}
              messages={messages}
              onVote={onVote}
              onDelete={onDelete}
              onReply={onReply}
              isVoted={messageVotes.has(child.id)}
              canDelete={child.user_id === currentUserId}
              currentUserId={currentUserId}
              messageVotes={messageVotes}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Topic Detail View
function TopicDetail({
  topicId,
  onBack,
  currentUserId,
  categories,
}: {
  topicId: number;
  onBack: () => void;
  currentUserId: string;
  categories: ForumCategory[];
}) {
  const { t } = useTranslation();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [topicVoted, setTopicVoted] = useState(false);
  const [messageVotes, setMessageVotes] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<MessageSortOrder>('oldest');

  const loadTopic = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTopic(topicId, sortOrder);
      setTopic(data.topic);
      setMessages(data.messages);

      // Load votes
      const messageIds = data.messages.map((m) => m.id);
      const votes = await getUserVotes({ topic_ids: [topicId], message_ids: messageIds });
      setTopicVoted(votes.topic_votes?.includes(topicId) ?? false);
      setMessageVotes(new Set(votes.message_votes ?? []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topic');
    } finally {
      setLoading(false);
    }
  }, [topicId, sortOrder]);

  useEffect(() => {
    loadTopic();
  }, [loadTopic]);

  const handleVoteTopic = async () => {
    try {
      const result = await vote({ topic_id: topicId });
      setTopicVoted(result.voted);
      if (topic) {
        setTopic({ ...topic, upvotes: result.upvotes });
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleVoteMessage = async (messageId: number) => {
    try {
      const result = await vote({ message_id: messageId });
      const newVotes = new Set(messageVotes);
      if (result.voted) {
        newVotes.add(messageId);
      } else {
        newVotes.delete(messageId);
      }
      setMessageVotes(newVotes);
      setMessages(
        messages.map((m) => (m.id === messageId ? { ...m, upvotes: result.upvotes } : m))
      );
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsReplying(true);
    try {
      const newMessage = await createMessage(topicId, { 
        content: replyContent.trim(),
        parent_id: replyingTo,
      });
      setMessages([...messages, newMessage]);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm(t('forum.confirm_delete_message'))) return;
    
    try {
      await deleteMessage(messageId);
      setMessages(messages.filter((m) => m.id !== messageId && m.parent_id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleDeleteTopic = async () => {
    if (!window.confirm(t('forum.confirm_delete_topic'))) return;
    
    try {
      await deleteTopic(topicId);
      onBack();
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  const handleReplyToMessage = (parentId: number) => {
    setReplyingTo(parentId);
    // Scroll to reply form
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReplyTo = () => {
    setReplyingTo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error || 'Topic not found'}</p>
        <button onClick={onBack} className="mt-4 text-brand-400 hover:text-brand-300">
          {t('forum.back_to_topics')}
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.name === topic.category);
  const categoryColor = category?.color || '#6B7280';
  
  // Get only top-level messages
  const topLevelMessages = messages.filter(m => m.parent_id === null);
  const replyingToMessage = replyingTo ? messages.find(m => m.id === replyingTo) : null;

  return (
    <div className="space-y-6 lg:p-10 p-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('forum.back_to_topics')}
      </button>

      {/* Topic */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <button
              onClick={handleVoteTopic}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                topicVoted
                  ? 'bg-brand-500/20 text-brand-400'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              <svg
                className={`w-6 h-6 transition-transform ${topicVoted ? 'scale-110' : ''}`}
                fill={topicVoted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-lg font-semibold">{topic.upvotes}</span>
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge name={topic.category} color={categoryColor} />
              <span className="text-slate-500 text-sm">
                {formatRelativeTime(topic.created_at, t)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-6">{topic.title}</h1>
            <div className="text-slate-300 mb-6">
              <MarkdownContent content={topic.content} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={topic.author.avatar_image}
                  name={topic.author.nickname}
                  roleColor={topic.author.role_color}
                />
                <div>
                  <span className="font-medium" style={{ color: topic.author.role_color }}>
                    {topic.author.nickname}
                  </span>
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${topic.author.role_color}20`, color: topic.author.role_color }}
                  >
                    {topic.author.role}
                  </span>
                </div>
              </div>
              {topic.user_id === currentUserId && (
                <button
                  onClick={handleDeleteTopic}
                  className="text-slate-500 hover:text-red-400 transition-colors text-sm"
                >
                  {t('forum.delete_topic')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">
            {t('forum.replies')} ({messages.length})
          </h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as MessageSortOrder)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-300"
          >
            <option value="oldest">{t('forum.sort.oldest')}</option>
            <option value="newest">{t('forum.sort.newest')}</option>
            <option value="top">{t('forum.sort.top')}</option>
          </select>
        </div>

        <div className="space-y-4">
          {topLevelMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              messages={messages}
              onVote={handleVoteMessage}
              onDelete={handleDeleteMessage}
              onReply={handleReplyToMessage}
              isVoted={messageVotes.has(message.id)}
              canDelete={message.user_id === currentUserId}
              currentUserId={currentUserId}
              messageVotes={messageVotes}
            />
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            {t('forum.no_replies')}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <form id="reply-form" onSubmit={handleReply} className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-4">
        {replyingToMessage && (
          <div className="mb-3 p-3 bg-slate-900/50 rounded-lg border-l-4 border-brand-500 flex items-start justify-between">
            <div>
              <span className="text-xs text-slate-500">{t('forum.replying_to')}</span>
              <p className="text-sm text-slate-400 line-clamp-2">{replyingToMessage.content}</p>
            </div>
            <button
              type="button"
              onClick={cancelReplyTo}
              className="text-slate-500 hover:text-slate-300 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={replyingTo ? t('forum.nested_reply_placeholder') : t('forum.reply_placeholder')}
          rows={3}
          className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-slate-500">{t('forum.markdown_supported')}</p>
          <button
            type="submit"
            disabled={isReplying || !replyContent.trim()}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReplying ? t('forum.posting') : t('forum.reply')}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main Forum Page
export default function ForumPage() {
  const { t } = useTranslation();
  const { user, isSubscribed } = useAuth();
  const { topicId: topicIdParam } = useParams<{ topicId?: string }>();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<TopicSortOrder>('recent');
  const [topicVotes, setTopicVotes] = useState<Set<number>>(new Set());
  
  // Parse topic ID from URL params
  const selectedTopicId = topicIdParam ? parseInt(topicIdParam, 10) : null;

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  const loadTopics = useCallback(async () => {
    try {
      setLoading(true);
      const params: { category?: string; sort?: TopicSortOrder } = { sort: sortOrder };
      if (categoryFilter) params.category = categoryFilter;
      
      const data = await getTopics(params);
      setTopics(data.topics);

      // Load votes for topics
      if (data.topics.length > 0) {
        const topicIds = data.topics.map((t) => t.id);
        const votes = await getUserVotes({ topic_ids: topicIds });
        setTopicVotes(new Set(votes.topic_votes ?? []));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, sortOrder]);

  useEffect(() => {
    if (user && isSubscribed) {
      loadCategories();
      loadTopics();
    }
  }, [loadCategories, loadTopics, user, isSubscribed]);

  const handleCreateTopic = async (data: { title: string; content: string; category: string }) => {
    const newTopic = await createTopic(data);
    setTopics([newTopic, ...topics]);
    setShowNewTopicForm(false);
  };

  const handleVoteTopic = async (topicId: number) => {
    try {
      const result = await vote({ topic_id: topicId });
      const newVotes = new Set(topicVotes);
      if (result.voted) {
        newVotes.add(topicId);
      } else {
        newVotes.delete(topicId);
      }
      setTopicVotes(newVotes);
      setTopics(topics.map((t) => (t.id === topicId ? { ...t, upvotes: result.upvotes } : t)));
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  // Require subscription
  if (!isSubscribed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-8 max-w-md">
          <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">{t('forum.subscription_required')}</h2>
          <p className="text-slate-400 mb-6">{t('forum.subscription_message')}</p>
          <a
            href="/pagamento"
            className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
          >
            {t('forum.subscribe_now')}
          </a>
        </div>
      </div>
    );
  }

  // Topic Detail View
  if (selectedTopicId !== null && !isNaN(selectedTopicId)) {
    return (
      <TopicDetail
        topicId={selectedTopicId}
        onBack={() => {
          navigate('/forum');
          loadTopics();
        }}
        currentUserId={user?.uid || ''}
        categories={categories}
      />
    );
  }

  return (
    <div className="space-y-6 lg:p-10 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            {t('forum.title')}
          </h1>
          <p className="text-slate-400 mt-1">{t('forum.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowNewTopicForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('forum.new_topic')}
        </button>
      </div>

      {/* New Topic Form */}
      <AnimatePresence>
        {showNewTopicForm && categories.length > 0 && (
          <NewTopicForm
            categories={categories}
            onSubmit={handleCreateTopic}
            onCancel={() => setShowNewTopicForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              categoryFilter === null
                ? 'bg-brand-500/20 text-brand-400 border-brand-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            {t('forum.all')}
          </button>
          {categories.map((cat) => {
            const styles = getCategoryStyles(cat.color);
            const isSelected = categoryFilter === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.name)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                style={{
                  backgroundColor: isSelected ? styles.bg : 'rgb(30, 41, 59)',
                  color: isSelected ? styles.text : '#94a3b8',
                  borderColor: isSelected ? styles.border : '#334155',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as TopicSortOrder)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300"
        >
          <option value="recent">{t('forum.sort.recent')}</option>
          <option value="active">{t('forum.sort.active')}</option>
          <option value="popular">{t('forum.sort.popular')}</option>
        </select>
      </div>

      {/* Topics List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button onClick={loadTopics} className="mt-4 text-brand-400 hover:text-brand-300">
            {t('forum.try_again')}
          </button>
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-1">{t('forum.no_topics')}</h3>
          <p className="text-slate-500">{t('forum.be_first')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => navigate(`/forum/${topic.id}`)}
                onVote={() => handleVoteTopic(topic.id)}
                isVoted={topicVotes.has(topic.id)}
                categories={categories}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
