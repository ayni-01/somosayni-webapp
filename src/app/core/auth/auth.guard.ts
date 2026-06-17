import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const ok = auth.estaAutenticado();
  console.log('[authGuard]', { url: state.url, autenticado: ok, token: auth.token(), usuario: auth.usuario() });
  return ok ? true : router.createUrlTree(['/auth/login']);
};

export const soloAnonimoGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const ok = auth.estaAutenticado();
  console.log('[soloAnonimoGuard]', { url: state.url, autenticado: ok });
  return ok ? router.createUrlTree(['/app/inicio']) : true;
};
