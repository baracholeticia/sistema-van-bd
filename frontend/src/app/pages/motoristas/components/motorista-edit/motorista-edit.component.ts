import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, DriverAdmin } from '../../../../services/admin.service';
import { ToastService } from '../../../../components/toast/toast.service';
import { Toast } from '../../../../components/toast/toast';

@Component({
  selector: 'app-motorista-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast],
  templateUrl: './motorista-edit.component.html',
  styleUrl: './motorista-edit.component.css'
})
export class MotoristaEditComponent implements OnInit {
  @Input() motorista: DriverAdmin | null = null;
  @Output() aoFechar = new EventEmitter<boolean>();

  motoristaEditado: any = {};
  carregando = signal(false);
  rejectionReason = '';

  statusOptions: { label: string; value: 'PENDING' | 'APPROVED' | 'REJECTED' }[] = [
    { label: 'Ativo', value: 'APPROVED' },
    { label: 'Aguardando', value: 'PENDING' },
    { label: 'Recusado', value: 'REJECTED' },
  ];

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    if (this.motorista) {
      this.motoristaEditado = { ...this.motorista };
      this.motoristaEditado.phone = this.formatPhone(this.motorista.phone);
      this.motoristaEditado.cpf = this.motorista.cpf || (this.motorista as any).identidade || '';
      
      // Carrega os dados do veículo caso existam no modelo original
      this.motoristaEditado.vehicleModel = (this.motorista as any).vehicleModel || '';
      this.motoristaEditado.vehiclePlate = (this.motorista as any).vehiclePlate || '';

      if (this.motorista.registrationStatus === 'REJECTED' && this.motorista.rejectionReason) {
        this.rejectionReason = this.motorista.rejectionReason;
      }

      console.log('Dados do motorista recebidos:', this.motorista);
    }
  }

  private formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/^(\d\d)(\d{5})(\d{4})$/, '($1)$2-$3');
    if (digits.length === 10) return digits.replace(/^(\d\d)(\d{4})(\d{4})$/, '($1)$2-$3');
    return raw;
  }

  onPhoneInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1)$2-$3');
    else if (value.length > 6) value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1)$2-$3');
    else if (value.length > 2) value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1)$2');
    else if (value.length > 0) value = value.replace(/^(\d*)/, '($1');
    this.motoristaEditado.phone = value;
    input.value = value;
  }

  onCnhInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    this.motoristaEditado.cnh = value;
    input.value = value;
  }

  onCpfInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    this.motoristaEditado.cpf = value;
    input.value = value;
  }

  // NOVO: Formata a placa para sempre maiúscula e remove hífens/símbolos
  onPlateInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) value = value.slice(0, 7);
    this.motoristaEditado.vehiclePlate = value;
    input.value = value;
  }

  fechar() {
    this.aoFechar.emit(false);
  }

  salvar() {
    if (!this.motoristaEditado.id) return;

    const rawPhone = this.motoristaEditado.phone?.replace(/\D/g, '') ?? '';

    if (!this.motoristaEditado.name || this.motoristaEditado.name.length < 4) {
      this.toastService.error('O nome deve ter no mínimo 4 caracteres.');
      return;
    }
    if (rawPhone.length < 10 || rawPhone.length > 11) {
      this.toastService.error('Telefone inválido. Use de 10 a 11 dígitos.');
      return;
    }
    if (this.motoristaEditado.cnh?.length !== 11) {
      this.toastService.error('A CNH deve ter exatamente 11 dígitos.');
      return;
    }
    if (this.motoristaEditado.cpf && this.motoristaEditado.cpf.length !== 11) {
      this.toastService.error('O CPF deve ter exatamente 11 dígitos.');
      return;
    }
    // NOVO: Validação da Placa do Veículo
    if (this.motoristaEditado.vehiclePlate && this.motoristaEditado.vehiclePlate.length !== 7) {
      this.toastService.error('A placa do veículo deve conter exatamente 7 caracteres.');
      return;
    }
    if (this.motoristaEditado.registrationStatus === 'REJECTED' && !this.rejectionReason.trim()) {
      this.toastService.error('Informe o motivo da rejeição.');
      return;
    }

    this.carregando.set(true);

    const statusMudou = this.motoristaEditado.registrationStatus !== this.motorista?.registrationStatus;
    const isRejected = this.motoristaEditado.registrationStatus === 'REJECTED';

    // Chama updateDriver para os dados gerais (incluindo veículo e placa agora)
    this.adminService.updateDriver(this.motoristaEditado.id, {
      name: this.motoristaEditado.name,
      email: this.motoristaEditado.email,
      phone: rawPhone,
      cnh: this.motoristaEditado.cnh,
      cpf: this.motoristaEditado.cpf || this.motoristaEditado.identidade,
      //vehicleModel: this.motoristaEditado.vehicleModel, // Enviando modelo
      //vehiclePlate: this.motoristaEditado.vehiclePlate  // Enviando placa
    }).subscribe({
      next: () => {
        // Se o status mudou, chama updateDriverStatus em seguida
        if (statusMudou) {
          this.adminService.updateDriverStatus(
            this.motoristaEditado.id,
            this.motoristaEditado.registrationStatus,
            isRejected ? this.rejectionReason.trim() : undefined
          ).subscribe({
            next: () => {
              this.carregando.set(false);
              this.toastService.success('Motorista atualizado com sucesso!');
              setTimeout(() => this.aoFechar.emit(true), 800);
            },
            error: (err: any) => {
              this.carregando.set(false);
              this.toastService.error(err?.error?.message ?? 'Erro ao atualizar status.');
            }
          });
        } else {
          this.carregando.set(false);
          this.toastService.success('Motorista atualizado com sucesso!');
          setTimeout(() => this.aoFechar.emit(true), 800);
        }
      },
      error: (err: any) => {
        this.carregando.set(false);
        if (err?.error?.message) {
          this.toastService.error(err.error.message);
        } else if (typeof err?.error === 'string') {
          this.toastService.error(err.error);
        } else {
          this.toastService.error('Erro ao salvar. Verifique os dados e tente novamente.');
        }
      }
    });
  }
}