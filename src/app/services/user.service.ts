import {AuthService} from './auth.service';
import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserProfileResponse} from '../interfaces/pages/user-profile.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private _authService = inject(AuthService);
  private _http = inject(HttpClient);

  private get authHeaders() {
    const token = this._authService.getToken();
    if (!token) {
      throw new Error('Unauthorized');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserById(id: number) {
    return this._http.get(`${environment.apiUrl}/user/${id}`, {headers: this.authHeaders})
  }

  getUserByUsername(username: string) {
    return this._http.get<UserProfileResponse>(`${environment.apiUrl}/user/profile/${username}`, {headers: this.authHeaders});
  }
}
