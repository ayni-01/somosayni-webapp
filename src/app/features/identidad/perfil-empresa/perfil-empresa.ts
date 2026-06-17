import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of, tap } from 'rxjs';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EstadoValidacion, PerfilEmpresa as PerfilEmpresaModel } from '../../../shared/models/perfil-empresa.model';

const ETIQUETAS_SECTOR: Record<string, string> = {
  TECNOLOGIA: 'Tecnología',
  FINANZAS: 'Finanzas',
  SALUD: 'Salud',
  EDUCACION: 'Educación',
  COMERCIO: 'Comercio',
  INDUSTRIA: 'Industria',
  SERVICIOS: 'Servicios',
};

@Component({
  selector: 'sa-perfil-empresa',
  standalone: true,
  imports: [
    MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-empresa.html',
  styleUrl: './perfil-empresa.scss',
})
export class PerfilEmpresa {
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly authStore = inject(AuthStore);

  readonly usuario = this.authStore.usuario;
  readonly cargando = signal(true);
  readonly perfil = signal<PerfilEmpresaModel | null>(null);

  readonly estadoValidacion = computed<EstadoValidacion | null>(() => this.perfil()?.estadoValidacion ?? null);

  readonly etiquetaEstado = computed(() => {
    switch (this.estadoValidacion()) {
      case 'VALIDADO': return 'Validada';
      case 'RECHAZADO': return 'Rechazada';
      case 'PENDIENTE': return 'Pendiente de revisión';
      default: return 'Sin estado';
    }
  });

  readonly iconoEstado = computed(() => {
    switch (this.estadoValidacion()) {
      case 'VALIDADO': return 'verified';
      case 'RECHAZADO': return 'gpp_bad';
      case 'PENDIENTE': return 'pending';
      default: return 'help';
    }
  });

  readonly iniciales = computed(() => {
    const fuente = this.perfil()?.razonSocial || this.usuario()?.email || '?';
    return fuente
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? '')
      .join('');
  });

  readonly sectorLegible = computed(() => {
    const s = this.perfil()?.sector;
    if (!s) return null;
    return ETIQUETAS_SECTOR[s] ?? s;
  });

  constructor() {
    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) {
      this.cargando.set(false);
      return;
    }

    this.perfilesApi.obtenerEmpresa(usuarioId).pipe(
      catchError(() => of(null)),
      tap(perfil => {
        this.perfil.set(perfil);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
