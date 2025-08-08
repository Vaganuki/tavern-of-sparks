import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, retry, shareReplay, tap} from 'rxjs';
import {CardSelectorConfig, MtgCard, SearchResult} from '../interfaces/core/cards/card.interface';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CardService {
  private _http = inject(HttpClient);
  private _cache = new Map<string, Observable<SearchResult>>();
  private maxCacheSize = 50;

  searchCards(query: string | null, config: Partial<CardSelectorConfig> = {}): Observable<SearchResult> {
    const trimmedQuery = query?.trim().toLowerCase() || '';

    if (!trimmedQuery || trimmedQuery.length < (config.minQueryLength ?? 2)) {
      return of({cards: []});
    }

    const cacheKey = `${trimmedQuery}-${config.maxResults ?? 20}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)!;
    }

    if (this._cache.size >= this.maxCacheSize) {
      const firstKey = this._cache.keys().next().value;
      if (firstKey) this._cache.delete(firstKey);
    }

    const request$ = this._http.get<MtgCard[]>(`${environment.apiUrl}/card/search/${trimmedQuery}`)
      .pipe(
        retry({count: config.retryAttempts ?? 1, delay: 1000}),

        map(response => {
          return {
            cards: response || [],
          } as SearchResult;
        }),

        catchError((error: HttpErrorResponse) => {
          console.error('Search failed:', error);
          const errorResult: SearchResult = {
            cards: [],
          };
          return of(errorResult);
        }),
        shareReplay(1),
      )
    ;
    this._cache.set(cacheKey, request$);
    return request$;
  }

}
