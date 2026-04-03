import { TestBed } from '@angular/core/testing';
import { MatrixFormComponent } from './matrix-form';

describe('MatrixFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixFormComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be invalid when size is empty', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const { form } = fixture.componentInstance;
    form.controls.size.setValue(null);
    expect(form.invalid).toBeTrue();
  });

  it('should be invalid when size is below minimum (3)', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const { form } = fixture.componentInstance;
    form.controls.size.setValue(2);
    expect(form.invalid).toBeTrue();
  });

  it('should be invalid when size exceeds maximum (15)', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const { form } = fixture.componentInstance;
    form.controls.size.setValue(16);
    expect(form.invalid).toBeTrue();
  });

  it('should be valid when size is within range', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const { form } = fixture.componentInstance;
    form.controls.size.setValue(7);
    expect(form.valid).toBeTrue();
  });

  it('should emit size on valid submit', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const component = fixture.componentInstance;
    let emitted: number | undefined;
    component.matrixSizeSubmit.subscribe((v: number) => (emitted = v));

    component.form.controls.size.setValue(9);
    component.onSubmit();

    expect(emitted).toBe(9);
  });

  it('should not emit on invalid submit', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const component = fixture.componentInstance;
    let emitted = false;
    component.matrixSizeSubmit.subscribe(() => (emitted = true));

    component.form.controls.size.setValue(1);
    component.onSubmit();

    expect(emitted).toBeFalse();
  });

  it('should set submitted signal to true after onSubmit', () => {
    const fixture = TestBed.createComponent(MatrixFormComponent);
    const component = fixture.componentInstance;
    component.onSubmit();
    expect(component['submitted']()).toBeTrue();
  });
});
