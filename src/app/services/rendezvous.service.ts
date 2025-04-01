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

  updateRendezVous(value : any) : Observable<any> {
    const token = localStorage.getItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      "_id" : value._id,
      "date_rdv" : value.date_rdv,
      "heure_rdv" : value.heure_rdv,
      "mecanicien_id" : value.mecanicien_id
    }

    return this.http.put(`${this.apiUrl}/update`,body);

  }

  convertIsoStringDateWithoutUTC(date : string) : string{
    
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    const dateUtc = `${year}-${month}-${day}T00:00:00.000Z`;
    return dateUtc;
  }


  getRendezVousEmploye() : Observable<any[]>{
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    const employeId = localStorage.getItem('userId');
    return this.http.get<any[]>(`${this.apiUrl}/employe/${employeId}`)
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

  getReparationForRendezVous(id_rendezvous: string) :  Observable<any>{
     const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.get<any>(`${this.apiUrl}/reparation/${id_rendezvous}`);
  }

  // rendez vous rehetra ny client iray
  getRdvByIdClient(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userId = localStorage.getItem('userId');
    return this.http.get<any>(this.apiUrl+'/mes-rdv/'+userId,{headers});
  }

  // annuler rdv
  annulerRdv(rdv_id : string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(this.apiUrl+'/annuler/'+rdv_id,{headers});
  }

  convertRdvMecanicienToEvent(listeRdv: any[]) : any[] {
    const events: any[] = [];
  
    for (const rdv of listeRdv) {
      const dateRdv = new Date(rdv.date_rdv);
      const heureRdv = rdv.heure_rdv; 
      const startDate = new Date(dateRdv); 
      startDate.setHours(heureRdv.hours);
      startDate.setMinutes(heureRdv.minutes);
  
      const duree = rdv.service_id.duree;
      const endDate = new Date(startDate);
      endDate.setTime(startDate.getTime() + (duree.hours * 60 + duree.minutes) * 60 * 1000);
  
      // Création de l'événement
      const newEvent = {
        _id : rdv._id,
        title: `${rdv.service_id.libelle}`,
        start: startDate.toISOString(), 
        end: endDate.toISOString(),     
        allDay: false,
        icon : `🔧`,
      };
  
      events.push(newEvent); 
    }
    return events; 
  }

  convertRdvManagerToEvent(listeRdvManager : any[]) : any[] {
    const events : any[] = [];
    let colors = ['#71EADD','#719BB7','#083530','#F8DBB4','#9796E8'] 
    let i = 0;
    for(const rdvmecanicien of listeRdvManager){
      for(const rdv of rdvmecanicien.rendez_vous_semaine){
        const dateRdv = new Date(rdv.date_rdv);
        const heureRdv = rdv.heure_rdv;
        const startDate = new Date(dateRdv); 
        startDate.setHours(heureRdv.hours);
        startDate.setMinutes(heureRdv.minutes);   
        const duree = rdv.service_id.duree;
        const endDate = new Date(startDate);
        endDate.setTime(startDate.getTime() + (duree.hours * 60 + duree.minutes) * 60 * 1000);
        
        const newEvent = {
          _id : rdv._id,
          title: `${rdv.service_id.libelle}`,
          start: startDate.toISOString(), 
          end: endDate.toISOString(),     
          allDay: false,
          backgroundColor: `${colors[i]}`,
          eventResizable: false,  
        };
  
        events.push(newEvent);
      }
      i++;
    }

    return events;
  }

}
