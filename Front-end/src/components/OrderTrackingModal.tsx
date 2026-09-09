import { useState } from 'react'
import type { Lang } from '../types'

interface OrderTrackingModalProps {
  lang: Lang
  onClose: () => void
}

interface OrderStatus {
  id: string
  customerName: string
  recipientName: string
  recipientPhone: string
  address: string
  productName: string
  status: 'received' | 'arranging' | 'shipping' | 'delivered'
  createdAt: string
  estimatedDelivery: string
  driverPhone?: string
  photoProof?: string
}

export default function OrderTrackingModal({ lang, onClose }: OrderTrackingModalProps) {
  const vi = lang === 'vi'

  const [searchQuery, setSearchQuery] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<OrderStatus | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Mock database of sample active orders for demonstration
  const mockOrders: Record<string, OrderStatus> = {
    '0901234567': {
      id: 'ORD-88291',
      customerName: 'Lee Min Ho (이민호)',
      recipientName: 'Kim Ji Won',
      recipientPhone: '0901234567',
      address: '74 Nguyễn Cơ Thạch, An Lợi Đông, TP. Thủ Đức, TP.HCM',
      productName: vi ? 'Bó Hồng Phấn Premium 24 Bông' : '프리미엄 핑크 장미 24송이',
      status: 'shipping',
      createdAt: '09/09/2026 13:15',
      estimatedDelivery: '09/09/2026 15:30',
      driverPhone: '0988 765 432 (A. Tuấn)',
      photoProof: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=400&h=400&fit=crop&auto=format',
    },
    'ORD-88291': {
      id: 'ORD-88291',
      customerName: 'Lee Min Ho (이민호)',
      recipientName: 'Kim Ji Won',
      recipientPhone: '0901234567',
      address: '74 Nguyễn Cơ Thạch, An Lợi Đông, TP. Thủ Đức, TP.HCM',
      productName: vi ? 'Bó Hồng Phấn Premium 24 Bông' : '프리미엄 핑크 장미 24송이',
      status: 'shipping',
      createdAt: '09/09/2026 13:15',
      estimatedDelivery: '09/09/2026 15:30',
      driverPhone: '0988 765 432 (A. Tuấn)',
      photoProof: 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=400&h=400&fit=crop&auto=format',
    },
    'ORD-77123': {
      id: 'ORD-77123',
      customerName: 'Park Seo Joon (박서준)',
      recipientName: 'Cty TNHH Sangwoo',
      recipientPhone: '0912345678',
      address: 'Lô C1-3 Đường N1, KCN Tân Bình, Tân Phú, Hà Nội',
      productName: vi ? 'Kệ Khai Trương 2 Tầng Premium' : '2단 프리미엄 개업 화환',
      status: 'delivered',
      createdAt: '09/09/2026 09:00',
      estimatedDelivery: '09/09/2026 11:30',
      driverPhone: '0933 111 222 (A. Hùng)',
      photoProof: 'https://images.unsplash.com/photo-1760618511409-9d80f26e36f4?w=400&h=400&fit=crop&auto=format',
    },
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return

    const order = mockOrders[q]
    if (order) {
      setSearchedOrder(order)
      setErrorMsg('')
    } else {
      setSearchedOrder(null)
      setErrorMsg(
        vi
          ? 'Không tìm thấy đơn hàng với số điện thoại hoặc mã đơn này. Thử lại với SĐT: 0901234567 hoặc Mã: ORD-88291'
          : '해당 전화번호 또는 주문번호의 주문을 찾을 수 없습니다. (예시: 0901234567 또는 ORD-88291)'
      )
    }
  }

  const statusSteps = [
    { key: 'received', labelVi: 'Đã nhận đơn', labelKo: '주문 접수' },
    { key: 'arranging', labelVi: 'Đang thiết kế hoa', labelKo: '꽃 제작 중' },
    { key: 'shipping', labelVi: 'Đang giao hàng', labelKo: '배송 중' },
    { key: 'delivered', labelVi: 'Giao thành công', labelKo: '배송 완료' },
  ]

  const getStepIndex = (status: OrderStatus['status']) => {
    switch (status) {
      case 'received': return 0
      case 'arranging': return 1
      case 'shipping': return 2
      case 'delivered': return 3
      default: return 0
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FBF6EF] border border-[#E4D9C8] rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#6E2A34] text-[#FBF6EF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5F6F52] flex items-center justify-center text-xl shadow-inner">
              🚚
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {vi ? 'Tra Cứu Tiến Độ Đơn Hàng' : '실시간 주문 배송 조회'}
              </h2>
              <p className="text-xs text-[#D9A6A0]">
                {vi ? 'Nhập Số điện thoại hoặc Mã đơn hàng để kiểm tra' : '전화번호 또는 주문번호를 입력하세요'}
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
        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={vi ? 'Nhập SĐT (VD: 0901234567) hoặc Mã đơn (ORD-88291)' : '전화번호 또는 주문번호 입력'}
              className="flex-1 bg-white border border-[#E4D9C8] rounded-xl px-4 py-2.5 text-xs text-[#2B2A26] focus:outline-none focus:border-[#6E2A34]"
            />
            <button
              type="submit"
              className="bg-[#6E2A34] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#582029] transition-colors"
            >
              {vi ? 'Tra cứu' : '조회하기'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Searched Order Details */}
          {searchedOrder && (
            <div className="bg-white p-5 rounded-2xl border border-[#E4D9C8] space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-start border-b border-[#F4EDE3] pb-3">
                <div>
                  <span className="text-[10px] bg-[#5F6F52] text-white px-2 py-0.5 rounded font-mono font-semibold">
                    {searchedOrder.id}
                  </span>
                  <h3 className="text-sm font-bold text-[#2B2A26] mt-1">
                    {searchedOrder.productName}
                  </h3>
                  <p className="text-xs text-[#7A7163]">
                    {vi ? `Người nhận: ${searchedOrder.recipientName}` : `수령인: ${searchedOrder.recipientName}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#6E2A34]">
                    {vi ? 'Dự kiến giao:' : '예정 배송시간:'}
                  </span>
                  <p className="text-xs font-mono font-bold text-[#2B2A26]">
                    {searchedOrder.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <div className="flex justify-between items-center relative mb-2">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E4D9C8] -translate-y-1/2 -z-0" />
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-[#5F6F52] -translate-y-1/2 transition-all duration-500 -z-0"
                    style={{
                      width: `${(getStepIndex(searchedOrder.status) / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(searchedOrder.status)
                    const isPassed = idx <= currentIdx
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed
                              ? 'bg-[#5F6F52] text-white shadow-sm'
                              : 'bg-white text-[#7A7163] border border-[#E4D9C8]'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span className="text-[10px] font-semibold text-[#2B2A26] mt-1.5 text-center">
                          {vi ? step.labelVi : step.labelKo}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Extra Proof & Driver Info */}
              <div className="bg-[#FBF6EF] p-3 rounded-xl border border-[#E4D9C8] flex items-center justify-between text-xs">
                <div>
                  <p className="text-[#7A7163]">
                    {vi ? 'Tài xế giao hàng:' : '배송 기사:'} <span className="font-semibold text-[#2B2A26]">{searchedOrder.driverPhone}</span>
                  </p>
                  <p className="text-[#7A7163] text-[11px] mt-0.5">
                    {vi ? 'Địa chỉ:' : '주소:'} {searchedOrder.address}
                  </p>
                </div>
                {searchedOrder.photoProof && (
                  <img
                    src={searchedOrder.photoProof}
                    alt="Proof"
                    className="w-12 h-12 object-cover rounded-lg border border-[#E4D9C8]"
                  />
                )}
              </div>
            </div>
          )}

          {/* Customer Care Note */}
          <div className="bg-[#F4EDE3] p-4 rounded-2xl border border-[#D9A6A0]/40 flex items-center justify-between text-xs text-[#6E2A34]">
            <span>
              {vi
                ? 'Cần hỗ trợ gấp? Đội ngũ tư vấn KakaoTalk luôn sẵn sàng 24/7'
                : '긴급 문의가 있으신가요? 카카오톡 상담원이 24시간 대기 중입니다'}
            </span>
            <a
              href="https://kakao.com"
              target="_blank"
              rel="noreferrer"
              className="bg-[#FFE812] text-[#3C1E1E] px-3 py-1.5 rounded-lg font-bold hover:bg-[#FEE500] transition-colors whitespace-nowrap ml-3"
            >
              KakaoTalk 💬
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
