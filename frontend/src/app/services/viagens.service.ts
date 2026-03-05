import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TravelPriceDTO {
  distance: string;
  price: number;
}

export interface TravelResponseDTO {
  id: string;
  departureTime: string; // Formato esperado: "dd/MM/yyyy HH:mm"
  status: string;
  driverName: string;
  vehiclePlate: string;
  routeName: string;
  prices: TravelPriceDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class ViagensService {
  private apiUrl = 'http://localhost:8080/api/travels';

  constructor(private http: HttpClient) { }

  getViagens(): Observable<TravelResponseDTO[]> {
    return this.http.get<TravelResponseDTO[]>(this.apiUrl);
  }
}