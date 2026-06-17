import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { EmbudoReto, MetricasEmpresa } from '../../shared/models/metricas.model';

@Injectable({ providedIn: 'root' })
export class MetricasApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).metricas;

  empresa(empresaId: string): Observable<MetricasEmpresa> {
    return this.http.get<MetricasEmpresa>(`${this.base}/metricas/empresa/${empresaId}`);
  }

  embudo(empresaId: string): Observable<EmbudoReto[]> {
    return this.http.get<EmbudoReto[]>(`${this.base}/metricas/embudo/${empresaId}`);
  }
}
