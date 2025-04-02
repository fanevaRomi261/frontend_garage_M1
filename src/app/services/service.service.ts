import { Injectable } from '@angular/core';
import { environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../model/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/service`;

  constructor(private http: HttpClient) { }

  getServices() : Observable<Service[]>{
     const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });
    return this.http.get<Service[]>(this.apiUrl,{headers});
  }

  findServiceById(idService : string) : Observable<Service>{
    const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
    });
    return this.http.get<Service>(`${this.apiUrl}/find/${idService}`, {headers});   
  }

  
  
  
}
