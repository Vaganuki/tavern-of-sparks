import {Component, computed, inject, OnInit} from '@angular/core';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {passwordStrengthValidator} from '../../../../services/validators/password-strength.validator';
import {passwordMatchValidator} from '../../../../services/validators/password-match.validator';
import {environment} from '../../../../../environments/environment';
import {UpdateUserForm, UpdateUserFormData} from '../../../../interfaces/forms/update-user-form.interface';
import {CommonModule} from '@angular/common';
import {UserService} from '../../../../services/user.service';
import {AuthService} from '../../../../services/auth.service';
import {ColorOption} from '../../../../interfaces/forms/color-option.interface';
import {toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

@Component({
  selector: 'app-user-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {

  private _fb = inject(NonNullableFormBuilder);
  private _http = inject(HttpClient);
  private _router = inject(Router);

  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _userService = inject(UserService);

  private _paramMap = toSignal(this._activatedRoute.paramMap);

  selectedColors: string[] = [];

  username = computed(() => this._paramMap()?.get('username') || '');

  userProfile = toSignal(
    this._activatedRoute.paramMap.pipe(
      switchMap(params => {
        const username = params.get('username');
        if (username) {
          return this._userService.getUserByUsername(username);
        }
        return of(null)
      })
    )
  )

  ngOnInit() {
    this.initializeForm();
    this.loadUserData();
  }

  colorOptions: ColorOption[] = [
    {
      letter: 'W',
      name: 'White',
      svg: 'white_mana.svg',
    },
    {
      letter: 'U',
      name: 'Blue',
      svg: '#blue_mana.svg',
    },
    {
      letter: 'B',
      name: 'Black',
      svg: 'black_mana.svg',
    },
    {
      letter: 'R',
      name: 'Red',
      svg: 'red_mana.svg',
    },
    {
      letter: 'G',
      name: 'Green',
      svg: 'green_mana.svg',
    },
    {
      letter: 'C',
      name: 'Colorless',
      svg: 'colorless_mana.svg',
    },
  ]


  updateUserForm: FormGroup<UpdateUserForm> = this._fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: ['', Validators.required],
    password: [''],
    confirmPassword: [''],
    colorIdentity: [''],
    pronouns: [''],
  }, {
    validators: [passwordMatchValidator()],
  });

  onSubmit() {
    if (this.updateUserForm.invalid) {
      return;
    }

    const updateData: UpdateUserFormData = this.updateUserForm.getRawValue();
    this._http.post(`${environment.apiUrl}/user/`, updateData)
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
    return this.updateUserForm.hasError('passwordMismatch') && this.updateUserForm.get('confirmPassword')?.touched === true;
  }

  get passwordControl() {
    return this.updateUserForm.get('password');
  }

  get confirmPasswordControl() {
    return this.updateUserForm.get('confirmPassword');
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


  private initializeForm() {
    this.updateUserForm.get('password')?.valueChanges.subscribe((value) => {
      const confirmPasswordControl = this.updateUserForm.get('confirmPassword');
      if (value) {
        this.updateUserForm.get('password')?.setValidators([passwordStrengthValidator()])
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        this.updateUserForm.get('password')?.clearValidators();
        confirmPasswordControl?.clearValidators();
      }
      this.updateUserForm.get('password')?.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    })
  }

  private loadUserData() {
    const profileData = this.userProfile();
    console.log(profileData);
    if (profileData?.user) {
      const user = profileData.user;

      this.updateUserForm.patchValue({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        pronouns: user.pronouns || '',
        birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : '',
      });

      if (user.colorIdentity) {
        this.selectedColors = user.colorIdentity.split('');
      }
    }
  }

  toggleColor(color: string) {
    const index = this.selectedColors.indexOf(color);
    if (index >= 0) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.selectedColors.sort((a, b) => {
      const order = ['W', 'U', 'B', 'R', 'G', 'C'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }

  isColorSelected(color: string): boolean {
    return this.selectedColors.includes(color);
  }

  getSelectedColorDisplay(): string {
    return this.selectedColors.length > 0 ? this.selectedColors.join() : 'Aucune';
  }

}
