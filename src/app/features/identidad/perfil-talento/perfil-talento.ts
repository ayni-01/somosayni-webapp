import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
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
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule,
    MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatDividerModule,
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

  readonly usuario = this.authStore.usuario;

  readonly form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    ubicacion: [''],
    sobreMi: ['', [Validators.maxLength(500)]],
  });

  private readonly valor = signal({ nombreCompleto: '', ubicacion: '', sobreMi: '' });

  readonly iniciales = computed(() => {
    const fuente = this.valor().nombreCompleto || this.usuario()?.email || '?';
    return fuente
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() ?? '')
      .join('');
  });

  readonly progreso = computed(() => {
    const v = this.valor();
    const completados =
      (v.nombreCompleto?.trim() ? 1 : 0) +
      (v.ubicacion?.trim() ? 1 : 0) +
      (v.sobreMi?.trim() && v.sobreMi.trim().length >= 20 ? 1 : 0);
    return Math.round((completados / 3) * 100);
  });

  readonly etiquetaProgreso = computed(() => {
    const p = this.progreso();
    if (p === 100) return 'Perfil completo';
    if (p >= 66) return 'Casi listo';
    if (p >= 33) return 'En progreso';
    return 'Comencemos';
  });

  readonly contadorSobreMi = computed(() => this.valor().sobreMi?.length ?? 0);

  constructor() {
    this.form.valueChanges.subscribe(v => {
      this.valor.set({
        nombreCompleto: v.nombreCompleto ?? '',
        ubicacion: v.ubicacion ?? '',
        sobreMi: v.sobreMi ?? '',
      });
    });

    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) {
      this.cargando.set(false);
      return;
    }

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
