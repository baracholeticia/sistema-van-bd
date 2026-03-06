import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/client.service';
import { ToastService } from '../../../components/toast/toast.service';

@Component({
  selector: 'app-cliente-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-edit.html',
})
export class ClienteEditComponent implements OnInit {

  @Input() cliente: any; 
  @Output() aoFechar = new EventEmitter<boolean>();

  carregando = signal(false);
  mostrarSenha = false; // Controle do olhinho da senha
  
  // Objeto preparado com todos os campos que o PassengerUpdateDTO aceita
  clienteEditado: any = {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    birthDate: ''
  };

  constructor(
    private service: ClienteService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    if (this.cliente) {
      // O banco envia YYYY-MM-DD. Precisamos formatar para DD/MM/YYYY para a máscara não quebrar.
      let dataFormatada = this.cliente.birthDate || '';
      if (dataFormatada && dataFormatada.includes('-')) {
        const [ano, mes, dia] = dataFormatada.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      }

      this.clienteEditado = { 
        name: this.cliente.name,
        email: this.cliente.email,
        phone: this.cliente.phone,
        cpf: this.cliente.cpf,
        birthDate: dataFormatada,
        password: '' // Sempre vazio por segurança
      };
    }
  }

  alternarVisualizacaoSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fechar() {
    this.aoFechar.emit(false);
  }

  salvar() {
    if (!this.cliente || !this.cliente.id) {
      this.toastService.error('Erro: ID do cliente não encontrado.');
      return;
    }

    // Validação básica garantindo que os campos principais existam
    if (!this.clienteEditado.name || !this.clienteEditado.email || !this.clienteEditado.cpf || !this.clienteEditado.phone || !this.clienteEditado.birthDate) {
      this.toastService.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.carregando.set(true);

    // Removemos os pontos e traços para enviar limpo pro banco
    const cpfLimpo = this.clienteEditado.cpf.replace(/\D/g, '');
    const phoneLimpo = this.clienteEditado.phone.replace(/\D/g, '');

    // Construção dinâmica do Payload
    const payload: any = {
      name: this.clienteEditado.name,
      email: this.clienteEditado.email,
      phone: phoneLimpo,
      cpf: cpfLimpo,
      birthDate: this.clienteEditado.birthDate
    };

    // Só enviamos a senha se o admin digitou alguma coisa no campo
    if (this.clienteEditado.password && this.clienteEditado.password.trim() !== '') {
      payload.password = this.clienteEditado.password;
    }

    // Passa o ID e o Payload separadamente!
    this.service.editar(this.cliente.id, payload).subscribe({
      next: () => {
        this.carregando.set(false);
        this.toastService.success('Cliente atualizado com sucesso!');
        this.aoFechar.emit(true); 
      },
      error: (err: any) => {
        this.carregando.set(false);
        console.error('Erro ao editar:', err);
        this.toastService.error(err.error?.message || 'Erro ao editar cliente.');
      }
    });
  }

  // --- MÁSCARAS ---
  onCpfInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11);
    this.clienteEditado.cpf = value;
    input.value = value;
  }

  onPhoneInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1)$2-$3');
    else if (value.length > 6) value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1)$2-$3');
    else if (value.length > 2) value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1)$2');
    else if (value.length > 0) value = value.replace(/^(\d*)/, '($1');

    this.clienteEditado.phone = value; // Corrigido para 'phone'
    input.value = value;
  }

  onBirthdateInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 4) value = value.replace(/^(\d{2})(\d{2})(\d{0,4}).*/, '$1/$2/$3');
    else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,2}).*/, '$1/$2');

    this.clienteEditado.birthDate = value;
    input.value = value;
  }
}