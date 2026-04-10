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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white/98 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              장바구니 추가 완료
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h3>
            <p className="text-base leading-relaxed text-slate-600">{description}</p>
          </div>

          <button
            type="button"
            aria-label="토스트 닫기"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" size="lg" onClick={onClose}>
            닫기
          </Button>
          {actionLabel && actionHref ? (
            <Link to={actionHref}>
              <Button size="lg" className="min-w-36" onClick={onClose}>
                {actionLabel}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};
