import {Routes} from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {SignUpComponent} from './components/auth/sign-up/sign-up.component';
import {MainPageComponent} from './components/core/main-page/main-page.component';
import {DevComponent} from './components/dev/dev.component';
import {UserProfileComponent} from './components/pages/user/user-profile/user-profile.component';
import {NotFoundComponent} from './components/core/not-found/not-found.component';
import {UserEditComponent} from './components/pages/user/user-edit/user-edit.component';
import {ProfileEditGuard} from './guard/profile-edit.guard';
import {DecklistDashboardComponent} from './components/pages/deck/decklist-dashboard/decklist-dashboard.component';
import {DeckDetailsComponent} from './components/pages/deck/deck-details/deck-details.component';


export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'users/:username',
        component: UserProfileComponent,
      },
      {
        path: 'users/:username/edit',
        component: UserEditComponent,
        canActivate: [ProfileEditGuard]
      },
      {
        path: 'decks/public',
        component: DecklistDashboardComponent,
      },
      {
        path: 'decks/private',
        component: DecklistDashboardComponent,
      },
      {
        path: 'decks/:deckid',
        component: DeckDetailsComponent,
      },
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'dev', component: DevComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', component: NotFoundComponent},
];
