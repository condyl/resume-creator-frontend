'use client'

import React, { useState } from 'react';
import { ButtonWithTooltip } from '@/components/ui/button-with-tooltip';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { BASE_URL } from '@/lib/constants';

interface AIImprovementButtonProps {
  text: string;
  onTextImproved: (improvedText: string) => void;
  className?: string;
}

const AIImprovementButton: React.FC<AIImprovementButtonProps> = ({ text, onTextImproved, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleImproveText = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/improve-text`, { text });
      const improvedText = response.data.improvedText;
      onTextImproved(improvedText);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to improve text');
        setShowError(true);
      } else {
        setError('An unexpected error occurred');
        setShowError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showError ? (
        <Popover open={showError} onOpenChange={setShowError}>
          <PopoverTrigger asChild>
            <ButtonWithTooltip 
              type="button" 
              variant="outline" 
              size="icon"
              className={className}
              onClick={handleImproveText} 
              disabled={loading}
              icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              tooltipText="Improve this text using AI"
              ariaLabel="Improve text with AI"
            />
          </PopoverTrigger>
          <PopoverContent className="flex items-center space-x-2 p-4">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm">{error}</p>
          </PopoverContent>
        </Popover>
      ) : (
        <ButtonWithTooltip 
          type="button" 
          variant="outline" 
          size="icon"
          className={className}
          onClick={handleImproveText} 
          disabled={loading}
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          tooltipText="Improve this text using AI"
          ariaLabel="Improve text with AI"
        />
      )}
    </>
  );
};

export default AIImprovementButton;