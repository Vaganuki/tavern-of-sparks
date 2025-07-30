import {FormControl} from '@angular/forms';

export interface RegisterForm {
  username: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthdate: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

export interface RegisterFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  password: string;
  confirmPassword: string;
}
