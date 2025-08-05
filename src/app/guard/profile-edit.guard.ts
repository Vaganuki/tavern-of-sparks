import {AuthService} from '../services/auth.service';
import {inject, Injectable} from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {catchError, map, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProfileEditGuard implements CanActivate {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot) {
    const username = route.paramMap.get('username');

    if(!this._authService.isAuthenticated()) {
      void this._router.navigate(['/login']);
      return false;
    }

    if(!username) {
      void this._router.navigate(['/']);
      return false;
    }

    return this._userService.getUserByUsername(username).pipe(
      map(res => {
        if (res.canEdit) {
          return true
        } else {
          void this._router.navigate(['/profile', username]);
          return false;
        }
      }),
      catchError(err => {
        console.error('Error while checking your rights:', err);
        void this._router.navigate(['/']);
        return of(false);
      })
    );

  }

}
