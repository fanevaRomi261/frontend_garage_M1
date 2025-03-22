import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePasswordForm : FormGroup;

  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    this.changePasswordForm = new FormGroup({
      oldPwd: new FormControl('', [Validators.required]),
      newPwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const { oldPwd, newPwd } = this.changePasswordForm.value;
      this.authService.changerPwd(oldPwd, newPwd).subscribe({
        next: () => {
          this.isLoading = false;
          localStorage.setItem('mustChangePassword', 'false');
          alert('Mot de passe modifié avec succès');
          this.router.navigate(['/accueil']);
        },
        error: (error) => {
          this.isLoading = false;
          alert(error.error.message);
        },
      });
    }
  }
}
