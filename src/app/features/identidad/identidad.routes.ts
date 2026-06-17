import { Routes } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';

export const IDENTIDAD_ROUTES: Routes = [
  { path: '', redirectTo: 'perfil', pathMatch: 'full' },
  {
    path: 'perfil',
    canActivate: [rolGuard(['TALENTO'])],
    loadComponent: () => import('./perfil-talento/perfil-talento').then(m => m.PerfilTalento),
  },
  {
    path: 'empresa',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./perfil-empresa/perfil-empresa').then(m => m.PerfilEmpresa),
  },
];
