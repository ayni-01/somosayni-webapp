import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { CrearTalentoRequest, EditarTalentoRequest, PerfilTalento } from '../../shared/models/perfil-talento.model';
import { CrearEmpresaRequest, PerfilEmpresa } from '../../shared/models/perfil-empresa.model';

@Injectable({ providedIn: 'root' })
export class PerfilesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).perfiles;

  crearTalento(body: CrearTalentoRequest): Observable<PerfilTalento> {
    return this.http.post<PerfilTalento>(`${this.base}/perfiles/talento`, body);
  }

  editarTalento(id: string, body: EditarTalentoRequest): Observable<PerfilTalento> {
    return this.http.put<PerfilTalento>(`${this.base}/perfiles/talento/${id}`, body);
  }

  obtenerTalento(id: string): Observable<PerfilTalento> {
    return this.http.get<PerfilTalento>(`${this.base}/perfiles/talento/${id}`);
  }

  crearEmpresa(body: CrearEmpresaRequest): Observable<PerfilEmpresa> {
    return this.http.post<PerfilEmpresa>(`${this.base}/perfiles/empresa`, body);
  }

  obtenerEmpresa(id: string): Observable<PerfilEmpresa> {
    return this.http.get<PerfilEmpresa>(`${this.base}/perfiles/empresa/${id}`);
  }
}
