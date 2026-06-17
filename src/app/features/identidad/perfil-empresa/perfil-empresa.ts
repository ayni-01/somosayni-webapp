import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of, tap } from 'rxjs';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EstadoValidacion, PerfilEmpresa as PerfilEmpresaModel } from '../../../shared/models/perfil-empresa.model';

@Component({
  selector: 'sa-perfil-empresa',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule,
    MatCardModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-empresa.html',
  styleUrl: './perfil-empresa.scss',
})
export class PerfilEmpresa {
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly perfil = signal<PerfilEmpresaModel | null>(null);
  readonly estadoValidacion = signal<EstadoValidacion | null>(null);

  constructor() {
    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) {
      this.cargando.set(false);
      return;
    }

    this.perfilesApi.obtenerEmpresa(usuarioId).pipe(
      catchError(() => of(null)),
      tap(perfil => {
        if (perfil) {
          this.perfil.set(perfil);
          this.estadoValidacion.set(perfil.estadoValidacion);
        }
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
