import {Component, inject} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RegisterForm, RegisterFormData} from '../../interfaces/forms/register-form.interface';
import {CommonModule} from '@angular/common';
import {passwordMatchValidator} from '../../services/validators/password-match.validator';
import {passwordStrengthValidator} from '../../services/validators/password-strength.validator';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-dev',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './dev.component.html',
  standalone: true,
  styleUrl: './dev.component.scss'
})
export class DevComponent {
  private _fb = inject(NonNullableFormBuilder);
  private _http = inject(HttpClient);

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

  devSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const registerData: RegisterFormData = this.registerForm.getRawValue();
    this._http.post(`${environment.apiUrl}/user/sign_up`, registerData)
      .subscribe({
        next: () => {
          alert('Signed up successfully');
        },
        error: (err) => {
          console.error(err);
          alert(err.message);
        }
      })
  }

  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.touched === true;
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  getPasswordStrength(): string {
    const password = this.passwordControl?.value || '';

    if (password.length === 0) return '';

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    if (score <= 4) return 'Strong';
    return 'Very-strong';
  }
}
