import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { UtilisateurService } from './utilisateur.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    const id = localStorage.getItem('userId');
    return !!id;
  }

  mustChangePwd() : boolean{
    return localStorage.getItem('mustChangePassword') === 'true'; 
  }

  getUserProfile(): string | null {
    const user = localStorage.getItem('userData');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.profil_id?.libelle || null;
    }
    return null;
  }

  login(credentials: { mail: string; pwd: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Inscription
  register(utilisateur: { nom: string; prenom: string; mail: string; pwd: string; dtn: string; contact: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, utilisateur);
  }

  // Pour garantir que userData soit disponible avant de continuer, 
  // de mila m-retourne Promise 
  // ou attendre explicitement la fin de l'opération asynchrone, satria non bloquant
  setUserInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = localStorage.getItem('userId');
      if (!id) {
        console.warn('Aucun ID utilisateur trouvé dans le localStorage.');
        resolve();
        return;
      }
  
      const cachedUser = localStorage.getItem('userData');
      if (cachedUser) {
        resolve();
        return;
      }
  
      // Appel API et stockage dans localStorage
      this.utilisateurService.getUtilisateurById(id).subscribe({
        next: (response) => {
          localStorage.setItem('userData', JSON.stringify(response));
          resolve(); // Résoudre une fois les données stockées
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données utilisateur', error);
          reject(error); // Rejeter en cas d'erreur
        }
      });
    });
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
  }

  changerPwd(oldPwd: string, newPwd: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/change-pwd`,{ oldPwd, newPwd },{ headers });
  }
}