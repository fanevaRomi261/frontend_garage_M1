import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Observable } from 'rxjs';

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

  async doLogin() {
    this.loading = true;

    this.authService.login(this.loginModel).subscribe({
      next: async (response) => {
        // console.log(response);
        this.authService.clearCache();
        localStorage.setItem('authToken', response.token); // Stocker le token si renvoyé
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('mustChangePassword',response.mustChangePassword.toString());
        await this.authService.setUserInfo();
        // console.log(localStorage.getItem("userData"));
        this.loading = false;
        if (response.mustChangePassword) {
          alert("Vous devez changer votre mot de passe !!!");
          this.router.navigate(['/change-password']);
        } else {
          this.router.navigate(['/accueil']);
        }
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Email ou mot de passe incorrect.'; // Message utilisateur
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
        this.loading = false;
      },
    });
  }
}
