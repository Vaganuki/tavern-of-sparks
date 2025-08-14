import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {NewDeckListData, NewDeckListForm} from "../../../../interfaces/forms/decklist-form.interface";
import {FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CardSelectorComponent} from '../../../core/assets/card-selector/card-selector.component';
import {MtgCard} from '../../../../interfaces/core/cards/card.interface';
import {GameFormatSelectorComponent} from '../../../core/assets/game-format-selector/game-format-selector.component';
import {Deck_listService} from '../../../../services/deck_list.service';
import {Decklist, GameFormat} from '../../../../interfaces/core/deck_list.interface';
import {RelativeTimePipe} from '../../../../pipes/relativeTime.pipe';
import {Router, RouterLink} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-decklist-dashboard',
  imports: [
    ReactiveFormsModule,
    CardSelectorComponent,
    GameFormatSelectorComponent,
    RelativeTimePipe,
    RouterLink,
  ],
  templateUrl: './decklist-dashboard.component.html',
  styleUrl: './decklist-dashboard.component.scss'
})
export class DecklistDashboardComponent implements OnInit {

  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder)
  private _decklistService = inject(Deck_listService);
  private _router = inject(Router);


  isLoggedIn = this._authService.isLoggedIn();
  isFormOpen = signal<boolean>(false);

  selectedCard: MtgCard | null = null;

  newDeckListForm: FormGroup<NewDeckListForm> = this._fb.group({
    name: ['', Validators.required],
    // main_card_id: [''],
    game_format: [0, Validators.required],
  });

  showedDecks: Decklist[] = []

  ngOnInit() {
    this.getDeckList();
  }

  onSubmit() {
    if (this.newDeckListForm.invalid) return;

    const newDecklistData: NewDeckListData = this.newDeckListForm.getRawValue();
    if (this.selectedCard) newDecklistData.main_card_id = this.selectedCard.oracle_id;

    this._decklistService.createNewDecklist(newDecklistData);
  }

  cancelCreation() {
    this.isFormOpen.set(false);
  }

  openCreationForm() {
    this.isFormOpen.set(true);
  }

  onCardSelected(card: MtgCard) {
    this.selectedCard = card;
  }

  onGameFormatSelected(selected: GameFormat) {
    this.newDeckListForm.patchValue({
      game_format: selected.id
    });
  }

  getDeckList() {
    if (this._router.url.includes('private')) {
      if (this.isLoggedIn) {
        const id = localStorage.getItem('id');
        if (id) {
          this._decklistService.getDecklistByUser(id)
            .subscribe(decklist => {
              this.showedDecks = decklist;
            });
        } else {
          void this._router.navigate(['/login']);
        }
      } else {
        void this._router.navigate(['/login']);
      }
    } else {
      this._decklistService.getRecentDecklist()
        .subscribe({
          next: (decklist) => {
            this.showedDecks = decklist
          },
          error: (error) => {
            console.error('Failed to load decklists:', error);
          }
        })
    }
  }
}
