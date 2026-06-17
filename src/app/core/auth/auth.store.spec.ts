import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(AuthStore);
  });

  it('inicia sin usuario ni token', () => {
    expect(store.usuario()).toBeNull();
    expect(store.estaAutenticado()).toBe(false);
  });

  it('iniciarSesion guarda token y usuario', () => {
    store.iniciarSesion('jwt-xyz', { id: '1', correo: 'a@b.com', rol: 'TALENTO', creadoEn: '' });
    expect(store.usuario()?.correo).toBe('a@b.com');
    expect(store.estaAutenticado()).toBe(true);
  });

  it('cerrarSesion limpia el estado', () => {
    store.iniciarSesion('jwt-xyz', { id: '1', correo: 'a@b.com', rol: 'TALENTO', creadoEn: '' });
    store.cerrarSesion();
    expect(store.estaAutenticado()).toBe(false);
  });
});
