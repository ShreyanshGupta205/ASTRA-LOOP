import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation: Escape closes modal, Enter confirms
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Autofocus confirm button for smooth keyboard accessibility
    confirmButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-desc"
      onClick={onCancel}
    >
      <div
        className="bg-[#0c0c0c] border border-[#282828] shadow-2xl max-w-md w-full p-6 space-y-4 font-mono animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 flex items-center justify-center shrink-0 border ${
                isDestructive ? 'bg-red/15 text-red border-red/40' : 'bg-amber/15 text-amber border-amber/40'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3
              id="confirmation-dialog-title"
              className="text-base font-bold text-white font-din uppercase tracking-wide"
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-white/50 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p id="confirmation-dialog-desc" className="text-xs text-white/70 leading-relaxed font-sans">
          {message}
        </p>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#282828]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-din font-bold uppercase tracking-[0.16em] text-white/70 hover:text-white bg-black/60 border border-[#333333] hover:border-white transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-xs font-din font-bold uppercase tracking-[0.16em] transition-all cursor-pointer ${
              isDestructive
                ? 'bg-red text-white hover:brightness-110 shadow-red-glow'
                : 'bg-white text-black hover:bg-neutral-200 shadow-lg'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
