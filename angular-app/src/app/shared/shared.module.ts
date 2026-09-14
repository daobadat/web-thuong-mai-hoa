import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CurrencyVndPipe } from './pipes/currency-vnd.pipe';
import { AnnouncementBarComponent } from './components/announcement-bar/announcement-bar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    CurrencyVndPipe,
    AnnouncementBarComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    CurrencyVndPipe,
    AnnouncementBarComponent,
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
