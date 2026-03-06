package com.vanvan.service;

import com.vanvan.dto.*;
import com.vanvan.enums.RegistrationStatus;
import com.vanvan.enums.UserRole;
import com.vanvan.exception.UserNotFoundException;
import com.vanvan.model.Driver;
import com.vanvan.model.Passenger;
import com.vanvan.repository.DriverRepository;
import com.vanvan.repository.PassengerRepository;
import com.vanvan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //metodos de motoristas
    public Page<DriverAdminResponseDTO> listDrivers(RegistrationStatus status, Pageable pageable) {
        if (status != null) {
            return driverRepository.findByRegistrationStatus(status, pageable)
                    .map(DriverAdminResponseDTO::from);
        } else {
            return driverRepository.findAll(pageable)
                    .map(DriverAdminResponseDTO::from);
        }
    }

    public DriverAdminResponseDTO updateDriverStatus(UUID driverId, DriverStatusUpdateDTO dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new UserNotFoundException(UserRole.DRIVER, driverId));

        if (dto.status() == RegistrationStatus.REJECTED && (dto.rejectionReason() == null || dto.rejectionReason().isBlank())) {
            throw new IllegalArgumentException("O motivo da rejeição é obrigatório.");
        }

        driver.setRegistrationStatus(dto.status());

        if (dto.status() == RegistrationStatus.REJECTED) {
            driver.setRejectionReason(dto.rejectionReason());
        } else {
            driver.setRejectionReason(null);
        }
        return DriverAdminResponseDTO.from(driverRepository.save(driver));
    }

    public DriverAdminResponseDTO updateDriver(UUID driverId, DriverUpdateDTO dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new UserNotFoundException(UserRole.DRIVER, driverId));

        if (dto.name() != null && !dto.name().isBlank()) driver.setName(dto.name());
        if (dto.email() != null && !dto.email().isBlank()) driver.setEmail(dto.email());
        if (dto.phone() != null && !dto.phone().isBlank()) driver.setPhone(dto.phone());
        if (dto.cnh() != null && !dto.cnh().isBlank()) driver.setCnh(dto.cnh());
        if (dto.cpf() != null && !dto.cpf().isBlank()) driver.setCpf(dto.cpf());
        if (dto.registrationStatus() != null) driver.setRegistrationStatus(dto.registrationStatus());

        return DriverAdminResponseDTO.from(driverRepository.save(driver));
    }

    public void deleteDriver(UUID driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new UserNotFoundException(UserRole.DRIVER, driverId));
        driverRepository.delete(driver);
    }
    //metodos de passageiros
    public Page<PassengerResponseDTO> listClients(Pageable pageable) {
        return passengerRepository.findAll(pageable).map(PassengerResponseDTO::from);
    }

    public PassengerResponseDTO createClient(RegisterRequestDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new IllegalArgumentException("Já existe um usuário com este email.");
        }
        if (userRepository.findByCpf(dto.getCpf()) != null) {
            throw new IllegalArgumentException("Já existe um usuário com este CPF.");
        }

        Passenger passenger = (Passenger) dto.toEntity();
        
        passenger.setPassword(passwordEncoder.encode(passenger.getPassword()));

        return PassengerResponseDTO.from(passengerRepository.save(passenger));
    }

    public PassengerResponseDTO updateClient(UUID clientId, PassengerUpdateDTO dto) {
        Passenger passenger = passengerRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        if (dto.name() != null && !dto.name().isBlank()) passenger.setName(dto.name());
        if (dto.email() != null && !dto.email().isBlank()) passenger.setEmail(dto.email());
        if (dto.phone() != null && !dto.phone().isBlank()) passenger.setPhone(dto.phone());
        if (dto.cpf() != null && !dto.cpf().isBlank()) passenger.setCpf(dto.cpf());

        // Adicionando a atualização da Data de Nascimento
        if (dto.birthDate() != null && !dto.birthDate().isBlank()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            passenger.setBirthDate(LocalDate.parse(dto.birthDate(), formatter));
        }

        // Adicionando a atualização da Senha (com criptografia)
        if (dto.password() != null && !dto.password().isBlank()) {
            // Lembre-se de ter o 'private final PasswordEncoder passwordEncoder;' injetado no construtor do Service
            passenger.setPassword(passwordEncoder.encode(dto.password())); 
        }

        return PassengerResponseDTO.from(passengerRepository.save(passenger));
    }

    public void deleteClient(UUID clientId) {
        Passenger passenger = passengerRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
        passengerRepository.delete(passenger);
    }
}