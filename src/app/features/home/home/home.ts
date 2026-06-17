import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { AuthStore } from '../../../core/auth/auth.store';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { HabilidadesApi } from '../../../core/api/habilidades-api';
import { RetosApi } from '../../../core/api/retos-api';
import { MetricasApi } from '../../../core/api/metricas-api';
import { Postulacion } from '../../../shared/models/postulacion.model';
import { NivelDificultad, Reto } from '../../../shared/models/reto.model';
import { MetricasEmpresa } from '../../../shared/models/metricas.model';
import { Portafolio } from '../../../shared/models/habilidad.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    MatIconModule, MatButtonModule, MatCardModule, MatChipsModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authStore = inject(AuthStore);
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly habilidadesApi = inject(HabilidadesApi);
  private readonly retosApi = inject(RetosApi);
  private readonly metricasApi = inject(MetricasApi);

  readonly usuario = this.authStore.usuario;
  readonly cargando = signal(true);

  readonly postulaciones = signal<Postulacion[]>([]);
  readonly portafolio = signal<Portafolio | null>(null);
  readonly retos = signal<Reto[]>([]);
  readonly metricas = signal<MetricasEmpresa | null>(null);

  readonly esTalento = computed(() => this.usuario()?.rol === 'TALENTO');
  readonly esEmpresa = computed(() => this.usuario()?.rol === 'EMPRESA');

  readonly statsTalento = computed(() => {
    const lista = this.postulaciones();
    return {
      enProgreso: lista.filter((p) => p.estado === 'EN_REVISION').length,
      completadas: lista.filter((p) => p.estado === 'APROBADO').length,
      insignias: this.portafolio()?.insignias.length ?? 0,
    };
  });

  readonly retosEnProgreso = computed(() => {
    return this.postulaciones()
      .filter((p) => p.estado === 'EN_REVISION')
      .slice(0, 3);
  });

  readonly retosRecientes = computed(() => {
    return this.retos().slice(0, 3);
  });

  constructor() {
    const usuario = this.usuario();
    if (!usuario) return;

    if (usuario.rol === 'TALENTO') {
      forkJoin({
        postulaciones: this.postulacionesApi
          .historialTalento(usuario.id)
          .pipe(catchError(() => of([] as Postulacion[]))),
        portafolio: this.habilidadesApi
          .portafolio(usuario.id)
          .pipe(catchError(() => of(null as Portafolio | null))),
      })
        .pipe(
          tap(({ postulaciones, portafolio }) => {
            this.postulaciones.set(postulaciones);
            this.portafolio.set(portafolio);
            this.cargando.set(false);
          }),
        )
        .subscribe();
    } else if (usuario.rol === 'EMPRESA') {
      forkJoin({
        metricas: this.metricasApi
          .empresa(usuario.id)
          .pipe(catchError(() => of(null as MetricasEmpresa | null))),
        retos: this.retosApi
          .buscar({ empresaId: usuario.id })
          .pipe(catchError(() => of([] as Reto[]))),
      })
        .pipe(
          tap(({ metricas, retos }) => {
            this.metricas.set(metricas);
            this.retos.set(retos);
            this.cargando.set(false);
          }),
        )
        .subscribe();
    } else {
      this.cargando.set(false);
    }
  }

  etiquetaNivel(nivel: NivelDificultad): string {
    switch (nivel) {
      case 'BASICO': return 'Básico';
      case 'INTERMEDIO': return 'Intermedio';
      case 'AVANZADO': return 'Avanzado';
      case 'EXPERTO': return 'Experto';
    }
  }
}
