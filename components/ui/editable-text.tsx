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
  const [width, setWidth] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update width as user types
  useEffect(() => {
    if (isEditing && hiddenSpanRef.current) {
      const newWidth = hiddenSpanRef.current.offsetWidth;
      setWidth(Math.max(newWidth + 20, 50)); // Add padding and set minimum width
    }
  }, [inputValue, isEditing]);

  const handleDoubleClick = () => {
    // Capture the initial width of the text before entering edit mode
    if (spanRef.current) {
      const styles = window.getComputedStyle(spanRef.current);
      const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const initialWidth = spanRef.current.offsetWidth - padding;
      setWidth(Math.max(initialWidth, 50)); // Set minimum width of 50px
    }
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setWidth(null);
    if (inputValue !== value) {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setIsEditing(false);
      setWidth(null);
    }
  };

  if (isEditing) {
    return (
      <>
        {/* Hidden span to measure text width */}
        <span
          ref={hiddenSpanRef}
          aria-hidden="true"
          className={cn(
            'invisible fixed left-0 top-0 whitespace-pre',
            className
          )}
          style={{
            font: window.getComputedStyle(spanRef.current || document.body).font,
            ...style
          }}
        >
          {inputValue || placeholder}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none px-1',
            className
          )}
          style={{
            width: width ? `${width}px` : 'auto',
            minWidth: '50px',
            ...style
          }}
          placeholder={placeholder}
        />
      </>
    );
  }

  return (
    <span
      ref={spanRef}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'cursor-text inline-block hover:bg-gray-100/50 rounded px-1 -mx-1 min-w-[1em] min-h-[1em]',
        !value && 'text-gray-400 italic',
        className
      )}
      style={style}
    >
      {value || placeholder}
    </span>
  );
}; 