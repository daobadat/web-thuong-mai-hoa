import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public isVisible = signal<boolean>(false);
  public message = signal<string>('');

  private timeoutId: any;

  show(msg: string, duration: number = 3000) {
    this.message.set(msg);
    this.isVisible.set(true);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isVisible.set(false);
    }, duration);
  }
}
