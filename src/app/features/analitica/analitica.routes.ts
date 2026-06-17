import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { rolGuard } from '../../core/auth/rol.guard';
import { AuthStore } from '../../core/auth/auth.store';

const redirigirPorRol: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const rol = auth.usuario()?.rol;
  if (rol === 'EMPRESA') return router.createUrlTree(['/app/analitica/empresa']);
  if (rol === 'TALENTO') return router.createUrlTree(['/app/analitica/talento']);
  return router.createUrlTree(['/app/inicio']);
};

export const ANALITICA_ROUTES: Routes = [
  {
    path: '',
    canActivate: [redirigirPorRol],
    children: [],
  },
  {
    path: 'empresa',
    canActivate: [rolGuard(['EMPRESA'])],
    loadComponent: () => import('./panel-empresa/panel-empresa').then(m => m.PanelEmpresa),
  },
  {
    path: 'talento',
    canActivate: [rolGuard(['TALENTO'])],
    loadComponent: () => import('./resumen-talento/resumen-talento').then(m => m.ResumenTalento),
  },
];
