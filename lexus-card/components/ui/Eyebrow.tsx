import { ReactNode } from 'react';

/** Wide-tracked uppercase label that precedes most headings (§4). */
export function Eyebrow({
  children,
  className = '',
  tone = 'slate',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'slate' | 'silver';
}) {
  const color = tone === 'silver' ? 'text-silver' : 'text-slate';
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${color} ${className}`}>
      <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
