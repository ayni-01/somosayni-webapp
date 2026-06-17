import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { FiltroRetos, PublicarRetoRequest, Reto } from '../../shared/models/reto.model';

@Injectable({ providedIn: 'root' })
export class RetosApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).retos;

  publicar(body: PublicarRetoRequest): Observable<Reto> {
    return this.http.post<Reto>(`${this.base}/retos`, body);
  }

  buscar(filtros: FiltroRetos = {}): Observable<Reto[]> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filtros)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return this.http.get<Reto[]>(`${this.base}/retos`, { params });
  }

  detalle(id: string): Observable<Reto> {
    return this.http.get<Reto>(`${this.base}/retos/${id}`);
  }

  cerrar(id: string): Observable<Reto> {
    return this.http.post<Reto>(`${this.base}/retos/${id}/cerrar`, {});
  }

  duplicar(id: string): Observable<Reto> {
    return this.http.post<Reto>(`${this.base}/retos/${id}/duplicar`, {});
  }
}
