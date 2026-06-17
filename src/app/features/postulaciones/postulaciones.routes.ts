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
    path: 'publicar',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./publicar-reto/publicar-reto').then(m => m.PublicarReto),
  },
  {
    path: 'mis-retos',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./mis-retos/mis-retos').then(m => m.MisRetos),
  },
];
