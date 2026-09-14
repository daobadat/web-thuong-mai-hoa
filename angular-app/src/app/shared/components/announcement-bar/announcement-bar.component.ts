import { Component, inject } from '@angular/core';
import { LangService } from '../../../core/services/lang.service';

@Component({
  selector: 'app-announcement-bar',
  templateUrl: './announcement-bar.component.html',
  styleUrls: ['./announcement-bar.component.css'],
  standalone: false
})
export class AnnouncementBarComponent {
  langService = inject(LangService);
}
