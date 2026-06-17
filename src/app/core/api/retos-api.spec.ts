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

  it('buscar envia GET a /retos con params', () => {
    api.buscar({ categoria: 'Tecnología', page: 0, size: 10 }).subscribe();
    const req = http.expectOne(r => r.url === 'http://api/retos/retos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('categoria')).toBe('Tecnología');
    expect(req.request.params.get('page')).toBe('0');
    req.flush({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 10 });
  });

  it('buscar sin filtros omite parametros vacios', () => {
    api.buscar({ categoria: '', texto: undefined as any }).subscribe();
    const req = http.expectOne('http://api/retos/retos');
    expect(req.request.params.has('categoria')).toBe(false);
    expect(req.request.params.has('texto')).toBe(false);
    req.flush({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 10 });
  });

  it('detalle envia GET a /retos/:id', () => {
    api.detalle('xyz').subscribe();
    const req = http.expectOne('http://api/retos/retos/xyz');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
