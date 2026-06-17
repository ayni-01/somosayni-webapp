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
    api.publicar({
      titulo: 'X',
      descripcion: 'd',
      empresaId: 'emp-1',
      modalidad: 'REMOTO',
      duracionDias: 30,
    }).subscribe();
    const req = http.expectOne('http://api/retos/retos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.titulo).toBe('X');
    expect(req.request.body.empresaId).toBe('emp-1');
    expect(req.request.body.modalidad).toBe('REMOTO');
    expect(req.request.body.duracionDias).toBe(30);
    req.flush({});
  });

  it('buscar envia GET a /retos con params', () => {
    api.buscar({ modalidad: 'REMOTO', estado: 'ACTIVO' }).subscribe();
    const req = http.expectOne(r => r.url === 'http://api/retos/retos');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('modalidad')).toBe('REMOTO');
    expect(req.request.params.get('estado')).toBe('ACTIVO');
    req.flush([]);
  });

  it('buscar sin filtros omite parametros vacios', () => {
    api.buscar({ texto: '', modalidad: undefined }).subscribe();
    const req = http.expectOne('http://api/retos/retos');
    expect(req.request.params.has('texto')).toBe(false);
    expect(req.request.params.has('modalidad')).toBe(false);
    req.flush([]);
  });

  it('detalle envia GET a /retos/:id', () => {
    api.detalle('xyz').subscribe();
    const req = http.expectOne('http://api/retos/retos/xyz');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('cerrar envia POST a /retos/:id/cerrar', () => {
    api.cerrar('1').subscribe();
    const req = http.expectOne('http://api/retos/retos/1/cerrar');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('duplicar envia POST a /retos/:id/duplicar', () => {
    api.duplicar('1').subscribe();
    const req = http.expectOne('http://api/retos/retos/1/duplicar');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
