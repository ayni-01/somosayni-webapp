import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Educacion, Experiencia, PerfilTalento as PerfilTalentoModel } from '../../../shared/models/perfil-talento.model';

@Component({
  selector: 'sa-perfil-talento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule,
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
    bio: ['', [Validators.maxLength(500)]],
    portafolioUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    educacion: this.fb.array<FormGroup>([]),
    experiencia: this.fb.array<FormGroup>([]),
  });

  get educacion(): FormArray { return this.form.controls.educacion as FormArray; }
  get experiencia(): FormArray { return this.form.controls.experiencia as FormArray; }

  constructor() {
    const usuarioId = this.authStore.usuario()?.id;
    if (!usuarioId) return;

    this.perfilesApi.obtenerTalento(usuarioId).pipe(
      catchError(() => of(null)),
      tap(perfil => {
        if (perfil) this.poblarFormulario(perfil);
        this.cargando.set(false);
      }),
    ).subscribe();
  }

  agregarEducacion(): void {
    this.educacion.push(this.crearGrupoEducacion());
  }

  quitarEducacion(index: number): void {
    this.educacion.removeAt(index);
  }

  agregarExperiencia(): void {
    this.experiencia.push(this.crearGrupoExperiencia());
  }

  quitarExperiencia(index: number): void {
    this.experiencia.removeAt(index);
  }

  guardar(): void {
    const usuario = this.authStore.usuario();
    if (!usuario || this.form.invalid || this.guardando()) return;
    this.guardando.set(true);

    const valor = this.form.getRawValue();
    const payload: Partial<PerfilTalentoModel> = {
      usuarioId: usuario.id,
      nombreCompleto: valor.nombreCompleto!,
      bio: valor.bio ?? '',
      portafolioUrl: valor.portafolioUrl || null,
      educacion: valor.educacion as Educacion[],
      experiencia: valor.experiencia as Experiencia[],
    };

    this.perfilesApi.editarTalento(usuario.id, payload).pipe(
      tap({
        next: () => {
          this.guardando.set(false);
          this.snack.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        },
        error: () => this.guardando.set(false),
      }),
    ).subscribe();
  }

  private poblarFormulario(perfil: PerfilTalentoModel): void {
    this.form.patchValue({
      nombreCompleto: perfil.nombreCompleto,
      bio: perfil.bio,
      portafolioUrl: perfil.portafolioUrl ?? '',
    });
    this.educacion.clear();
    for (const item of perfil.educacion ?? []) {
      this.educacion.push(this.crearGrupoEducacion(item));
    }
    this.experiencia.clear();
    for (const item of perfil.experiencia ?? []) {
      this.experiencia.push(this.crearGrupoExperiencia(item));
    }
  }

  private crearGrupoEducacion(valor?: Educacion): FormGroup {
    return this.fb.group({
      institucion: [valor?.institucion ?? '', [Validators.required]],
      titulo: [valor?.titulo ?? '', [Validators.required]],
      desde: [valor?.desde ?? '', [Validators.required]],
      hasta: [valor?.hasta ?? null],
    });
  }

  private crearGrupoExperiencia(valor?: Experiencia): FormGroup {
    return this.fb.group({
      empresa: [valor?.empresa ?? '', [Validators.required]],
      cargo: [valor?.cargo ?? '', [Validators.required]],
      desde: [valor?.desde ?? '', [Validators.required]],
      hasta: [valor?.hasta ?? null],
      descripcion: [valor?.descripcion ?? '', [Validators.maxLength(500)]],
    });
  }
}
