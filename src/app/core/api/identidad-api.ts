import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { CambiarPasswordRequest, LoginRequest, LoginResponse, RegistroRequest, Usuario } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class IdentidadApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).identidad;

  registrar(body: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.base}/auth/registro`, body);
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body);
  }

  cambiarPassword(body: CambiarPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/cambiar-password`, body);
  }
}
