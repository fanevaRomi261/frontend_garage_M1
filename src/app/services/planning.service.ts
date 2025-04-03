import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '../model/time.model';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/planning`;
  constructor(private http: HttpClient) {}

  getCreneauPropose(service_id: string, date_rdv: string): Observable<any> {
    const body = {
      service_id: service_id,
      date_rdv: date_rdv,
    };

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/proposeCreneau`, body,{headers});
  }

  getMecanicienPropose(date_rdv: string,id_rendezvous: string,creneauChoisi: number[]) : Observable<any[]> {
    const token = localStorage.getItem('authToken');

    const body = {
      date_rdv: date_rdv,
      id_rendezvous: id_rendezvous,
      creneauChoisi: creneauChoisi,
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any[]>(`${this.apiUrl}/mecanicien/libre`,body,{headers});
  }

  

  convertStringToIntervalle(horaire: string): number[] {
    const [start, end] = horaire.split('&').map((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    return [start, end];
  }
}
