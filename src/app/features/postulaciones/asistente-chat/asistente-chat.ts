import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, tap } from 'rxjs';
import { AsistenteApi } from '../../../core/api/asistente-api';

interface Turno {
  autor: 'tu' | 'ia';
  texto: string;
}

@Component({
  selector: 'sa-asistente-chat',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './asistente-chat.html',
  styleUrl: './asistente-chat.scss',
})
export class AsistenteChat {
  readonly retoId = input.required<string>();

  private readonly asistenteApi = inject(AsistenteApi);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly campo = viewChild<ElementRef<HTMLInputElement>>('campo');

  readonly abierto = signal(false);
  readonly mensajes = signal<Turno[]>([]);
  readonly consultando = signal(false);
  readonly pregunta = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  readonly sugerencias = [
    '¿Qué tecnologías necesito?',
    '¿Qué nivel de dificultad tiene?',
    '¿Qué debo entregar?',
  ];

  constructor() {
    effect(() => {
      this.mensajes();
      this.consultando();
      const el = this.scroller()?.nativeElement;
      if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    });
  }

  abrir(): void {
    this.abierto.set(true);
    requestAnimationFrame(() => this.campo()?.nativeElement.focus());
  }

  cerrar(): void {
    this.abierto.set(false);
  }

  usarSugerencia(texto: string): void {
    this.pregunta.setValue(texto);
    this.enviar();
  }

  enviar(): void {
    const texto = this.pregunta.value.trim();
    if (!texto || this.consultando()) return;
    this.mensajes.update(m => [...m, { autor: 'tu', texto }]);
    this.pregunta.reset();
    this.consultando.set(true);
    this.asistenteApi.consultarReto(this.retoId(), texto).pipe(
      catchError(() => {
        this.consultando.set(false);
        this.mensajes.update(m => [...m, { autor: 'ia', texto: 'No pude responder ahora. Intenta de nuevo en un momento.' }]);
        return of(null);
      }),
      tap(res => {
        if (!res) return;
        this.consultando.set(false);
        this.mensajes.update(m => [...m, { autor: 'ia', texto: res.respuesta }]);
      }),
    ).subscribe();
  }
}
