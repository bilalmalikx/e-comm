import { Component } from '@angular/core';
import { UpdateMeRequest, User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { LoaderService } from '../../core/services/loader.service';
import { finalize } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile {
  user: User = {} as User;
  formData: UpdateMeRequest = {};
  dropdownOpen = false;

  constructor(private userService: UserService, public loader: LoaderService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loader.show();
    this.userService
      .getMe()
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res) => {
          this.user = res;
          this.formData = { ...res };
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        },
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectGender(value: string) {
    this.formData.gender = value;
    this.dropdownOpen = false;
  }

  updateProfile() {
    this.loader.show();
    this.userService
      .updateMe(this.formData)
      .pipe(finalize(() => this.loader.hide()))
      .subscribe({
        next: (res) => {
          this.user = res;
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          alert('Profile update failed!');
        },
      });
  }
}
