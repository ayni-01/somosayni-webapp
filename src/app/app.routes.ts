import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AuthLayout } from './core/layout/auth-layout/auth-layout';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayout,
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
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found/not-found').then((m) => m.NotFound),
  },
];
