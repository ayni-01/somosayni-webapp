import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { RegistroRequest, Usuario } from '../../shared/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class IdentidadApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).identidad;

  registrar(body: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.base}/auth/registro`, body);
  }
}
