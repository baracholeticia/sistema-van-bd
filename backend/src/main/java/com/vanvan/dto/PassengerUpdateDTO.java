package com.vanvan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

public record PassengerUpdateDTO(
        @Size(min = 2, max = 120) String name,
        @Email String email,
        @Pattern(regexp = "\\d{10,11}") String phone,
        @CPF String cpf,
        String password, // Adicionado (Opcional)
        String birthDate
) {}