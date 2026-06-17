import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of, tap } from 'rxjs';
import { HabilidadesApi } from '../../../core/api/habilidades-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { NivelHabilidad, Portafolio as PortafolioModel } from '../../../shared/models/habilidad.model';

@Component({
  selector: 'sa-portafolio',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portafolio.html',
  styleUrl: './portafolio.scss',
})
export class Portafolio {
  private readonly habilidadesApi = inject(HabilidadesApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly portafolio = signal<PortafolioModel | null>(null);

  constructor() {
    const usuario = this.authStore.usuario();
    if (!usuario) return;

    this.habilidadesApi.portafolio(usuario.id).pipe(
      catchError(() => of(null)),
      tap(portafolio => {
        this.portafolio.set(portafolio);
        this.cargando.set(false);
      }),
    ).subscribe();
  }

  etiquetaNivel(nivel: NivelHabilidad): string {
    switch (nivel) {
      case 'BASICO': return 'Básico';
      case 'INTERMEDIO': return 'Intermedio';
      case 'AVANZADO': return 'Avanzado';
    }
  }
}
