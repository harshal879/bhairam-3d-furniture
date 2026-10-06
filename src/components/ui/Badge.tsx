import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'default' | 'accent' | 'success'
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const tones = {
    default: 'bg-stone-100 text-stone-700',
    accent: 'bg-sand text-walnut',
    success: 'bg-emerald-50 text-emerald-800',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-sm ${tones[tone]}`}>
      {children}
    </span>
  )
}
