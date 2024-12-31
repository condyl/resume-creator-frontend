'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { BASE_URL } from '@/lib/constants';

interface AIImprovementButtonProps {
  text: string;
  onTextImproved: (improvedText: string) => void;
  className?: string;
}

const AIImprovementButton: React.FC<AIImprovementButtonProps> = ({ text, onTextImproved, className }) => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImproveText = async () => {
    if (!text) {
      setShowError(true);
      setError('Please provide text to improve.');
      return;
    }

    setLoading(true);
    setShowError(false);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/api/improve-text`, { text }, { headers: { 'Content-Type': 'application/json' } });
      const improvedText = response.data.improvedText;
      if (improvedText.includes("ERROR")) {
        throw new Error("AI returned an error.");
      }
      onTextImproved(improvedText);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error improving text:', error.response.data);
        setError(error.response.data.message || 'Error improving text.');
      } else if (axios.isAxiosError(error)) {
        console.error('Network error:', error.message);
        setError('Network error: ' + error.message);
      } else {
        console.error('Error improving text:', error);
        setError((error as Error).message || 'An unexpected error occurred.');
      }
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip>
      {showError ? (
        <Popover open={showError} onOpenChange={setShowError}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className={className}
                onClick={handleImproveText} 
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <PopoverContent className="flex items-center space-x-2 p-4">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm">{error}</p>
          </PopoverContent>
        </Popover>
      ) : (
        <TooltipTrigger asChild>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            className={className}
            onClick={handleImproveText} 
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
      )}
      <TooltipContent>
        <p className="text-sm">Improve this text using AI</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AIImprovementButton;