import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Cliente {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  role: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API_URL = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) { }

  listar(page = 0, size = 100): Observable<Cliente[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    return this.http
      .get<PageResponse<Cliente>>(`${this.API_URL}/clients`, { params })
      .pipe(map(response => response.content));
  }

  adicionar(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.API_URL}/clients`, cliente);
  }
  
  editar(id: string, payload: any): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API_URL}/clients/${id}`, payload);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clients/${id}`);
  }
}