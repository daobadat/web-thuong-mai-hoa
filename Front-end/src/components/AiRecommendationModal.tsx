import { useState } from 'react'
import type { Lang, OccasionKey, Product } from '../types'
import { PRODUCTS, OCC, OCCASION_KEYS, OCC_ICONS } from '../data/products'
import { fmt } from '../utils/helpers'

interface AiRecommendationModalProps {
  lang: Lang
  onClose: () => void
  onSelectProduct: (p: Product) => void
  onAddCart: (p: Product) => void
}

type Recipient = 'family' | 'lover' | 'partner' | 'friend'

export default function AiRecommendationModal({
  lang,
  onClose,
  onSelectProduct,
  onAddCart,
}: AiRecommendationModalProps) {
  const vi = lang === 'vi'

  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>('birthday')
  const [maxBudget, setMaxBudget] = useState<number>(1000000)
  const [recipient, setRecipient] = useState<Recipient>('family')
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [preOrderDate, setPreOrderDate] = useState('')

  const recipientLabels: Record<Recipient, { vi: string; ko: string }> = {
    family: { vi: 'Gia đình / Bố mẹ', ko: '가족 / 부모님' },
    lover: { vi: 'Người yêu / Vợ (Chồng)', ko: '연인 / 배우자' },
    partner: { vi: 'Đối tác / Sếp / Khách hàng', ko: '비즈니스 파트너 / 상사' },
    friend: { vi: 'Bạn bè / Đồng nghiệp', ko: '친구 / 동료' },
  }

  const etiquetteTips: Record<OccasionKey, { vi: string; ko: string }> = {
    birthday: {
      vi: '💡 Mẹo tặng hoa sinh nhật: Người Hàn Quốc rất ưa chuộng các tông màu pastel dịu nhẹ hoặc hồng phấn. Đi kèm thiệp viết tay chân thành sẽ điểm 10 tinh tế!',
      ko: '💡 생일 꽃 선물 팁: 파스텔 톤이나 핑크 빛 꽃다발이 인기입니다. 정성 어린 손편지를 함께 전해보세요!',
    },
    opening: {
      vi: '💡 Vẫn hóa tặng hoa Khai trương: Kệ hoa 2-3 tầng hoặc chậu Lan Hồ Điệp in dải ruy băng chữ mạ vàng (축 개업) thể hiện sự tôn trọng tuyệt đối dành cho gia chủ.',
      ko: '💡 개업 축하 팁: 2~3단 화환이나 호접란에 금박 리본 문구(祝 開業)를 첨부하여 정중한 축하를 전하세요.',
    },
    wedding: {
      vi: '💡 Mẹo tặng hoa Cưới: Tone màu trắng thuần khiết (hoa ly, hồng trắng, tulip) biểu trưng cho lời chúc hạnh phúc viên mãn và bền lâu.',
      ko: '💡 웨딩 꽃 팁: 순백의 부케와 백합, 장미는 축복과 영원한 행복을 상징합니다.',
    },
    corporate: {
      vi: '💡 Quà tặng Doanh nghiệp: Nên chọn Hộp hoa cao cấp hoặc lẵng hoa chỉn chu, hỗ trợ in logo doanh nghiệp lên thiệp chúc mừng.',
      ko: '💡 기업 선물 팁: 고급스러운 꽃 박스에 기업 로고 카드를 부착하여 전문적이고 깔끔한 느낌을 주세요.',
    },
    chuseok: {
      vi: '💡 Tết Chuseok (추석): Giỏ cúc vàng rực rỡ tượng trưng cho sự trường thọ, biết ơn và đoàn tụ gia đình theo truyền thống Hàn.',
      ko: '💡 추석 명절 팁: 풍성한 노란 국화 바구니는 건강과 장수, 가족 간의 따뜻한 정을 상징합니다.',
    },
    valentine: {
      vi: '💡 Valentine & White Day: Bó 99 hồng đỏ hoặc Tulip hồng tươi nhập khẩu thể hiện tình yêu nồng thắm, tinh tế.',
      ko: '💡 발렌타인·화이트데이 팁: 빨간 장미 99송이나 핑크 튤립으로 낭만적인 마음을 전하세요.',
    },
  }

  // Calculate matching score & filtered results
  const filteredProducts = PRODUCTS.filter(p => {
    const matchOcc = p.occasions.includes(selectedOccasion)
    const matchPrice = p.price <= maxBudget
    return matchOcc && matchPrice
  }).sort((a, b) => b.price - a.price)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FBF6EF] border border-[#E4D9C8] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#6E2A34] text-[#FBF6EF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5F6F52] flex items-center justify-center text-xl shadow-inner">
              ✨
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {vi ? 'Gợi Ý Hoa AI & Đặt Trước Dịp Lễ' : 'AI 맞춤 꽃 추천 & 사전 예약'}
              </h2>
              <p className="text-xs text-[#D9A6A0]">
                {vi ? 'Tìm mẫu hoa hoàn hảo theo dịp, ngân sách & đối tượng' : '상황, 예산, 받는 분에 맞는 최적의 꽃 추천'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Choose Occasion */}
          <div>
            <label className="block text-xs font-bold text-[#6E2A34] uppercase tracking-wider mb-2">
              {vi ? '1. Chọn dịp tặng hoa' : '1. 기념일 / 목적 선택'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {OCCASION_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedOccasion(key)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-xs font-semibold ${
                    selectedOccasion === key
                      ? 'bg-[#6E2A34] text-white border-[#6E2A34] shadow-md'
                      : 'bg-white text-[#2B2A26] border-[#E4D9C8] hover:bg-[#F4EDE3]'
                  }`}
                >
                  <span className="text-base">{OCC_ICONS[key]}</span>
                  <span>{OCC[key][lang]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#6E2A34] uppercase tracking-wider">
                {vi ? '2. Ngân sách tối đa' : '2. 최대 예산 설정'}
              </label>
              <span className="text-sm font-bold text-[#6E2A34] font-mono">
                {fmt(maxBudget)} {vi ? 'đ' : '₫'}
              </span>
            </div>
            <input
              type="range"
              min={400000}
              max={3000000}
              step={100000}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#6E2A34] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7A7163] mt-1 font-mono">
              <span>400.000đ</span>
              <span>1.500.000đ</span>
              <span>3.000.000đ</span>
            </div>
          </div>

          {/* Step 3: Recipient Relationship */}
          <div>
            <label className="block text-xs font-bold text-[#6E2A34] uppercase tracking-wider mb-2">
              {vi ? '3. Người nhận hoa' : '3. 받는 분과의 관계'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(recipientLabels) as Recipient[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRecipient(r)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    recipient === r
                      ? 'bg-[#5F6F52] text-white border-[#5F6F52]'
                      : 'bg-white text-[#2B2A26] border-[#E4D9C8] hover:bg-[#F4EDE3]'
                  }`}
                >
                  {recipientLabels[r][lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Pre-order Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-[#E4D9C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="preorder"
                checked={isPreOrder}
                onChange={e => setIsPreOrder(e.target.checked)}
                className="w-4 h-4 accent-[#6E2A34] rounded cursor-pointer"
              />
              <label htmlFor="preorder" className="text-xs font-bold text-[#2B2A26] cursor-pointer">
                {vi ? '📅 Đặt trước cho dịp lễ đặc biệt (Pre-Order)' : '📅 특별 명절 사전 예약 (Pre-Order)'}
              </label>
            </div>
            {isPreOrder && (
              <input
                type="date"
                value={preOrderDate}
                onChange={e => setPreOrderDate(e.target.value)}
                className="bg-[#FBF6EF] border border-[#E4D9C8] rounded-xl px-3 py-1.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#6E2A34]"
              />
            )}
          </div>

          {/* Etiquette Tip Banner */}
          <div className="bg-[#F4EDE3] p-4 rounded-2xl border border-[#D9A6A0]/40 text-xs text-[#6E2A34] leading-relaxed">
            {etiquetteTips[selectedOccasion][lang]}
          </div>

          {/* Recommendation Results */}
          <div>
            <h3 className="text-xs font-bold text-[#2B2A26] uppercase tracking-wider mb-3">
              {vi ? `Kết quả đề xuất (${filteredProducts.length} mẫu phù hợp):` : `추천 결과 (${filteredProducts.length}개 상품):`}
            </h3>
            {filteredProducts.length === 0 ? (
              <p className="text-xs text-[#7A7163] italic text-center py-6">
                {vi ? 'Không tìm thấy mẫu hoa phù hợp trong mức giá này. Hãy thử tăng ngân sách.' : '설정한 예산에 맞는 상품이 없습니다. 예산을 늘려보세요.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white p-3 rounded-2xl border border-[#E4D9C8] flex gap-3 hover:shadow-md transition-shadow group"
                  >
                    <img
                      src={product.img}
                      alt={vi ? product.nameVi : product.nameKo}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-xs font-bold text-[#2B2A26] truncate">
                          {vi ? product.nameVi : product.nameKo}
                        </h4>
                        <p className="text-[11px] text-[#7A7163] line-clamp-2 mt-0.5">
                          {vi ? product.descVi : product.descKo}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F4EDE3]">
                        <span className="text-xs font-bold text-[#6E2A34] font-mono">
                          {fmt(product.price)} {vi ? 'đ' : '₫'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onSelectProduct(product)
                              onClose()
                            }}
                            className="text-[10px] text-[#5F6F52] font-semibold hover:underline"
                          >
                            {vi ? 'Xem' : '보기'}
                          </button>
                          <button
                            onClick={() => onAddCart(product)}
                            className="text-[10px] bg-[#6E2A34] text-white px-2.5 py-1 rounded-lg font-medium hover:bg-[#582029]"
                          >
                            {vi ? '+ Đặt hoa' : '+ 담기'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
