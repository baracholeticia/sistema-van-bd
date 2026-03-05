package com.vanvan.controller;

import com.vanvan.model.views.DriverRankingView;
import com.vanvan.model.views.FinancialReportView;
import com.vanvan.model.views.TravelDetailsView;
import com.vanvan.repository.views.DriverRankingViewRepository;
import com.vanvan.repository.views.FinancialReportViewRepository;
import com.vanvan.repository.views.TravelDetailsViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ReportController {

    private final TravelDetailsViewRepository travelDetailsRepo;
    private final FinancialReportViewRepository financialReportRepo;
    private final DriverRankingViewRepository driverRankingRepo;

    @GetMapping("/travel-details")
    public ResponseEntity<List<TravelDetailsView>> getTravelDetails() {
        return ResponseEntity.ok(travelDetailsRepo.findAll());
    }

    @GetMapping("/financial")
    public ResponseEntity<List<FinancialReportView>> getFinancialReports() {
        return ResponseEntity.ok(financialReportRepo.findAll());
    }

    @GetMapping("/driver-ranking")
    public ResponseEntity<List<DriverRankingView>> getDriverRankings() {
        return ResponseEntity.ok(driverRankingRepo.findAll());
    }
}