import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {NewDeckListData} from '../interfaces/forms/decklist-form.interface';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Decklist} from '../interfaces/core/deck_list.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Deck_listService {
  private _authService = inject(AuthService);
  private _http = inject(HttpClient);
  private _router = inject(Router);


  createNewDecklist(data: NewDeckListData) {
    const user_id = localStorage.getItem('id');
    if (user_id) {
      data.user_id = +user_id;
    } else {
      return;
    }
    if (data.game_format === 0) data.game_format++;

    this._http.post(`${environment.apiUrl}/deck_list/create`, data)
      .subscribe({
        next: () => {
          void this._router.navigateByUrl('/');
        },
        error: error => {
          console.log(error);
        }
      })
  }

  getRecentDecklist(): Observable<Decklist[]> {
    return this._http.get<Decklist[]>(`${environment.apiUrl}/deck_list/recent`)
  }

}
