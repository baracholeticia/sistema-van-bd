import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TravelPriceDTO {
  boardingStopId: string;
  dropOffStopId: string;
  price: number;
}

export interface TravelResponseDTO {
  id: string; 
  departureTime: string;
  status: string;
  driverName: string;
  vehiclePlate: string;
  routeName: string;
  prices: TravelPriceDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/journeys'; 
  private rateApiUrl = 'http://localhost:8080/api/rates';

 
  getJourneys(): Observable<TravelResponseDTO[] | any> {
    return this.http.get<TravelResponseDTO[] | any>(this.apiUrl);
  }

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicles`);
  }

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/routes`);
  }

  // Criar nova viagem (POST)s
  addJourney(journey: any): Observable<TravelResponseDTO> {
    return this.http.post<TravelResponseDTO>(this.apiUrl, journey);
  }

  // Atualizar viagem existente (PUT) - O ID agora é string (UUID)
  updateJourney(id: string, journey: any): Observable<TravelResponseDTO> {
    return this.http.put<TravelResponseDTO>(`${this.apiUrl}/${id}`, journey);
  }

  // Deletar viagem (DELETE) - O ID agora é string (UUID)
  deleteJourney(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---- Exemplo para a tarifa ----
  getRate(): Observable<{ value: number }> {
    return this.http.get<{ value: number }>(this.rateApiUrl);
  }

  updateRate(value: number): Observable<any> {
    return this.http.put(this.rateApiUrl, { value });
  }
}