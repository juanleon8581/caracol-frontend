import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CaracolResponse, CaracolService } from '../caracol.service';

@Component({
  selector: 'app-matrix-result',
  templateUrl: './matrix-result.html',
  styleUrl: './matrix-result.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixResultComponent {
  readonly size = input.required<number>();

  private readonly caracolService = inject(CaracolService);

  protected readonly caracolData = rxResource<CaracolResponse, number>({
    params: () => this.size(),
    stream: ({ params: size }) => this.caracolService.getCaracol(size),
  });

  protected readonly diagonalStr = computed(
    () => this.caracolData.value()?.diagonal.join(', ') ?? '',
  );

  protected readonly reverseDiagonalStr = computed(
    () => this.caracolData.value()?.reverseDiagonal.join(', ') ?? '',
  );
}
