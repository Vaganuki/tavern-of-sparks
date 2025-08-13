import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';
import {Deck_listService} from '../../../../services/deck_list.service';
import {JsonPipe, KeyValuePipe} from '@angular/common';
import {DeckCard, NewCard} from '../../../../interfaces/core/deck_list.interface';
import {CardSelectorComponent} from '../../../core/assets/card-selector/card-selector.component';
import {MtgCard} from '../../../../interfaces/core/cards/card.interface';

@Component({
  selector: 'app-deck-details',
  imports: [JsonPipe, KeyValuePipe, CardSelectorComponent],
  templateUrl: './deck-details.component.html',
  styleUrl: './deck-details.component.scss'
})
export class DeckDetailsComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _decklistService = inject(Deck_listService);
  private _paramMap = toSignal(this._activatedRoute.paramMap);

  deckid = computed(() => this._paramMap()?.get('deckid'));

  groupedCards = computed(() => {
    const cards = this.deckList()?.cards;
    if (!cards) return [];
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
    return Object.entries(grouped).map(([key, value]) => ({
      type: key,
      cards: Array.from(value.values()),
      count: Array.from(value.values()).reduce((total, cardData) => total + cardData.count, 0),
    }));
  });

  deckList = toSignal(
    this._activatedRoute.paramMap.pipe(
      switchMap(params => {
        const deckid = params.get('deckid');
        if (deckid) {
          return this._decklistService.getDecklistDetails(deckid);
        }
        return of(null);
      })
    )
  );

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
    if (user_id) {
      const data: NewCard = {
        user_id: +user_id,
        card_id: card.oracle_id,
        deck_id: this.deckList()?.decklist[0].id ?? 0,
      };
      console.log(data);
      void this._decklistService.addCardToDecklist(data);
    } else {
      return
    }
  }

}
