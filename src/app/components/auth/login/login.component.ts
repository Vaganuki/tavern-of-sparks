import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private _fb = inject(FormBuilder);
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  loginForm = this._fb.group({
    email: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: this._fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.getRawValue();

    this._authService.login(loginData).subscribe({
      next: (res) => {
        void this._router.navigate(['/']);
      }
    })
  }
}
