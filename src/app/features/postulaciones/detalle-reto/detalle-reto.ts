import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Reto } from '../../../shared/models/reto.model';

@Component({
  selector: 'sa-detalle-reto',
  standalone: true,
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-reto.html',
  styleUrl: './detalle-reto.scss',
})
export class DetalleReto {
  readonly id = input.required<string>();

  private readonly retosApi = inject(RetosApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly reto = signal<Reto | null>(null);
  readonly error = signal(false);

  readonly esTalento = computed(() => this.authStore.usuario()?.rol === 'TALENTO');
  readonly puedePostular = computed(() => {
    const r = this.reto();
    return !!r && r.estado === 'ACTIVO' && this.esTalento();
  });

  constructor() {
    queueMicrotask(() => this.cargar());
  }

  private cargar(): void {
    const id = this.id();
    if (!id) return;
    this.retosApi.detalle(id).pipe(
      catchError(() => {
        this.error.set(true);
        return of(null);
      }),
      tap(reto => {
        this.reto.set(reto);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
