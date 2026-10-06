import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm text-stone-600">{label}</span>}
      <input
        id={inputId}
        className={[
          'w-full h-11 px-3 rounded-sm border border-stone-300 bg-white text-ink',
          'placeholder:text-stone-400 focus:outline-none focus:border-ink transition-colors',
          error ? 'border-red-500' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
