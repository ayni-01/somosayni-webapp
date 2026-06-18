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
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RetosApi } from '../../../core/api/retos-api';
import { Categoria, FiltroRetos, NivelDificultad, Reto } from '../../../shared/models/reto.model';

const CATEGORIAS: Categoria[] = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'DATA', 'DEVOPS', 'UX_UI', 'QA', 'MOBILE'];
const NIVELES: NivelDificultad[] = ['JUNIOR', 'TRAINEE', 'SENIOR'];

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

  readonly categorias = CATEGORIAS;
  readonly niveles = NIVELES;

  readonly categoria = new FormControl<Categoria | ''>('', { nonNullable: true });
  readonly nivelDificultad = new FormControl<NivelDificultad | ''>('', { nonNullable: true });

  readonly cargando = signal(true);
  readonly resultados = signal<Reto[]>([]);

  constructor() {
    this.categoria.valueChanges.pipe(
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

  private cargar() {
    this.cargando.set(true);
    const filtros: FiltroRetos = {
      categoria: (this.categoria.value as Categoria) || undefined,
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
