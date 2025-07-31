import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _http = inject(HttpClient);

  constructor() {
  }

  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());

  public isLoggedIn = this.loggedIn.asObservable();

  login(data: { email: string, password: string }): Observable<{ token: string }> {
    return new Observable(observer => {
      this._http.post<{ token: string }>(`${environment.apiUrl}/user/login`, data)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.saveToken(res.token);
            this.loggedIn.next(true);
            observer.next(res);
            observer.complete();
          },
          error: error => {
            console.log(error);
          }
        })
    })
  }

  saveToken(token : string) {
    console.log("Access Token", token);
    localStorage.setItem('token', token);

    try {
      const decoded = this.decodeToken(token);
      const id = decoded.id;
      if (id) {
        localStorage.setItem('id', id);
      } else {
        console.error('Can\'t find user ID from token');
      }
    } catch (e) {
      console.error('Error decoding token:', e);
    }

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
      }
      const payload = parts[1];

      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error decoding JWT token:', e);
      throw new Error('Failed to decode JWT token');
    }
  }
}
