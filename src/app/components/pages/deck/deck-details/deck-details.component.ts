import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Deck_listService} from '../../../../services/deck_list.service';
import {DatePipe, JsonPipe,} from '@angular/common';
import {
  DeckCard,
  Decklist,
  DeckListDetails,
  DeckResponse,
  NewCard
} from '../../../../interfaces/core/deck_list.interface';
import {CardSelectorComponent} from '../../../core/assets/card-selector/card-selector.component';
import {MtgCard} from '../../../../interfaces/core/cards/card.interface';
import {RelativeTimePipe} from '../../../../pipes/relativeTime.pipe';

@Component({
  selector: 'app-deck-details',
  imports: [JsonPipe, CardSelectorComponent, RelativeTimePipe, DatePipe, RouterLink],
  templateUrl: './deck-details.component.html',
  styleUrl: './deck-details.component.scss'
})
export class DeckDetailsComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _decklistService = inject(Deck_listService);
  private _paramMap = toSignal(this._activatedRoute.paramMap);

  isOwnDeck = false;

  deckid = computed(() => this._paramMap()?.get('deckid'));

  private _deckListSignal = signal<DeckListDetails>({
    id: 0,
    name: 'PlaceHolder',
    main_card_id: null,
    created_at: new Date(),
    last_updated: new Date(),
    user: {
      username: 'Loading...',
    },
    game_format: {
      name: 'Loading',
    },
    cards: [],
  });
  deckList = this._deckListSignal.asReadonly();

  private _groupedCardSignal = signal<any[]>([]);
  groupedCards = this._groupedCardSignal.asReadonly();


  constructor() {
    this._activatedRoute.paramMap.subscribe(params => {
      const deckid = params.get('deckid');
      if (deckid) {
        this.loadDeckList(deckid);
      }
    });
  }

  private updateGroupedCards(deckListData: DeckListDetails) {

    const cards = deckListData.cards;
    const grouped: Record<string, Map<string, { card: DeckCard, count: number }>> = {};

    cards?.forEach((c) => {
      const type = this.extractMainType(c.card.type_line);
      const cardID = c.card.oracle_id;

      if (!grouped[type]) grouped[type] = new Map();

      if (grouped[type].has(cardID)) {
        grouped[type].get(cardID)!.count++;
      } else {
        grouped[type].set(cardID, {card: c, count: 1});
      }
    })
    const result = Object.entries(grouped).map(([key, value]) => ({
      type: key,
      cards: Array.from(value.values()),
      count: Array.from(value.values()).reduce((total, cardData) => total + cardData.count, 0),
    }));
    this._groupedCardSignal.set(result);
  }

  private loadDeckList(deckid: string) {
    this._decklistService.getDecklistDetails(deckid).subscribe(decklist => {
      this._deckListSignal.set(decklist);
      this.isOwnDeck = this.deckList().user.username === localStorage.getItem('username');
      this.updateGroupedCards(decklist);
    });
  }

  extractMainType(typeline: string): string {
    if (typeline.includes('Planeswalker')) return 'Planeswalker';
    if (typeline.includes('Creature')) return 'Creature';
    if (typeline.includes('Enchantment')) return 'Enchantment';
    if (typeline.includes('Artifact')) return 'Artifact';
    if (typeline.includes('Land')) return 'Land';
    if (typeline.includes('Sorcery')) return 'Sorcery';
    if (typeline.includes('Instant')) return 'Instant';
    return 'Other';
  }

  onCardSelected(card: MtgCard) {

    const user_id = localStorage.getItem('id');
    const deckInfo = this.deckList();
    if (user_id) {
      const data: NewCard = {
        user_id: +user_id,
        card_id: card.oracle_id,
        deck_id: deckInfo.id ?? 0,
      };
      this._decklistService.addCardToDecklist(data).subscribe({
        next: (res) => {
          this.refreshDeckList();
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      return
    }
  }

  private refreshDeckList() {
    const deckid = this.deckid();
    if (deckid) {
      this.loadDeckList(deckid);
    }
  }

  getMainCardPrinting(deck : DeckListDetails) {
    if (!deck.main_card_id) return null;
    const mainCard = deck.cards.find(card => card.card.oracle_id === deck.main_card_id);
    return mainCard?.printing.image_uris.art_crop || null;
  }

  getMainCardName(deck: DeckListDetails):string {
    if(!deck.main_card_id) return '';
    const mainCard = deck.cards.find(card => card.card.oracle_id === deck.main_card_id);
    return mainCard?.card.name || '';
  }
}
