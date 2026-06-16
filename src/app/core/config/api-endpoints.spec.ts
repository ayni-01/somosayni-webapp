import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { API_ENDPOINTS, provideApiEndpoints } from './api-endpoints';

describe('API_ENDPOINTS', () => {
  it('provee URLs por cada microservicio', () => {
    TestBed.configureTestingModule({
      providers: [provideApiEndpoints({
        identidad: 'http://x',
        perfiles: 'http://x',
        retos: 'http://x',
        postulaciones: 'http://x',
        habilidades: 'http://x',
        notificaciones: 'http://x',
        metricas: 'http://x',
      })],
    });
    const endpoints = TestBed.inject(API_ENDPOINTS);
    expect(endpoints.identidad).toBe('http://x');
    expect(endpoints.metricas).toBe('http://x');
  });
});
