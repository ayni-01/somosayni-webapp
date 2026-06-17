import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { Evaluacion, EvaluarRequest, Postulacion, PostularRequest } from '../../shared/models/postulacion.model';

@Injectable({ providedIn: 'root' })
export class PostulacionesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).postulaciones;

  postular(body: PostularRequest): Observable<Postulacion> {
    return this.http.post<Postulacion>(`${this.base}/postulaciones`, body);
  }

  historialTalento(talentoId: string): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.base}/postulaciones/talento/${talentoId}`);
  }

  solucionesReto(retoId: string): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.base}/postulaciones/reto/${retoId}`);
  }

  evaluar(id: string, body: EvaluarRequest): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.base}/postulaciones/${id}/evaluar`, body);
  }
}
