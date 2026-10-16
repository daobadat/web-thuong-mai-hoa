import { Injectable, signal } from '@angular/core';
import { Lang } from '../models';
import { T } from '../i18n/translations';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  public currentLang = signal<Lang>('vi');

  constructor() {
    const saved = localStorage.getItem('app_lang') as Lang;
    if (saved === 'vi' || saved === 'ko') {
      this.currentLang.set(saved);
      document.documentElement.lang = saved;
    }

    // Synchronize across tabs and storage events
    window.addEventListener('storage', (e) => {
      if (e.key === 'app_lang' && (e.newValue === 'vi' || e.newValue === 'ko')) {
        this.currentLang.set(e.newValue as Lang);
        document.documentElement.lang = e.newValue;
      }
    });
  }

  public setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }

  public toggleLang() {
    const next: Lang = this.currentLang() === 'vi' ? 'ko' : 'vi';
    this.setLang(next);
  }

  public get t() {
    return T[this.currentLang()];
  }
}
