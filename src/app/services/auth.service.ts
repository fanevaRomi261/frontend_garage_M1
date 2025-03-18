import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null); // État de l'utilisateur
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: { mail: string; pwd: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(utilisateur: { nom: string; prenom: string ;mail: string ;pwd: string ;dtn: string ;contact: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, utilisateur);
  }
}
