import React from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3 rounded-2xl bg-ink py-2 pl-4 pr-1.5 text-sm text-white shadow-xl"
        >
          {toast.tone === 'success' && <CircleCheck size={18} className="shrink-0 text-emerald-400" />}
          {toast.tone === 'error' && <CircleAlert size={18} className="shrink-0 text-red-400" />}
          {toast.tone === 'info' && <Info size={18} className="shrink-0 text-white/70" />}
          <span className="flex-1 py-1.5 leading-snug">{toast.message}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action!.onClick();
                dismissToast(toast.id);
              }}
              className="shrink-0 rounded-lg px-3 py-2 font-semibold text-white underline underline-offset-4 hover:bg-white/10"
            >
              {toast.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
