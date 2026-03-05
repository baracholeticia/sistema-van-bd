import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleResponseDTO {
  id: string;
  plate: string;
  model: string;
  seatsQuantity: number;
  driverId: string;
  driverName: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:8080/api/vehicles';

  constructor(private http: HttpClient) { }

  findAll(): Observable<VehicleResponseDTO[]> {
    return this.http.get<VehicleResponseDTO[]>(this.apiUrl);
  }
}