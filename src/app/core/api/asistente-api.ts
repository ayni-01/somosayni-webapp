import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  ConsultaRetoResponse,
  FeedbackSolucionResponse,
  RecomendacionesResponse,
} from '../../shared/models/asistente.model';

@Injectable({ providedIn: 'root' })
export class AsistenteApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).asistente;

  consultarReto(retoId: string, pregunta: string): Observable<ConsultaRetoResponse> {
    return this.http.post<ConsultaRetoResponse>(
      `${this.base}/asistente/retos/${retoId}/consulta`,
      { pregunta },
    );
  }

  recomendaciones(): Observable<RecomendacionesResponse> {
    return this.http.get<RecomendacionesResponse>(`${this.base}/asistente/recomendaciones`);
  }

  feedback(postulacionId: string, enfoqueSolucion: string): Observable<FeedbackSolucionResponse> {
    return this.http.post<FeedbackSolucionResponse>(
      `${this.base}/asistente/postulaciones/${postulacionId}/feedback`,
      { enfoqueSolucion },
    );
  }
}
