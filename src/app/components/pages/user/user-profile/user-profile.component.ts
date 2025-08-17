import {Component, computed, inject, OnInit, signal,} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserService} from '../../../../services/user.service';
import {catchError, of, switchMap, tap} from 'rxjs';
import {CommonModule} from '@angular/common';
import {Deck_listService} from '../../../../services/deck_list.service';
import {Decklist} from '../../../../interfaces/core/deck_list.interface';
import {RelativeTimePipe} from '../../../../pipes/relativeTime.pipe';
import {FollowService} from '../../../../services/follow.service';
import {AuthService} from '../../../../services/auth.service';

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
  private _followService = inject(FollowService);
  private _authService = inject(AuthService);

  username = computed(() => this._paramMap()?.get('username') || '');
  followerCount = signal<number>(0);
  followingCount = signal<number>(0);
  isFollowing = signal<boolean>(false);
  isFollowLoading = signal<boolean>(false);
  isLoggedIn = this._authService.isLoggedIn();

  showedDecks: Decklist[] = []

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

  currentUserId = localStorage.getItem('id');

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
            this.loadFollowData(profile.user.id.toString());
            return this._decklistService.getDecklistByUser(profile.user.id.toString())
          }
          return of([]);
        })
      )
      .subscribe(decklist => {
        this.showedDecks = decklist;
      });
  }

  private loadFollowData(userId: string) {
    this._followService.getFollowers(userId).subscribe({
      next: (followers) => {
        this.followerCount.set(followers.length);

        if (this.currentUserId) {
          const isCurrentlyFollowing = followers.some(
            follow => follow.id === +this.currentUserId!
          );
          this.isFollowing.set(isCurrentlyFollowing);
        }
      },
      error: error => {
        console.error(error);
      }
    });

    this._followService.getFollowing(userId).subscribe({
      next: (following) => {
        this.followingCount.set(following.length)
      },
      error: error => {
        console.error(error);
      }
    });
  }

  onFollowToggle() {
    const targetUserId = this.user()?.id;

    const followerId = this.currentUserId!;

    if (!targetUserId) {
      console.error('Target User ID not found');
      return;
    }

    if (this.isFollowLoading()) return;

    this.isFollowLoading.set(true);

    if (this.isFollowing()) {
      this._followService.unfollowUser(+followerId, targetUserId).pipe(
        tap(() => {
          this.isFollowing.set(false);
          this.followerCount.update(count => Math.max(0, count - 1));
        }),
        catchError(error => {
          console.error(error);
          return of(null);
        })
      )
        .subscribe(() => {
          this.isFollowLoading.set(false);
        });
    } else {
      this._followService.followUser(+followerId, targetUserId).pipe(
        tap(() => {
          this.isFollowing.set(true);
          this.followerCount.update(count => Math.max(0, count + 1));
        }),
        catchError(error => {
          console.error(error)
          return of(null);
        })
      )
        .subscribe(() => {
          this.isFollowLoading.set(false);
        })
    }
  }
}
