import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CaracolResponse, CaracolService } from './caracol.service';

describe('CaracolService', () => {
  let service: CaracolService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CaracolService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the correct endpoint with the given size', () => {
    const mockResponse: CaracolResponse = {
      matrix: [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
      diagonal: [1, 9, 5],
      reverseDiagonal: [3, 9, 7],
    };

    service.getCaracol(3).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/caracol/3');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should include the size in the URL', () => {
    service.getCaracol(10).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/caracol/10');
    expect(req.request.method).toBe('GET');
    req.flush({ matrix: [], diagonal: [], reverseDiagonal: [] });
  });
});
