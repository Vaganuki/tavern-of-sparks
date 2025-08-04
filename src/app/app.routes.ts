import {Routes} from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {SignUpComponent} from './components/auth/sign-up/sign-up.component';
import {MainPageComponent} from './components/core/main-page/main-page.component';
import {DevComponent} from './components/dev/dev.component';
import {UserProfileComponent} from './components/pages/user/user-profile/user-profile.component';
import {NotFoundComponent} from './components/core/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'users/:username',
        component: UserProfileComponent,
      }
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'dev', component: DevComponent},
  {path: '**', component: NotFoundComponent},
];
