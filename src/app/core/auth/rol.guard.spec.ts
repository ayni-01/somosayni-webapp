import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { rolGuard } from './rol.guard';
import { AuthStore } from './auth.store';

describe('rolGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { createUrlTree: (cmds: any[]) => ({ toString: () => cmds.join('/') }) } },
      ],
    });
  });

  it('permite acceso cuando el rol esta permitido', () => {
    const store = TestBed.inject(AuthStore);
    store.iniciarSesion('t', { id: '1', email: 'a@b.com', rol: 'TALENTO', creadoEn: '' });
    const result = TestBed.runInInjectionContext(() => rolGuard(['TALENTO'])({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirige cuando el rol no esta permitido', () => {
    const store = TestBed.inject(AuthStore);
    store.iniciarSesion('t', { id: '1', email: 'a@b.com', rol: 'EMPRESA', creadoEn: '' });
    const result = TestBed.runInInjectionContext(() => rolGuard(['TALENTO'])({} as any, {} as any));
    expect(String(result)).toContain('app');
  });
});
