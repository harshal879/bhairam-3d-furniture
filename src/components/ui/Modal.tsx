import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'relative z-10 w-full bg-cream shadow-xl animate-fade-up',
          'rounded-t-lg sm:rounded-sm max-h-[92vh] overflow-y-auto',
          wide ? 'sm:max-w-3xl' : 'sm:max-w-lg',
        ].join(' ')}
      >
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-cream border-b border-stone-200">
          <h3 className="font-display text-xl text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-sm hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
