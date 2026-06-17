import { describe, expect, it } from 'vitest';
import { FormControl, FormGroup } from '@angular/forms';
import { matchPasswords } from './match-passwords';

describe('matchPasswords', () => {
  it('retorna null cuando coinciden', () => {
    const form = new FormGroup({
      password: new FormControl('abc'),
      confirmar: new FormControl('abc'),
    }, { validators: matchPasswords('password', 'confirmar') });
    expect(form.errors).toBeNull();
  });

  it('retorna error cuando no coinciden', () => {
    const form = new FormGroup({
      password: new FormControl('abc'),
      confirmar: new FormControl('xyz'),
    }, { validators: matchPasswords('password', 'confirmar') });
    expect(form.errors).toEqual({ passwordsMismatch: true });
  });
});
