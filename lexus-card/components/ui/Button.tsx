import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 text-caption uppercase tracking-wide font-medium transition-colors duration-700 ease-luxe select-none rounded-xs min-h-[48px]';

const variants: Record<Variant, string> = {
  // Solid ink with a crimson underline that draws on hover.
  primary: 'bg-ink text-white hover:bg-graphite',
  // Hairline outline on light surfaces.
  secondary:
    'border border-[var(--hairline)] text-ink hover:border-ink bg-transparent',
  // On dark surfaces.
  ghost: 'border border-white/30 text-white hover:border-white bg-transparent',
};

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  download,
  ...rest
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  download?: boolean | string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-7 bottom-3 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-luxe group-hover:scale-x-100"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} download={download} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
