import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirm_password');

  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};