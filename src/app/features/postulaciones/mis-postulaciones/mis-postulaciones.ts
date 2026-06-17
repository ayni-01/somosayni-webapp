import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EstadoPostulacion, Postulacion } from '../../../shared/models/postulacion.model';

@Component({
  selector: 'sa-mis-postulaciones',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-postulaciones.html',
  styleUrl: './mis-postulaciones.scss',
})
export class MisPostulaciones {
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly postulaciones = signal<Postulacion[]>([]);

  readonly resumen = computed(() => {
    const lista = this.postulaciones();
    const aprobadas = lista.filter(p => p.estado === 'APROBADA' || p.estado === 'FINALIZADA').length;
    const enRevision = lista.filter(p => p.estado === 'ENVIADA' || p.estado === 'EN_REVISION').length;
    return { total: lista.length, aprobadas, enRevision };
  });

  constructor() {
    const usuario = this.authStore.usuario();
    if (!usuario) return;

    this.postulacionesApi.historialTalento(usuario.id).pipe(
      catchError(() => of([] as Postulacion[])),
      tap(lista => {
        this.postulaciones.set(lista);
        this.cargando.set(false);
      }),
    ).subscribe();
  }

  etiquetaEstado(estado: EstadoPostulacion): string {
    switch (estado) {
      case 'ENVIADA': return 'Enviada';
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADA': return 'Aprobada';
      case 'RECHAZADA': return 'Rechazada';
      case 'FINALIZADA': return 'Finalizada';
    }
  }
}
