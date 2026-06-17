import { Routes } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';

export const POSTULACIONES_ROUTES: Routes = [
  { path: '', redirectTo: 'explorar', pathMatch: 'full' },
  {
    path: 'explorar',
    loadComponent: () => import('./explorar-retos/explorar-retos').then(m => m.ExplorarRetos),
  },
  {
    path: 'publicar',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./publicar-reto/publicar-reto').then(m => m.PublicarReto),
  },
];
