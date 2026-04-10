import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionToastProps {
  open: boolean;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onClose: () => void;
}

export const ActionToast = ({
  open,
  title,
  description,
  actionLabel,
  actionHref,
  onClose,
}: ActionToastProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{description}</p>
        </div>

        <button
          type="button"
          aria-label="토스트 닫기"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          닫기
        </Button>
        {actionLabel && actionHref ? (
          <Link to={actionHref}>
            <Button size="sm" onClick={onClose}>
              {actionLabel}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};
