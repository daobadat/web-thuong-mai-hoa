import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService, AuthUser } from '../../core/services/auth-api.service';
import { UserApiService } from '../../core/services/user-api.service';
import { LangService } from '../../core/services/lang.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: AuthUser | null = null;
  
  formData = {
    full_name: '',
    phone: '',
    preferred_language: 'vi'
  };

  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public authApi: AuthApiService,
    private userApi: UserApiService,
    public langService: LangService
  ) {}

  ngOnInit() {
    this.user = this.authApi.currentUser();
    if (this.user) {
      this.formData.full_name = this.user.full_name || '';
      this.formData.phone = this.user.phone || '';
      this.formData.preferred_language = this.user.preferred_language || 'vi';
    }
  }

  saveProfile() {
    if (!this.formData.full_name) {
      this.errorMessage = this.langService.currentLang() === 'vi' ? 'Vui lòng nhập họ tên' : '이름을 입력해주세요';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userApi.updateProfile(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = this.langService.currentLang() === 'vi' ? 'Cập nhật thành công!' : '성공적으로 업데이트되었습니다!';
        // Reload user info
        this.authApi.getMe().subscribe();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Lỗi cập nhật';
      }
    });
  }
}
