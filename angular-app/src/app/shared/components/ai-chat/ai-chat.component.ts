import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AiChatService, ChatProduct } from '../../../core/services/ai-chat.service';
import { LangService } from '../../../core/services/lang.service';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css'],
  standalone: false
})
export class AiChatComponent implements AfterViewChecked {
  public chatService = inject(AiChatService);
  public langService = inject(LangService);
  public cartService = inject(CartService);
  public productService = inject(ProductService);
  private router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  public inputText: string = '';
  private shouldScroll: boolean = false;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  public scrollToBottom(): void {
    try {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // ignore
    }
  }

  public handleSend(): void {
    if (!this.inputText.trim() || this.chatService.isLoading()) return;
    const text = this.inputText;
    this.inputText = '';
    this.shouldScroll = true;
    this.chatService.sendMessage(text);
  }

  public handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }

  public handleSelectSuggestion(prompt: string): void {
    this.shouldScroll = true;
    this.chatService.sendMessage(prompt);
  }

  public viewProduct(prod: ChatProduct): void {
    this.router.navigate(['/shop/product', prod.id]);
    // On mobile we might close or keep open
    if (window.innerWidth < 768) {
      this.chatService.closeChat();
    }
  }

  public addProductToCart(prod: ChatProduct): void {
    // Find matching full product from ProductService or build minimal Product
    const fullProd = this.productService.products().find(p => String(p.id) === String(prod.id));
    const targetProduct: Product = fullProd || {
      id: String(prod.id),
      nameVi: prod.nameVi,
      nameKo: prod.nameKo || prod.nameVi,
      price: prod.price,
      occasions: [],
      category: prod.category || 'bo-hoa',
      img: prod.img || 'https://images.unsplash.com/photo-1680563094046-5d846e2c59d1?w=500&h=620&fit=crop&auto=format',
      descVi: prod.descVi || '',
      descKo: '',
      stock: 99
    };

    this.cartService.addToCart(targetProduct, 1);
  }
}
