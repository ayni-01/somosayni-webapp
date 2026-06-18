import { Injectable, computed, signal } from '@angular/core';
import { RolUsuario, Usuario } from '../../shared/models/usuario.model';

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
    const usuarioFinal = usuario ?? derivarUsuarioDeJwt(token);
    localStorage.setItem(KEY_TOKEN, token);
    if (usuarioFinal) {
      localStorage.setItem(KEY_USER, JSON.stringify(usuarioFinal));
      this._usuario.set(usuarioFinal);
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
    if (raw && raw !== 'undefined' && raw !== 'null') {
      try {
        return JSON.parse(raw) as Usuario;
      } catch {
        localStorage.removeItem(KEY_USER);
      }
    }
    const token = localStorage.getItem(KEY_TOKEN);
    if (!token || token === 'undefined' || token === 'null') return null;
    return derivarUsuarioDeJwt(token);
  }
}

function derivarUsuarioDeJwt(token: string): Usuario | null {
  const payload = decodificarJwt(token);
  if (!payload) return null;
  const rol = normalizarRol(payload['rol'] ?? payload['role'] ?? payload['roles']);
  return {
    id: String(payload['sub'] ?? payload['userId'] ?? payload['id'] ?? ''),
    email: String(payload['email'] ?? payload['sub'] ?? ''),
    rol,
  };
}

function decodificarJwt(token: string): Record<string, unknown> | null {
  try {
    const parte = token.split('.')[1];
    if (!parte) return null;
    const normalizada = parte.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalizada.padEnd(normalizada.length + ((4 - (normalizada.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizarRol(valor: unknown): RolUsuario {
  if (Array.isArray(valor) && valor.length > 0) return normalizarRol(valor[0]);
  const texto = String(valor ?? '').toUpperCase().replace(/^ROLE_/, '');
  if (texto === 'EMPRESA' || texto === 'TALENTO' || texto === 'ADMIN') return texto;
  return 'TALENTO';
}
