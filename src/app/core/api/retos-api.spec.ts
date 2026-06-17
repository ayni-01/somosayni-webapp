import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RetosApi } from './retos-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: '', perfiles: '', retos: 'http://api/retos',
  postulaciones: '', habilidades: '', notificaciones: '', metricas: '',
};

describe('RetosApi', () => {
  let api: RetosApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(RetosApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('publicar envia POST a /retos', () => {
    api.publicar({ titulo: 'X', descripcion: 'd', categoria: 'Tecnología', nivel: 'INTERMEDIO', cuposTotal: 5 }).subscribe();
    const req = http.expectOne('http://api/retos/retos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.titulo).toBe('X');
    req.flush({});
  });
});
