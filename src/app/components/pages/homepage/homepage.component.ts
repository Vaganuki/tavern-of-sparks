import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Decklist} from '../../../interfaces/core/deck_list.interface';
import {Deck_listService} from '../../../services/deck_list.service';
import {DatePipe, JsonPipe} from '@angular/common';
import {RelativeTimePipe} from '../../../pipes/relativeTime.pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [
    DatePipe,
    JsonPipe,
    RelativeTimePipe,
    RouterLink
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  private _authService = inject(AuthService);
  private _decklistService = inject(Deck_listService);

  isLoggedIn = this._authService.isLoggedIn();
  currentUserID = localStorage.getItem('id');

  userLatestUpdatedDeck: Decklist[] = [];
  followLatestUpdatedDeck: Decklist[] = [];
  followLatestDeck: Decklist[] = [];

  ngOnInit(): void {
    this.loadUserLatestUpdatedDeck();
    this.loadUsersFollowLatestDeck();
    this.loadUsersFollowLatestUpdatedDeck();
  }

  private loadUserLatestUpdatedDeck() {
    if (this.currentUserID) {
      this._decklistService.getUserLatestUpdatedDeck(this.currentUserID, 5)
        .subscribe({
          next: (decklist: Decklist[]) => {
            this.userLatestUpdatedDeck = decklist;
          },
          error: (err) => {
            console.error(err);
          }
        });
    }
  }
  private loadUsersFollowLatestUpdatedDeck() {
    if (this.currentUserID) {
      this._decklistService.getUsersFollowLatestUpdatedDeck(this.currentUserID, 5)
        .subscribe({
          next: (decklist: Decklist[]) => {
            this.followLatestUpdatedDeck = decklist;
          },
          error: (err) => {
            console.error(err);
          }
        });
    }
  }
  private loadUsersFollowLatestDeck() {
    if (this.currentUserID) {
      this._decklistService.getUsersFollowLatestDeck(this.currentUserID, 5)
        .subscribe({
          next: (decklist: Decklist[]) => {
            this.followLatestDeck = decklist;
          },
          error: (err) => {
            console.error(err);
          }
        });
    }
  }

}
