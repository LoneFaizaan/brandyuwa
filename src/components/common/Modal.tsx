import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEscapeKey, useLockBodyScroll } from '../../lib/hooks';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Wider dialog on desktop */
  wide?: boolean;
  /** id on the scrollable panel (used for printing receipts) */
  panelId?: string;
  headerActions?: React.ReactNode;
  /** Full-height sheet on phones (search) */
  tall?: boolean;
}

/** Bottom sheet on phones, centred dialog on larger screens. */
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, footer, wide, panelId, headerActions, tall }) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="modal-root fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="modal-backdrop absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`modal-panel relative flex max-h-[92dvh] w-full animate-sheet-up flex-col overflow-hidden rounded-t-3xl bg-canvas shadow-2xl outline-none sm:max-h-[85vh] sm:animate-fade-in sm:rounded-2xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md'
        } ${tall ? 'h-[92dvh] sm:h-auto' : ''}`}
      >
        <div className="modal-header flex items-center justify-between gap-3 border-b border-line py-2 pl-5 pr-2">
          <h2 id={titleId} className="truncate text-lg font-semibold">
            {title}
          </h2>
          <div className="flex items-center">
            {headerActions}
            <button type="button" onClick={onClose} className="icon-btn" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>
        <div id={panelId} className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        {footer && <div className="pb-safe border-t border-line bg-canvas p-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};
