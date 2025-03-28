import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apiUrl = `${environment.apiUrl}/rendezvous`;
  private mecanicien = `${environment.apiUrl}/mecanicien`;
   
  constructor(private http : HttpClient) { }

  saveRendezVous( date_rdv : string , creneauChoisi : number[] , service_id: string , id_voiture: string) : Observable<any>{
    const token = localStorage.getItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const userId = localStorage.getItem('userId');
    const body = {
      "client_id" : userId,
      "date_rdv" : date_rdv,
      "creneauChoisi" : creneauChoisi,
      "service_id" : service_id,
      "id_voiture" : id_voiture
    }

    return this.http.post(`${this.apiUrl}/save`,body);
  }

  getRendezVousMecanicienSemaine(){

  }  


}


