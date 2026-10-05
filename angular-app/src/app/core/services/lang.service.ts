import { Injectable, signal } from '@angular/core';
import { Lang } from '../models';
import { T } from '../i18n/translations';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  public currentLang = signal<Lang>('vi');

  public setLang(lang: Lang) {
    this.currentLang.set(lang);
    // Cập nhật thuộc tính lang trên <html> để CSS html[lang='ko'] hoạt động
    document.documentElement.lang = lang;
  }

  public get t() {
    return T[this.currentLang()];
  }
}
