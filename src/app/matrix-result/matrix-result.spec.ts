import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatrixResultComponent } from './matrix-result';

describe('MatrixResultComponent', () => {
  let componentRef: ComponentRef<MatrixResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixResultComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(MatrixResultComponent);
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    componentRef.setInput('size', 5);
    expect(componentRef.instance).toBeTruthy();
  });

  it('should expose the size input', () => {
    componentRef.setInput('size', 8);
    expect(componentRef.instance.size()).toBe(8);
  });
});
