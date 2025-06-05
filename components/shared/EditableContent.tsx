'use client';

import { useRef } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setIsEditing(false);
    if (textarea.value !== content) {
      onSave(textarea.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.value = content;
      }
      setIsEditing(false);
    }
  };

  // Setup textarea when entering edit mode
  const setupTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    textarea.value = content;
    textarea.focus();
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textareaRef.current = textarea;
  };

  return (
    <div className="relative group">
      {isEditing ? (
        <textarea
          ref={setupTextarea}
          onChange={() => {}} // Controlled by ref, not state
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
