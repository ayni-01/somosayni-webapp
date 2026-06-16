import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IdentidadApi } from './identidad-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: 'http://api/identidad',
  perfiles: '', retos: '', postulaciones: '', habilidades: '', notificaciones: '', metricas: '',
};

describe('IdentidadApi', () => {
  let api: IdentidadApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(IdentidadApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('registrar envia POST a /auth/registro', () => {
    api.registrar({ correo: 'a@b.com', password: 'x', rol: 'TALENTO', nombreCompleto: 'A' }).subscribe();
    const req = http.expectOne('http://api/identidad/auth/registro');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.correo).toBe('a@b.com');
    req.flush({ id: '1', correo: 'a@b.com', rol: 'TALENTO', creadoEn: '' });
  });
});
