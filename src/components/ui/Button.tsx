import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-cream hover:bg-stone-800 active:bg-stone-900',
  secondary: 'bg-sand text-ink hover:bg-stone-200',
  ghost: 'bg-transparent text-ink hover:bg-stone-100',
  outline: 'bg-transparent border border-stone-300 text-ink hover:border-ink hover:bg-stone-50',
  danger: 'bg-red-700 text-white hover:bg-red-800',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
