import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HabilidadesApi } from './habilidades-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: '', perfiles: '', retos: '', postulaciones: '',
  habilidades: 'http://api/hab', notificaciones: '', metricas: '',
};

describe('HabilidadesApi', () => {
  let api: HabilidadesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(HabilidadesApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('registrarHabilidad envia POST a /habilidades', () => {
    api.registrarHabilidad({ nombre: 'Spring Boot', nivel: 'AVANZADO' }).subscribe();
    const req = http.expectOne('http://api/hab/habilidades');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'Spring Boot', nivel: 'AVANZADO' });
    req.flush({});
  });

  it('portafolio envia GET a /habilidades/portafolio/:id', () => {
    api.portafolio('t1').subscribe();
    const req = http.expectOne('http://api/hab/habilidades/portafolio/t1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('otorgarInsignia envia POST a /insignias', () => {
    api.otorgarInsignia({ talentoId: 't', retoId: 'r', titulo: 'X', tipo: 'VERIFICADO' }).subscribe();
    const req = http.expectOne('http://api/hab/insignias');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('insigniasTalento envia GET a /insignias/talento/:id', () => {
    api.insigniasTalento('t').subscribe();
    http.expectOne('http://api/hab/insignias/talento/t').flush([]);
  });
});
