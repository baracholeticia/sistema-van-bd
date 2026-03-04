CREATE OR REPLACE FUNCTION validate_reservation_update()
RETURNS TRIGGER AS $$
DECLARE
    travel_status VARCHAR(20);
BEGIN
    -- Busca o status atual da viagem
    SELECT status INTO travel_status FROM travels WHERE id = OLD.travel_id;

    -- Se a viagem já aconteceu ou está ocorrendo, bloqueia o cancelamento/alteração
    IF travel_status IN ('FINISHED', 'ONGOING') AND NEW.status = 'CANCELLED' THEN
        RAISE EXCEPTION 'Não é possível cancelar uma reserva de uma viagem que já iniciou ou finalizou.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_limit_cancellation
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION validate_reservation_update();

CREATE OR REPLACE FUNCTION check_vehicle_capacity()
RETURNS TRIGGER AS $$
DECLARE
    total_seats INT;
    occupied_seats INT;
BEGIN
    -- Pega a capacidade total da van vinculada à viagem
    SELECT v.seats_quantity INTO total_seats
    FROM travels t
    JOIN vehicles v ON t.vehicle_id = v.id
    WHERE t.id = NEW.travel_id;

    -- Soma quantos passageiros já estão confirmados para essa viagem
    SELECT COALESCE(SUM(passenger_count), 0) INTO occupied_seats
    FROM reservations
    WHERE travel_id = NEW.travel_id AND status = 'CONFIRMED';

    -- Verifica se a nova reserva estoura o limite
    IF (occupied_seats + NEW.passenger_count) > total_seats THEN
        RAISE EXCEPTION 'Capacidade máxima atingida! A van possui apenas % assentos.', total_seats;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_check_capacity
BEFORE INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION check_vehicle_capacity();

CREATE OR REPLACE FUNCTION handle_driver_rejection()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o status mudou para REJECTED, deletamos os veículos
    IF NEW.registration_status = 'REJECTED' THEN
        DELETE FROM vehicles WHERE driver_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_cleanup_rejected_driver
AFTER UPDATE OF registration_status ON drivers
FOR EACH ROW
EXECUTE FUNCTION handle_driver_rejection();