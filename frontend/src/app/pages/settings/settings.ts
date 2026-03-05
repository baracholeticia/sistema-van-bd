import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViagensService } from '../../services/viagens.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html' // Ou o nome do seu HTML
})
export class SettingsComponent implements OnInit {
  
  // --- BARRA DE PESQUISA ---
  searchQuery = signal('');

  // --- DADOS ORIGINAIS DA API ---
  allTrips = signal<any[]>([]);

  // --- DADOS FILTRADOS PARA A TABELA ---
  trips = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.allTrips();

    return this.allTrips().filter(trip => 
      trip.driverName.toLowerCase().includes(query) ||
      trip.routeName.toLowerCase().includes(query) ||
      trip.vehiclePlate.toLowerCase().includes(query)
    );
  });

  // --- CONTROLES DOS MODAIS ---
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
    status: 'SCHEDULED', // Mudou para o inglês por conta do enum do back-end
    pricePerKm: 0
  };

  showDeleteModal = false;
  selectedJourney: any = null;

  // Injetando o serviço no construtor
  constructor(private viagensService: ViagensService) {}

  ngOnInit() {
    this.carregarViagens();
  }

  carregarViagens() {
    this.viagensService.getViagens().subscribe({
      next: (dados) => {
        // Mapeando o TravelResponseDTO para o formato que a tabela espera
        const viagensFormatadas = dados.map((viagem: any) => {
          
          // O Spring manda "dd/MM/yyyy HH:mm", o HTML espera uma data que o pipe date entenda
          const [dataStr, horaStr] = viagem.departureTime.split(' ');
          const [dia, mes, ano] = dataStr.split('/');
          const isoDateString = `${ano}-${mes}-${dia}T${horaStr}:00`;

          // Formatando o status para a cor certa na tabela
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
            originalStatus: viagem.status, // guarda o enum para salvar edição
            routeName: viagem.routeName,
            vehiclePlate: viagem.vehiclePlate,
            // Preços vêm como array no DTO
            pricePerKm: viagem.prices && viagem.prices.length > 0 ? viagem.prices[0].price : 0,
            tripName: viagem.routeName,
            reviews: [] // O DTO atual de TravelResponse não traz as reviews aninhadas
          };
        });

        this.allTrips.set(viagensFormatadas);
      },
      error: (err) => {
        console.error('Erro ao carregar as viagens do back-end', err);
      }
    });
  }

  // ==========================================
  // FUNÇÕES DE ADICIONAR VIAGEM
  // ==========================================
  openAddTripModal() {
    this.newTrip = {
      driverName: '',
      dateTime: '',
      pickupPoint: '',
      dropoffPoint: '',
      status: 'SCHEDULED',
      pricePerKm: 0
    };
    this.showAddTripModal = true;
  }

  saveNewTrip() {
    // Por enquanto simula localmente na tela
    const tripToSave = {
      id: Math.floor(Math.random() * 1000) + 100,
      tripName: `${this.newTrip.pickupPoint} - ${this.newTrip.dropoffPoint}`,
      reviews: [],
      status: 'Agendada',
      ...this.newTrip
    };
    
    this.allTrips.update(list => [...list, tripToSave]);
    this.closeTripModals();
  }

  // ==========================================
  // FUNÇÕES DE VISUALIZAÇÃO, EDIÇÃO E EXCLUSÃO
  // ==========================================
  openReviewsModal(trip: any) {
    this.selectedTrip = trip;
    this.showReviewsModal = true;
  }

  deleteReview(reviewId: number) {
    const confirmacao = confirm('Tem certeza que deseja excluir esta avaliação?');
    if (confirmacao) {
      this.selectedTrip.reviews = this.selectedTrip.reviews.filter((r: any) => r.id !== reviewId);
      this.allTrips.update(list => 
        list.map(t => t.id === this.selectedTrip.id ? this.selectedTrip : t)
      );
    }
  }

  openEditTripModal(trip: any) {
    this.selectedTrip = { ...trip }; 
    this.showEditTripModal = true;
  }

  saveTripEdit() {
    this.allTrips.update(list => 
      list.map(t => t.id === this.selectedTrip.id ? this.selectedTrip : t)
    );
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

  closeModals() {
    this.showDeleteModal = false;
  }
  deleteJourney() {
    this.showDeleteModal = false;
  }
}