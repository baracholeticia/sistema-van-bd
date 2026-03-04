package com.vanvan.dto;

import com.vanvan.model.Rating;
import java.util.UUID;

public record RatingResponseDTO(
        UUID id,
        Integer score,
        String comment,
        String passengerName,
        String driverName,
        UUID travelId
) {
    public static RatingResponseDTO from(Rating rating) {
        return new RatingResponseDTO(
                rating.getId(),
                rating.getScore(),
                rating.getComment(),
                rating.getPassenger().getName(),
                rating.getTravel().getVehicle().getDriver().getName(),
                rating.getTravel().getId()
        );
    }
}