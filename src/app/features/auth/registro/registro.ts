import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterLink } from '@angular/router';
import { RegistroTalentoForm } from './registro-talento-form';
import { RegistroEmpresaForm } from './registro-empresa-form';

type RolRegistro = 'TALENTO' | 'EMPRESA';

@Component({
  selector: 'sa-registro',
  standalone: true,
  imports: [MatButtonToggleModule, RouterLink, RegistroTalentoForm, RegistroEmpresaForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  readonly rol = signal<RolRegistro>('TALENTO');

  cambiarRol(valor: RolRegistro): void {
    this.rol.set(valor);
  }
}
