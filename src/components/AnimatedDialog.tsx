import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function AnimatedDialog({ children, onClose, label, wide = false }: {
  children: ReactNode
  onClose: () => void
  label: string
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const dialog = ref.current!
    const previous = document.activeElement as HTMLElement | null
    dialog.showModal()
    return () => {
      dialog.close()
      previous?.focus()
    }
  }, [])

  return (
    <motion.dialog
      ref={ref}
      className={`animated-dialog ${wide ? 'animated-dialog-wide' : ''}`}
      aria-label={label}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      initial={{ opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 0.98 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.dialog>
  )
}
