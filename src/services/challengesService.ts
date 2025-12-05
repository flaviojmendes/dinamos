// Clehallenges API Service
const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface Challenge {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  difficulty: string;
  category: string;
  order: number;
  evaluation_prompt?: string;
  initial_requirements?: string;
  video_solution_url?: string;
  video_solution_release_date?: string;
  attempts_count?: number;
}

// Get auth token from Firebase
async function getAuthToken(): Promise<string> {
  const { auth } = await import('../config/firebase');
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.getIdToken();
}

// Get all available challenges
export async function getChallenges(): Promise<{ challenges: Challenge[] }> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/challenges`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch challenges: ${response.status}`);
  }
  
  return response.json();
}

// Get a specific challenge by ID
export async function getChallenge(challengeId: string): Promise<Challenge> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/api/challenges/${challengeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Challenge not found');
    }
    throw new Error(`Failed to fetch challenge: ${response.status}`);
  }
  
  return response.json();
}

