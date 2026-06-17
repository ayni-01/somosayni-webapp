import { Routes } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';

export const POSTULACIONES_ROUTES: Routes = [
  { path: '', redirectTo: 'explorar', pathMatch: 'full' },
  {
    path: 'explorar',
    loadComponent: () => import('./explorar-retos/explorar-retos').then(m => m.ExplorarRetos),
  },
  {
    path: 'reto/:id',
    loadComponent: () => import('./detalle-reto/detalle-reto').then(m => m.DetalleReto),
  },
  {
    path: 'reto/:id/postular',
    canActivate: [rolGuard(['TALENTO'])],
    loadComponent: () => import('./postular/postular').then(m => m.Postular),
  },
  {
    path: 'reto/:id/recibidos',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./recibidos-reto/recibidos-reto').then(m => m.RecibidosReto),
  },
  {
    path: 'publicar',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./publicar-reto/publicar-reto').then(m => m.PublicarReto),
  },
  {
    path: 'mis-retos',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./mis-retos/mis-retos').then(m => m.MisRetos),
  },
  {
    path: 'postulacion/:id/evaluar',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./evaluar/evaluar').then(m => m.Evaluar),
  },
  {
    path: 'mis-postulaciones',
    canActivate: [rolGuard(['TALENTO'])],
    loadComponent: () => import('./mis-postulaciones/mis-postulaciones').then(m => m.MisPostulaciones),
  },
];
