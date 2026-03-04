package com.vanvan.controller;

import com.vanvan.dto.ReservationRequestDTO;
import com.vanvan.dto.ReservationResponseDTO;
import com.vanvan.dto.ReservationStatusUpdateDTO;
import com.vanvan.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> findAll() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    @PostMapping
    public ResponseEntity<String> createReservation(@Valid @RequestBody ReservationRequestDTO dto) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar reserva: " + e.getMessage()); 
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable UUID id, @Valid @RequestBody ReservationStatusUpdateDTO dto) {
        try {
            return ResponseEntity.ok(reservationService.updateReservationStatus(id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable UUID id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar reserva: " + e.getMessage());
        }
    }
}