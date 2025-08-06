import {FormControl} from '@angular/forms';

export interface UpdateUserForm {
  username: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthdate: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  colorIdentity: FormControl<string>;
  pronouns: FormControl<string>;
}

export interface UpdateUserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  password?: string;
  confirmPassword?: string;
  colorIdentity?: string;
  pronouns?: string;
}
