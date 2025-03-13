import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginModel = { mail: '', pwd: '' }; // Nouveau modèle pour le formulaire
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  doLogin() {
    this.loading = true;

    this.authService.login(this.loginModel).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Stocker le token si renvoyé
        this.router.navigate(['/accueil']);
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = "Email ou mot de passe incorrect."; // Message utilisateur
        } else {
          this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        }
        this.loading = false;
      },

    });
  }
}
