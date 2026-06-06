import React, { useRef, useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

export interface InlineEditRowProps {
  validate?: (value: string) => string | null;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  inputType?: 'text' | 'tel' | 'number';
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel';
  placeholder?: string;
  isEditing?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

export const InlineEditRow: React.FC<InlineEditRowProps> = ({
  label,
  value,
  onSave,
  inputType = 'text',
  inputMode,
  placeholder,
  isEditing: controlledIsEditing,
  onEditStart,
  onEditEnd,
  validate,
}) => {
  const [internalEditing, setInternalEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = controlledIsEditing !== undefined ? controlledIsEditing : internalEditing;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    if (validate) {
      const err = validate(inputValue);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    onSave(inputValue);
    if (controlledIsEditing === undefined) {
      setInternalEditing(false);
    }
    onEditEnd?.();
  };

  const handleDone = () => {
    if (validate) {
      const err = validate(inputValue);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    onSave(inputValue);
    if (controlledIsEditing === undefined) {
      setInternalEditing(false);
    }
    onEditEnd?.();
  };

  const startEdit = () => {
    if (controlledIsEditing === undefined) {
      setInternalEditing(true);
    }
    onEditStart?.();
  };

  return (
    <div
      className="min-h-[52px] flex items-center justify-between border-b border-[#F3F4F6]"
      onClick={!isEditing ? startEdit : undefined}
    >
      <span className="text-sm font-medium text-[#374151]">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type={inputType}
              inputMode={inputMode}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`text-base text-right min-w-[120px] bg-transparent border-none outline-none p-0 ${error ? 'text-[#DC2626]' : 'text-[#111827]'}`}
            />
            <button
              onClick={handleDone}
              className={`text-[13px] font-semibold underline underline-offset-2 ${error ? 'text-[#DC2626]' : 'text-[#111827]'}`}
            >
              {error ? 'Invalid' : 'Done'}
            </button>
            {error && <span className="text-[11px] text-[#DC2626] ml-1">{error}</span>}
          </>
        ) : (
          <>
            <span className="text-base font-medium text-[#111827]">{value}</span>
            <Pencil size={14} color="#9CA3AF" />
          </>
        )}
      </div>
    </div>
  );
};
