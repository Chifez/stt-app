'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableContentProps {
  content: any;
  onSave: (newContent: string) => void;
  className?: string;
  isEditing: boolean;
  setIsEditing: (e: any) => void;
}

const EditableContent = ({
  content,
  onSave,
  className = '',
  setIsEditing,
  isEditing,
}: EditableContentProps) => {
  const [text, setText] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      setText(content);
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (text !== content) {
      onSave(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(content);
    }
  };

  return (
    <div className="relative group">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`w-full bg-transparent outline-none resize-none ${className}`}
          rows={5}
        />
      ) : (
        <div className="relative">
          <p className={className}>{content}</p>
        </div>
      )}
    </div>
  );
};

export default EditableContent;
