import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RetosApi } from '../../../core/api/retos-api';
import { FiltroRetos, NivelDificultad, Reto } from '../../../shared/models/reto.model';
import { Page } from '../../../shared/models/page.model';

const CATEGORIAS = ['Tecnología', 'Diseño', 'Marketing', 'Datos', 'Operaciones'];
const NIVELES: NivelDificultad[] = ['BASICO', 'INTERMEDIO', 'AVANZADO'];

@Component({
  selector: 'sa-explorar-retos',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
    MatButtonModule, MatIconModule, MatPaginatorModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explorar-retos.html',
  styleUrl: './explorar-retos.scss',
})
export class ExplorarRetos {
  private readonly retosApi = inject(RetosApi);

  readonly categorias = CATEGORIAS;
  readonly niveles = NIVELES;

  readonly texto = new FormControl('', { nonNullable: true });
  readonly categoria = new FormControl<string>('', { nonNullable: true });
  readonly nivel = new FormControl<NivelDificultad | ''>('', { nonNullable: true });

  readonly cargando = signal(true);
  readonly resultados = signal<Page<Reto> | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(9);

  constructor() {
    this.texto.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.pageIndex.set(0)),
      switchMap(() => this.cargar()),
      takeUntilDestroyed(),
    ).subscribe();

    this.categoria.valueChanges.pipe(
      tap(() => this.pageIndex.set(0)),
      switchMap(() => this.cargar()),
      takeUntilDestroyed(),
    ).subscribe();

    this.nivel.valueChanges.pipe(
      tap(() => this.pageIndex.set(0)),
      switchMap(() => this.cargar()),
      takeUntilDestroyed(),
    ).subscribe();

    this.cargar().subscribe();
  }

  limpiarFiltros(): void {
    this.texto.setValue('');
    this.categoria.setValue('');
    this.nivel.setValue('');
  }

  cambiarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.cargar().subscribe();
  }

  private cargar() {
    this.cargando.set(true);
    const filtros: FiltroRetos = {
      texto: this.texto.value || undefined,
      categoria: this.categoria.value || undefined,
      nivel: (this.nivel.value as NivelDificultad) || undefined,
      estado: 'ACTIVO',
      page: this.pageIndex(),
      size: this.pageSize(),
    };
    return this.retosApi.buscar(filtros).pipe(
      tap({
        next: pagina => {
          this.resultados.set(pagina);
          this.cargando.set(false);
        },
        error: () => {
          this.resultados.set({ content: [], totalElements: 0, totalPages: 0, page: 0, size: this.pageSize() });
          this.cargando.set(false);
        },
      }),
    );
  }
}
