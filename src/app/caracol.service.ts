import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CaracolResponse {
  matrix: number[][];
  diagonal: number[];
  reverseDiagonal: number[];
}

const API_BASE = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class CaracolService {
  private readonly http = inject(HttpClient);

  getCaracol(size: number): Observable<CaracolResponse> {
    return this.http.get<CaracolResponse>(`${API_BASE}/api/caracol/${size}`);
  }
}
