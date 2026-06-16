import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../../shared/models/usuario.model';

const KEY_TOKEN = 'sa.auth.token';
const KEY_USER = 'sa.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _usuario = signal<Usuario | null>(this.cargarUsuario());
  private readonly _token = signal<string | null>(localStorage.getItem(KEY_TOKEN));

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly estaAutenticado = computed(() => this._token() !== null);

  iniciarSesion(token: string, usuario: Usuario): void {
    localStorage.setItem(KEY_TOKEN, token);
    localStorage.setItem(KEY_USER, JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);
  }

  cerrarSesion(): void {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    this._token.set(null);
    this._usuario.set(null);
  }

  private cargarUsuario(): Usuario | null {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) as Usuario : null;
  }
}
