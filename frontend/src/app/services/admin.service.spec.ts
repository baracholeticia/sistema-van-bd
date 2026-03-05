import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AdminService, DriverAdmin, PageResponse } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listDrivers', () => {
    it('should list drivers without status filter', () => {
      const mockResponse: PageResponse<DriverAdmin> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 10
      };

      service.listDrivers().subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => 
        req.url === 'http://localhost:8080/api/admin/drivers' && 
        req.params.has('page') && 
        req.params.has('size') &&
        !req.params.has('status')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should list drivers with status filter', () => {
      const mockResponse: PageResponse<DriverAdmin> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 10
      };

      service.listDrivers('PENDING', 1, 20).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => 
        req.url === 'http://localhost:8080/api/admin/drivers' && 
        req.params.get('status') === 'PENDING' &&
        req.params.get('page') === '1' &&
        req.params.get('size') === '20'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updateDriverStatus', () => {
    it('should update driver status to APPROVED', () => {
      const mockDriver: DriverAdmin = {
        id: '123',
        cpf: '04394190002',
        name: 'Test Driver',
        email: 'driver@test.com',
        phone: '123456789',
        cnh: '12345678900',
        birthDate: '01/01/1990',
        registrationStatus: 'APPROVED',
        rejectionReason: null
      };

      service.updateDriverStatus('123', 'APPROVED').subscribe(driver => {
        expect(driver.registrationStatus).toBe('APPROVED');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/drivers/123/status');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: 'APPROVED', rejectionReason: undefined });
      req.flush(mockDriver);
    });

    it('should update driver status to REJECTED with reason', () => {
      const mockDriver: DriverAdmin = {
        id: '123',
        cpf: '04394190002',
        name: 'Test Driver',
        email: 'driver@test.com',
        phone: '123456789',
        cnh: '12345678900',
        birthDate: '01/01/1990',
        registrationStatus: 'REJECTED',
        rejectionReason: 'Invalid CNH'
      };

      service.updateDriverStatus('123', 'REJECTED', 'Invalid CNH').subscribe(driver => {
        expect(driver.registrationStatus).toBe('REJECTED');
        expect(driver.rejectionReason).toBe('Invalid CNH');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/admin/drivers/123/status');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: 'REJECTED', rejectionReason: 'Invalid CNH' });
      req.flush(mockDriver);
    });
  });
});
