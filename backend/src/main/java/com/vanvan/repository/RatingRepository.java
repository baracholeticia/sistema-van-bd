package com.vanvan.repository;

import com.vanvan.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<Rating, UUID> {
}