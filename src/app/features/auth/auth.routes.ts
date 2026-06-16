import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro').then(m => m.Registro),
  },
];
