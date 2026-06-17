import { Routes } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';

export const POSTULACIONES_ROUTES: Routes = [
  { path: '', redirectTo: 'publicar', pathMatch: 'full' },
  {
    path: 'publicar',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./publicar-reto/publicar-reto').then(m => m.PublicarReto),
  },
];
