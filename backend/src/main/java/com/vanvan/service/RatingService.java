package com.vanvan.service;

import com.vanvan.dto.RatingResponseDTO;
import com.vanvan.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public List<RatingResponseDTO> findAll() {
        return ratingRepository.findAll()
                .stream()
                .map(RatingResponseDTO::from)
                .toList();
    }

    public void delete(UUID id) {
        if (!ratingRepository.existsById(id)) {
            throw new IllegalArgumentException("Avaliação não encontrada");
        }
        ratingRepository.deleteById(id);
    }
}