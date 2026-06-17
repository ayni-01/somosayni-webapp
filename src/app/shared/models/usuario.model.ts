export type RolUsuario = 'TALENTO' | 'EMPRESA' | 'ADMIN';

export interface Usuario {
  id: string;
  correo: string;
  rol: RolUsuario;
  creadoEn: string;
}

export interface RegistroRequest {
  correo: string;
  password: string;
  rol: RolUsuario;
  nombreCompleto: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
  recordarme?: boolean;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CambiarPasswordRequest {
  passwordActual: string;
  passwordNuevo: string;
}
