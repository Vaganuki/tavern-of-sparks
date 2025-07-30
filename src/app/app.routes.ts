import {Routes} from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {SignUpComponent} from './components/auth/sign-up/sign-up.component';
import {MainPageComponent} from './components/core/main-page/main-page.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: '', component: MainPageComponent}
];
