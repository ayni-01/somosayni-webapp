import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { RolUsuario } from '../../shared/models/usuario.model';

export function rolGuard(rolesPermitidos: RolUsuario[]): CanActivateFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);
    const rol = auth.usuario()?.rol;
    if (rol && rolesPermitidos.includes(rol)) return true;
    return router.createUrlTree(['/app/inicio']);
  };
}
