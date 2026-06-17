import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { EstadoValidacion, PerfilEmpresa as PerfilEmpresaModel } from '../../../shared/models/perfil-empresa.model';

const SECTORES = ['Tecnología', 'Finanzas', 'Salud', 'Educación', 'Retail', 'Manufactura', 'Servicios', 'Otro'];
const RUC_PATTERN = /^\d{11}$/;

@Component({
  selector: 'sa-perfil-empresa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDividerModule,
    MatCardModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-empresa.html',
  styleUrl: './perfil-empresa.scss',
})
export class PerfilEmpresa {
  private readonly fb = inject(FormBuilder);
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly authStore = inject(AuthStore);
  private readonly snack = inject(MatSnackBar);

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly estado = signal<EstadoValidacion | null>(null);
  readonly sectores = SECTORES;

  readonly form = this.fb.group({
    razonSocial: ['', [Validators.required, Validators.minLength(2)]],
    ruc: ['', [Validators.required, Validators.pattern(RUC_PATTERN)]],
    sector: ['', [Validators.required]],
  });

  constructor() {
    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) return;

    this.perfilesApi.obtenerEmpresa(usuarioId).pipe(
      catchError(() => of(null)),
      tap(perfil => {
        if (perfil) this.poblarFormulario(perfil);
        this.cargando.set(false);
      }),
    ).subscribe();
  }

  guardar(): void {
    const usuario = this.authStore.usuario();
    if (!usuario || this.form.invalid || this.guardando()) return;
    this.guardando.set(true);

    const valor = this.form.getRawValue();
    const payload = {
      razonSocial: valor.razonSocial!,
      ruc: valor.ruc!,
      sector: valor.sector!,
    };

    this.perfilesApi.editarEmpresa(usuario.id, payload).pipe(
      tap({
        next: actualizado => {
          this.guardando.set(false);
          this.estado.set(actualizado?.estado ?? this.estado());
          this.snack.open('Datos guardados', 'Cerrar', { duration: 3000 });
        },
        error: () => this.guardando.set(false),
      }),
    ).subscribe();
  }

  private poblarFormulario(perfil: PerfilEmpresaModel): void {
    this.estado.set(perfil.estado);
    this.form.patchValue({
      razonSocial: perfil.razonSocial,
      ruc: perfil.ruc,
      sector: perfil.sector,
    });
  }
}
