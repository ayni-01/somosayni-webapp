import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RetosApi } from '../../../core/api/retos-api';
import { FiltroRetos, NivelDificultad, Reto } from '../../../shared/models/reto.model';

const NIVELES: NivelDificultad[] = ['BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO'];

@Component({
  selector: 'sa-explorar-retos',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explorar-retos.html',
  styleUrl: './explorar-retos.scss',
})
export class ExplorarRetos {
  private readonly retosApi = inject(RetosApi);

  readonly niveles = NIVELES;

  readonly categoria = new FormControl('', { nonNullable: true });
  readonly nivelDificultad = new FormControl<NivelDificultad | ''>('', { nonNullable: true });

  readonly cargando = signal(true);
  readonly resultados = signal<Reto[]>([]);

  constructor() {
    this.categoria.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => this.cargar()),
      takeUntilDestroyed(),
    ).subscribe();

    this.nivelDificultad.valueChanges.pipe(
      switchMap(() => this.cargar()),
      takeUntilDestroyed(),
    ).subscribe();

    this.cargar().subscribe();
  }

  limpiarFiltros(): void {
    this.categoria.setValue('');
    this.nivelDificultad.setValue('');
  }

  etiquetaNivel(nivel: NivelDificultad): string {
    switch (nivel) {
      case 'BASICO': return 'Básico';
      case 'INTERMEDIO': return 'Intermedio';
      case 'AVANZADO': return 'Avanzado';
      case 'EXPERTO': return 'Experto';
    }
  }

  private cargar() {
    this.cargando.set(true);
    const filtros: FiltroRetos = {
      categoria: this.categoria.value || undefined,
      nivelDificultad: (this.nivelDificultad.value as NivelDificultad) || undefined,
      estado: 'ACTIVO',
    };
    return this.retosApi.buscar(filtros).pipe(
      tap({
        next: lista => {
          this.resultados.set(lista);
          this.cargando.set(false);
        },
        error: () => {
          this.resultados.set([]);
          this.cargando.set(false);
        },
      }),
    );
  }
}
