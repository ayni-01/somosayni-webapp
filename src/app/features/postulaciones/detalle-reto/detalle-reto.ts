import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { AsistenteChat } from '../asistente-chat/asistente-chat';
import { Categoria, NivelDificultad, Reto, TipoRecompensa } from '../../../shared/models/reto.model';

@Component({
  selector: 'sa-detalle-reto',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    MatButtonModule, MatIconModule, MatDividerModule,
    MatCardModule, MatChipsModule, MatProgressSpinnerModule,
    AsistenteChat,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-reto.html',
  styleUrl: './detalle-reto.scss',
})
export class DetalleReto {
  readonly id = input.required<string>();

  private readonly retosApi = inject(RetosApi);
  private readonly authStore = inject(AuthStore);

  readonly cargando = signal(true);
  readonly reto = signal<Reto | null>(null);
  readonly error = signal(false);

  readonly esTalento = computed(() => this.authStore.usuario()?.rol === 'TALENTO');
  readonly puedePostular = computed(() => {
    const r = this.reto();
    return !!r && r.estado === 'ACTIVO' && this.esTalento();
  });

  constructor() {
    queueMicrotask(() => this.cargar());
  }

  etiquetaCategoria(c: Categoria): string {
    switch (c) {
      case 'FRONTEND': return 'Frontend';
      case 'BACKEND': return 'Backend';
      case 'FULLSTACK': return 'Fullstack';
      case 'DATA': return 'Data';
      case 'DEVOPS': return 'DevOps';
      case 'UX_UI': return 'UX / UI';
      case 'QA': return 'QA / Testing';
      case 'MOBILE': return 'Mobile';
    }
  }

  etiquetaNivel(n: NivelDificultad): string {
    switch (n) {
      case 'JUNIOR': return 'Junior';
      case 'TRAINEE': return 'Trainee';
      case 'SENIOR': return 'Senior';
    }
  }

  etiquetaTipoRecompensa(t: TipoRecompensa): string {
    switch (t) {
      case 'MONETARIA': return 'Monetaria';
      case 'CONTRATACION': return 'Contratación';
      case 'DIPLOMA': return 'Diploma';
    }
  }

  private cargar(): void {
    const id = this.id();
    if (!id) return;
    this.retosApi.detalle(id).pipe(
      catchError(() => {
        this.error.set(true);
        return of(null);
      }),
      tap(reto => {
        this.reto.set(reto);
        this.cargando.set(false);
      }),
    ).subscribe();
  }
}
