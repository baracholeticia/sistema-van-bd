import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViagensService {
  private apiUrl = 'http://localhost:8080/api/travels';

  constructor(private http: HttpClient) { }

  getViagens(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createViagem(viagem: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, viagem);
  }

  updateViagem(id: string, viagem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, viagem);
  }

  cancelViagem(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
  }
}