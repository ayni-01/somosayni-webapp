import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.estaAutenticado() ? true : router.createUrlTree(['/auth/login']);
};

export const soloAnonimoGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.estaAutenticado() ? router.createUrlTree(['/app/inicio']) : true;
};
