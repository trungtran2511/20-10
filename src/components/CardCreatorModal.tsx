import { useState, useRef } from 'react'
import { X, Copy, Heart, Check, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { AnimatedDialog } from './AnimatedDialog'
import { useReducedMotion } from 'framer-motion'
import { SakuraBranchCorner, SakuraSealStamp } from './SakuraFloralAccents'
import { SakuraModalPetals } from './SakuraModalPetals'

interface CardCreatorModalProps {
  onClose: () => void
}

const PRESET_MESSAGES: Record<string, string[]> = {
  'Mẹ': [
    'Con kính chúc Mẹ ngày 20-10 ngập tràn niềm vui, dồi dào sức khỏe và luôn an nhiên. Cảm ơn Mẹ đã luôn là điểm tựa ấm áp nhất của con!',
    'Mẹ là người phụ nữ tuyệt vời nhất trong cuộc đời con. Chúc Mẹ luôn rạng ngời nụ cười và hạnh phúc bên gia đình mình.'
  ],
  'Người Yêu / Vợ': [
    'Chúc em ngày 20-10 thật rạng rỡ, xinh đẹp và hạnh phúc. Cảm ơn em đã đến và mang lại cho anh những điều ngọt ngào nhất!',
    'Anh chúc người con gái anh yêu mãi luôn tươi vui, đáng yêu và được yêu thương trọn vẹn mỗi ngày. Yêu em thật nhiều!'
  ],
  'Chị / Em Gái': [
    'Chúc chị/em ngày 20-10 thật vui vẻ, luôn xinh tươi, tự tin và sớm đạt được mọi ước mơ đã ấp ủ nhé!',
    'Chúc người chị/em gái tuyệt vời luôn trẻ trung, yêu đời và ngập tràn may mắn trên con đường sắp tới.'
  ],
  'Bạn Bè / Đồng Nghiệp': [
    'Chúc bạn ngày 20-10 thật nhiều hoa và quà, luôn rạng rỡ, công việc thuận lợi và thành công rực rỡ!',
    'Chúc nửa thế giới của chúng mình luôn tỏa sáng, xinh đẹp và luôn là phiên bản tự tin nhất của chính mình.'
  ]
}

export function CardCreatorModal({ onClose }: CardCreatorModalProps) {
  const [role, setRole] = useState<string>('Người Yêu / Vợ')
  const [recipient, setRecipient] = useState<string>('')
  const [sender, setSender] = useState<string>('')
  const [message, setMessage] = useState<string>(PRESET_MESSAGES['Người Yêu / Vợ'][0])
  const [copied, setCopied] = useState<boolean>(false)
  const [copyError, setCopyError] = useState('')
  const reduced = useReducedMotion()
  const cardPreviewRef = useRef<HTMLDivElement>(null)

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
    setMessage(PRESET_MESSAGES[newRole][0])
  }

  const handleCopy = async () => {
    const cardText = `🌸 THIỆP HOA ĐÀO CHÚC MỪNG 20-10 🌸\n\nThân gửi: ${recipient || 'Bạn'}\n\n"${message}"\n\nTừ: ${sender || 'Một người luôn trân quý bạn'}\n✨ Chúc mừng Ngày Phụ Nữ Việt Nam 20-10 ✨`
    try {
      await navigator.clipboard.writeText(cardText)
    } catch {
      setCopyError('Chưa sao chép được. Hãy cho phép truy cập khay nhớ tạm rồi thử lại.')
      return
    }
    setCopyError('')
    setCopied(true)
    if (!reduced) confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    })
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <AnimatedDialog onClose={onClose} label="Tạo thiệp chúc mừng 20-10" wide>
      <div className="relative w-full p-6 sm:p-8 rounded-3xl bg-[#14081c]/95 border border-pink-400/40 shadow-[0_0_70px_rgba(244,114,182,0.35)] text-white overflow-hidden backdrop-blur-2xl">
        
        {/* Gentle Floating Sakura Petals in Modal Background */}
        <SakuraModalPetals count={42} />

        {/* Sakura Corner Branches */}
        <SakuraBranchCorner position="top-right" className="opacity-80 -top-2 -right-2" />
        <SakuraBranchCorner position="bottom-left" className="opacity-60 -bottom-3 -left-3" />

        {/* Close Button */}
        <button
          aria-label="Đóng trình tạo thiệp"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full text-pink-300/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="relative z-10 flex items-center gap-2 mb-2 text-pink-400 text-xs font-semibold tracking-wider uppercase">
          <Sparkles size={14} className="text-amber-400" />
          <span>🌸 Thiệp Hoa Đào Trao Yêu Thương</span>
        </div>
        <h2 className="relative z-10 text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-rose-200 mb-6 drop-shadow-[0_2px_12px_rgba(244,114,182,0.35)]">
          Tạo Thiệp Chúc Mừng 20-10
        </h2>

        {/* Form Controls */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Left: Input Options */}
          <div className="space-y-4">
            {/* Role Select */}
            <div>
              <label className="block text-xs font-medium text-pink-200/80 mb-2">
                Gửi tặng đến:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(PRESET_MESSAGES).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                      role === r
                        ? 'bg-pink-600/35 border-pink-400 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.35)] font-semibold'
                        : 'bg-white/5 border-white/10 text-pink-200/70 hover:bg-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Sender Input */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">
                  Tên người nhận:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mẹ yêu, Lan..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-pink-400/20 focus:border-pink-400 focus:outline-none text-white placeholder-pink-300/30 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-pink-200/80 mb-1">
                  Người gửi:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Con trai, Nam..."
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-pink-400/20 focus:border-pink-400 focus:outline-none text-white placeholder-pink-300/30 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-medium text-pink-200/80 mb-1">
                Nội dung lời chúc:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/5 border border-pink-400/20 focus:border-pink-400 focus:outline-none text-pink-100 resize-none leading-relaxed backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right: Live Card Preview */}
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-pink-200/80 mb-2">
              Xem trước tấm thiệp hoa đào:
            </label>
            <div
              ref={cardPreviewRef}
              className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-[#2c0f2f] via-[#1a0820] to-[#2e0c1f] border-2 border-pink-400/50 shadow-[0_0_30px_rgba(244,114,182,0.2)] relative flex flex-col justify-between overflow-hidden"
            >
              {/* Corner Sakura Branch on Card */}
              <SakuraBranchCorner position="top-right" className="opacity-95 -top-2 -right-2 scale-90" />

              {/* Decorative Corner Filigrees */}
              <div className="absolute top-2 left-2 text-pink-400/40 text-xs">❀</div>
              <div className="absolute bottom-2 left-2 text-pink-400/40 text-xs">❀</div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[11px] uppercase tracking-widest font-semibold mb-2">
                  <Heart size={12} className="fill-amber-300" />
                  <span>HAPPY WOMEN'S DAY • 20-10</span>
                </div>
                
                <h4 className="text-lg font-serif font-bold text-center text-pink-100 mb-2">
                  Gửi {recipient ? recipient : 'Người Phụ Nữ Tuyệt Vời'}
                </h4>

                <p className="text-xs font-display italic text-pink-100/95 leading-relaxed text-center px-2 py-1">
                  "{message}"
                </p>
              </div>

              {/* Signature and Vermilion Seal Stamp */}
              <div className="relative z-10 flex items-end justify-between pt-3 border-t border-pink-400/25 mt-2">
                <SakuraSealStamp label="20-10" sublabel="AN NHIÊN" className="scale-80 origin-bottom-left" />
                <div className="text-right text-[11px] text-pink-300/85 font-medium">
                  Thương mến, <span className="text-pink-100 font-semibold">{sender ? sender : '...' }</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200 text-xs font-medium transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Đã sao chép vào khay nhớ tạm!' : 'Sao chép thiệp để gửi'}</span>
          </button>
        </div>

        <p role="status" className="relative z-10 mt-3 text-xs text-pink-200">{copyError}</p>
      </div>
    </AnimatedDialog>
  )
}
