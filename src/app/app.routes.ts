import { Routes } from '@angular/router';
import { authGuard, soloAnonimoGuard } from './core/auth/auth.guard';
import { RootRedirector } from './core/auth/root-redirector';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RootRedirector,
  },
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [soloAnonimoGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: 'app',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'identidad',
        loadChildren: () =>
          import('./features/identidad/identidad.routes').then((m) => m.IDENTIDAD_ROUTES),
      },
      {
        path: 'gamificacion',
        loadChildren: () =>
          import('./features/gamificacion/gamificacion.routes').then(
            (m) => m.GAMIFICACION_ROUTES,
          ),
      },
      {
        path: 'postulaciones',
        loadChildren: () =>
          import('./features/postulaciones/postulaciones.routes').then(
            (m) => m.POSTULACIONES_ROUTES,
          ),
      },
      {
        path: 'analitica',
        loadChildren: () =>
          import('./features/analitica/analitica.routes').then((m) => m.ANALITICA_ROUTES),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found/not-found').then((m) => m.NotFound),
  },
];
