import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from './pipes/currency-vnd.pipe';
import { AnnouncementBarComponent } from './components/announcement-bar/announcement-bar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { SearchAutocompleteComponent } from './components/search-autocomplete/search-autocomplete.component';

@NgModule({
  declarations: [
    CurrencyVndPipe,
    AnnouncementBarComponent,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    AiChatComponent,
    SearchAutocompleteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyVndPipe,
    AnnouncementBarComponent,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    AiChatComponent,
    SearchAutocompleteComponent
  ]
})
export class SharedModule { }
