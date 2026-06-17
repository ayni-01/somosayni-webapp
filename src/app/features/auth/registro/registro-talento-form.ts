import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { IdentidadApi } from '../../../core/api/identidad-api';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { matchPasswords } from '../../../shared/validators/match-passwords';

@Component({
  selector: 'sa-registro-talento-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro-talento-form.html',
  styleUrl: './registro-talento-form.scss',
})
export class RegistroTalentoForm {
  private readonly fb = inject(FormBuilder);
  private readonly identidadApi = inject(IdentidadApi);
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly enviando = signal(false);

  readonly form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmar: ['', [Validators.required]],
  }, { validators: matchPasswords('password', 'confirmar') });

  submit(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const { nombreCompleto, email, password } = this.form.getRawValue();

    this.identidadApi.registrar({
      email: email!,
      password: password!,
      rol: 'TALENTO',
    }).pipe(
      switchMap(() => this.perfilesApi.crearTalento({ nombreCompleto: nombreCompleto! })),
      tap({
        next: () => {
          this.enviando.set(false);
          this.snack.open('Cuenta creada. Inicia sesión para continuar.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/auth/login'], { queryParams: { email } });
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }
}
