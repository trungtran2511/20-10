import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { Scene } from './components/Scene'
import { UIOverlay } from './components/UIOverlay'
import { WishModal } from './components/WishModal'
import { PillarModal } from './components/PillarModal'
import { WISH_CARDS, WishCard } from './data/wishes'

export default function App() {
  const [flyTargetZ, setFlyTargetZ] = useState<number | null>(null)
  const [scrollMessageStep, setScrollMessageStep] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [entered, setEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMusicOn, setIsMusicOn] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const toggleMusic = () => { const audio = audioRef.current; if (!audio) return; if (!audio.paused) { audio.pause(); return }; audio.play().catch(console.warn) }
  const toggleFullscreen = () => { if (document.fullscreenElement) document.exitFullscreen().catch(console.warn); else document.documentElement.requestFullscreen?.().catch(console.warn) }
  useEffect(() => { const update = () => setIsFullscreen(Boolean(document.fullscreenElement)); document.addEventListener("fullscreenchange", update); return () => document.removeEventListener("fullscreenchange", update) }, [])
  const enterGarden = () => { setEntered(true); audioRef.current?.play().catch(console.warn) }
  const { progress, active, total } = useProgress()
  const handleJourneyPosition = useCallback((z: number) => {
    setScrollMessageStep(z > 29 ? 0 : z > 22.75 ? 1 : z > 18.5 ? 2 : z > 14 ? 3 : z > 8 ? 4 : 5)
  }, [])
  useEffect(() => {
    if (!sceneReady || active || (total > 0 && progress < 100)) return
    const id = window.setTimeout(() => setLoaded(true), 350)
    return () => window.clearTimeout(id)
  }, [sceneReady, active, progress, total])
  const [currentWish, setCurrentWish] = useState<WishCard | null>(null)
  const [selectedPillar, setSelectedPillar] = useState<any | null>(null)
  const [isWishing, setIsWishing] = useState(false)
  const wishTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeWish = useCallback(() => {
    if (wishTimer.current) clearTimeout(wishTimer.current)
    wishTimer.current = null
    setIsWishing(false)
    setCurrentWish(null)
  }, [])
  useEffect(() => () => {
    if (wishTimer.current) clearTimeout(wishTimer.current)
  }, [])

  // Draw a randomized 20-10 blessing card
  const handleDrawWish = useCallback(() => {
    if (wishTimer.current) return
    setIsWishing(true)
    wishTimer.current = setTimeout(() => {
      wishTimer.current = null
      setIsWishing(false)
      const randomIdx = Math.floor(Math.random() * WISH_CARDS.length)
      setCurrentWish(WISH_CARDS[randomIdx])
    }, 600)
  }, [])

  // Enter from Gateway into Grand Exhibition Hall
  const handleEnterHall = useCallback(() => {
    setFlyTargetZ(5.2) // Fly smoothly to the Crystal Sphere
  }, [])

  const handleFlyComplete = useCallback(() => {
    setFlyTargetZ(null)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
    <main className="relative w-full h-dvh overflow-hidden bg-[#060309] select-none">
      {/* 3D Canvas Scene with Pure Mouse Drag & Click */}
      <Scene
        flyTargetZ={flyTargetZ}
        onFlyComplete={handleFlyComplete}
        onEnterHall={handleEnterHall}
        onSelectPillar={setSelectedPillar}
        onShakeSphere={() => {}}
        onDrawWish={handleDrawWish}
        isWishing={isWishing}
        controlsEnabled={entered && !currentWish && !selectedPillar}
        onJourneyPosition={handleJourneyPosition}
        onSceneReady={() => setSceneReady(true)}
      />

      <audio ref={audioRef} src="/audio/ngon-gio-dem-nay.mp3" preload="auto" loop onPlay={() => setIsMusicOn(true)} onPause={() => setIsMusicOn(false)} />
      {/* Minimalistic Non-intrusive Overlay (Brand & Audio only) */}
      <UIOverlay
        onEnter={handleEnterHall}
        onHome={() => { setFlyTargetZ(33); setScrollMessageStep(0) }}
        onWish={handleDrawWish}
        isWishing={isWishing}
        isMusicOn={isMusicOn}
        onToggleMusic={toggleMusic}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5" aria-live="polite">
        <AnimatePresence mode="wait">
          {[2, 4].includes(scrollMessageStep) && (
            <div key={scrollMessageStep} className="scroll-wish-message" role="status">
              <div className="wish-ornament" aria-hidden="true"><span />✦<span /></div>
              <p className="wish-overline">GỬI CẬU MỘT CHÚT DỊU DÀNG</p>
              {scrollMessageStep === 2 ? (
                <p className="wish-main">20/10 <em>vui vẻ nhé,</em><br />mong nụ cười luôn ở trên môi cậu.</p>
              ) : (
                <p className="wish-main">Tớ luôn mong cậu được <em>yêu thương,</em><br />bình yên và hạnh phúc mỗi ngày.</p>
              )}
              <div className="wish-ornament wish-bottom" aria-hidden="true"><span />♡<span /></div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {entered && (scrollMessageStep === 1 || scrollMessageStep === 3) && (
        <div key={scrollMessageStep} className="journey-marker" role="status">
          <span className="journey-marker-icon">✦</span>
          <div><small>{scrollMessageStep === 1 ? "MỐC LỜI CHÚC 01" : "MỐC LỜI CHÚC 02"}</small><p>{scrollMessageStep === 1 ? "Phía trước có một lời nhắn dành cho cậu" : "Còn một điều tớ muốn gửi đến cậu"}</p><span>Cuộn tiếp để khám phá ↓</span></div>
        </div>
      )}

      {entered && <nav className="journey-progress" aria-label="Các mốc hành trình">{["Toàn cảnh", "Lời chúc 01", "Lời chúc 02", "Pha lê"].map((label, i) => { const reached = i === 0 || (i === 1 && scrollMessageStep >= 1) || (i === 2 && scrollMessageStep >= 3) || (i === 3 && scrollMessageStep >= 5); return <div key={label} className={`journey-progress-stop ${reached ? "reached" : ""} ${((i === 0 && scrollMessageStep === 0) || (i === 1 && [1,2].includes(scrollMessageStep)) || (i === 2 && [3,4].includes(scrollMessageStep)) || (i === 3 && scrollMessageStep === 5)) ? "current" : ""}`}><span className="journey-progress-dot" /><span>{label}</span></div> })}</nav>}

      {!entered && (
        <div className="garden-loading" role="status" aria-live="polite">
          <div className="garden-loading-mark">✿</div>
          <p className="garden-loading-title">Một khu vườn dành cho cậu</p>
          <p className="garden-loading-subtitle">{loaded ? "Khu vườn đã sẵn sàng" : "Đang chuẩn bị những điều dịu dàng..."}</p>
          {!loaded && <><div className="garden-loading-track"><div style={{ width: `${Math.round(progress)}%` }} /></div><span>{Math.round(progress)}%</span></>}
          <div className="garden-instructions"><p><span className="garden-instruction-icon">↔</span><span>Nhẹ nhàng kéo chuột để ngắm nhìn khu vườn.</span></p><p><span className="garden-instruction-icon">↕</span><span>Cuộn chuột để khám phá từng lời nhắn nhỏ.</span></p><p><span className="garden-instruction-icon">♫</span><span>Một giai điệu sẽ cất lên khi cậu bước vào.</span></p><p><span className="garden-instruction-icon">⛶</span><span>Thử chế độ toàn màn hình để tận hưởng trọn vẹn nhé.</span></p></div>
          <button className="garden-enter-button" disabled={!loaded} onClick={enterGarden}>{loaded ? "Bước vào khu vườn →" : "Đang tải khu vườn..."}</button>
        </div>
      )}

      {/* Popups & Modals triggered directly by clicking 3D Objects */}
      <AnimatePresence>
      {currentWish && <WishModal
        key="wish"
        card={currentWish}
        onClose={closeWish}
        onDrawAnother={handleDrawWish}
      />}

      {selectedPillar && <PillarModal
        key="pillar"
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
      />}

      </AnimatePresence>
    </main>
    </MotionConfig>
  )
}
