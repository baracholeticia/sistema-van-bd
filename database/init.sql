-- motoristas
CREATE TABLE drivers (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    cnh VARCHAR(11) UNIQUE NOT NULL,
    pix_key VARCHAR(100),
    registration_status VARCHAR(20) DEFAULT 'PENDING',
    rejection_reason TEXT,
    role VARCHAR(20) NOT NULL
);

-- veículos
CREATE TABLE vehicles (
    id UUID PRIMARY KEY,
    plate VARCHAR(7) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    seats_quantity INT NOT NULL,
    driver_id UUID NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- rotas
CREATE TABLE routes (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- pontos de parada
CREATE TABLE route_stops (
    id UUID PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    stop_location VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    route_id UUID NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- viagens
CREATE TABLE travels (
    id UUID PRIMARY KEY,
    departure_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    vehicle_id UUID NOT NULL,
    route_id UUID NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE, 
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- preços
CREATE TABLE travel_prices (
    id UUID PRIMARY KEY,
    travel_id UUID NOT NULL,
    boarding_stop_id UUID NOT NULL,
    dropoff_stop_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (travel_id) REFERENCES travels(id) ON DELETE CASCADE,
    FOREIGN KEY (boarding_stop_id) REFERENCES route_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (dropoff_stop_id) REFERENCES route_stops(id) ON DELETE CASCADE
);

-- passageiros
CREATE TABLE passengers (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    birth_date DATE NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- reservas
CREATE TABLE reservations (
    id UUID PRIMARY KEY,
    passenger_id UUID NOT NULL,
    travel_id UUID NOT NULL,
    boarding_stop_id UUID NOT NULL,
    dropoff_stop_id UUID NOT NULL,
    passenger_count INT DEFAULT 1,
    total_value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE,
    FOREIGN KEY (travel_id) REFERENCES travels(id) ON DELETE CASCADE,
    FOREIGN KEY (boarding_stop_id) REFERENCES route_stops(id) ON DELETE CASCADE,
    FOREIGN KEY (dropoff_stop_id) REFERENCES route_stops(id) ON DELETE CASCADE
);

-- avaliações
CREATE TABLE ratings (
    id UUID PRIMARY KEY,
    score INT NOT NULL,
    comment TEXT,
    passenger_id UUID NOT NULL,
    travel_id UUID NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE, 
    FOREIGN KEY (travel_id) REFERENCES travels(id) ON DELETE CASCADE        
);

-- admins
CREATE TABLE administrators (
    id UUID PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(120),
    cpf VARCHAR(11),
    phone VARCHAR(15),
    birth_date DATE,
    role VARCHAR(20) NOT NULL
);