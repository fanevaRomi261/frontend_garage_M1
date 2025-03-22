import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

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

  constructor(private utilisateurService: UtilisateurService,private router: Router,private authService: AuthService) {}

  changeClass() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    await this.authService.setUserInfo(); // Attendre que les données soient chargées
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout(); // Appelle directement le service
  }
}
