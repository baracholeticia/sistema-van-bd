package com.vanvan.service;

import com.vanvan.dto.ReservationRequestDTO;
import com.vanvan.dto.ReservationResponseDTO;
import com.vanvan.dto.ReservationStatusUpdateDTO;
import com.vanvan.model.Passenger;
import com.vanvan.model.Reservation;
import com.vanvan.model.RouteStop;
import com.vanvan.model.Travel;
import com.vanvan.repository.PassengerRepository;
import com.vanvan.repository.ReservationRepository;
import com.vanvan.repository.RouteStopRepository;
import com.vanvan.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PassengerRepository passengerRepository;
    private final TravelRepository travelRepository;
    private final RouteStopRepository routeStopRepository;

    public String createReservation(ReservationRequestDTO dto) {
        Passenger passenger = passengerRepository.findById(dto.passengerId())
                .orElseThrow(() -> new IllegalArgumentException("Passageiro não encontrado"));
        Travel travel = travelRepository.findById(dto.travelId())
                .orElseThrow(() -> new IllegalArgumentException("Viagem não encontrada"));
        RouteStop boarding = routeStopRepository.findById(dto.boardingStopId())
                .orElseThrow(() -> new IllegalArgumentException("Ponto de embarque não encontrado"));
        RouteStop dropOff = routeStopRepository.findById(dto.dropOffStopId())
                .orElseThrow(() -> new IllegalArgumentException("Ponto de desembarque não encontrado"));

        Reservation reservation = new Reservation();
        reservation.setPassenger(passenger);
        reservation.setTravel(travel);
        reservation.setBoardingStop(boarding);
        reservation.setDropOffStop(dropOff);
        reservation.setPassengerCount(dto.passengerCount());
        reservation.setTotalValue(dto.totalValue());
        reservation.setStatus(dto.status());


        reservationRepository.save(reservation);
        return "Reserva criada com sucesso!";
    }

    public String updateReservationStatus(UUID id, ReservationStatusUpdateDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada"));
        
        reservation.setStatus(dto.status());

        reservationRepository.save(reservation);
        return "Status da reserva atualizado com sucesso!";
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(ReservationResponseDTO::from)
                .toList();
    }

    public void deleteReservation(UUID id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Reserva não encontrada");
        }
        reservationRepository.deleteById(id);
    }
}