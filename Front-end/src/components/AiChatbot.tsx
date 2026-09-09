import { useState, useRef, useEffect } from 'react'
import type { Lang, Product } from '../types'
import { PRODUCTS, OCC } from '../data/products'
import { fmt } from '../utils/helpers'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  recommendations?: Product[]
  timestamp: string
}

interface AiChatbotProps {
  lang: Lang
  onSelectProduct: (p: Product) => void
  onAddCart: (p: Product) => void
}

export default function AiChatbot({ lang, onSelectProduct, onAddCart }: AiChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const vi = lang === 'vi'

  const initialMessage: Message = {
    id: '1',
    sender: 'bot',
    text: vi
      ? 'Xin chào! Tôi là Chuyên gia Tư vấn Hoa AI 🌸. Bạn đang tìm hoa cho dịp gì hoặc với ngân sách bao nhiêu? (Ví dụ: "Bó hoa sinh nhật dưới 600k" hoặc "Hoa khai trương sang trọng")'
      : '안녕하세요! AI 꽃 추천 전문가입니다 🌸. 어떤 기념일이나 예산의 꽃을 찾으시나요? (예: "50만동 이하 생일 꽃다발" 또는 "고급 개업 화환")',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }

  const [messages, setMessages] = useState<Message[]>([initialMessage])

  // Reset or adjust initial greeting when language changes if chat is empty/fresh
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [initialMessage]
      }
      return prev
    })
  }, [lang])

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickPrompts = vi
    ? [
        '🎂 Hoa sinh nhật dưới 600k',
        '🎋 Hoa khai trương hoành tráng',
        '🍂 Hoa biếu Tết Chuseok (추석)',
        '💝 Hoa Valentine lãng mạn',
      ]
    : [
        '🎂 60만동 이하 생일 꽃다발',
        '🎋 화려한 개업 화환',
        '🍂 추석 선물용 꽃 바구니',
        '💝 로맨틱 발렌타인 꽃',
      ]

  const generateBotReply = (query: string): { text: string; recs: Product[] } => {
    const q = query.toLowerCase()
    let recs: Product[] = []
    let text = ''

    // Budget extraction
    let maxBudget = Infinity
    if (q.includes('500k') || q.includes('50만동')) maxBudget = 550000
    else if (q.includes('600k') || q.includes('60만동')) maxBudget = 650000
    else if (q.includes('1tr') || q.includes('1 triệu') || q.includes('100만동')) maxBudget = 1100000
    else if (q.includes('2tr') || q.includes('2 triệu') || q.includes('200만동')) maxBudget = 2100000

    // Occasion matching
    if (q.includes('sinh nhật') || q.includes('생일') || q.includes('birthday')) {
      recs = PRODUCTS.filter(p => p.occasions.includes('birthday') && p.price <= maxBudget)
      text = vi
        ? `Dưới đây là các mẫu hoa sinh nhật tinh tế nhất dành cho bạn${maxBudget < Infinity ? ` trong tầm giá dưới ${fmt(maxBudget)}` : ''}:`
        : `생일 축하에 가장 잘 어울리는 추천 꽃입니다${maxBudget < Infinity ? ` (${fmt(maxBudget)} 이하)` : ''}:`
    } else if (q.includes('khai trương') || q.includes('개업') || q.includes('opening')) {
      recs = PRODUCTS.filter(p => p.occasions.includes('opening') && p.price <= maxBudget)
      text = vi
        ? 'Dưới đây là các kệ hoa và chậu lan khai trương hồng phát, may mắn cho đối tác:'
        : '개업을 축하하고 번영을 기원하는 추천 화환과 호접란입니다:'
    } else if (q.includes('chuseok') || q.includes('추석') || q.includes('trung thu')) {
      recs = PRODUCTS.filter(p => p.occasions.includes('chuseok'))
      text = vi
        ? 'Bộ sưu tập hoa Chuseok (Tết Trung Thu Hàn Quốc) mang đậm nét truyền thống tri ân gia đình:'
        : '추석 명절에 부모님과 지인께 감사함을 전하는 전통 국화 꽃 바구니입니다:'
    } else if (q.includes('valentine') || q.includes('lãng mạn') || q.includes('발렌타인') || q.includes('화이트데이')) {
      recs = PRODUCTS.filter(p => p.occasions.includes('valentine') && p.price <= maxBudget)
      text = vi
        ? 'Những bó hoa hồng và tulip ngọt ngào nhất cho tình yêu:'
        : '사랑을 전하는 가장 달콤한 장미와 튤립 꽃다발입니다:'
    } else if (q.includes('doanh nghiệp') || q.includes('기업') || q.includes('đối tác')) {
      recs = PRODUCTS.filter(p => p.occasions.includes('corporate'))
      text = vi
        ? 'Các thiết kế hộp hoa sang trọng kèm thiệp in logo dành cho đối tác doanh nghiệp:'
        : '비즈니스 파트너를 위한 고급스러운 기업 선물 꽃 박스입니다:'
    } else if (maxBudget < Infinity) {
      recs = PRODUCTS.filter(p => p.price <= maxBudget)
      text = vi
        ? `Gợi ý các mẫu hoa bán chạy trong ngân sách dưới ${fmt(maxBudget)}:`
        : `예산 ${fmt(maxBudget)} 이하 추천 상품입니다:`
    } else {
      // General match
      recs = PRODUCTS.filter(p =>
        p.nameVi.toLowerCase().includes(q) ||
        p.nameKo.toLowerCase().includes(q) ||
        p.descVi.toLowerCase().includes(q) ||
        p.descKo.toLowerCase().includes(q)
      )
      if (recs.length === 0) {
        recs = PRODUCTS.filter(p => p.isPopular).slice(0, 3)
        text = vi
          ? 'Tôi đã tìm thấy những mẫu hoa được yêu thích nhất hiện nay tại cửa hàng:'
          : '현재 가장 인기 있는 대표 꽃 상품들을 추천해 드립니다:'
      } else {
        text = vi
          ? `Gợi ý các mẫu hoa phù hợp với tìm kiếm "${query}" của bạn:`
          : `"${query}" 검색어와 잘 어울리는 추천 꽃입니다:`
      }
    }

    return { text, recs: recs.slice(0, 3) }
  }

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input
    if (!q.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botReply = generateBotReply(q)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply.text,
        recommendations: botReply.recs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#6E2A34] text-[#FBF6EF] px-4 py-3 rounded-full shadow-2xl hover:bg-[#582029] hover:scale-105 active:scale-95 transition-all duration-200 group border border-[#D9A6A0]/30"
        aria-label="AI Flower Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A6A0] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9A6A0]"></span>
        </span>
        <svg className="w-5 h-5 text-[#FBF6EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-xs font-semibold tracking-wide">
          {vi ? 'Tư vấn AI 🌸' : 'AI 꽃 추천 🌸'}
        </span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] bg-[#FBF6EF] rounded-2xl shadow-2xl border border-[#E4D9C8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#6E2A34] text-[#FBF6EF] px-5 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5F6F52] flex items-center justify-center text-lg border border-[#D9A6A0]/40 shadow-inner">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                  {vi ? 'Tư Vấn Hoa AI Song Ngữ' : 'AI AI 꽃 추천 전문가'}
                  <span className="text-[10px] bg-[#5F6F52] text-[#FBF6EF] px-1.5 py-0.5 rounded font-mono">PRO</span>
                </h3>
                <p className="text-[11px] text-[#D9A6A0] font-medium">
                  {vi ? 'Sẵn sàng trợ giúp 24/7 (Việt - Hàn)' : '24/7 한국어·베트남어 실시간 상담'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#FBF6EF]/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2.5 bg-[#F4EDE3] border-b border-[#E4D9C8] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[11px] bg-white text-[#6E2A34] hover:bg-[#6E2A34] hover:text-white px-3 py-1 rounded-full border border-[#E4D9C8] transition-all font-medium shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] min-h-[260px] bg-[#FBF6EF]">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#6E2A34] text-[#FBF6EF] rounded-br-none'
                      : 'bg-white text-[#2B2A26] border border-[#E4D9C8] rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Recommendations Cards inside chat */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-[#E4D9C8] pt-2.5">
                      {msg.recommendations.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-[#FBF6EF] p-2.5 rounded-xl border border-[#E4D9C8] flex items-center gap-3 hover:border-[#6E2A34] transition-colors"
                        >
                          <img
                            src={prod.img}
                            alt={vi ? prod.nameVi : prod.nameKo}
                            className="w-12 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-[#2B2A26] truncate">
                              {vi ? prod.nameVi : prod.nameKo}
                            </h4>
                            <p className="text-[11px] font-semibold text-[#6E2A34]">
                              {fmt(prod.price)} {vi ? 'đ' : '₫'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => {
                                  onSelectProduct(prod)
                                  setIsOpen(false)
                                }}
                                className="text-[10px] text-[#5F6F52] hover:underline font-semibold"
                              >
                                {vi ? 'Chi tiết →' : '상세보기 →'}
                              </button>
                              <button
                                onClick={() => onAddCart(prod)}
                                className="text-[10px] bg-[#6E2A34] text-white px-2 py-0.5 rounded font-medium hover:bg-[#582029]"
                              >
                                {vi ? '+ Giỏ hàng' : '+ 담기'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#7A7163] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#7A7163] bg-white/70 px-3 py-2 rounded-xl w-fit border border-[#E4D9C8]">
                <span className="animate-pulse">🌸</span>
                <span>{vi ? 'AI đang soạn phản hồi...' : 'AI가 답변을 작성 중입니다...'}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-[#E4D9C8] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={vi ? 'Nhập tin nhắn tư vấn...' : '문의 내용을 입력하세요...'}
              className="flex-1 bg-[#FBF6EF] border border-[#E4D9C8] rounded-xl px-3.5 py-2 text-xs text-[#2B2A26] focus:outline-none focus:border-[#6E2A34]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#6E2A34] text-[#FBF6EF] p-2 rounded-xl disabled:opacity-40 hover:bg-[#582029] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
