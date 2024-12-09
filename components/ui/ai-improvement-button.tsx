import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertTriangle  } from 'lucide-react';
import axios from 'axios';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { BASE_URL } from '@/config';

interface AIImprovementButtonProps {
  text: string;
  onTextImproved: (improvedText: string) => void;
}

// const BASE_URL = 'https://connorsresumebuilder.com'; // Change to 'http://localhost:5000' for local testing

const AIImprovementButton: React.FC<AIImprovementButtonProps> = ({ text, onTextImproved }) => {
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
    <TooltipProvider>
      <Tooltip>
        {showError ? (
          <Popover open={showError} onOpenChange={setShowError}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2" variant={"ghost"} onClick={handleImproveText} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Brain size={16} />}
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <PopoverContent className="flex items-center space-x-2">
              <AlertTriangle className="text-yellow-500" /><p>{error}</p>
            </PopoverContent>
          </Popover>
        ) : (
          <TooltipTrigger asChild>
            <Button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2" variant={"ghost"} onClick={handleImproveText} disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Brain size={16} />}
            </Button>
          </TooltipTrigger>
        )}
        <TooltipContent>
          <p>Improve this text using AI</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AIImprovementButton;