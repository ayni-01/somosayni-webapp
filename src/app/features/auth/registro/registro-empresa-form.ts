import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { IdentidadApi } from '../../../core/api/identidad-api';
import { PerfilesApi } from '../../../core/api/perfiles-api';
import { matchPasswords } from '../../../shared/validators/match-passwords';

const SECTORES = ['Tecnología', 'Finanzas', 'Salud', 'Educación', 'Retail', 'Manufactura', 'Servicios', 'Otro'];

@Component({
  selector: 'sa-registro-empresa-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro-empresa-form.html',
  styleUrl: './registro-empresa-form.scss',
})
export class RegistroEmpresaForm {
  private readonly fb = inject(FormBuilder);
  private readonly identidadApi = inject(IdentidadApi);
  private readonly perfilesApi = inject(PerfilesApi);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly sectores = SECTORES;

  readonly form = this.fb.group({
    razonSocial: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    sector: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmar: ['', [Validators.required]],
  }, { validators: matchPasswords('password', 'confirmar') });

  submit(): void {
    if (this.form.invalid || this.enviando()) return;
    this.enviando.set(true);

    const { razonSocial, correo, sector, password } = this.form.getRawValue();

    this.identidadApi.registrar({
      nombreCompleto: razonSocial!,
      correo: correo!,
      password: password!,
      rol: 'EMPRESA',
    }).pipe(
      switchMap(usuario => this.perfilesApi.crearEmpresa({
        usuarioId: usuario.id,
        razonSocial: razonSocial!,
        ruc: '',
        sector: sector!,
        logoUrl: null,
        estado: 'PENDIENTE',
      })),
      tap({
        next: () => {
          this.enviando.set(false);
          this.snack.open('Cuenta de empresa creada. Inicia sesión para continuar.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/auth/login'], { queryParams: { correo } });
        },
        error: () => this.enviando.set(false),
      }),
    ).subscribe();
  }
}
