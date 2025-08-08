import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {CardSelectorComponent} from '../assets/card-selector/card-selector.component';
import { MtgCard, SearchState} from '../../../interfaces/core/cards/card.interface';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-main-page',
  imports: [
    NavBarComponent,
    RouterOutlet,
    CardSelectorComponent,
    CommonModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  selectedCard: MtgCard | null = null;
  searchState: SearchState | null = null;

  // Appelé quand l'état de recherche change (loading, error, results)
  onSearchStateChanged(state: SearchState) {
    console.log('Search state changed:', state);
    this.searchState = state;
  }

  onCardSelected(card: MtgCard) {
    console.log('Card selected:', card);
    this.selectedCard = card;
  }


}
