import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { PublicarRetoRequest, Reto } from '../../shared/models/reto.model';

@Injectable({ providedIn: 'root' })
export class RetosApi {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_ENDPOINTS).retos;

  publicar(body: PublicarRetoRequest): Observable<Reto> {
    return this.http.post<Reto>(`${this.base}/retos`, body);
  }
}
