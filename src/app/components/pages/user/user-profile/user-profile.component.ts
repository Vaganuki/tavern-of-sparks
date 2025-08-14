import {Component, computed, inject, OnInit,} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserService} from '../../../../services/user.service';
import {of, switchMap} from 'rxjs';
import {CommonModule} from '@angular/common';
import {Deck_listService} from '../../../../services/deck_list.service';
import {Decklist} from '../../../../interfaces/core/deck_list.interface';
import {RelativeTimePipe} from '../../../../pipes/relativeTime.pipe';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    RouterModule,
    RelativeTimePipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  private _userService = inject(UserService);
  private _activatedRoute = inject(ActivatedRoute);
  private _paramMap = toSignal(this._activatedRoute.paramMap);
  private _decklistService = inject(Deck_listService)

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

  ngOnInit() {
    this._activatedRoute.paramMap
      .pipe(
        switchMap(params => {
          const username = params.get('username');
          if (username) {
            return this._userService.getUserByUsername(username);
          }
          return of(null);
        }),
        switchMap(profile => {
          if (profile?.user?.id) {
            return this._decklistService.getDecklistByUser(profile.user.id.toString())
          }
          return of([]);
        })
      )
      .subscribe(decklist => {
        this.showedDecks = decklist;
      });  }

  user = computed(() => this.userProfile()?.user);
  isOwnProfile = computed(() => this.userProfile()?.isOwnProfile);
  canEdit = computed(() => this.userProfile()?.canEdit);
  showedDecks: Decklist[] = []
}
