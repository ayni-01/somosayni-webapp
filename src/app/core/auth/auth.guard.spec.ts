import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth.store';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { createUrlTree: (cmds: any[]) => ({ toString: () => cmds.join('/') }) } },
      ],
    });
  });

  it('permite navegacion cuando hay sesion', () => {
    const store = TestBed.inject(AuthStore);
    store.iniciarSesion('t', { id: '1', correo: 'a@b.com', rol: 'TALENTO', creadoEn: '' });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirige a /auth/login cuando no hay sesion', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(String(result)).toContain('auth');
  });
});
