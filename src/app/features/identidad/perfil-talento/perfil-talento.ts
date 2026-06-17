import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { PerfilTalento as PerfilTalentoModel } from '../../../shared/models/perfil-talento.model';

@Component({
  selector: 'sa-perfil-talento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-talento.html',
  styleUrl: './perfil-talento.scss',
})
export class PerfilTalento {
  private readonly fb = inject(FormBuilder);
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly authStore = inject(AuthStore);
  private readonly snack = inject(MatSnackBar);

  readonly cargando = signal(true);
  readonly guardando = signal(false);

  readonly form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    ubicacion: [''],
    sobreMi: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) return;

    this.perfilesApi.obtenerTalento(usuarioId).pipe(
      catchError(() => of(null)),
      tap(perfil => {
        if (perfil) {
          this.form.patchValue({
            nombreCompleto: perfil.nombreCompleto,
            ubicacion: perfil.ubicacion ?? '',
            sobreMi: perfil.sobreMi ?? '',
          });
        }
        this.cargando.set(false);
      }),
    ).subscribe();
  }

  guardar(): void {
    const usuario = this.authStore.usuario();
    if (!usuario || this.form.invalid || this.guardando()) return;
    this.guardando.set(true);

    const valor = this.form.getRawValue();

    this.perfilesApi.editarTalento(usuario.id, {
      nombreCompleto: valor.nombreCompleto!,
      ubicacion: valor.ubicacion || null,
      sobreMi: valor.sobreMi || null,
    }).pipe(
      tap({
        next: () => {
          this.guardando.set(false);
          this.snack.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        },
        error: () => this.guardando.set(false),
      }),
    ).subscribe();
  }
}
