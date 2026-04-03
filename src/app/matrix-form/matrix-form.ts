import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-matrix-form',
  imports: [ReactiveFormsModule],
  templateUrl: './matrix-form.html',
  styleUrl: './matrix-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixFormComponent {
  readonly matrixSizeSubmit = output<number>();

  readonly form = new FormGroup({
    size: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(3),
      Validators.max(15),
    ]),
  });

  protected readonly submitted = signal(false);

  get showError(): boolean {
    return this.submitted() && this.form.controls.size.invalid;
  }

  onSubmit(): void {
    this.submitted.set(true);
    const value = this.form.controls.size.value;
    if (this.form.valid && value !== null) {
      this.matrixSizeSubmit.emit(value);
    }
  }
}
