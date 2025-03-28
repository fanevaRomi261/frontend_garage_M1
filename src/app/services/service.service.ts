import { Injectable } from '@angular/core';
import { environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../model/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/service`;

  constructor(private http: HttpClient) { }

  getServices() : Observable<Service[]>{
    return this.http.get<Service[]>(this.apiUrl);
  }

  findServiceById(idService : string) : Observable<Service>{
    return this.http.get<Service>(this.apiUrl+'/find/'+idService);   
  }

  
  
  
}
