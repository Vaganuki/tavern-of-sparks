import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.=-])[A-Za-z\d@$!%*?&.=-]{8,}$/;

    const isValid = passwordRegex.test(value);
    if (!isValid) return {
      passwordStrength: {
        message: `Password must contain at least 8 characters, 1 Uppercase letter, 1 lowercase letter, 1 special character and 1 number.`,
      },
    };

    return null;
  }
}
