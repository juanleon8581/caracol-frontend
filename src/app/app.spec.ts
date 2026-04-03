import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize matrixSize as null', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance['matrixSize']()).toBeNull();
  });

  it('should update matrixSize when onMatrixSizeSubmit is called', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.onMatrixSizeSubmit(9);
    expect(fixture.componentInstance['matrixSize']()).toBe(9);
  });
});
