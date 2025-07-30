import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private _fb = inject(FormBuilder);

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
    if (!this.loginForm.valid) {
      alert('FILL CORRECTLY MORON!');
      console.log(this._fb.control(''));
      return;
    }

    const loginData = this.loginForm.getRawValue();
    console.log(loginData);
  }

}
