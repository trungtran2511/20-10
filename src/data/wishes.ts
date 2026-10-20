export interface WishCard {
  id: number
  title: string
  archetype: string
  symbol: string
  blessing: string
  detail: string
  color: string
}

export const WISH_CARDS: WishCard[] = [
  {
    id: 1,
    title: "Nhan Sắc Tỏa Sáng",
    archetype: "Bông Hoa Vĩnh Cửu",
    symbol: "🌸",
    blessing: "Chúc bạn luôn rạng ngời như ánh ban mai, nụ cười luôn nở trên môi và trái tim luôn ngập tràn yêu thương.",
    detail: "Mỗi ngày trôi qua, hãy là đóa hoa xinh đẹp và kiêu hãnh nhất trong khu vườn của chính mình.",
    color: "#f472b6"
  },
  {
    id: 2,
    title: "Bình An & Hạnh Phúc",
    archetype: "Ánh Trăng Dịu Dàng",
    symbol: "🌙",
    blessing: "Chúc bạn tìm thấy sự an yên trong tâm hồn, mọi muộn phiền tan biến, chỉ còn lại sự ấm áp và bình yên đong đầy.",
    detail: "Hạnh phúc không ở đâu xa, nó luôn hiện diện trong từng khoảnh khắc bạn yêu thương bản thân.",
    color: "#a78bfa"
  },
  {
    id: 3,
    title: "Bản Lĩnh & Thành Công",
    archetype: "Ngọn Lửa Khát Vọng",
    symbol: "✨",
    blessing: "Chúc bạn tự tin chinh phục mọi ước mơ, luôn kiên định với con đường đã chọn và đạt được những đỉnh cao mới.",
    detail: "Phụ nữ hiện đại không chỉ dịu dàng mà còn mang trong mình sức mạnh vô hạn để thay đổi thế giới.",
    color: "#fbbf24"
  },
  {
    id: 4,
    title: "Tri Ân Tình Mẹ",
    archetype: "Suối Nguồn Bao Dung",
    symbol: "💖",
    blessing: "Kính chúc Mẹ luôn dồi dào sức khỏe, an vui mỗi ngày. Cảm ơn Mẹ vì tất cả sự hy sinh và tình yêu thương vô bờ bến.",
    detail: "Nụ cười của Mẹ là món quà tuyệt vời nhất trên đời. 20-10 này và mãi mãi về sau, chúc Mẹ luôn hạnh phúc.",
    color: "#f87171"
  },
  {
    id: 5,
    title: "Tình Yêu Thăng Hoa",
    archetype: "Viên Ngọc Quý Giá",
    symbol: "💎",
    blessing: "Chúc bạn luôn được yêu thương, chở che và trân trọng như món quà quý giá nhất của tạo hóa.",
    detail: "Bạn xứng đáng với những điều ngọt ngào nhất, những cái ôm ấm áp và một tình yêu chân thành trọn vẹn.",
    color: "#ec4899"
  },
  {
    id: 6,
    title: "Tự Do & Rực Rỡ",
    archetype: "Cánh Bướm Tự Do",
    symbol: "🦋",
    blessing: "Hãy sống cuộc đời theo cách bạn muốn: Tự do, kiêu hãnh, luôn mỉm cười và tỏa sáng rực rỡ theo chất riêng.",
    detail: "Bạn là phiên bản duy nhất và đặc biệt nhất trên hành tinh này. Hãy luôn tự hào về chính mình!",
    color: "#38bdf8"
  }
]
