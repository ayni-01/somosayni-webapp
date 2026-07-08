import { InjectionToken, Provider } from '@angular/core';

export interface ApiEndpoints {
  identidad: string;
  perfiles: string;
  retos: string;
  postulaciones: string;
  habilidades: string;
  notificaciones: string;
  metricas: string;
  asistente: string;
}

export const API_ENDPOINTS = new InjectionToken<ApiEndpoints>('API_ENDPOINTS');

export function provideApiEndpoints(endpoints: ApiEndpoints): Provider {
  return { provide: API_ENDPOINTS, useValue: endpoints };
}
