import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { LangService } from './lang.service';

export interface ChatProduct {
  id: string | number;
  nameVi: string;
  nameKo?: string;
  price: number;
  category?: string;
  img?: string;
  descVi?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  products?: ChatProduct[];
}

export interface ChatSuggestion {
  label: string;
  prompt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private api = inject(ApiService);
  private langService = inject(LangService);

  public isOpen = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public unreadCount = signal<number>(0);
  public messages = signal<ChatMessage[]>([]);
  public suggestions = signal<ChatSuggestion[]>([]);

  constructor() {
    this.initWelcomeMessage();
    this.loadSuggestions();
  }

  public initWelcomeMessage() {
    const isKo = this.langService.currentLang() === 'ko';
    const welcomeText = isKo
      ? '안녕하세요! KFlower AI 어시스턴트입니다 🌸\n어떤 특별한 날을 위해 꽃을 찾고 계신가요? 생일, 기념일, 개업 축하 등 원하시는 스타일이나 예산을 편하게 말씀해 주세요!'
      : 'Xin chào! Em là trợ lý KFlower AI 🌸\nAnh/chị đang tìm hoa cho dịp đặc biệt nào ạ? Hãy chia sẻ về dịp tặng (sinh nhật, tình yêu, khai trương...), sở thích hoặc ngân sách để em tư vấn mẫu hoa đẹp nhất nhé!';

    const initialMessage: ChatMessage = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      text: welcomeText,
      time: this.getCurrentTimeString(),
    };

    this.messages.set([initialMessage]);
  }

  public toggleChat() {
    const nextState = !this.isOpen();
    this.isOpen.set(nextState);
    if (nextState) {
      this.unreadCount.set(0);
    }
  }

  public openChat() {
    this.isOpen.set(true);
    this.unreadCount.set(0);
  }

  public closeChat() {
    this.isOpen.set(false);
  }

  public loadSuggestions() {
    const lang = this.langService.currentLang();
    this.api.get<any>('/chat/suggestions', { lang }).subscribe({
      next: (res) => {
        if (res.data) {
          this.suggestions.set(res.data);
        }
      },
      error: () => {
        // Fallback suggestions
        if (lang === 'ko') {
          this.suggestions.set([
            { label: '🌸 생일 축하 꽃 추천', prompt: '생일 축하용으로 인기 있는 꽃 추천해 줘' },
            { label: '💖 여자친구 꽃 선물', prompt: '여자친구에게 선물할 로맨틱한 꽃 추천해 줘' },
            { label: '💰 50만동 이하 꽃', prompt: '50만동 이하 예쁜 꽃다발 추천해 줘' },
            { label: '🚚 배송 안내', prompt: '배송 소요 시간과 정책 알려줘' },
          ]);
        } else {
          this.suggestions.set([
            { label: '🌸 Tư vấn hoa sinh nhật', prompt: 'Gợi ý cho mình mẫu hoa tặng sinh nhật đẹp và ý nghĩa nhé' },
            { label: '💖 Hoa tặng bạn gái', prompt: 'Mình muốn tìm bó hoa lãng mạn tặng người yêu' },
            { label: '💰 Hoa dưới 500k', prompt: 'Shop có mẫu hoa nào giá dưới 500k không?' },
            { label: '🎉 Hoa khai trương', prompt: 'Tư vấn kệ hoa mừng khai trương đối tác' },
            { label: '🚚 Phí ship & giao hàng', prompt: 'Giao hoa mất bao lâu và phí ship tính thế nào?' },
          ]);
        }
      }
    });
  }

  public sendMessage(text: string) {
    if (!text || !text.trim() || this.isLoading()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: text.trim(),
      time: this.getCurrentTimeString()
    };

    // Append user message
    this.messages.update(msgs => [...msgs, userMsg]);
    this.isLoading.set(true);

    const historyForBackend = this.messages().map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text
    }));

    const lang = this.langService.currentLang();

    this.api.post<any>('/chat/message', {
      message: userMsg.text,
      history: historyForBackend,
      lang
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const data = res.data;
        const assistantMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          text: data?.reply || 'Em đã nhận được yêu cầu ạ! Anh/chị xem qua các mẫu hoa dưới đây nhé:',
          time: this.getCurrentTimeString(),
          products: data?.recommendedProducts || []
        };

        this.messages.update(msgs => [...msgs, assistantMsg]);

        if (!this.isOpen()) {
          this.unreadCount.update(c => c + 1);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg: ChatMessage = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          text: this.langService.currentLang() === 'ko'
            ? '죄송합니다. 일시적인 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
            : 'Dạ hiện tại đường truyền đang bận, anh/chị vui lòng thử lại sau giây lát hoặc nhắn trực tiếp qua hotline của shop nhé! 🌸',
          time: this.getCurrentTimeString()
        };
        this.messages.update(msgs => [...msgs, errorMsg]);
      }
    });
  }

  public clearHistory() {
    this.initWelcomeMessage();
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
