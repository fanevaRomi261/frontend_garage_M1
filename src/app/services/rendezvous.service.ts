import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apiUrl = `${environment.apiUrl}/rendezvous`;
  // private mecanicienUrl = `${environment.apiUrl}/mecanicien`;
   
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

  getRendezVousMecanicienSemaine() : Observable<any[]>{
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    const mecanicienId = localStorage.getItem('userId');
    return this.http.get<any[]>(`${this.apiUrl}/mecanicien/${mecanicienId}`);
  }
  
  getRendezVousManager() : Observable<any[]>{
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/manager`);    
  }

  getRendezVousById(_idRendezvous : any) : Observable<any>{
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    const body = {
      "_idRendezvous" : _idRendezvous
    }; 

    return this.http.post<any>(`${this.apiUrl}/find`,body);
  }
  

  convertRdvMecanicienToEvent(listeRdv: any[]) {
    const events: any[] = [];
  
    for (const rdv of listeRdv) {
      const dateRdv = new Date(rdv.date_rdv);
      const heureRdv = rdv.heure_rdv; 
      const startDate = new Date(dateRdv); 
      startDate.setHours(heureRdv.hours);
      startDate.setMinutes(heureRdv.minutes);
  
      const duree = rdv.service_id.duree;
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + duree.hours);
      endDate.setMinutes(startDate.getMinutes() + duree.minutes);
  
      // Création de l'événement
      const newEvent = {
        _id : rdv._id,
        title: `${rdv.service_id.libelle}`,
        start: startDate.toISOString(), 
        end: endDate.toISOString(),     
        allDay: false,
        icon : `🔧`,
      };

      console.log(newEvent);
  
      events.push(newEvent); 
    }
  
    return events; 
  }
  

}


