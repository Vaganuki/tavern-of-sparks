import {Component, inject} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {RegisterForm, RegisterFormData} from '../../../interfaces/forms/register-form.interface';
import {passwordStrengthValidator} from '../../../services/validators/password-strength.validator';
import {passwordMatchValidator} from '../../../services/validators/password-match.validator';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  private _fb = inject(NonNullableFormBuilder);
  private _http = inject(HttpClient);
  private _router = inject(Router);

  constructor() {
  }

  registerForm: FormGroup<RegisterForm> = this._fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    password: ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['', Validators.required],
  }, {
    validators: [passwordMatchValidator()],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const registerData: RegisterFormData = this.registerForm.getRawValue();
    this._http.post(`${environment.apiUrl}/user/sign_up`, registerData)
      .subscribe({
        next: () => {
          void this._router.navigate(['/login']);
        },
        error: error => {
          alert(error.message);
        }
      })
  };

  get passwordMismatch() {
    return this.registerForm.hasError('passwordMismatch') && this.registerForm.get('confirmPassword')?.touched === true;
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  getPasswordStrength() {
    const password = this.passwordControl?.value || '';

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&._=-]/.test(password)) score++;

    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    if (score <= 4) return 'Strong';
    return 'Very-strong';
  }
}
