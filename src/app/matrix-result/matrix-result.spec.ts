import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { MatrixResultComponent } from './matrix-result';

const MOCK_RESPONSE = {
  matrix: [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
  diagonal: [1, 9, 5],
  reverseDiagonal: [3, 9, 7],
};

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
    expect(componentRef.instance).toBeTruthy();
    httpMock.expectOne('http://localhost:3000/api/caracol/5').flush(MOCK_RESPONSE);
  });

  it('should show loading state before the response arrives', () => {
    componentRef.setInput('size', 3);
    fixture.detectChanges();

    const loadingEl = fixture.nativeElement.querySelector('.result-loading');
    expect(loadingEl).toBeTruthy();

    httpMock.expectOne('http://localhost:3000/api/caracol/3').flush(MOCK_RESPONSE);
  });

  it('should render the matrix cells after a successful response', async () => {
    componentRef.setInput('size', 3);
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:3000/api/caracol/3').flush(MOCK_RESPONSE);
    await fixture.whenStable();
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('.result-matrix__cell');
    expect(cells.length).toBe(9);
    expect(cells[0].textContent.trim()).toBe('1');
    expect(cells[8].textContent.trim()).toBe('5');
  });

  it('should display diagonal values after a successful response', async () => {
    componentRef.setInput('size', 3);
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:3000/api/caracol/3').flush(MOCK_RESPONSE);
    await fixture.whenStable();
    fixture.detectChanges();

    const diagonals = fixture.nativeElement.querySelectorAll('.result-diagonal');
    expect(diagonals[0].textContent).toContain('1, 9, 5');
    expect(diagonals[1].textContent).toContain('3, 9, 7');
  });

  it('should show error state when the API returns an error', async () => {
    componentRef.setInput('size', 3);
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:3000/api/caracol/3').flush(
      { message: 'Invalid size' },
      { status: 400, statusText: 'Bad Request' },
    );
    await fixture.whenStable();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.result-error');
    expect(errorEl).toBeTruthy();
  });
});
