import React, { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, X, Share2, RefreshCw } from 'lucide-react'
import type { WishCard } from '../data/wishes'
import { soundManager } from '../utils/audio'
import { AnimatedDialog } from './AnimatedDialog'
import { SakuraBranchCorner, SakuraSealStamp } from './SakuraFloralAccents'
import { SakuraModalPetals } from './SakuraModalPetals'

interface WishModalProps {
  card: WishCard | null
  onClose: () => void
  onDrawAnother: () => void
}

export function WishModal({ card, onClose, onDrawAnother }: WishModalProps) {
  const reduced = useReducedMotion()
  const [shareStatus, setShareStatus] = useState('')
  useEffect(() => {
    setShareStatus('')
    if (card && !reduced) {
      // Trigger burst of celebratory confetti & gold sparkles
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fde047', '#e879f9', '#ffffff']
      })
    }
  }, [card, reduced])

  if (!card) return null

  const handleShare = async () => {
    const text = `🌸 [Lời Chúc 20-10 Từ Quả Cầu Pha Lê]\n✨ ${card.title} - ${card.symbol}\n"${card.blessing}"\n${card.detail}\nChúc mừng Ngày Phụ Nữ Việt Nam 20-10!`
    try {
      await navigator.clipboard.writeText(text)
      setShareStatus('Đã sao chép lời chúc. Bạn có thể gửi qua Zalo hoặc Messenger.')
    } catch {
      setShareStatus('Chưa sao chép được. Hãy cho phép truy cập khay nhớ tạm rồi thử lại.')
    }
  }

  return (
    <AnimatedDialog onClose={onClose} label="Lời chúc dành cho bạn">
      {/* Tarot Card Container */}
      <div className="relative w-full max-w-md p-1 rounded-3xl bg-gradient-to-b from-rose-300/50 via-purple-500/25 to-amber-300/40 shadow-[0_0_60px_rgba(244,114,182,0.35)] animate-in fade-in zoom-in-95 duration-300">
        <div className="relative p-6 sm:p-8 rounded-[22px] bg-[#14081c]/95 border border-pink-400/40 overflow-hidden text-center backdrop-blur-2xl">
          
          {/* Gentle Floating Sakura Petals Canvas in Background */}
          <SakuraModalPetals count={36} />

          {/* Artistic Sakura Branch Accents in Corners */}
          <SakuraBranchCorner position="top-right" className="opacity-90 -top-3 -right-3" />
          <SakuraBranchCorner position="bottom-left" className="opacity-70 -bottom-4 -left-4" />

          {/* Close button */}
          <button
            aria-label="Đóng lời chúc"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full text-pink-300/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Golden Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/90 border border-pink-400/50 text-pink-300 text-xs font-medium tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(244,114,182,0.25)]">
            <Sparkles size={13} className="text-amber-300" />
            <span>🌸 Quẻ Ước Nguyện Hoa Đào</span>
          </div>

          {/* Symbol / Tarot Sigil */}
          <div className="relative z-10 w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-500/25 via-purple-500/35 to-amber-500/25 border border-pink-400/50 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(244,114,182,0.45)]">
            {card.symbol}
          </div>

          {/* Archetype */}
          <div className="relative z-10 text-xs uppercase tracking-widest text-amber-300/90 font-medium mb-1">
            {card.archetype}
          </div>

          {/* Card Title */}
          <h3 className="relative z-10 text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-rose-200 mb-4 drop-shadow-[0_2px_12px_rgba(244,114,182,0.35)] tracking-normal">
            {card.title}
          </h3>

          {/* Blessing Message */}
          <div className="relative z-10 p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 mb-4 backdrop-blur-sm shadow-inner">
            <p className="text-base sm:text-lg font-display italic text-pink-100 leading-relaxed">
              "{card.blessing}"
            </p>
          </div>

          {/* Detail Note & Traditional Red Seal */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-6 text-left px-1">
            <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed flex-1">
              {card.detail}
            </p>
            <SakuraSealStamp label="20-10" sublabel="CÁT TƯỜNG" className="shrink-0 scale-90" />
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={() => {
                soundManager.playWishMagic()
                onDrawAnother()
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-pink-200 text-sm font-medium border border-white/15 transition-all hover:scale-[1.02] active:scale-95"
            >
              <RefreshCw size={15} />
              <span>Rút quẻ khác</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-90 text-white text-sm font-semibold shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Share2 size={15} />
              <span>Gửi lời chúc này</span>
            </button>
          </div>
          <p role="status" className="relative z-10 mt-3 text-xs text-pink-200">{shareStatus}</p>

        </div>
      </div>
    </AnimatedDialog>
  )
}
