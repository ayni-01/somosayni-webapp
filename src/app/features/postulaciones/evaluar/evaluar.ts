import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { PostulacionesApi } from '../../../core/api/postulaciones-api';
import { ResultadoEvaluacion } from '../../../shared/models/postulacion.model';

@Component({
  selector: 'sa-evaluar',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatRadioModule, MatSliderModule,
    MatButtonModule, MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './evaluar.html',
  styleUrl: './evaluar.scss',
})
export class Evaluar {
  readonly id = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly postulacionesApi = inject(PostulacionesApi);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly enviando = signal(false);

  readonly form = this.fb.group({
    puntuacion: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
    feedback: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
    resultado: ['APROBADO' as ResultadoEvaluacion, [Validators.required]],
  });

  enviar(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const valor = this.form.getRawValue();
    this.postulacionesApi.evaluar(this.id(), {
      puntuacion: valor.puntuacion!,
      feedback: valor.feedback!,
      resultado: valor.resultado!,
    }).pipe(
      tap({
        next: () => {
          this.enviando.set(false);
          this.snack.open('Evaluación enviada', 'Cerrar', { duration: 3000 });
          this.router.navigateByUrl(this.urlVuelta());
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }

  urlVuelta(): string {
    const retoId = this.route.snapshot.queryParamMap.get('reto');
    return retoId ? `/app/postulaciones/reto/${retoId}/recibidos` : '/app/postulaciones/mis-retos';
  }
}
