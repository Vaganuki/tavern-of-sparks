import {Component, inject} from '@angular/core';
import {NavItem} from '../../../interfaces/core/nav-links.model';
import {AuthService} from '../../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);

  _isLoggedIn = this._authService.isLoggedIn;

  _loggedUsername = this._authService.loggedUsername;

  logout() {
    this._authService.logout();
    void this._router.navigateByUrl('/login');
  }

  mainMenu: NavItem[] = [
    {
      url: '/',
      name: 'Sparks',
      icon: 'house-heart-fill',
    },
    {
      url: '/',
      name: 'Events',
      icon: 'calendar-event',
    },
    {
      url: '/decks/public',
      name: 'Decks',
      icon:'card-list'
    },
    {
      url: '/',
      name: 'Trades',
      icon:'arrow-repeat',
    },
    {
      url: '/',
      name: 'Forums',
      icon:'chat-square-quote-fill',
    },
  ];
}
