import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatrixFormComponent } from './matrix-form/matrix-form';
import { MatrixResultComponent } from './matrix-result/matrix-result';

@Component({
  selector: 'app-root',
  imports: [MatrixFormComponent, MatrixResultComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly matrixSize = signal<number | null>(null);

  onMatrixSizeSubmit(size: number): void {
    this.matrixSize.set(size);
  }
}
