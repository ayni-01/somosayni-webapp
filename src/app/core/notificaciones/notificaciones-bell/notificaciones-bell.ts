import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, of, tap } from 'rxjs';
import { NotificacionesApi } from '../../../core/api/notificaciones-api';
import { Notificacion, TipoNotificacion } from '../../../shared/models/notificacion.model';

@Component({
  selector: 'sa-notificaciones-bell',
  standalone: true,
  imports: [DatePipe, MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notificaciones-bell.html',
  styleUrl: './notificaciones-bell.scss',
})
export class NotificacionesBell {
  private readonly api = inject(NotificacionesApi);

  readonly cargando = signal(false);
  readonly notificaciones = signal<Notificacion[]>([]);

  readonly noLeidas = computed(() => this.notificaciones().filter(n => !n.leida).length);

  constructor() {
    this.recargar();
  }

  abrirMenu(): void {
    this.recargar();
  }

  marcarLeida(n: Notificacion): void {
    if (n.leida) return;
    this.api.marcarLeida(n.id).pipe(
      tap(() => {
        this.notificaciones.update(lista =>
          lista.map(x => x.id === n.id ? { ...x, leida: true } : x),
        );
      }),
    ).subscribe();
  }

  iconoPara(tipo: TipoNotificacion): string {
    switch (tipo) {
      case 'NUEVA_POSTULACION': return 'inbox';
      case 'APROBADO':          return 'check_circle';
      case 'RECHAZADO':         return 'cancel';
      case 'RETO_CERRADO':      return 'lock';
    }
  }

  etiquetaTipo(tipo: TipoNotificacion): string {
    switch (tipo) {
      case 'NUEVA_POSTULACION': return 'Nueva postulación';
      case 'APROBADO':          return 'Aprobado';
      case 'RECHAZADO':         return 'Rechazado';
      case 'RETO_CERRADO':      return 'Reto cerrado';
    }
  }

  private recargar(): void {
    this.cargando.set(true);
    this.api.propias().pipe(
      catchError(() => of([] as Notificacion[])),
      tap(lista => {
        this.notificaciones.set(lista);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
