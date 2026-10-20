import { X, Heart } from 'lucide-react'
import { AnimatedDialog } from './AnimatedDialog'
import { SakuraBranchCorner } from './SakuraFloralAccents'
import { SakuraModalPetals } from './SakuraModalPetals'

interface PillarItem {
  id: number
  title: string
  sub: string
  quote: string
  color: string
}

interface PillarModalProps {
  pillar: PillarItem | null
  onClose: () => void
}

export function PillarModal({ pillar, onClose }: PillarModalProps) {
  if (!pillar) return null

  return (
    <AnimatedDialog onClose={onClose} label={pillar.title}>
      <div className="relative w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-[#14081c]/95 border border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.3)] text-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden backdrop-blur-2xl">
        {/* Sakura petals floating in background */}
        <SakuraModalPetals count={26} />

        {/* Sakura Branch Corner */}
        <SakuraBranchCorner position="top-right" className="opacity-80 -top-3 -right-3 scale-80" />

        <button
          aria-label="Đóng thông tin"
          onClick={onClose}
          className="relative z-20 absolute top-4 right-4 p-2 rounded-full text-pink-300/70 hover:text-white hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: `${pillar.color}25`, border: `1px solid ${pillar.color}60` }}>
          <Heart size={20} style={{ color: pillar.color }} />
        </div>

        <div className="relative z-10 text-xs uppercase tracking-widest text-pink-300/70 font-semibold mb-1">
          {pillar.sub}
        </div>
        <h3 className="relative z-10 text-2xl font-serif font-bold text-white mb-3" style={{ color: pillar.color }}>
          {pillar.title}
        </h3>

        <p className="relative z-10 text-base font-display italic text-pink-100 leading-relaxed mb-6">
          "{pillar.quote}"
        </p>

        <button
          onClick={onClose}
          className="relative z-10 w-full py-2.5 rounded-xl bg-pink-500/25 hover:bg-pink-500/35 text-pink-200 text-sm font-medium border border-pink-500/40 transition-colors shadow-lg shadow-pink-950/50"
        >
          Đóng
        </button>
      </div>
    </AnimatedDialog>
  )
}
