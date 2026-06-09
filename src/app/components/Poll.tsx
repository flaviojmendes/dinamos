import { useState, useMemo } from 'react';
import { Poll as PollType } from '../types';
import { apiClient } from '../utils/api';
import { TacticalButton } from '../../components/tactical';

interface PollProps {
  poll: PollType;
  onPollUpdate?: (poll: PollType) => void;
  canManage?: boolean;
}

const Poll = ({ poll, onPollUpdate, canManage = false }: PollProps) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>(poll.user_votes || []);
  const [isVoting, setIsVoting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);

  // Determine if poll has ended
  const hasEnded = useMemo(() => {
    if (localPoll.ends_at) {
      return new Date(localPoll.ends_at) < new Date();
    }
    return false;
  }, [localPoll.ends_at]);

  // Determine if voting is allowed
  const canVote = !localPoll.is_closed && !hasEnded;
  
  // Check if user has voted
  const hasVoted = localPoll.user_votes && localPoll.user_votes.length > 0;
  
  // Show results if user has voted, poll is closed, or poll has ended
  const showResults = hasVoted || localPoll.is_closed || hasEnded;

  const handleOptionClick = (optionId: number) => {
    if (!canVote) return;
    
    if (localPoll.allow_multiple) {
      // Toggle selection for multiple choice
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // Single choice - replace selection
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || !canVote) return;
    
    setIsVoting(true);
    try {
      const response = await apiClient.post(`/api/forum/polls/${localPoll.id}/vote`, {
        option_ids: selectedOptions
      });
      const updatedPoll = response.data;
      setLocalPoll(updatedPoll);
      setSelectedOptions(updatedPoll.user_votes || []);
      onPollUpdate?.(updatedPoll);
    } catch (error: any) {
      console.error('Error voting:', error);
      alert(error.response?.data?.detail || 'Erro ao votar');
    } finally {
      setIsVoting(false);
    }
  };

  const handleClosePoll = async () => {
    if (!canManage) return;
    
    if (!window.confirm('Tem certeza que deseja encerrar esta enquete? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    setIsClosing(true);
    try {
      const response = await apiClient.put(`/api/forum/polls/${localPoll.id}/close`);
      const updatedPoll = response.data;
      setLocalPoll(updatedPoll);
      onPollUpdate?.(updatedPoll);
    } catch (error: any) {
      console.error('Error closing poll:', error);
      alert(error.response?.data?.detail || 'Erro ao encerrar enquete');
    } finally {
      setIsClosing(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!localPoll.ends_at) return null;
    const endDate = new Date(localPoll.ends_at);
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Encerrada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h restantes`;
    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
  };

  return (
    <div className="tactical-panel p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg border border-signal-cyan/40 bg-signal-cyan/10">
            <svg className="w-5 h-5 text-brand-600 dark:text-signal-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <span className="font-sans text-xs text-brand-600 dark:text-signal-cyan">
              Enquete
            </span>
            {localPoll.allow_multiple && (
              <span className="ml-2 text-xs text-slate-500 dark:text-tactical-label">
                (múltipla escolha)
              </span>
            )}
          </div>
        </div>
        
        {/* Status badges */}
        <div className="flex items-center gap-2">
          {localPoll.is_closed && (
            <span className="rounded-full border border-slate-300 dark:border-tactical-line px-2 py-0.5 text-slate-500 dark:text-tactical-label text-xs font-sans">
              Encerrada
            </span>
          )}
          {hasEnded && !localPoll.is_closed && (
            <span className="rounded-full border border-signal-amber/40 text-signal-amber bg-signal-amber/10 px-2 py-0.5 text-xs font-sans">
              Expirada
            </span>
          )}
          {!localPoll.is_closed && !hasEnded && localPoll.ends_at && (
            <span className="rounded-full border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 px-2 py-0.5 text-xs font-sans">
              ⏱ {formatTimeRemaining()}
            </span>
          )}
        </div>
      </div>

      {/* Question */}
      <h4 className="text-lg font-semibold text-slate-900 dark:text-tactical-text mb-4">
        {localPoll.question}
      </h4>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {localPoll.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isUserVote = localPoll.user_votes?.includes(option.id);
          const percentage = option.percentage || 0;
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={!canVote}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all relative overflow-hidden
                ${canVote ? 'cursor-pointer hover:border-signal-green/60' : 'cursor-default'}
                ${isSelected 
                  ? 'border-signal-green bg-signal-green/10 dark:bg-signal-green/10' 
                  : 'border-slate-200 dark:border-tactical-border bg-white dark:bg-tactical-surface'
                }
                ${isUserVote && !isSelected ? 'ring-1 ring-signal-green/40' : ''}
              `}
            >
              {/* Progress bar (visible when showing results) */}
              {showResults && (
                <div className="absolute inset-y-0 left-0 w-full pointer-events-none">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${
                      isUserVote ? 'seg-bar text-signal-green' : 'bg-slate-100 dark:bg-tactical-raised'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Checkbox/Radio indicator */}
                  <div className={`
                    w-5 h-5 ${localPoll.allow_multiple ? 'rounded-sm' : 'rounded-full'} border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected 
                      ? 'border-signal-green bg-signal-green text-white' 
                      : 'border-slate-300 dark:border-tactical-line'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <span className={`font-medium ${isUserVote ? 'text-brand-600 dark:text-signal-green' : 'text-slate-800 dark:text-tactical-text'}`}>
                    {option.text}
                  </span>
                  
                  {isUserVote && (
                    <span className="text-xs text-brand-600 dark:text-signal-green font-sans">
                      (seu voto)
                    </span>
                  )}
                </div>
                
                {/* Vote count and percentage */}
                {showResults && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-tactical-dim">
                      {option.vote_count || 0} {(option.vote_count || 0) === 1 ? 'voto' : 'votos'}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-tactical-text min-w-[3rem] text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-tactical-border">
        <div className="text-sm text-slate-500 dark:text-tactical-dim font-mono tabular-nums">
          {localPoll.total_votes} {localPoll.total_votes === 1 ? 'voto total' : 'votos totais'}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Vote button */}
          {canVote && selectedOptions.length > 0 && (
            <TacticalButton
              variant="primary"
              onClick={handleVote}
              disabled={isVoting}
              className="flex items-center gap-2"
            >
              {isVoting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Votando...
                </>
              ) : hasVoted ? (
                'Atualizar voto'
              ) : (
                'Votar'
              )}
            </TacticalButton>
          )}
          
          {/* Close poll button (for owner/admin) */}
          {canManage && !localPoll.is_closed && (
            <TacticalButton
              variant="danger"
              size="sm"
              onClick={handleClosePoll}
              disabled={isClosing}
            >
              {isClosing ? 'Encerrando...' : 'Encerrar enquete'}
            </TacticalButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Poll;
