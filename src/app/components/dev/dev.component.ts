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
  ],
  templateUrl: './dev.component.html',
  standalone: true,
  styleUrl: './dev.component.scss'
})
export class DevComponent {
  private _fb = inject(NonNullableFormBuilder);
  private _http = inject(HttpClient);
}
