import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm text-stone-600">{label}</span>}
      <textarea
        id={inputId}
        className={[
          'w-full min-h-28 px-3 py-2.5 rounded-sm border border-stone-300 bg-white text-ink resize-y',
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
