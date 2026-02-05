CREATE DATABASE IF NOT EXISTS SistemaVan;
USE SistemaVan;

CREATE TABLE MOTORISTA (
    id_motorista INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    chave_pix VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE VEICULO (
    placa VARCHAR(7) PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL,
    qtd_assentos INT NOT NULL,
    id_motorista INT UNIQUE,
    FOREIGN KEY (id_motorista) REFERENCES MOTORISTA(id_motorista) ON DELETE CASCADE
);

CREATE TABLE ROTA (
    id_rota INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL -- ex: garanhuns X caruaru
);

CREATE TABLE PONTO (
    id_ponto INT PRIMARY KEY,
    cidade VARCHAR(100) NOT NULL,
    local_parada VARCHAR(100) NOT NULL,
    ordem_na_rota INT NOT NULL, -- 1=origem, n=destino
    id_rota INT NOT NULL,
    FOREIGN KEY (id_rota) REFERENCES ROTA(id_rota) ON DELETE CASCADE
);

CREATE TABLE VIAGEM (
    id_viagem INT PRIMARY KEY,
    horario_saida DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    placa VARCHAR(7) NOT NULL,
    id_motorista INT NOT NULL,
    id_rota INT NOT NULL,
    FOREIGN KEY (placa) REFERENCES VEICULO(placa),
    FOREIGN KEY (id_motorista) REFERENCES MOTORISTA(id_motorista),
    FOREIGN KEY (id_rota) REFERENCES ROTA(id_rota)
);

CREATE TABLE PRECOS_TRECHOS (
    id_viagem INT NOT NULL,
    id_ponto_subida INT NOT NULL,
    id_ponto_descida INT NOT NULL,
    valor_trecho DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_viagem, id_ponto_subida, id_ponto_descida),
    FOREIGN KEY (id_viagem) REFERENCES VIAGEM(id_viagem) ON DELETE CASCADE,
    FOREIGN KEY (id_ponto_subida) REFERENCES PONTO(id_ponto),
    FOREIGN KEY (id_ponto_descida) REFERENCES PONTO(id_ponto)
);

CREATE TABLE CLIENTE (
    id_cliente INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100)
);

CREATE TABLE RESERVA (
    id_cliente INT NOT NULL,
    id_viagem INT NOT NULL,
    id_ponto_subida INT NOT NULL,
    id_ponto_descida INT NOT NULL,
    qtd_passageiros INT NOT NULL DEFAULT 1,
    valor_total_reserva DECIMAL(10,2) NOT NULL,
    status_reserva VARCHAR(20) NOT NULL,
    CONSTRAINT PK_RESERVA PRIMARY KEY (id_cliente, id_viagem, id_ponto_subida),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    FOREIGN KEY (id_viagem) REFERENCES VIAGEM(id_viagem),
    FOREIGN KEY (id_ponto_subida) REFERENCES PONTO(id_ponto),
    FOREIGN KEY (id_ponto_descida) REFERENCES PONTO(id_ponto)
);

CREATE TABLE AVALIACAO (
    id_avaliacao INT PRIMARY KEY,
    pontuacao INT NOT NULL,
    comentario TEXT,
    id_motorista INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_motorista) REFERENCES MOTORISTA(id_motorista),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente)
);