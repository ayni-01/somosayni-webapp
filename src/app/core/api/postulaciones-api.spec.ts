import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PostulacionesApi } from './postulaciones-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: '', perfiles: '', retos: '', postulaciones: 'http://api/post',
  habilidades: '', notificaciones: '', metricas: '',
};

describe('PostulacionesApi', () => {
  let api: PostulacionesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(PostulacionesApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('postular envia POST a /postulaciones con retoId y urlSolucion', () => {
    api.postular({ retoId: 'r1', urlSolucion: 'https://github.com/x' }).subscribe();
    const req = http.expectOne('http://api/post/postulaciones');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ retoId: 'r1', urlSolucion: 'https://github.com/x' });
    req.flush({});
  });

  it('historialTalento envia GET a /postulaciones/talento/:id', () => {
    api.historialTalento('t1').subscribe();
    http.expectOne('http://api/post/postulaciones/talento/t1').flush([]);
  });

  it('solucionesReto envia GET a /postulaciones/reto/:id', () => {
    api.solucionesReto('r1').subscribe();
    http.expectOne('http://api/post/postulaciones/reto/r1').flush([]);
  });

  it('evaluar envia POST a /postulaciones/:id/evaluar con puntuacion, feedback y resultado', () => {
    api.evaluar('p1', { puntuacion: 92, feedback: 'ok', resultado: 'APROBADO' }).subscribe();
    const req = http.expectOne('http://api/post/postulaciones/p1/evaluar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ puntuacion: 92, feedback: 'ok', resultado: 'APROBADO' });
    req.flush({});
  });
});
