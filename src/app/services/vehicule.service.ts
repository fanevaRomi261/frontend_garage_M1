import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule } from '../model/vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicule`;

  constructor(private http: HttpClient) { }

  getUserVehicule(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userId = localStorage.getItem('userId');
    return this.http.get(this.apiUrl+'/utilisateur/'+userId, { headers });
  }

  getUserVehiculeByIsma(): Observable<Vehicule[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userId = localStorage.getItem('userId');
    return this.http.get<Vehicule[]>(this.apiUrl+'/utilisateur/'+userId, { headers });
  }

  insererVehicule(vehicule: { immatriculation: string; modele: string ;marque: string ;type_vehicule_id: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}`, vehicule,{headers});
  }

  getVehiculeByIdVehicule(vehicule_id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl+'/'+vehicule_id, { headers });
  }

  getVehiculeByIdVehiculeByIsma(vehicule_id : string): Observable<Vehicule>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Vehicule>(this.apiUrl+'/'+vehicule_id, { headers });
  }

  modifierVehicule(vehicule_id : string,vehicule: { immatriculation: string; modele: string ;marque: string ;type_vehicule_id: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/`+vehicule_id, vehicule,{headers});
  }
}
