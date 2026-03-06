# Banco de Dados - Sistema de Gestão de Transporte de Vans

<div align="center">

 <p>
    Projeto desenvolvido para a disciplina de <b>Banco de Dados</b> do curso de Ciência da Computação da 
    <b>Universidade Federal do Agreste de Pernambuco (UFAPE)</b>.
  </p>
  
</div>
---

## Sobre o projeto

Este projeto consiste no desenvolvimento de um banco de dados para uma aplicação web que implementa um sistema de gerenciamento (lado de administrador) de viagens intermunicipais por meio de veículos fretados.

O objetivo é a implementação de um banco de dados funcional como requisito para aprovação na disciplina de Banco de Dados, ministrada pela professora **Priscilla Azevedo**, na Universidade Federal do Agreste de Pernambuco - UFAPE, durante o semestre de 2025.2.

## Equipe
<div align="center">
  <a href="https://github.com/baracholeticia">
    <img src="https://img.shields.io/badge/Leticia%20Baracho-000?style=for-the-badge&logo=github&logoColor=white">
  </a>
  <a href="https://github.com/jmatheusnl">
    <img src="https://img.shields.io/badge/J.%20Matheus%20Nascimento-000?style=for-the-badge&logo=github&logoColor=white">
  </a>
  <a href="https://github.com/melissa-08">
    <img src="https://img.shields.io/badge/Melissa%20Oliveira-000?style=for-the-badge&logo=github&logoColor=white">
  </a>
  <a href="https://github.com/josematheusleal">
    <img src="https://img.shields.io/badge/Jose%20Matheus%20Leal-000?style=for-the-badge&logo=github&logoColor=white">
  </a>
</div>

---

## Como Rodar o Projeto

### Pré-requisitos
* **Docker Desktop** instalado e rodando.
* **Git** para clonar o repositório.

