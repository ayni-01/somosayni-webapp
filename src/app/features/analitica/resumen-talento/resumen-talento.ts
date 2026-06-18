import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { HabilidadesApi } from '../../../core/api/habilidades-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Postulacion } from '../../../shared/models/postulacion.model';
import { Portafolio } from '../../../shared/models/habilidad.model';

@Component({
  selector: 'sa-resumen-talento',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    MatIconModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resumen-talento.html',
  styleUrl: './resumen-talento.scss',
})
export class ResumenTalento {
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly habilidadesApi = inject(HabilidadesApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly postulaciones = signal<Postulacion[]>([]);
  readonly portafolio = signal<Portafolio | null>(null);

  readonly stats = computed(() => {
    const lista = this.postulaciones();
    const completados = lista.filter(p => p.estado === 'APROBADO').length;
    const enProgreso = lista.filter(p => p.estado === 'EN_REVISION').length;
    const insignias = this.portafolio()?.insignias.length ?? 0;
    return { completados, enProgreso, insignias };
  });

  readonly retosEnProgreso = computed(() => {
    return this.postulaciones().filter(p => p.estado === 'EN_REVISION');
  });

  constructor() {
    const usuario = this.authStore.usuario();
    if (!usuario) return;

    forkJoin({
      postulaciones: this.postulacionesApi.historialTalento(usuario.id).pipe(catchError(() => of([] as Postulacion[]))),
      portafolio: this.habilidadesApi.portafolio(usuario.id).pipe(catchError(() => of(null))),
    }).pipe(
      tap(({ postulaciones, portafolio }) => {
        this.postulaciones.set(postulaciones);
        this.portafolio.set(portafolio);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
