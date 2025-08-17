import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import { FollowResponse} from '../interfaces/pages/follow.model';

@Injectable({
  providedIn: 'root',
})

export class FollowService {
  private _http = inject(HttpClient);

  getFollowers(userId: string | number): Observable<FollowResponse[]> {
    return this._http.get<FollowResponse[]>(`${environment.apiUrl}/following/followers/${userId}`);
  }

  getFollowing(userId: string | number): Observable<FollowResponse[]> {
    return this._http.get<FollowResponse[]>(`${environment.apiUrl}/following/following/${userId}`);
  }

  followUser(followerId: number, followedId: number): Observable<FollowResponse> {
    return this._http.post<FollowResponse>(`${environment.apiUrl}/following/follow`, {
      followerId,
      followedId
    });
  }

  unfollowUser(followerId: number, followedId: number): Observable<string> {
    return this._http.post<string>(`${environment.apiUrl}/following/unfollow`, {
      followerId,
      followedId
    });
  }
}
