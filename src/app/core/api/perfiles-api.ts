import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { PerfilTalento } from '../../shared/models/perfil-talento.model';
import { PerfilEmpresa } from '../../shared/models/perfil-empresa.model';

@Injectable({ providedIn: 'root' })
export class PerfilesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).perfiles;

  crearTalento(body: Partial<PerfilTalento>): Observable<PerfilTalento> {
    return this.http.post<PerfilTalento>(`${this.base}/perfiles/talento`, body);
  }

  crearEmpresa(body: Partial<PerfilEmpresa>): Observable<PerfilEmpresa> {
    return this.http.post<PerfilEmpresa>(`${this.base}/perfiles/empresa`, body);
  }

  obtenerTalento(id: string): Observable<PerfilTalento> {
    return this.http.get<PerfilTalento>(`${this.base}/perfiles/talento/${id}`);
  }

  editarTalento(id: string, body: Partial<PerfilTalento>): Observable<PerfilTalento> {
    return this.http.put<PerfilTalento>(`${this.base}/perfiles/talento/${id}`, body);
  }
}
