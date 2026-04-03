import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { CaracolResponse } from '../caracol.service';
import { MatrixResultComponent } from './matrix-result';

function buildMockResponse(size: number): CaracolResponse {
  const total = size * size;
  const flat = Array.from({ length: total }, (_, i) => i + 1);
  const matrix = Array.from({ length: size }, (_, r) => flat.slice(r * size, r * size + size));
  const diagonal = Array.from({ length: size }, (_, i) => matrix[i][i]);
  const reverseDiagonal = Array.from({ length: size }, (_, i) => matrix[i][size - 1 - i]);
  return { matrix, diagonal, reverseDiagonal };
}

const MIN_SIZE = 3;
const MAX_SIZE = 15;

describe('MatrixResultComponent', () => {
  let fixture: ComponentFixture<MatrixResultComponent>;
  let componentRef: ComponentRef<MatrixResultComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixResultComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatrixResultComponent);
    componentRef = fixture.componentRef;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    componentRef.setInput('size', 5);
    fixture.detectChanges();
    expect(componentRef.instance).toBeTruthy();
    httpMock.expectOne('http://localhost:3000/api/caracol/5').flush(buildMockResponse(5));
  });

  it('should show loading state before the response arrives', () => {
    componentRef.setInput('size', MIN_SIZE);
    fixture.detectChanges();

    const loadingEl = fixture.nativeElement.querySelector('.result-loading');
    expect(loadingEl).toBeTruthy();

    httpMock.expectOne(`http://localhost:3000/api/caracol/${MIN_SIZE}`).flush(buildMockResponse(MIN_SIZE));
  });

  it('should show error state when the API returns an error', async () => {
    componentRef.setInput('size', MIN_SIZE);
    fixture.detectChanges();

    httpMock.expectOne(`http://localhost:3000/api/caracol/${MIN_SIZE}`).flush(
      { message: 'Invalid size' },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.result-error');
    expect(errorEl).toBeTruthy();
  });

  describe('minimum size (3x3)', () => {
    let mock: CaracolResponse;

    beforeEach(async () => {
      mock = buildMockResponse(MIN_SIZE);
      componentRef.setInput('size', MIN_SIZE);
      fixture.detectChanges();
      httpMock.expectOne(`http://localhost:3000/api/caracol/${MIN_SIZE}`).flush(mock);
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should render 3 rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('.result-matrix tr');
      expect(rows.length).toBe(MIN_SIZE);
    });

    it('should render 9 cells total', () => {
      const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
      expect(cells.length).toBe(MIN_SIZE * MIN_SIZE);
    });

    it('should display the first and last cell correctly', () => {
      const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
      expect(cells[0].textContent.trim()).toBe('1');
      expect(cells[MIN_SIZE * MIN_SIZE - 1].textContent.trim()).toBe(String(MIN_SIZE * MIN_SIZE));
    });

    it('should display 3 diagonal values', () => {
      const diagonals = fixture.nativeElement.querySelectorAll('.result-diagonal');
      const expectedDiag = mock.diagonal.join(', ');
      const expectedRevDiag = mock.reverseDiagonal.join(', ');
      expect(diagonals[0].textContent).toContain(expectedDiag);
      expect(diagonals[1].textContent).toContain(expectedRevDiag);
    });
  });

  describe('maximum size (15x15)', () => {
    let mock: CaracolResponse;

    beforeEach(async () => {
      mock = buildMockResponse(MAX_SIZE);
      componentRef.setInput('size', MAX_SIZE);
      fixture.detectChanges();
      httpMock.expectOne(`http://localhost:3000/api/caracol/${MAX_SIZE}`).flush(mock);
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should render 15 rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('.result-matrix tr');
      expect(rows.length).toBe(MAX_SIZE);
    });

    it('should render 225 cells total', () => {
      const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
      expect(cells.length).toBe(MAX_SIZE * MAX_SIZE);
    });

    it('should display the first and last cell correctly', () => {
      const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
      expect(cells[0].textContent.trim()).toBe('1');
      expect(cells[MAX_SIZE * MAX_SIZE - 1].textContent.trim()).toBe(String(MAX_SIZE * MAX_SIZE));
    });

    it('should display 15 diagonal values', () => {
      const diagonals = fixture.nativeElement.querySelectorAll('.result-diagonal');
      const expectedDiag = mock.diagonal.join(', ');
      const expectedRevDiag = mock.reverseDiagonal.join(', ');
      expect(diagonals[0].textContent).toContain(expectedDiag);
      expect(diagonals[1].textContent).toContain(expectedRevDiag);
    });

    it('should re-fetch when size changes from max to min', async () => {
      componentRef.setInput('size', MIN_SIZE);
      fixture.detectChanges();

      const minMock = buildMockResponse(MIN_SIZE);
      httpMock.expectOne(`http://localhost:3000/api/caracol/${MIN_SIZE}`).flush(minMock);
      await fixture.whenStable();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
      expect(cells.length).toBe(MIN_SIZE * MIN_SIZE);
    });
  });
});
