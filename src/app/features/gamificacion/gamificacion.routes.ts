import { Routes } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';

export const GAMIFICACION_ROUTES: Routes = [
  { path: '', redirectTo: 'portafolio', pathMatch: 'full' },
  {
    path: 'portafolio',
    canActivate: [rolGuard(['TALENTO'])],
    loadComponent: () => import('./portafolio/portafolio').then(m => m.Portafolio),
  },
];
