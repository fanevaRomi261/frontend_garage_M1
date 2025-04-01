import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  commencerReparation(mecanicien_id : string , rendez_vous_id : string, date_debut : string) : Observable<any>{
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const date_fin = "0";
    const prix_main_doeuvre = 0;

    const body = {
      "mecanicien_id" : mecanicien_id,
      "rendez_vous_id" : rendez_vous_id,
      "date_debut" : date_debut,
      "date_fin" : date_fin,
      "prix_main_doeuvre" : prix_main_doeuvre
    }

    return this.http.post<any>(`${this.apiUrl}/commencer`, body, { headers }).pipe(
      catchError((error) => {
        let errorMessage = 'Une erreur est survenue.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(errorMessage); // Propage le message d'erreur
      })
    );
  }

  terminerReparation(reparation_id : string,rendez_vous_id : string,date_fin : string, observation: string,prix_main_doeuvre : number) : Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const body = {
      "reparation_id" : reparation_id,
      "rendez_vous_id" : rendez_vous_id,
      "date_fin" :  date_fin,
      "observation" : observation,
      "prix_main_doeuvre" : prix_main_doeuvre
    }

    return this.http.post<any>(`${this.apiUrl}/terminer`,body);
  }

  payerReparation(rendez_vous_id: string) : Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    const body = {
      "rendez_vous_id" : rendez_vous_id
    }

    return this.http.post<any>(`${this.apiUrl}/payer`,body);
  }

  getReparationById(id_reparation: string) :  Observable<any>{
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/find/${id_reparation}`);
  }

  formatDate(date : Date) : string{
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


}


