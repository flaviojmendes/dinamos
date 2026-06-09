import { useState } from 'react';
import { apiClient } from '../utils/api';

interface VoteButtonProps {
  id: number;
  type: 'topic' | 'message';
  initialUpvotes: number;
  initialHasVoted?: boolean;
}

export default function VoteButton({ id, type, initialUpvotes, initialHasVoted = false }: VoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation();
    
    if (loading) return;
    setLoading(true);

    try {
      const payload = type === 'topic' ? { topic_id: id } : { message_id: id };
      const response = await apiClient.post('/api/forum/vote', payload);
      
      setUpvotes(response.data.upvotes);
      setHasVoted(response.data.has_voted);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center space-x-1 px-2 py-1 transition-colors ${
        hasVoted
          ? 'text-signal-green'
          : 'text-slate-400 dark:text-tactical-label hover:text-slate-600 dark:hover:text-tactical-dim'
      }`}
      title={hasVoted ? 'Remover voto' : 'Votar'}
    >
      <svg 
        className={`h-5 w-5 ${hasVoted ? 'fill-current' : 'fill-none stroke-current'}`} 
        viewBox="0 0 24 24" 
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
      <span className="font-mono tabular-nums text-sm">{upvotes}</span>
    </button>
  );
}
