import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVnd',
  standalone: false
})
export class CurrencyVndPipe implements PipeTransform {
  transform(value: number | undefined, isKo: boolean = false): string {
    if (value === undefined || value === null) return '';
    if (isKo) {
      return `${value.toLocaleString('ko-KR')}₫`;
    }
    return `${value.toLocaleString('vi-VN')}đ`;
  }
}
