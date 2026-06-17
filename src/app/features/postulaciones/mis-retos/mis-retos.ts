import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, switchMap, tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Reto } from '../../../shared/models/reto.model';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'sa-mis-retos',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mis-retos.html',
  styleUrl: './mis-retos.scss',
})
export class MisRetos {
  private readonly retosApi = inject(RetosApi);
  private readonly authStore = inject(AuthStore);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly cargando = signal(true);
  readonly retos = signal<Reto[]>([]);

  constructor() {
    this.cargar();
  }

  cerrar(reto: Reto): void {
    const data: ConfirmDialogData = {
      titulo: 'Cerrar reto',
      mensaje: `¿Seguro que quieres cerrar el reto "${reto.titulo}"? No recibirás más postulaciones.`,
      textoConfirmar: 'Cerrar reto',
    };
    this.dialog.open(ConfirmDialog, { data })
      .afterClosed()
      .pipe(
        switchMap(confirmado => confirmado ? this.retosApi.cerrar(reto.id) : of(null)),
        tap(resultado => {
          if (resultado) {
            this.snack.open('Reto cerrado', 'Cerrar', { duration: 3000 });
            this.cargar();
          }
        }),
      ).subscribe();
  }

  duplicar(reto: Reto): void {
    this.retosApi.duplicar(reto.id).pipe(
      tap({
        next: () => {
          this.snack.open('Reto duplicado como borrador', 'Cerrar', { duration: 3000 });
          this.cargar();
        },
      }),
    ).subscribe();
  }

  private cargar(): void {
    const usuario = this.authStore.usuario();
    if (!usuario) return;
    this.cargando.set(true);
    this.retosApi.buscar({ empresaId: usuario.id }).pipe(
      catchError(() => of([] as Reto[])),
      tap(lista => {
        this.retos.set(lista);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
