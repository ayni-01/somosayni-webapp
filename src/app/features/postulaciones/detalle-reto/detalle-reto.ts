import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsistenteApi } from '../../../core/api/asistente-api';
import { catchError, of, tap } from 'rxjs';
import { RetosApi } from '../../../core/api/retos-api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Categoria, NivelDificultad, Reto, TipoRecompensa } from '../../../shared/models/reto.model';

@Component({
  selector: 'sa-detalle-reto',
  standalone: true,
  imports: [
    RouterLink, DatePipe,
    MatButtonModule, MatIconModule, MatDividerModule,
    MatCardModule, MatChipsModule, MatProgressSpinnerModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-reto.html',
  styleUrl: './detalle-reto.scss',
})
export class DetalleReto {
  readonly id = input.required<string>();

  private readonly retosApi = inject(RetosApi);
  private readonly authStore = inject(AuthStore);
  private readonly asistenteApi = inject(AsistenteApi);
  private readonly snack = inject(MatSnackBar);

  readonly pregunta = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly hilo = signal<{ pregunta: string; respuesta: string }[]>([]);
  readonly consultando = signal(false);

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

  preguntar(): void {
    const reto = this.reto();
    const texto = this.pregunta.value.trim();
    if (!reto || !texto || this.consultando()) return;
    this.consultando.set(true);
    this.asistenteApi.consultarReto(reto.id, texto).pipe(
      catchError(() => {
        this.consultando.set(false);
        this.snack.open('No pudimos obtener respuesta. Intenta de nuevo.', 'Cerrar', { duration: 4000 });
        return of(null);
      }),
      tap((res) => {
        if (!res) return;
        this.hilo.update((h) => [...h, { pregunta: texto, respuesta: res.respuesta }]);
        this.pregunta.reset();
        this.consultando.set(false);
      }),
    ).subscribe();
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
