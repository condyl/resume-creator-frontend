import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  style = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      adjustHeight(inputRef.current);
    }
  }, [isEditing]);

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue !== value) {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (inputRef.current) {
      adjustHeight(inputRef.current);
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none px-1 w-full resize-none overflow-hidden',
          className
        )}
        style={{
          ...style,
          minHeight: '1.2em',
          maxHeight: '10em'
        }}
        placeholder={placeholder}
        rows={1}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'cursor-text inline-block hover:bg-gray-100/50 rounded px-1 -mx-1 min-w-[1em] min-h-[1em] whitespace-pre-wrap break-words',
        !value && 'text-gray-400 italic',
        className
      )}
      style={style}
    >
      {value || placeholder}
    </span>
  );
}; 