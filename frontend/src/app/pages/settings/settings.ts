import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViagensService } from '../../services/viagens.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html' 
})
export class SettingsComponent implements OnInit {
  
  // --- BARRA DE PESQUISA ---
  searchQuery = signal('');

  // ==========================================
  // DADOS E CONTROLES DE ROTAS
  // ==========================================
  allRoutes = signal<any[]>([
    {
      id: 1,
      name: 'Recife - Campina Grande',
      stops: [{ name: 'Recife' }, { name: 'Caruaru' }, { name: 'Campina Grande' }],
      segments: [
        { origin: 'Recife', destination: 'Caruaru', price: 45.0 },
        { origin: 'Caruaru', destination: 'Campina Grande', price: 60.0 },
        { origin: 'Recife', destination: 'Campina Grande', price: 105.0 }
      ]
    }
  ]);

  showAddRouteModal = false;
  showEditRouteModal = false;
  showDeleteRouteModal = false;
  showRouteDetailsModal = false;
  
  selectedRoute: any = null;

  newRoute: any = {
    name: '',
    stops: [{ name: '' }],
    segments: [{ origin: '', destination: '', price: null }]
  };

  // ==========================================
  // DADOS E CONTROLES DE RESERVAS (NOVO)
  // ==========================================
  reservations = signal<any[]>([
    { id: 1, clientName: 'Ana Clara', driverName: 'Carlos Almeida', tripName: 'Recife - Campina Grande', status: 'Confirmada' },
    { id: 2, clientName: 'Roberto Alves', driverName: 'Mariana Santos', tripName: 'Caruaru - Garanhuns', status: 'Cancelada' },
    { id: 3, clientName: 'João da Silva', driverName: 'Carlos Almeida', tripName: 'Recife - Campina Grande', status: 'Confirmada' }
  ]);


  // ==========================================
  // DADOS E CONTROLES DE VIAGENS
  // ==========================================
  allTrips = signal<any[]>([]);

  trips = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.allTrips();

