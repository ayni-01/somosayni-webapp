import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { Categoria, NivelDificultad, TipoRecompensa } from '../../../shared/models/reto.model';

const CATEGORIAS: Categoria[] = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'DATA', 'DEVOPS', 'UX_UI', 'QA', 'MOBILE'];
const NIVELES: NivelDificultad[] = ['JUNIOR', 'TRAINEE', 'SENIOR'];
const TIPOS_RECOMPENSA: TipoRecompensa[] = ['MONETARIA', 'CONTRATACION', 'DIPLOMA'];

@Component({
  selector: 'sa-publicar-reto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, MatSelectModule, MatCardModule, MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publicar-reto.html',
  styleUrl: './publicar-reto.scss',
})
export class PublicarReto {
  private readonly fb = inject(FormBuilder);
  private readonly retosApi = inject(RetosApi);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly categorias = CATEGORIAS;
  readonly niveles = NIVELES;
  readonly tiposRecompensa = TIPOS_RECOMPENSA;

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    categoria: ['BACKEND' as Categoria, [Validators.required]],
    nivelDificultad: ['TRAINEE' as NivelDificultad, [Validators.required]],
    cuposDisponibles: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
    tipoRecompensa: ['MONETARIA' as TipoRecompensa, [Validators.required]],
    montoRecompensa: [0, [Validators.required, Validators.min(0)]],
    fechaLimite: [''],
    requisitos: this.fb.array<FormControl<string>>([this.crearControl('')]),
    entregables: this.fb.array<FormControl<string>>([this.crearControl('')]),
  });

  get requisitos(): FormArray<FormControl<string>> {
    return this.form.controls.requisitos;
  }

  get entregables(): FormArray<FormControl<string>> {
    return this.form.controls.entregables;
  }

  agregarRequisito(): void {
    this.requisitos.push(this.crearControl(''));
  }

  quitarRequisito(i: number): void {
    if (this.requisitos.length > 1) this.requisitos.removeAt(i);
  }

  agregarEntregable(): void {
    this.entregables.push(this.crearControl(''));
  }

  quitarEntregable(i: number): void {
    if (this.entregables.length > 1) this.entregables.removeAt(i);
  }

  etiquetaCategoria(c: Categoria): string {
    switch (c) {
      case 'FRONTEND': return 'Frontend';
      case 'BACKEND': return 'Backend';
      case 'FULLSTACK': return 'Fullstack';
      case 'DATA': return 'Data';
      case 'DEVOPS': return 'DevOps';
      case 'UX_UI': return 'UX / UI';
      case 'QA': return 'QA / Testing';
      case 'MOBILE': return 'Mobile';
    }
  }

  etiquetaNivel(n: NivelDificultad): string {
    switch (n) {
      case 'JUNIOR': return 'Junior';
      case 'TRAINEE': return 'Trainee';
      case 'SENIOR': return 'Senior';
    }
  }

  etiquetaTipoRecompensa(t: TipoRecompensa): string {
    switch (t) {
      case 'MONETARIA': return 'Monetaria';
      case 'CONTRATACION': return 'Contratación';
      case 'DIPLOMA': return 'Diploma';
    }
  }

  publicar(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const v = this.form.getRawValue();
    this.retosApi.publicar({
      titulo: v.titulo!,
      descripcion: v.descripcion!,
      categoria: v.categoria!,
      requisitos: (v.requisitos as string[]).map(s => s?.trim()).filter(s => !!s),
      entregables: (v.entregables as string[]).map(s => s?.trim()).filter(s => !!s),
      tipoRecompensa: v.tipoRecompensa!,
      montoRecompensa: v.montoRecompensa!,
      fechaLimite: v.fechaLimite || null,
      nivelDificultad: v.nivelDificultad!,
      cuposDisponibles: v.cuposDisponibles!,
    }).pipe(
      tap({
        next: () => {
          this.enviando.set(false);
          this.snack.open('Reto publicado', 'Cerrar', { duration: 3000 });
          this.router.navigateByUrl('/app/postulaciones/mis-retos');
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }

  private crearControl(valor: string): FormControl<string> {
    return this.fb.nonNullable.control(valor);
  }
}
