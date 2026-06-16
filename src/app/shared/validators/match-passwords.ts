import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswords(controlName: string, confirmName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(controlName)?.value;
    const confirm = group.get(confirmName)?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  };
}
