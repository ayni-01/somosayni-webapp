import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { MetricasApi } from '../../../core/api/metricas-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EmbudoReto, MetricasEmpresa } from '../../../shared/models/metricas.model';

@Component({
  selector: 'sa-panel-empresa',
  standalone: true,
  imports: [DecimalPipe, RouterLink, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './panel-empresa.html',
  styleUrl: './panel-empresa.scss',
})
export class PanelEmpresa {
  private readonly metricasApi = inject(MetricasApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly metricas = signal<MetricasEmpresa | null>(null);
  readonly embudo = signal<EmbudoReto[]>([]);

  constructor() {
    const usuario = this.authStore.usuario();
    if (!usuario) return;

    forkJoin({
      metricas: this.metricasApi.empresa(usuario.id).pipe(catchError(() => of(null))),
      embudo: this.metricasApi.embudo(usuario.id).pipe(catchError(() => of([] as EmbudoReto[]))),
    }).pipe(
      tap(({ metricas, embudo }) => {
        this.metricas.set(metricas);
        this.embudo.set(embudo);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
