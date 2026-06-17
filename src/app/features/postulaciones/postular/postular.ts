import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { RetosApi } from '../../../core/api/retos-api';
import { Categoria, NivelDificultad, Reto } from '../../../shared/models/reto.model';

@Component({
  selector: 'sa-postular',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatCardModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './postular.html',
  styleUrl: './postular.scss',
})
export class Postular {
  readonly id = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly retosApi = inject(RetosApi);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly reto = signal<Reto | null>(null);
  readonly error = signal(false);

  readonly form = this.fb.group({
    urlSolucion: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  });

  constructor() {
    queueMicrotask(() => this.cargarReto());
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

  enviar(): void {
    const reto = this.reto();
    if (!reto || this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const urlSolucion = this.form.controls.urlSolucion.value!;

    this.postulacionesApi.postular({
      retoId: reto.id,
      urlSolucion,
    }).pipe(
      tap({
        next: () => {
          this.enviando.set(false);
          this.snack.open('Postulación enviada con éxito', 'Cerrar', { duration: 4000 });
          this.router.navigateByUrl('/app/postulaciones/mis-postulaciones');
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }

  private cargarReto(): void {
    this.retosApi.detalle(this.id()).pipe(
      catchError(() => {
        this.error.set(true);
        return of(null);
      }),
      tap(reto => {
        this.reto.set(reto);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
