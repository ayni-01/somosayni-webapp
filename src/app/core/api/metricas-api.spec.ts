import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MetricasApi } from './metricas-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: '', perfiles: '', retos: '', postulaciones: '',
  habilidades: '', notificaciones: '', metricas: 'http://api/met',
};

describe('MetricasApi', () => {
  let api: MetricasApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(MetricasApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('empresa envia GET a /metricas/empresa/:id', () => {
    api.empresa('e1').subscribe();
    const req = http.expectOne('http://api/met/metricas/empresa/e1');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('embudo envia GET a /metricas/embudo/:id', () => {
    api.embudo('e1').subscribe();
    const req = http.expectOne('http://api/met/metricas/embudo/e1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