### Passo a Passo
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/baracholeticia/banco-de-dados_sistema-vans.git](https://github.com/baracholeticia/banco-de-dados_sistema-vans.git)
    cd banco-de-dados_sistema-vans
    ```

2.  **Suba o container do banco de dados:**
    ```bash
    docker compose up -d
    ```

3.  **Acesse o banco:**
    O banco de dados estará disponível em `localhost:3307`. Você pode utilizar o terminal ou ferramentas como MySQL Workbench/DBeaver:
    * **User:** `root`
    * **Password:** `root`
    * **Database:** `SistemaVan`

---

**O sistema está disponivel em `localhost:4200`**

---

## Como logar como Admistrador

1. Login`admin.sistemavan@email.com`.
2. Senha `password`.

---

## Modelagem do Banco de Dados

### Diagrama de Entidade-Relacionamento (DER)

![Diagrama de Entidade-Relacionamento](./img/diagrama_ER.png)

### Esquema Lógico

![Esquema Lógico do Banco de Dados](./img/diagrama_relacional.png)

---

<h2 id="dicionario"> Dicionário de Dados (2FN)</h2>

<p>Abaixo estão detalhadas todas as entidades do sistema, seus tipos de dados e restrições de integridade.</p>

<details open>
<summary><b>1. Tabela: drivers (MOTORISTA)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
      <tr><td>id</td><td>UUID</td><td>PK</td><td>Identificador único universal.</td></tr>
    <tr><td>name</td><td>VARCHAR(120)</td><td>NOT NULL</td><td>Nome completo do condutor.</td></tr>
    <tr><td>cpf</td><td>VARCHAR(11)</td><td>UNIQUE, NOT NULL</td><td>CPF (apenas números).</td></tr>
    <tr><td>phone</td><td>VARCHAR(15)</td><td>-</td><td>Telefone de contato.</td></tr>
    <tr><td>email</td><td>VARCHAR(100)</td><td>UNIQUE, NOT NULL</td><td>Email do condutor.</td></tr>
    <tr><td>password</td><td>VARCHAR(255)</td><td>NOT NULL</td><td>Senha criptografada.</td></tr>
    <tr><td>birth_date</td><td>DATE</td><td>NOT NULL</td><td>Data de nascimento.</td></tr>
    <tr><td>cnh</td><td>VARCHAR(11)</td><td>UNIQUE, NOT NULL</td><td>Número da CNH.</td></tr>
    <tr><td>pix_key</td><td>VARCHAR(100)</td><td>-</td><td>Chave Pix para recebimento.</td></tr>
    <tr><td>registration_status</td><td>VARCHAR(20)</td><td>DEFAULT 'PENDING'</td><td>Status de aprovação.</td></tr>
    <tr><td>rejection_reason</td><td>TEXT</td><td>-</td><td>Motivo caso o cadastro seja negado.</td></tr>
    <tr><td>role</td><td>VARCHAR(20)</td><td>NOT NULL</td><td>Papel do usuário (DRIVER).</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>2. Tabela: vehicles (VEICULO)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
      <tr><td>id</td><td>UUID</td><td>PK</td><td>ID único do veículo.</td></tr>
      <tr><td>plate</td><td>VARCHAR(7)</td><td>UNIQUE, NOT NULL</td><td>Placa do veículo.</td></tr>
      <tr><td>model</td><td>VARCHAR(50)</td><td>NOT NULL</td><td>Modelo da Van.</td></tr>
      <tr><td>seats_quantity</td><td>INT</td><td>NOT NULL</td><td>Capacidade total de passageiros.</td></tr>
      <tr><td>driver_id</td><td>UUID</td><td>FK</td><td>Vínculo com o motorista proprietário.</td>
    </tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>3. Tabela: routs (ROTA)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
      <tr><td>id</td><td>UUID</td><td>PK</td><td>Identificador da rota.</td></tr>
      <tr><td>name</td><td>VARCHAR(100)</td><td>NOT NULL</td><td>Nome da linha (Ex: Garanhuns - Recife).</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>4. Tabela: route_stops (PONTO)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
      <tr><td>id</td><td>UUID</td><td>PK</td><td>ID da parada física.</td></tr>
      <tr><td>city</td><td>VARCHAR(100)</td><td>NOT NULL</td><td>Cidade da parada.</td></tr>
      <tr><td>stop_location</td><td>VARCHAR(100)</td><td>NOT NULL</td><td>Referência/Logradouro do ponto.</td></tr>
      <tr><td>stop_order</td><td>INT</td><td>NOT NULL</td><td>Sequência numérica na rota.</td></tr>
      <tr><td>route_id</td><td>UUID</td><td>FK</td><td>Rota à qual o ponto pertence.</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>5. Tabela: travels (VIAGEM)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
      <tr><td>id</td><td>UUID</td><td>PK</td><td>Registro de uma instância de viagem.</td></tr>
      <tr><td>departure_time</td><td>TIMESTAMP</td><td>NOT NULL</td><td>Data e hora de saída.</td></tr>
      <tr><td>status</td><td>VARCHAR(20)</td><td>NOT NULL</td><td>Estado (Agendada, Em curso, etc).</td></tr>
      <tr><td>vehicle_id</td><td>UUID</td><td>FK</td><td>Veículo alocado.</td></tr>
      <tr><td>route_id</td><td>UUID</td><td>FK</td><td>Rota percorrida.</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>6. Tabela: travel_prices (PRECOS_TRECHOS)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>id</td><td>UUID</td><td>PK</td><td>ID da precificação.</td></tr>
    <tr><td>travel_id</td><td>UUID</td><td>FK</td><td>Viagem específica.</td></tr>
    <tr><td>boarding_stop_id</td><td>UUID</td><td>FK</td><td>Ponto de embarque do trecho.</td></tr>
    <tr><td>dropoff_stop_id</td><td>UUID</td><td>FK</td><td>Ponto de desembarque do trecho.</td></tr>
    <tr><td>price</td><td>DECIMAL(10,2)</td><td>NOT NULL</td><td>Valor cobrado pelo trecho definido.</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>7. Tabela: passengers (CLIENTE)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>id</td><td>UUID</td><td>PK</td><td>ID único do passageiro.</td></tr>
    <tr><td>name</td><td>VARCHAR(120)</td><td>NOT NULL</td><td>Nome completo.</td></tr>
    <tr><td>cpf</td><td>VARCHAR(11)</td><td>UNIQUE, NOT NULL</td><td>CPF do passageiro.</td></tr>
    <tr><td>email</td><td>VARCHAR(100)</td><td>UNIQUE, NOT NULL</td><td>Email de acesso.</td></tr>
    <tr><td>role</td><td>VARCHAR(20)</td><td>NOT NULL</td><td>Papel do usuário (PASSENGER).</td></tr>
  </tbody>
</table>
</details>

<br>

<details>
<summary><b>8. Tabela: reservations (RESERVA)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>id</td><td>UUID</td><td>PK</td><td>Identificador da reserva.</td></tr>
    <tr><td>passenger_id</td><td>UUID</td><td>FK</td><td>Passageiro que realizou a reserva.</td></tr>
    <tr><td>travel_id</td><td>UUID</td><td>FK</td><td>Viagem selecionada.</td></tr>
    <tr><td>passenger_count</td><td>INT</td><td>DEFAULT 1</td><td>Quantidade de assentos.</td></tr>
    <tr><td>total_value</td><td>DECIMAL(10,2)</td><td>NOT NULL</td><td>Valor total da reserva.</td></tr>
    <tr><td>status</td><td>VARCHAR(20)</td><td>NOT NULL</td><td>Status (Confirmada, Pendente, etc).</td></tr>
  </tbody>
</table>
</details>

<br>

<details open>
<summary><b>9. Tabela: ratings (AVALIACAO)</b></summary>
<br>
<table width="100%">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>Atributo</th>
      <th>Tipo</th>
      <th>Restrição</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>id</td><td>UUID</td><td>PK</td><td>Identificador único da avaliação.</td></tr>
    <tr><td>score</td><td>INT</td><td>NOT NULL</td><td>Nota dada ao serviço (Ex: 1 a 5).</td></tr>
    <tr><td>comment</td><td>TEXT</td><td>-</td><td>Comentário opcional do passageiro.</td></tr>
    <tr><td>passenger_id</td><td>UUID</td><td>FK</td><td>Passageiro que realizou a avaliação.</td></tr>
    <tr><td>travel_id</td><td>UUID</td><td>FK</td><td>Viagem que está sendo avaliada.</td></tr>
  </tbody>
</table>
</details>

<details>
<summary><b>10. Tabela: administrators (Admins)</b></summary>



<table width="100%">
<thead>
<tr style="background-color: #f2f2f2;">
<th>Atributo</th>
<th>Tipo</th>
<th>Restrição</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr><td>id</td><td>UUID</td><td>PK</td><td>ID do administrador.</td></tr>
<tr><td>email</td><td>VARCHAR(100)</td><td>UNIQUE, NOT NULL</td><td>Email de acesso administrativo.</td></tr>
<tr><td>name</td><td>VARCHAR(120)</td><td>-</td><td>Nome do gestor.</td></tr>
<tr><td>role</td><td>VARCHAR(20)</td><td>NOT NULL</td><td>Papel do usuário no sistema (Ex: ADMIN).</td></tr>
</tbody>
</table>
</details>


---


## Povoamento do Banco
O banco de dados é automaticamente populado na inicialização do container MySQL via Docker, utilizando script SQL do arquivo populate.sql. Os dados inseridos são fícticios e representam cenários de operação do sistema, incluindo motoristas, veículos, rotas, pontos de parada, viagens, preços por trecho, clientes, reservas e avaliações, respeitando a integridade referencial entre as tabelas.

O povoamento foi gerado automaticamente por IA, simulando dados reais, e por fim passados por um refinamento manual, onde os desenvolvedores adicionaram cpf válidos para cada um dos usuários registrados, juntamente com senha criptografada.

---

## Tecnologias Utilizadas
* **MySQL 8.0**: Sistema gerenciador de banco de dados.
* **Docker & Docker Compose**: Containerização do ambiente.
* **Git/GitHub**: Controle de versão e hospedagem do código.
