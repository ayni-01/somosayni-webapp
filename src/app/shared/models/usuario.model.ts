export type RolUsuario = 'TALENTO' | 'EMPRESA' | 'ADMIN';

export interface Usuario {
  id: string;
  email: string;
  rol: RolUsuario;
  creadoEn: string;
}

export interface RegistroRequest {
  email: string;
  password: string;
  rol: RolUsuario;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: string;
  email: string;
  rol: RolUsuario;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
}
