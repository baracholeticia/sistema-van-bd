import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalhesViagem, RelatorioFinanceiro, RankingMotorista } from '../pages/relatorios/relatorios';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  
  // Atualizado para o seu novo caminho base
  private apiUrl = 'http://localhost:8080/api/reports'; 

  constructor(private http: HttpClient) {}

  getDetalhesViagens(): Observable<DetalhesViagem[]> {
    return this.http.get<DetalhesViagem[]>(`${this.apiUrl}/travel-details`);
  }

  getRelatoriosFinanceiros(): Observable<RelatorioFinanceiro[]> {
    return this.http.get<RelatorioFinanceiro[]>(`${this.apiUrl}/financial`);
  }

  getRankingMotoristas(): Observable<RankingMotorista[]> {
    return this.http.get<RankingMotorista[]>(`${this.apiUrl}/driver-ranking`);
  }
}