import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.css',
})
export class LayoutMainComponent implements OnInit {
  isExpanded = false;
  user: any;

  constructor(private utilisateurService: UtilisateurService,private router: Router) {}

  changeClass() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const id = localStorage.getItem('userId');
    if (!id) {
      console.warn('Aucun ID utilisateur trouvé dans le localStorage.');
      return;
    }

    const cachedUser = localStorage.getItem('userData');

    if (cachedUser) {
      this.user = JSON.parse(cachedUser); // Utilisation du cache
    } else {
      this.utilisateurService.getUtilisateurByIdVehicule(id).subscribe({
        next: (response) => {
          this.user = response;
          localStorage.setItem('userData', JSON.stringify(response));
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données', error);
          this.user = null;
        },
      });
    }
  }

  logout(){
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    this.user = null;
    this.router.navigate(['/login']);
  }
}
