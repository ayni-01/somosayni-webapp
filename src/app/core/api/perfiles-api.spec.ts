import { beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PerfilesApi } from './perfiles-api';
import { provideApiEndpoints } from '../config/api-endpoints';

const ENDPOINTS = {
  identidad: '',
  perfiles: 'http://api/perfiles',
  retos: '',
  postulaciones: '',
  habilidades: '',
  notificaciones: '',
  metricas: '',
};

describe('PerfilesApi', () => {
  let api: PerfilesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiEndpoints(ENDPOINTS)],
    });
    api = TestBed.inject(PerfilesApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('crearTalento envia POST a /perfiles/talento', () => {
    api.crearTalento({} as any).subscribe();
    const req = http.expectOne('http://api/perfiles/perfiles/talento');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('crearEmpresa envia POST a /perfiles/empresa', () => {
    api.crearEmpresa({} as any).subscribe();
    const req = http.expectOne('http://api/perfiles/perfiles/empresa');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
