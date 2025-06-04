'use client';

import { useState, useRef } from 'react';

interface EditableContentProps {
  content: any;
  onSave: (newContent: string) => void;
  className?: string;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
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

  // Setup textarea when entering edit mode
  const setupTextarea = (textarea: HTMLTextAreaElement) => {
    setText(content);
    textarea.focus();
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="relative group">
      {isEditing ? (
        <textarea
          ref={(textarea) => {
            textareaRef.current = textarea;
            if (textarea) {
              setupTextarea(textarea);
            }
          }}
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
