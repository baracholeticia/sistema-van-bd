import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interface alinhada com DriverAdminResponseDTO do backend
export interface Motorista {
  id: string;
  name: string;
  email: string;
  phone: string;
  cnh: string;
  birthDate: string;
  registrationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
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
export class MotoristaService {

  private readonly API_URL = `${environment.apiUrl}/api/admin`;
  constructor(private http: HttpClient) { }

  listar(page = 0, size = 100): Observable<Motorista[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http
      .get<PageResponse<Motorista>>(`${this.API_URL}/drivers`, { params })
      .pipe(map(response => response.content));
  }

  editar(motorista: Partial<Motorista> & { id: string }): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.API_URL}/drivers/${motorista.id}`, motorista);
  }

  excluir(id: any): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/drivers/${id}`);
  }
}