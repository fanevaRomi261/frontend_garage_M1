import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '../model/time.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/planning`
  constructor(private http: HttpClient) { }

  getCreneauPropose(service_id: string, date_rdv: string) : Observable<any>{
    const body = {
      "service_id" : service_id,
      "date_rdv": date_rdv
    }
    return this.http.post(`${this.apiUrl}/proposeCreneau`,body);
  }







}
