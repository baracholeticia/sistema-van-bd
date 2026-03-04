package com.vanvan.dto;

import jakarta.validation.constraints.NotBlank;

public record ReservationStatusUpdateDTO(
        @NotBlank String status 
) {}