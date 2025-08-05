import {Component, computed, inject,} from '@angular/core';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserService} from '../../../../services/user.service';
import {of, switchMap} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  private _userService = inject(UserService);
  private _activatedRoute = inject(ActivatedRoute);
  private _paramMap = toSignal(this._activatedRoute.paramMap);

  username = computed(() => this._paramMap()?.get('username') || '');

  userProfile = toSignal(
    this._activatedRoute.paramMap.pipe(
      switchMap(params => {
        const username = params.get('username');
        if (username) {
          return this._userService.getUserByUsername(username);
        }
        return of(null);
      })
    )
  );

  user = computed(() => this.userProfile()?.user);
  isOwnProfile = computed(() => this.userProfile()?.isOwnProfile);
  canEdit = computed(() => this.userProfile()?.canEdit);
}
