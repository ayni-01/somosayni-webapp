import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { CrearNotificacionRequest, Notificacion } from '../../shared/models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).notificaciones;

  propias(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.base}/notificaciones`);
  }

  propiasNoLeidas(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.base}/notificaciones`, {
      params: new HttpParams().set('leida', 'false'),
    });
  }

  marcarLeida(id: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/notificaciones/${id}/leida`, {});
  }

  crear(body: CrearNotificacionRequest): Observable<Notificacion> {
    return this.http.post<Notificacion>(`${this.base}/notificaciones`, body);
  }
}
