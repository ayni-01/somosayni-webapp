import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { HabilidadValidada, Insignia, OtorgarInsigniaRequest, Portafolio, RegistrarHabilidadRequest } from '../../shared/models/habilidad.model';

@Injectable({ providedIn: 'root' })
export class HabilidadesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).habilidades;

  registrarHabilidad(body: RegistrarHabilidadRequest): Observable<HabilidadValidada> {
    return this.http.post<HabilidadValidada>(`${this.base}/habilidades`, body);
  }

  portafolio(talentoId: string): Observable<Portafolio> {
    return this.http.get<Portafolio>(`${this.base}/habilidades/portafolio/${talentoId}`);
  }

  otorgarInsignia(body: OtorgarInsigniaRequest): Observable<Insignia> {
    return this.http.post<Insignia>(`${this.base}/insignias`, body);
  }

  insigniasTalento(id: string): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(`${this.base}/insignias/talento/${id}`);
  }
}
