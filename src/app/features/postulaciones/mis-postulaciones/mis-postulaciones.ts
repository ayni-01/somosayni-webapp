import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EstadoPostulacion, Postulacion } from '../../../shared/models/postulacion.model';
import { FeedbackEnfoqueDialog } from '../feedback-enfoque-dialog/feedback-enfoque-dialog';

@Component({
  selector: 'sa-mis-postulaciones',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-postulaciones.html',
  styleUrl: './mis-postulaciones.scss',
})
export class MisPostulaciones {
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly authStore = inject(AuthStore);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(true);
  readonly postulaciones = signal<Postulacion[]>([]);

  readonly resumen = computed(() => {
    const lista = this.postulaciones();
    const aprobadas = lista.filter(p => p.estado === 'APROBADO').length;
    const enRevision = lista.filter(p => p.estado === 'EN_REVISION').length;
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

  abrirFeedback(postulacionId: string): void {
    this.dialog.open(FeedbackEnfoqueDialog, { data: { postulacionId } });
  }

  etiquetaEstado(estado: EstadoPostulacion): string {
    switch (estado) {
      case 'EN_REVISION': return 'En revisión';
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
    }
  }
}
