import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-matrix-result',
  templateUrl: './matrix-result.html',
  styleUrl: './matrix-result.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixResultComponent {
  readonly size = input.required<number>();
}
