import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../../shared/models/usuario.model';

const KEY_TOKEN = 'sa.auth.token';
const KEY_USER = 'sa.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _usuario = signal<Usuario | null>(this.cargarUsuario());
  private readonly _token = signal<string | null>(this.cargarToken());

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly estaAutenticado = computed(() => this._token() !== null);

  iniciarSesion(token: string, usuario: Usuario | null | undefined): void {
    localStorage.setItem(KEY_TOKEN, token);
    if (usuario) {
      localStorage.setItem(KEY_USER, JSON.stringify(usuario));
      this._usuario.set(usuario);
    } else {
      localStorage.removeItem(KEY_USER);
      this._usuario.set(null);
    }
    this._token.set(token);
  }

  cerrarSesion(): void {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    this._token.set(null);
    this._usuario.set(null);
  }

  private cargarToken(): string | null {
    const raw = localStorage.getItem(KEY_TOKEN);
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return raw;
  }

  private cargarUsuario(): Usuario | null {
    const raw = localStorage.getItem(KEY_USER);
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      localStorage.removeItem(KEY_USER);
      return null;
    }
  }
}
