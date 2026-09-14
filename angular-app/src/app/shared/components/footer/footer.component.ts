import { Component, inject } from '@angular/core';
import { LangService } from '../../../core/services/lang.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent {
  langService = inject(LangService);
}
