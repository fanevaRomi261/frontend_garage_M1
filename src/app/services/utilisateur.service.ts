import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateur`;

  constructor(private http: HttpClient) { }

  getUtilisateurById(id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl+'/'+id, { headers });
  }

  getListeMecanicien(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl+'/mecanicien', { headers });
  }

  ajoutMecanicien(utilisateur: { nom: string; prenom: string; mail: string; dtn: string; contact: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/mecanicien`, utilisateur,{ headers });
  }

  desactiverUtilisateur(user_id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // console.log("token"+token);
    return this.http.put(`${this.apiUrl}/desactiver/`+user_id,{},{ headers });
  }

  activerUtilisateur(user_id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/activer/`+user_id,{},{ headers });
  }

  modifierMecanicien(mecanicien_id : string,mecanicien: { nom: string; prenom: string; mail: string; dtn: string; contact: string; isActif:number }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/mecanicien/`+mecanicien_id, mecanicien,{headers});
  }
}
