import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of, tap } from 'rxjs';
import { AsistenteApi } from '../../../core/api/asistente-api';

@Component({
  selector: 'sa-feedback-enfoque-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feedback-enfoque-dialog.html',
  styleUrl: './feedback-enfoque-dialog.scss',
})
export class FeedbackEnfoqueDialog {
  private readonly asistenteApi = inject(AsistenteApi);
  private readonly data = inject<{ postulacionId: string }>(MAT_DIALOG_DATA);

  readonly enfoque = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly cargando = signal(false);
  readonly feedback = signal<string | null>(null);
  readonly error = signal(false);

  obtener(): void {
    const texto = this.enfoque.value.trim();
    if (!texto || this.cargando()) return;
    this.cargando.set(true);
    this.error.set(false);
    this.asistenteApi.feedback(this.data.postulacionId, texto).pipe(
      catchError(() => {
        this.error.set(true);
        this.cargando.set(false);
        return of(null);
      }),
      tap((res) => {
        if (!res) return;
        this.feedback.set(res.feedback);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
