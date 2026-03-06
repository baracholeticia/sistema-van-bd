import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosService } from '../../services/relatorios.service';

export interface DetalhesViagem {
  travelId: string;
  driverName: string;
  vehicleModel: string;
  vehiclePlate: string;
  routeName: string;
  departureTime: Date | string;
  status: string;
}

export interface RelatorioFinanceiro {
  travelId: string;
  routeName: string;
  departureTime: Date | string;
  totalPassengers: number;
  totalRevenue: number;
}

export interface RankingMotorista {
  driverId: string;
  driverName: string;
  averageRating: number;
  totalFeedbacks: number;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.html' // Ou relatorios.component.html (depende do seu arquivo real)
})
export class RelatoriosComponent implements OnInit {

  detalhesViagens: DetalhesViagem[] = [];
  relatoriosFinanceiros: RelatorioFinanceiro[] = [];
  rankingMotoristas: RankingMotorista[] = [];

  constructor(private relatoriosService: RelatoriosService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.relatoriosService.getDetalhesViagens().subscribe({
      next: (dados) => this.detalhesViagens = dados,
      error: (erro) => console.error('Erro ao buscar viagens', erro)
    });

    this.relatoriosService.getRelatoriosFinanceiros().subscribe({
      next: (dados) => this.relatoriosFinanceiros = dados,
      error: (erro) => console.error('Erro ao buscar financeiro', erro)
    });

    this.relatoriosService.getRankingMotoristas().subscribe({
      next: (dados) => this.rankingMotoristas = dados,
      error: (erro) => console.error('Erro ao buscar ranking', erro)
    });
  }
}