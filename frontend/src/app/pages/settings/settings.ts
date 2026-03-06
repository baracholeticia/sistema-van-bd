import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ViagensService } from '../../services/viagens.service';
import { RotasService } from '../../services/rotas.service';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html' 
})
export class SettingsComponent implements OnInit {
  
  // --- BARRA DE PESQUISA GERAL ---
  searchQuery = signal('');

  // ==========================================
  // DADOS E CONTROLES DE ROTAS
  // ==========================================
  allRoutes = signal<any[]>([]);
  showAddRouteModal = false;
  showEditRouteModal = false;
  showDeleteRouteModal = false;
  showRouteDetailsModal = false;
  selectedRoute: any = null;

  newRoute: any = {
    name: '',
    stops: [{ name: '' }],
    segments: [] 
  };

  // ==========================================
  // DADOS E CONTROLES DE RESERVAS
  // ==========================================
  reservations = signal<any[]>([]);

  // ==========================================
  // DADOS E CONTROLES DE VIAGENS
  // ==========================================
  allTrips = signal<any[]>([]);
  veiculosDisponiveis = signal<any[]>([]); 

  // Filtro de viagens baseado na barra de pesquisa
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
    vehicleId: '',
    routeId: '',
    dateTime: '',
    boardingStopId: '',
    dropOffStopId: '',
    status: 'SCHEDULED', 
    price: 0
  };

  constructor(
    private viagensService: ViagensService,
    private rotasService: RotasService,
    private reservasService: ReservasService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarRotas();
    this.carregarVeiculos();
    // Atraso leve para garantir que rotas e veículos carreguem antes das viagens
    setTimeout(() => this.carregarViagens(), 300);
    this.carregarReservas();
  }

  // ==========================================
  // BUSCA DE VEÍCULOS (Para o Select de Viagens)
  // ==========================================
  carregarVeiculos() {
    this.http.get<any[]>('http://localhost:8080/api/vehicles').subscribe({
      next: (dados) => this.veiculosDisponiveis.set(dados),
      error: (err) => console.error('Erro ao buscar veículos', err)
    });
  }

  // ==========================================
  // LÓGICA DE INTEGRAÇÃO - ROTAS
  // ==========================================
  carregarRotas() {
    this.rotasService.getRoutes().subscribe({
      next: (dados) => {
        const rotasFormatadas = dados.map(r => ({
          id: r.id,
          name: r.name,
          stops: r.stops.sort((a: any, b: any) => a.stopOrder - b.stopOrder).map((s: any) => ({
            id: s.id, name: s.city, location: s.stopLocation, order: s.stopOrder 
          })),
          segments: [] 
        }));
        this.allRoutes.set(rotasFormatadas);
      },
      error: (err) => console.error('Erro ao carregar rotas', err)
    });
  }

  openAddRouteModal() {
    this.newRoute = { name: '', stops: [{ name: '' }], segments: [] };
    this.showAddRouteModal = true;
  }

  addStop() { this.newRoute.stops.push({ name: '' }); }
  removeStop(index: number) { this.newRoute.stops.splice(index, 1); }

  saveNewRoute() {
    const payload = {
      name: this.newRoute.name,
      stops: this.newRoute.stops.map((s: any, index: number) => ({
        city: s.name || 'Desconhecida',
        stopLocation: 'Rodoviária', 
        stopOrder: index + 1
      }))
    };

    this.rotasService.createRoute(payload).subscribe({
      next: () => {
        this.carregarRotas();
        this.closeRouteModals();
      },
      error: (err) => alert('Erro ao criar rota: ' + err.error)
    });
  }

  openEditRouteModal(route: any) {
    this.selectedRoute = JSON.parse(JSON.stringify(route)); 
    this.showEditRouteModal = true;
  }

  addStopEdit() { this.selectedRoute.stops.push({ name: '' }); }
  removeStopEdit(index: number) { this.selectedRoute.stops.splice(index, 1); }

  saveRouteEdit() {
    const payload = {
      name: this.selectedRoute.name,
      stops: this.selectedRoute.stops.map((s: any, index: number) => ({
        city: s.name,
        stopLocation: s.location || 'Rodoviária',
        stopOrder: index + 1
      }))
    };

    this.rotasService.updateRoute(this.selectedRoute.id, payload).subscribe({
      next: () => {
        this.carregarRotas();
        this.closeRouteModals();
      },
      error: (err) => alert('Erro ao editar rota: ' + err.error)
    });
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
    this.rotasService.deleteRoute(this.selectedRoute.id).subscribe({
      next: () => {
        this.carregarRotas();
        this.closeRouteModals();
      },
      error: (err) => alert('Erro ao deletar rota: ' + err.error)
    });
  }

  closeRouteModals() {
    this.showAddRouteModal = false;
    this.showEditRouteModal = false;
    this.showDeleteRouteModal = false;
    this.showRouteDetailsModal = false;
    this.selectedRoute = null;
  }

  // ==========================================
  // LÓGICA DE INTEGRAÇÃO - RESERVAS
  // ==========================================
  carregarReservas() {
    this.reservasService.getReservations().subscribe({
      next: (dados) => {
        const reservasFormatadas = dados.map(r => ({
          id: r.id,
          clientName: r.passengerName,
          driverName: 'Motorista do Veículo', 
          tripName: r.routeName,
          status: r.status === 'CONFIRMED' ? 'Confirmada' : (r.status === 'CANCELED' || r.status === 'CANCELLED' ? 'Cancelada' : r.status),
          originalStatus: r.status
        }));
        this.reservations.set(reservasFormatadas);
      },
      error: (err) => console.error('Erro ao carregar reservas', err)
    });
  }

  toggleReservationStatus(reservation: any) {
    const newStatusBackend = reservation.originalStatus === 'CONFIRMED' ? 'CANCELLED' : 'CONFIRMED';
    this.reservasService.updateStatus(reservation.id, newStatusBackend).subscribe({
      next: () => this.carregarReservas(),
      error: (err) => alert('Erro ao alterar status da reserva')
    });
  }

  // ==========================================
  // LÓGICA DE INTEGRAÇÃO - VIAGENS
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

          const priceObj = viagem.prices && viagem.prices.length > 0 ? viagem.prices[0] : null;

          return {
            id: viagem.id,
            driverName: viagem.driverName || 'Sem motorista',
            dateTime: isoDateString,
            pickupPoint: viagem.routeName.split('-')[0]?.trim() || 'Ponto Inicial',
            dropoffPoint: viagem.routeName.split('-')[1]?.trim() || 'Ponto Final',
            status: statusTraduzido,
            originalStatus: viagem.status, 
            routeName: viagem.routeName,
            vehiclePlate: viagem.vehiclePlate,
            price: priceObj ? priceObj.price : 0,
            boardingStopId: priceObj ? priceObj.boardingStopId : '',
            dropOffStopId: priceObj ? priceObj.dropOffStopId : '',
            tripName: viagem.routeName,
            reviews: [] 
          };
        });

        this.allTrips.set(viagensFormatadas);
      },
      error: (err) => console.error('Erro ao carregar as viagens', err)
    });
  }

  get paradasDaRotaSelecionada() {
    const rota = this.allRoutes().find(r => r.id === this.newTrip.routeId);
    return rota ? rota.stops : [];
  }

  get paradasDaRotaEditSelecionada() {
    if (!this.selectedTrip) return [];
    const rota = this.allRoutes().find(r => r.id === this.selectedTrip.routeId);
    return rota ? rota.stops : [];
  }

  openAddTripModal() {
    this.newTrip = { vehicleId: '', routeId: '', dateTime: '', boardingStopId: '', dropOffStopId: '', status: 'SCHEDULED', price: 0 };
    this.showAddTripModal = true;
  }

  saveNewTrip() {
    if (!this.newTrip.dateTime || !this.newTrip.vehicleId || !this.newTrip.routeId || !this.newTrip.boardingStopId || !this.newTrip.dropOffStopId) {
      return alert("Preencha todos os campos obrigatórios (incluindo as paradas)!");
    }
    
    const [dataParte, horaParte] = this.newTrip.dateTime.split('T');
    const [ano, mes, dia] = dataParte.split('-');
    
    const payload = {
      departureTime: `${dia}/${mes}/${ano} ${horaParte}`,
      status: this.newTrip.status,
      vehicleId: this.newTrip.vehicleId,
      routeId: this.newTrip.routeId,
      prices: [{ boardingStopId: this.newTrip.boardingStopId, dropOffStopId: this.newTrip.dropOffStopId, price: this.newTrip.price }]
    };

    this.viagensService.createViagem(payload).subscribe({
      next: () => { 
        this.carregarViagens(); 
        this.closeTripModals(); 
      },
      error: (err) => alert('Erro: ' + (err.error || 'Verifique se os pontos de subida e descida pertencem à rota correta.'))
    });
  }

  openEditTripModal(trip: any) {
    const rota = this.allRoutes().find(r => r.name === trip.routeName);
    const veiculo = this.veiculosDisponiveis().find(v => v.plate === trip.vehiclePlate);

    this.selectedTrip = { 
      ...trip, 
      routeId: rota ? rota.id : '',
      vehicleId: veiculo ? veiculo.id : '',
      status: trip.originalStatus 
    }; 
    this.showEditTripModal = true;
  }

  saveTripEdit() {
    if (!this.selectedTrip.dateTime || !this.selectedTrip.vehicleId || !this.selectedTrip.routeId) {
      return alert("Preencha todos os campos obrigatórios!");
    }
    
    const [dataParte, horaParte] = this.selectedTrip.dateTime.split('T');
    const [ano, mes, dia] = dataParte.split('-');
    
    const payload = {
      departureTime: `${dia}/${mes}/${ano} ${horaParte}`,
      status: this.selectedTrip.status,
      vehicleId: this.selectedTrip.vehicleId,
      routeId: this.selectedTrip.routeId,
      prices: [{ boardingStopId: this.selectedTrip.boardingStopId, dropOffStopId: this.selectedTrip.dropOffStopId, price: this.selectedTrip.price }]
    };

    this.viagensService.updateViagem(this.selectedTrip.id, payload).subscribe({
      next: () => { 
        this.carregarViagens(); 
        this.closeTripModals(); 
      },
      error: (err) => alert('Erro ao editar: ' + (err.error || 'Verifique os dados.'))
    });
  }

  openDeleteTripModal(trip: any) {
    this.selectedTrip = trip;
    this.showDeleteTripModal = true;
  }

  deleteTrip() {
    this.viagensService.cancelViagem(this.selectedTrip.id).subscribe({
      next: () => { 
        this.carregarViagens(); 
        this.closeTripModals(); 
      },
      error: (err) => alert('Erro ao cancelar a viagem.')
    });
  }

  openReviewsModal(trip: any) {
    this.selectedTrip = trip;
    this.showReviewsModal = true;
  }

  closeTripModals() {
    this.showReviewsModal = false;
    this.showEditTripModal = false;
    this.showDeleteTripModal = false;
    this.showAddTripModal = false;
    this.selectedTrip = null;
  }
}