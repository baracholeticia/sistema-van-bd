package com.vanvan.dto;

import com.vanvan.model.Reservation;
import java.math.BigDecimal;
import java.util.UUID;

public record ReservationResponseDTO(
        UUID id,
        String passengerName,
        String routeName,
        String boardingStop,
        String dropOffStop,
        Integer passengerCount,
        BigDecimal totalValue,
        String status
) {
    public static ReservationResponseDTO from(Reservation reservation) {
        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getPassenger().getName(),
                reservation.getTravel().getRoute().getName(),
                reservation.getBoardingStop().getStopLocation(),
                reservation.getDropOffStop().getStopLocation(),
                reservation.getPassengerCount(),
                reservation.getTotalValue(),
                reservation.getStatus()
        );
    }
}