    return this.allTrips().filter(trip => 
      trip.driverName.toLowerCase().includes(query) ||
      trip.routeName.toLowerCase().includes(query) ||
      trip.vehiclePlate.toLowerCase().includes(query)
    );
  });

  showReviewsModal = false;
  showEditTripModal = false;
  showDeleteTripModal = false;
  showAddTripModal = false;
  
  selectedTrip: any = null;
  
  newTrip: any = {
    driverName: '',
    dateTime: '',
    pickupPoint: '',
    dropoffPoint: '',
    status: 'SCHEDULED', 
    pricePerKm: 0
  };

  showDeleteModal = false;
  selectedJourney: any = null;

  constructor(private viagensService: ViagensService) {}

  ngOnInit() {
    this.carregarViagens();
  }

  // ==========================================
  // FUNÇÕES DE ROTAS
  // ==========================================
  openAddRouteModal() {
    this.newRoute = { name: '', stops: [{ name: '' }], segments: [{ origin: '', destination: '', price: null }] };
    this.showAddRouteModal = true;
  }

  addStop() { this.newRoute.stops.push({ name: '' }); }
  removeStop(index: number) { this.newRoute.stops.splice(index, 1); }
  addSegment() { this.newRoute.segments.push({ origin: '', destination: '', price: null }); }
  removeSegment(index: number) { this.newRoute.segments.splice(index, 1); }

  saveNewRoute() {
    const routeToSave = { id: Math.floor(Math.random() * 1000) + 100, ...this.newRoute };
    this.allRoutes.update(list => [...list, routeToSave]);
    this.closeRouteModals();
  }

  openEditRouteModal(route: any) {
    this.selectedRoute = JSON.parse(JSON.stringify(route)); 
    this.showEditRouteModal = true;
  }

  addStopEdit() { this.selectedRoute.stops.push({ name: '' }); }
  removeStopEdit(index: number) { this.selectedRoute.stops.splice(index, 1); }
  addSegmentEdit() { this.selectedRoute.segments.push({ origin: '', destination: '', price: null }); }
  removeSegmentEdit(index: number) { this.selectedRoute.segments.splice(index, 1); }

  saveRouteEdit() {
    this.allRoutes.update(list => list.map(r => r.id === this.selectedRoute.id ? this.selectedRoute : r));
    this.closeRouteModals();
  }

  openRouteDetails(route: any) {
    this.selectedRoute = route;
    this.showRouteDetailsModal = true;
  }

  openDeleteRouteModal(route: any) {
    this.selectedRoute = route;
    this.showDeleteRouteModal = true;
  }

  deleteRoute() {
    this.allRoutes.update(list => list.filter(r => r.id !== this.selectedRoute.id));
    this.closeRouteModals();
  }

  closeRouteModals() {
    this.showAddRouteModal = false;
    this.showEditRouteModal = false;
    this.showDeleteRouteModal = false;
    this.showRouteDetailsModal = false;
    this.selectedRoute = null;
  }

  // ==========================================
  // FUNÇÕES DE RESERVAS (NOVO)
  // ==========================================
  toggleReservationStatus(reservation: any) {
    // Alterna o status entre Confirmada e Cancelada
    const novoStatus = reservation.status === 'Confirmada' ? 'Cancelada' : 'Confirmada';
    
    // Atualiza o signal
    this.reservations.update(list => 
      list.map(r => r.id === reservation.id ? { ...r, status: novoStatus } : r)
    );
  }

  // ==========================================
  // FUNÇÕES DE VIAGENS
  // ==========================================
  carregarViagens() {
    this.viagensService.getViagens().subscribe({
      next: (dados) => {
        const viagensFormatadas = dados.map((viagem: any) => {
          const [dataStr, horaStr] = viagem.departureTime.split(' ');
          const [dia, mes, ano] = dataStr.split('/');
          const isoDateString = `${ano}-${mes}-${dia}T${horaStr}:00`;

          let statusTraduzido = 'Agendada';
          if (viagem.status === 'CONFIRMED' || viagem.status === 'SCHEDULED') statusTraduzido = 'Agendada';
          else if (viagem.status === 'FINISHED' || viagem.status === 'COMPLETED') statusTraduzido = 'Concluída';
          else if (viagem.status === 'CANCELED' || viagem.status === 'CANCELLED') statusTraduzido = 'Cancelada';

          return {
            id: viagem.id,
            driverName: viagem.driverName || 'Sem motorista',
            dateTime: isoDateString,
            pickupPoint: viagem.routeName.split('-')[0]?.trim() || 'Ponto A',
            dropoffPoint: viagem.routeName.split('-')[1]?.trim() || 'Ponto B',
            status: statusTraduzido,
            originalStatus: viagem.status, 
            routeName: viagem.routeName,
            vehiclePlate: viagem.vehiclePlate,
            pricePerKm: viagem.prices && viagem.prices.length > 0 ? viagem.prices[0].price : 0,
            tripName: viagem.routeName,
            reviews: [] 
          };
        });

        this.allTrips.set(viagensFormatadas);
      },
      error: (err) => {
        console.error('Erro ao carregar as viagens do back-end', err);
      }
    });
  }

  openAddTripModal() {
    this.newTrip = { driverName: '', dateTime: '', pickupPoint: '', dropoffPoint: '', status: 'SCHEDULED', pricePerKm: 0 };
    this.showAddTripModal = true;
  }

  saveNewTrip() {
    const tripToSave = { id: Math.floor(Math.random() * 1000) + 100, tripName: `${this.newTrip.pickupPoint} - ${this.newTrip.dropoffPoint}`, reviews: [], status: 'Agendada', ...this.newTrip };
    this.allTrips.update(list => [...list, tripToSave]);
    this.closeTripModals();
  }

  openReviewsModal(trip: any) {
    this.selectedTrip = trip;
    this.showReviewsModal = true;
  }

  deleteReview(reviewId: number) {
    const confirmacao = confirm('Tem certeza que deseja excluir esta avaliação?');
    if (confirmacao) {
      this.selectedTrip.reviews = this.selectedTrip.reviews.filter((r: any) => r.id !== reviewId);
      this.allTrips.update(list => list.map(t => t.id === this.selectedTrip.id ? this.selectedTrip : t));
    }
  }

  openEditTripModal(trip: any) {
    this.selectedTrip = { ...trip }; 
    this.showEditTripModal = true;
  }

  saveTripEdit() {
    this.allTrips.update(list => list.map(t => t.id === this.selectedTrip.id ? this.selectedTrip : t));
    this.closeTripModals();
  }

  openDeleteTripModal(trip: any) {
    this.selectedTrip = trip;
    this.showDeleteTripModal = true;
  }

  deleteTrip() {
    this.allTrips.update(list => list.filter(t => t.id !== this.selectedTrip.id));
    this.closeTripModals();
  }

  closeTripModals() {
    this.showReviewsModal = false;
    this.showEditTripModal = false;
    this.showDeleteTripModal = false;
    this.showAddTripModal = false;
    this.selectedTrip = null;
  }

  closeModals() { this.showDeleteModal = false; }
  deleteJourney() { this.showDeleteModal = false; }
}