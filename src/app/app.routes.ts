import {Routes} from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {SignUpComponent} from './components/auth/sign-up/sign-up.component';
import {MainPageComponent} from './components/core/main-page/main-page.component';
import {DevComponent} from './components/dev/dev.component';
import {PersonalProfilComponent} from './components/pages/profile/personal-profil/personal-profil.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'profile',
        component: PersonalProfilComponent,
      }
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'dev', component: DevComponent},
];
