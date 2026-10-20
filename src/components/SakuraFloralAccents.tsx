import React from 'react'

// Elegant Cherry Blossom Corner Branch (Cành đào uốn lượn điểm góc thiệp)
export function SakuraBranchCorner({
  className = '',
  position = 'top-right'
}: {
  className?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}) {
  const isRight = position.includes('right')
  const isBottom = position.includes('bottom')

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none z-0 select-none overflow-hidden ${
        isRight ? 'right-0' : 'left-0'
      } ${isBottom ? 'bottom-0' : 'top-0'} ${
        isRight ? '' : 'scale-x-[-1]'
      } ${isBottom ? 'scale-y-[-1]' : ''} ${className}`}
      style={{ width: '160px', height: '140px' }}
    >
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-75 drop-shadow-[0_2px_8px_rgba(244,114,182,0.35)]"
      >
        <defs>
          {/* Branch Wood Gradient */}
          <linearGradient id="branchGrad" x1="160" y1="0" x2="40" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#452329" />
            <stop offset="50%" stopColor="#6e3742" />
            <stop offset="100%" stopColor="#301419" />
          </linearGradient>

          {/* Blossom Petal Gradient */}
          <radialGradient id="petalGrad1" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="45%" stopColor="#f472b6" />
            <stop offset="90%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#ffffff" />
          </radialGradient>

          <radialGradient id="petalGrad2" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="55%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#fff1f2" />
          </radialGradient>

          {/* Stamen Center Glow */}
          <radialGradient id="stamenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="60%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Main Curved Branch */}
        <path
          d="M165 0 C140 18, 110 32, 85 46 C60 60, 42 78, 28 105 C20 120, 15 135, 12 142"
          stroke="url(#branchGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Sub-branch 1 */}
        <path
          d="M110 32 C95 24, 75 22, 60 26"
          stroke="url(#branchGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Sub-branch 2 */}
        <path
          d="M60 60 C52 75, 45 88, 42 98"
          stroke="url(#branchGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Main Full Blossom at branch junction (x: 88, y: 44) */}
        <g transform="translate(88, 44)">
          {/* 5 Petals with realistic notches */}
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <path
              key={idx}
              transform={`rotate(${angle})`}
              d="M0 0 C -7 -10, -9 -18, -4 -22 C -2 -24, 0 -21, 0 -19 C 0 -21, 2 -24, 4 -22 C 9 -18, 7 -10, 0 0 Z"
              fill="url(#petalGrad1)"
              stroke="#fb7185"
              strokeWidth="0.4"
            />
          ))}
          {/* Golden Pistil & Stamens */}
          <circle cx="0" cy="0" r="3.5" fill="url(#stamenGlow)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((ang * Math.PI) / 180) * 5.5}
              y2={Math.sin((ang * Math.PI) / 180) * 5.5}
              stroke="#fbbf24"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Secondary Blossom (x: 58, y: 26) */}
        <g transform="translate(58, 26) scale(0.72) rotate(-20)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <path
              key={idx}
              transform={`rotate(${angle})`}
              d="M0 0 C -7 -10, -9 -18, -4 -22 C -2 -24, 0 -21, 0 -19 C 0 -21, 2 -24, 4 -22 C 9 -18, 7 -10, 0 0 Z"
              fill="url(#petalGrad2)"
              stroke="#f472b6"
              strokeWidth="0.4"
            />
          ))}
          <circle cx="0" cy="0" r="3" fill="#fef08a" />
        </g>

        {/* Side Blossom (x: 28, y: 104) */}
        <g transform="translate(28, 104) scale(0.65) rotate(45)">
          {[0, 72, 144, 216, 288].map((angle, idx) => (
            <path
              key={idx}
              transform={`rotate(${angle})`}
              d="M0 0 C -7 -10, -9 -18, -4 -22 C -2 -24, 0 -21, 0 -19 C 0 -21, 2 -24, 4 -22 C 9 -18, 7 -10, 0 0 Z"
              fill="url(#petalGrad1)"
              stroke="#fb7185"
              strokeWidth="0.4"
            />
          ))}
          <circle cx="0" cy="0" r="2.8" fill="#fde047" />
        </g>

        {/* Buds and loose petals */}
        {/* Bud 1 */}
        <ellipse cx="120" cy="18" rx="4" ry="2.5" transform="rotate(-30 120 18)" fill="#fb7185" />
        <ellipse cx="119" cy="17" rx="2" ry="1.2" transform="rotate(-30 119 17)" fill="#4c1d24" />
        {/* Bud 2 */}
        <ellipse cx="40" cy="72" rx="3.5" ry="2" transform="rotate(40 40 72)" fill="#fda4af" />

        {/* Loose drifting single petals */}
        <path
          d="M 125 55 C 122 51, 120 46, 124 43 C 126 42, 128 44, 128 45 C 128 44, 130 42, 131 43 C 135 46, 133 51, 125 55 Z"
          fill="url(#petalGrad1)"
          opacity="0.8"
          transform="rotate(25 125 55) scale(0.85)"
        />
        <path
          d="M 75 90 C 72 87, 70 82, 74 80 C 75 79, 76 81, 76 82 C 76 81, 78 79, 79 80 C 82 82, 81 87, 75 90 Z"
          fill="url(#petalGrad2)"
          opacity="0.85"
          transform="rotate(-15 75 90) scale(0.75)"
        />
      </svg>
    </div>
  )
}

// Traditional Vermilion Seal Stamp (Con Dấu Triện Son Cát Tường 20-10)
export function SakuraSealStamp({
  label = '20-10',
  sublabel = 'CÁT TƯỜNG',
  className = ''
}: {
  label?: string
  sublabel?: string
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`inline-flex flex-col items-center justify-center p-2 rounded-xl border-2 border-red-500/80 bg-gradient-to-br from-red-900/60 to-rose-950/70 shadow-[0_0_12px_rgba(239,68,68,0.35)] select-none rotate-[-4deg] hover:rotate-0 transition-transform duration-300 ${className}`}
      style={{
        width: '58px',
        height: '58px',
        boxShadow: 'inset 0 0 6px rgba(239, 68, 68, 0.4), 0 2px 10px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="w-full h-full border border-dashed border-red-400/60 rounded-lg flex flex-col items-center justify-center p-0.5">
        <span className="text-[11px] font-bold tracking-tighter text-red-300 leading-tight font-serif drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {label}
        </span>
        <div className="w-6 h-[1px] bg-red-400/60 my-0.5" />
        <span className="text-[7px] font-semibold tracking-wider text-red-200/90 uppercase leading-none">
          {sublabel}
        </span>
      </div>
    </div>
  )
}
