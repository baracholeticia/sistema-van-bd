import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag, TagVariant } from '../../components/tags/tags';
import { Buttons } from '../../components/buttons/buttons';
import { ViagensService } from '../../services/viagens.service';

@Component({
  selector: 'app-viagens',
  standalone: true,
  imports: [CommonModule, Tag, Buttons],
  templateUrl: './viagens.html',
  styleUrls: ['./viagens.css']
})
export class Viagens implements OnInit {
  // Carousel state for scheduled trips
  scheduledScrollIndex = 0;

  // Popups state
  showCancelPopup = false;
  cancelTripRef: any = null;
  showTicketPopup = false;
  ticketTripRef: any = null;
  ticketCode = 'ABC123';

  // Dados reais
  nextTrip: any = null;
  scheduledTrips: any[] = [];
  pastTrips: any[] = [];

  constructor(private viagensService: ViagensService) {}

  ngOnInit(): void {
    this.carregarViagens();
  }

  carregarViagens(): void {
    this.viagensService.getViagens().subscribe({
      next: (viagens) => {
        const viagensMapeadas = viagens.map(v => {
          // Extraindo dados de "10/02/2026 08:00"
          const partes = v.departureTime.split(' ');
          const dataString = partes[0] || '01/01/2000';
          const horaString = partes[1] || '00:00';
          const [dia, mes] = dataString.split('/');

          // Definindo origem e destino a partir do routeName (ex: "Garanhuns - Recife")
          const rotaSplited = v.routeName.split('-');
          const origin = rotaSplited[0] ? rotaSplited[0].trim() : 'Origem';
          const destination = rotaSplited[1] ? rotaSplited[1].trim() : 'Destino';

          // Preço (Pega o primeiro preço disponível na rota ou um valor padrão)
          const priceValue = v.prices && v.prices.length > 0 ? v.prices[0].price : 0;
          const priceFormatted = `R$ ${priceValue.toFixed(2).replace('.', ',')}`;

          // Mapeamento de Status
          let variant: TagVariant = 'warning';
          let statusLabel = 'Aguardando';

          switch (v.status) {
            case 'CONFIRMED':
              variant = 'success';
              statusLabel = 'Confirmado';
              break;
            case 'FINISHED':
              variant = 'success';
              statusLabel = 'Finalizado';
              break;
            case 'CANCELLED':
              variant = 'error'; // ou error, dependendo de como está seu enum de TagVariant
              statusLabel = 'Cancelado';
              break;
            default:
              variant = 'warning';
              statusLabel = 'Aguardando';
              break;
          }

          return {
            id: v.id,
            month: this.obterNomeMes(mes),
            day: dia,
            time: horaString,
            origin: origin,
            destination: destination,
            price: priceFormatted,
            vehicle: `Placa: ${v.vehiclePlate}`,
            pickupPoint: 'Ponto de Embarque', // Ajustar caso tenha no DTO no futuro
            driverName: v.driverName,
            driverContact: 'Contato indisponível',
            driverRating: 5.0, // Mock, pode vir do DTO depois
            variant: variant,
            statusLabel: statusLabel,
            originalStatus: v.status
          };
        });

        // Filtrando viagens ativas (Agendadas)
        this.scheduledTrips = viagensMapeadas.filter(
          v => v.originalStatus !== 'FINISHED' && v.originalStatus !== 'CANCELLED'
        );

        // Filtrando viagens passadas
        this.pastTrips = viagensMapeadas.filter(
          v => v.originalStatus === 'FINISHED'
        );

        // Define a "Próxima Viagem" como a primeira da lista de agendadas
        if (this.scheduledTrips.length > 0) {
          this.nextTrip = this.scheduledTrips[0];
        }
      },
      error: (err) => console.error('Erro ao buscar viagens', err)
    });
  }

  obterNomeMes(mesStr: string): string {
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const index = parseInt(mesStr, 10) - 1;
    return meses[index] || '---';
  }

  // Lógicas de UI existentes
  get currentScheduledTrip() {
    return this.scheduledTrips[this.scheduledScrollIndex] ?? null;
  }

  prevScheduled(): void {
    if (this.scheduledScrollIndex > 0) {
      this.scheduledScrollIndex--;
    }
  }

  nextScheduled(): void {
    if (this.scheduledScrollIndex < this.scheduledTrips.length - 1) {
      this.scheduledScrollIndex++;
    }
  }

  openTicketPopup(trip: any): void {
    this.ticketTripRef = trip;
    this.showTicketPopup = true;
  }

  closeTicketPopup(): void {
    this.showTicketPopup = false;
    this.ticketTripRef = null;
  }

  openCancelPopup(trip: any): void {
    this.cancelTripRef = trip;
    this.showCancelPopup = true;
  }

  closeCancelPopup(): void {
    this.showCancelPopup = false;
    this.cancelTripRef = null;
  }

  confirmCancelTrip(): void {
    console.log('Viagem cancelada:', this.cancelTripRef);
    this.closeCancelPopup();
    this.carregarViagens();
  }
}