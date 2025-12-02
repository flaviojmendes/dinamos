// Forum API Service
const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface ForumCategory {
  id: number;
  name: string;
  color: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ForumAuthor {
  nickname: string;
  avatar_image: string | null;
  role: string;
  role_color: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  content: string;
  user_id: string;
  category: string;
  upvotes: number;
  created_at: string;
  updated_at: string;
  author: ForumAuthor;
}

export interface ForumMessage {
  id: number;
  topic_id: number;
  parent_id: number | null;
  user_id: string;
  content: string;
  diagram_data: Record<string, unknown> | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
  author: ForumAuthor;
}

export interface TopicWithMessages {
  topic: ForumTopic;
  messages: ForumMessage[];
}

export interface VoteResponse {
  voted: boolean;
  upvotes: number;
}

export interface UserVotes {
  topic_votes: number[];
  message_votes: number[];
}

export type TopicSortOrder = 'recent' | 'active' | 'popular';
export type MessageSortOrder = 'oldest' | 'newest' | 'top';

// Get auth token from Firebase
async function getAuthToken(): Promise<string> {
  const { auth } = await import('../config/firebase');
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.getIdToken();
}

// Get all forum categories
export async function getCategories(): Promise<{ categories: ForumCategory[] }> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  return response.json();
}

// Get forum topics
export async function getTopics(params?: {
  category?: string;
  sort?: TopicSortOrder;
  skip?: number;
  limit?: number;
}): Promise<{ topics: ForumTopic[] }> {
  const token = await getAuthToken();
  
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.skip !== undefined) searchParams.set('skip', params.skip.toString());
  if (params?.limit !== undefined) searchParams.set('limit', params.limit.toString());
  
  const queryString = searchParams.toString();
  const url = `${API_URL}/api/forum/topics${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status}`);
  }
  
  return response.json();
}

// Get a specific topic with messages
export async function getTopic(
  topicId: number,
  sortMessages?: MessageSortOrder
): Promise<TopicWithMessages> {
  const token = await getAuthToken();
  
  const searchParams = new URLSearchParams();
  if (sortMessages) searchParams.set('sort_messages', sortMessages);
  
  const queryString = searchParams.toString();
  const url = `${API_URL}/api/forum/topics/${topicId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Topic not found');
    }
    throw new Error(`Failed to fetch topic: ${response.status}`);
  }
  
  return response.json();
}

// Create a new topic
export async function createTopic(data: {
  title: string;
  content: string;
  category: string;
}): Promise<ForumTopic> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/topics`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Invalid category');
    }
    throw new Error(`Failed to create topic: ${response.status}`);
  }
  
  return response.json();
}

// Create a reply message
export async function createMessage(
  topicId: number,
  data: {
    content: string;
    diagram?: Record<string, unknown>;
    parent_id?: number | null;
  }
): Promise<ForumMessage> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/topics/${topicId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: data.content,
      diagram: data.diagram,
      parent_id: data.parent_id ?? null,
    }),
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Topic not found');
    }
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create message');
    }
    throw new Error(`Failed to create message: ${response.status}`);
  }
  
  return response.json();
}

// Delete a topic
export async function deleteTopic(topicId: number): Promise<void> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/topics/${topicId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Topic not found');
    }
    if (response.status === 403) {
      throw new Error('Not authorized to delete this topic');
    }
    throw new Error(`Failed to delete topic: ${response.status}`);
  }
}

// Delete a message
export async function deleteMessage(messageId: number): Promise<void> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Message not found');
    }
    if (response.status === 403) {
      throw new Error('Not authorized to delete this message');
    }
    throw new Error(`Failed to delete message: ${response.status}`);
  }
}

// Vote on a topic or message
export async function vote(data: {
  topic_id?: number;
  message_id?: number;
}): Promise<VoteResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/forum/vote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Either topic_id or message_id is required');
    }
    throw new Error(`Failed to vote: ${response.status}`);
  }
  
  return response.json();
}

// Get user's votes
export async function getUserVotes(params?: {
  topic_ids?: number[];
  message_ids?: number[];
}): Promise<UserVotes> {
  const token = await getAuthToken();
  
  const searchParams = new URLSearchParams();
  if (params?.topic_ids?.length) {
    searchParams.set('topic_ids', params.topic_ids.join(','));
  }
  if (params?.message_ids?.length) {
    searchParams.set('message_ids', params.message_ids.join(','));
  }
  
  const queryString = searchParams.toString();
  const url = `${API_URL}/api/forum/user/votes${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user votes: ${response.status}`);
  }
  
  return response.json();
}
