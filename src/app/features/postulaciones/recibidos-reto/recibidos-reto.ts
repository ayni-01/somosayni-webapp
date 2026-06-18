import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { RetosApi } from '../../../core/api/retos-api';
import { EstadoPostulacion, Postulacion } from '../../../shared/models/postulacion.model';
import { Reto } from '../../../shared/models/reto.model';

@Component({
  selector: 'sa-recibidos-reto',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recibidos-reto.html',
  styleUrl: './recibidos-reto.scss',
})
export class RecibidosReto {
  readonly id = input.required<string>();

  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly retosApi = inject(RetosApi);

  readonly cargando = signal(true);
  readonly reto = signal<Reto | null>(null);
  readonly postulaciones = signal<Postulacion[]>([]);

  readonly resumen = computed(() => {
    const lista = this.postulaciones();
    const pendientes = lista.filter(p => p.estado === 'EN_REVISION').length;
    const aprobadas = lista.filter(p => p.estado === 'APROBADO').length;
    return { total: lista.length, pendientes, aprobadas };
  });

  constructor() {
    queueMicrotask(() => this.cargar());
  }

  etiquetaEstado(estado: EstadoPostulacion): string {
    switch (estado) {
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
    }
  }

  private cargar(): void {
    const retoId = this.id();
    forkJoin({
      reto: this.retosApi.detalle(retoId).pipe(catchError(() => of(null))),
      postulaciones: this.postulacionesApi.solucionesReto(retoId).pipe(catchError(() => of([] as Postulacion[]))),
    }).pipe(
      tap(({ reto, postulaciones }) => {
        this.reto.set(reto);
        this.postulaciones.set(postulaciones);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
