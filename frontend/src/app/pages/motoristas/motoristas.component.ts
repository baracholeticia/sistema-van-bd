import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs'; 

import { AdminService, DriverAdmin } from '../../services/admin.service'; 
import { VehicleService } from '../../services/vehicle.service'; 

import { MotoristaDeleteComponent } from './components/motorista-delete/motorista-delete.component';
import { MotoristaAdd } from './components/motorista-add/motorista-add';
import { MotoristaEditComponent } from './components/motorista-edit/motorista-edit.component';

// Estendemos a interface do AdminService para incluir os dados do veículo
export interface DriverAdminWithVehicle extends DriverAdmin {
  vehicleModel?: string;
  vehiclePlate?: string;
}

@Component({
  selector: 'app-motoristas',
  standalone: true,
  imports: [CommonModule, FormsModule, MotoristaDeleteComponent, MotoristaAdd, MotoristaEditComponent],
  templateUrl: './motoristas.component.html',
})
export class MotoristasComponent implements OnInit {

  // --- VARIÁVEIS DE DADOS ---
  listaMotoristas: DriverAdminWithVehicle[] = [];
  motoristasFiltrados = signal<DriverAdminWithVehicle[]>([]);
  termoBusca: string = '';
  carregando = signal(false);
  erro = signal('');

  // --- CONTROLE DE MODAIS ---
  modalAdicionarAberto: boolean = false;
  modalEditarAberto: boolean = false;
  modalExcluirAberto: boolean = false;
  modalVisualizarAberto: boolean = false;

  // --- MOTORISTAS SELECIONADOS ---
  motoristaSelecionado: DriverAdminWithVehicle | null = null;
  motoristaSelecionadoVisualizacao: DriverAdminWithVehicle | null = null;

  constructor(
    private adminService: AdminService, 
    private vehicleService: VehicleService 
  ) { }

  ngOnInit(): void {
    this.carregarMotoristas();
  }

  // --- 1. CARREGAR DADOS ---
  carregarMotoristas(): void {
    this.carregando.set(true);
    this.erro.set('');
    
    // Dispara as duas requisições simultaneamente
    forkJoin({
      motoristasPage: this.adminService.listDrivers(undefined, 0, 100),
      veiculos: this.vehicleService.findAll()
    }).subscribe({
      next: ({ motoristasPage, veiculos }) => {
        
        this.listaMotoristas = motoristasPage.content.map(mot => {
          // Busca o veículo garantindo que letras maiúsculas/minúsculas não quebrem o cruzamento
          const veiculo = veiculos.find(v => String(v.driverId).toLowerCase() === String(mot.id).toLowerCase());
          
          return {
            ...mot,
            vehicleModel: veiculo ? veiculo.model : 'Sem veículo',
            vehiclePlate: veiculo ? veiculo.plate : '---'
          };
        });

        this.filtrarMotoristas();
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar motoristas ou veículos:', err);
        this.erro.set('Erro ao carregar dados.');
        this.carregando.set(false);
      }
    });
  }

  // --- 2. FILTRO DE BUSCA ---
  filtrarMotoristas() {
    if (!this.termoBusca.trim()) {
      this.motoristasFiltrados.set([...this.listaMotoristas]);
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.motoristasFiltrados.set(
        this.listaMotoristas.filter(m =>
          m.name.toLowerCase().includes(termo) ||
          m.cnh.includes(termo) ||
          (m.vehiclePlate && m.vehiclePlate.toLowerCase().includes(termo))
        )
      );
    }
  }

  // --- 3. LÓGICA DE MODAIS ---
  abrirModalAdicionar() {
    this.modalAdicionarAberto = true;
  }

  fecharModalAdicionar(sucesso: boolean) {
    this.modalAdicionarAberto = false;
    if (sucesso) {
      this.carregarMotoristas();
    }
  }

  abrirModalEditar(motorista: DriverAdminWithVehicle) {
    this.motoristaSelecionado = { ...motorista };
    this.modalEditarAberto = true;
  }

  fecharModalEditar(sucesso: boolean) {
    this.modalEditarAberto = false;
    this.motoristaSelecionado = null;
    if (sucesso) {
      this.carregarMotoristas();
    }
  }

  abrirModalExcluir(motorista: DriverAdminWithVehicle) {
    this.motoristaSelecionado = motorista;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluir(sucesso: boolean) {
    this.modalExcluirAberto = false;
    this.motoristaSelecionado = null;
    if (sucesso) {
      this.carregarMotoristas();
    }
  }

  // --- 4. MODAL DE VISUALIZAÇÃO RÁPIDA ---
  abrirModalVisualizar(motorista: DriverAdminWithVehicle) {
    this.motoristaSelecionadoVisualizacao = motorista;
    this.modalVisualizarAberto = true;
  }

  fecharModalVisualizar() {
    this.modalVisualizarAberto = false;
    this.motoristaSelecionadoVisualizacao = null;
  }
}