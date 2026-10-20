import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Volume2, VolumeX, Heart, X, CircleHelp, Maximize2, Minimize2 } from 'lucide-react'

interface UIOverlayProps {
  onEnter: () => void
  onHome: () => void
  onWish: () => void
  isWishing: boolean
  isMusicOn: boolean
  onToggleMusic: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export function UIOverlay({ onHome, isMusicOn, onToggleMusic, isFullscreen, onToggleFullscreen }: UIOverlayProps) {
  const [showHelp, setShowHelp] = useState(false)
  const reduced = useReducedMotion()
  const entrance = {
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.65 },
  }
  return (
    <div className="experience-overlay">
      <motion.header className="experience-header" {...entrance}>
        <button className="brand-lockup" onClick={() => { onHome() }} aria-label="Về đầu con đường">
          <span className="brand-symbol"><Heart size={20} strokeWidth={1.4} /></span>
          <span><strong>Sanctuary <span>20.10</span></strong><small>DÀNH CHO NHỮNG ĐIỀU ĐẸP NHẤT</small></span>
        </button>
        <div className="header-tools">
          <span className="occasion-label">NGÀY PHỤ NỮ VIỆT NAM</span>
          <button className="icon-control" onClick={() => setShowHelp(!showHelp)} aria-label="Hướng dẫn khám phá" aria-expanded={showHelp}><CircleHelp size={19} /></button>
          <button className="icon-control" onClick={onToggleMusic} aria-label={isMusicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền'} aria-pressed={isMusicOn}>
            {isMusicOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button className="icon-control" onClick={onToggleFullscreen} aria-label={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"} title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>{isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}</button>
        </div>
      </motion.header>
      <AnimatePresence>
      {showHelp && (
        <motion.aside className="explore-help" aria-label="Hướng dẫn khám phá" {...entrance} exit={{ opacity: 0, y: reduced ? 0 : -8 }}>
          <button className="icon-control" aria-label="Đóng hướng dẫn" onClick={() => setShowHelp(false)}><X size={18} /></button>
          <h2>Một chuyến đi nhỏ,<br />thật nhiều yêu thương.</h2>
          <p>Kéo chuột hoặc vuốt để nhìn xung quanh 360°. Cuộn chuột để tiến tới và xem lời chúc.</p>
          <p>Quả cầu pha lê là điểm nhấn của khu vườn. Nhấn biểu tượng âm thanh để phát bài nhạc từ file của bạn.</p>
          <p className="asset-credit">
            Cây 3D: <a href="https://sketchfab.com/3d-models/sakura-tree-01-low-poly-model-147ae7d0d332456a99ec6195e9b0cd4f" target="_blank" rel="noreferrer">Sakura Tree 01</a>
            {' '}của <a href="https://sketchfab.com/thejogoss9" target="_blank" rel="noreferrer">Jogoss</a>
            {' '}· <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.
            {' '}Đã chỉnh tỷ lệ và cách hiển thị vật liệu hoa.
          </p>
        </motion.aside>
      )}
      </AnimatePresence>

    </div>
  )
}
