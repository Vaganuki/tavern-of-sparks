import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GameFormat} from '../interfaces/core/deck_list.interface';

@Injectable({
  providedIn: 'root'
})

export class GameFormatService {
  private _http = inject(HttpClient);

  getAllFormats(): Observable<GameFormat[]> {
    return this._http.get<GameFormat[]>(`${environment.apiUrl}/game_format/getAll`);
  }
}
