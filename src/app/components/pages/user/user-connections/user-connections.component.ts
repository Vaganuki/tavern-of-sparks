import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';
import {UserService} from '../../../../services/user.service';
import {FollowService} from '../../../../services/follow.service';
import {FollowResponse} from '../../../../interfaces/pages/follow.model';

@Component({
  selector: 'app-user-connections',
  imports: [
    RouterLink
  ],
  templateUrl: './user-connections.component.html',
  styleUrl: './user-connections.component.scss'
})
export class UserConnectionsComponent implements OnInit {

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _userService = inject(UserService);
  private _followService = inject(FollowService);

  isFollowerLink: boolean = true;

  followerCount = signal<number>(0)
  followingCount = signal<number>(0)

  userProfile = toSignal(
    this._activatedRoute.paramMap.pipe(
      switchMap(params => {
        const username = params.get('username');
        if (username) return this._userService.getUserByUsername(username);
        return of(null);
      })
    )
  );

  user = computed(() => this.userProfile()?.user);

  followData : FollowResponse[] = [];

  private _loadFollowDataEffect = effect(() => {
    const profile = this.userProfile();
    if (profile?.user?.id) {
      this.loadFollowData(profile.user.id);
    }
  });

  ngOnInit() {
    this.isFollowerLink = this._router.url.includes('/followers');
  }

  loadFollowData(userId : string | number) {
    console.log(userId);
    this._followService.getFollowers(userId).subscribe({
      next: result => {
        this.followerCount.set(result.length);
        if (this._router.url.includes('/followers')) {
          this._followService.getFollowers(userId).subscribe(
            result => {
              this.followData = result;
            }
          );
        }
      },
      error: error => {
        console.error(error);
      }
    });

    this._followService.getFollowing(userId).subscribe({
      next: result => {
        console.log(result);
        this.followingCount.set(result.length);
        if (this._router.url.includes('/following')) {
          this._followService.getFollowing(userId).subscribe(
            result => {
              this.followData = result;
            }
          )
        }
      },
      error: error => {
        console.error(error);
      }
    })

  }
}
