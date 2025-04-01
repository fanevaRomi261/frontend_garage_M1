import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  public planningRouter = "/planning";

  userRole!: string;

  ngOnInit() : void{
    this.loadUserRoleAndPermissions();
  }

  loadUserRoleAndPermissions(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const infoUser = JSON.parse(userData);
      this.userRole = infoUser.profil_id.libelle.toLowerCase();
    }
  }



}
