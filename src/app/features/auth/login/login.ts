import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { IdentidadApi } from '../../../core/api/identidad-api';
import { AuthStore } from '../../../core/auth/auth.store';

@Component({
  selector: 'sa-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly identidadApi = inject(IdentidadApi);
  private readonly authStore = inject(AuthStore);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly enviando = signal(false);

  readonly form = this.fb.group({
    email: [this.route.snapshot.queryParamMap.get('email') ?? '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    recordarme: [false],
  });

  submit(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const { email, password } = this.form.getRawValue();

    this.identidadApi.login({
      email: email!,
      password: password!,
    }).pipe(
      tap({
        next: respuesta => {
          this.enviando.set(false);
          this.authStore.iniciarSesion(respuesta.token, {
            id: respuesta.usuarioId,
            email: respuesta.email,
            rol: respuesta.rol,
          });
          this.router.navigateByUrl('/app/inicio');
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }
}
