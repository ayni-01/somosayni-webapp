import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Modalidad } from '../../../shared/models/reto.model';

const MODALIDADES: Modalidad[] = ['REMOTO', 'PRESENCIAL', 'HIBRIDO'];

@Component({
  selector: 'sa-publicar-reto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publicar-reto.html',
  styleUrl: './publicar-reto.scss',
})
export class PublicarReto {
  private readonly fb = inject(FormBuilder);
  private readonly retosApi = inject(RetosApi);
  private readonly authStore = inject(AuthStore);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly modalidades = MODALIDADES;

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    modalidad: ['REMOTO' as Modalidad, [Validators.required]],
    duracionDias: [30, [Validators.required, Validators.min(1), Validators.max(180)]],
  });

  publicar(): void {
    const usuario = this.authStore.usuario();
    if (!usuario || this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const valor = this.form.getRawValue();
    this.retosApi.publicar({
      titulo: valor.titulo!,
      descripcion: valor.descripcion!,
      empresaId: usuario.id,
      modalidad: valor.modalidad!,
      duracionDias: valor.duracionDias!,
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
