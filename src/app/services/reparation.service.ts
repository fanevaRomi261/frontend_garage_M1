import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReparationService {
  private apiUrl = `${environment.apiUrl}/reparation`;

  constructor(private http: HttpClient) { }

  // liste reparation d'un vehicule selectionne
  getReparationsByVehiculeId (vehicule_id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl+'/vehicule/'+vehicule_id,{headers});
  }
}


