import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchSuggestService, SuggestItem } from '../../../core/services/search-suggest.service';

/** Trạng thái hiển thị của dropdown */
type DropdownState = 'idle' | 'loading' | 'results' | 'empty' | 'error';

/** Mảnh text đã tách để highlight */
interface TextPart {
  text: string;
  isMatch: boolean;
}

@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.css'],
  standalone: false,
})
export class SearchAutocompleteComponent implements OnInit, OnDestroy {
  /** Ngôn ngữ hiện tại (vi / ko) */
  @Input() lang: string = 'vi';

  /** Phát ra khi user muốn xem trang kết quả đầy đủ */
  @Output() searchSubmit = new EventEmitter<string>();

  private suggestService = inject(SearchSuggestService);
  private router = inject(Router);
  private elRef = inject(ElementRef);

  @ViewChild('searchInput', { static: true }) searchInputEl!: ElementRef<HTMLInputElement>;

  searchVal = '';
  suggestions: SuggestItem[] = [];
  showDropdown = false;
  state: DropdownState = 'idle';
  activeIndex = -1;

  private input$ = new Subject<string>();
  private sub?: Subscription;

  private readonly DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=120&h=120&fit=crop';

  ngOnInit(): void {
    this.sub = this.input$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap((val) => {
          if (val.length < 2) {
            this.closeSuggestions();
          }
        }),
        filter((val) => val.length >= 2),
        tap(() => {
          this.state = 'loading';
          this.showDropdown = true;
          this.activeIndex = -1;
        }),
        switchMap((keyword) =>
          this.suggestService.suggest(keyword, this.lang, 8).pipe(
            catchError(() => {
              this.state = 'error';
              return of(null);
            })
          )
        )
      )
      .subscribe((res) => {
        if (!res) return; // error case handled above
        const items = res.data || [];
        this.suggestions = items;
        this.state = items.length > 0 ? 'results' : 'empty';
        this.showDropdown = true;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /* ─── Input & Focus ─── */
  onInputChange(): void {
    this.input$.next(this.searchVal.trim());
  }

  onFocus(): void {
    if (this.searchVal.trim().length >= 2 && this.suggestions.length > 0) {
      this.showDropdown = true;
    }
  }

  /* ─── Keyboard ─── */
  onKeydown(event: KeyboardEvent): void {
    if (!this.showDropdown) {
      if (event.key === 'Enter') {
        this.onSubmit();
      }
      return;
    }

    const totalItems = this.suggestions.length + (this.state === 'results' ? 1 : 0); // +1 for "view all"

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % totalItems;
        this.scrollActiveIntoView();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = this.activeIndex <= 0 ? totalItems - 1 : this.activeIndex - 1;
        this.scrollActiveIntoView();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.activeIndex >= 0 && this.activeIndex < this.suggestions.length) {
          this.goToProduct(this.suggestions[this.activeIndex]);
        } else {
          this.onSubmit();
        }
        break;

      case 'Escape':
        this.closeSuggestions();
        break;
    }
  }

  /* ─── Actions ─── */
  onSubmit(): void {
    const q = this.searchVal.trim();
    this.closeSuggestions();
    this.searchSubmit.emit(q);
  }

  goToProduct(item: SuggestItem): void {
    this.closeSuggestions();
    this.searchVal = '';
    this.router.navigate(['/shop/product', item.id]);
  }

  closeSuggestions(): void {
    this.showDropdown = false;
    this.activeIndex = -1;
  }

  /* ─── Click outside ─── */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeSuggestions();
    }
  }

  /* ─── Highlight helpers ─── */
  highlightParts(name: string): TextPart[] {
    const keyword = this.searchVal.trim();
    if (!keyword || keyword.length < 2) {
      return [{ text: name, isMatch: false }];
    }

    const parts: TextPart[] = [];
    const lowerName = name.toLowerCase();
    const lowerKey = keyword.toLowerCase();
    let startIdx = 0;

    while (startIdx < name.length) {
      const matchIdx = lowerName.indexOf(lowerKey, startIdx);
      if (matchIdx === -1) {
        parts.push({ text: name.slice(startIdx), isMatch: false });
        break;
      }
      if (matchIdx > startIdx) {
        parts.push({ text: name.slice(startIdx, matchIdx), isMatch: false });
      }
      parts.push({ text: name.slice(matchIdx, matchIdx + keyword.length), isMatch: true });
      startIdx = matchIdx + keyword.length;
    }

    return parts;
  }

  /* ─── Format price VND ─── */
  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN') + 'đ';
  }

  /* ─── Image fallback ─── */
  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = this.DEFAULT_IMAGE;
  }

  /* ─── Scroll active item into view ─── */
  private scrollActiveIntoView(): void {
    setTimeout(() => {
      const el = this.elRef.nativeElement.querySelector('.search-ac-item--active');
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }
}
