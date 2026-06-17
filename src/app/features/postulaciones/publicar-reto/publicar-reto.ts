import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { NivelDificultad } from '../../../shared/models/reto.model';

const CATEGORIAS = ['Tecnología', 'Diseño', 'Marketing', 'Datos', 'Operaciones', 'Otro'];
const NIVELES: NivelDificultad[] = ['BASICO', 'INTERMEDIO', 'AVANZADO'];

@Component({
  selector: 'sa-publicar-reto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule,
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

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    categoria: ['', [Validators.required]],
    nivel: ['INTERMEDIO' as NivelDificultad, [Validators.required]],
    cuposTotal: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
  });

  publicar(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const valor = this.form.getRawValue();
    this.retosApi.publicar({
      titulo: valor.titulo!,
      descripcion: valor.descripcion!,
      categoria: valor.categoria!,
      nivel: valor.nivel!,
      cuposTotal: valor.cuposTotal!,
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
}
