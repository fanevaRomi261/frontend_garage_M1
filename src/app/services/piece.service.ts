import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private apiUrl = `${environment.apiUrl}/piece`;

  constructor(private http: HttpClient) { }

  getListePiece(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl,{headers});
  }

  insererPiece(piece: { libelle: string; prix: string ;type_vehicule_id: string[] ;}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}`, piece,{headers});
  }

  modifierPiece(piece_id : string,piece: { libelle: string; prix: string ;type_vehicule_id: string[] ;}): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/`+piece_id, piece,{headers});
  }
}
