package com.vanvan.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record ReservationRequestDTO(
        @NotNull UUID passengerId,
        @NotNull UUID travelId,
        @NotNull UUID boardingStopId,
        @NotNull UUID dropOffStopId,
        @NotNull @Positive Integer passengerCount,
        @NotNull @Positive BigDecimal totalValue,
        @NotNull String status
) {}