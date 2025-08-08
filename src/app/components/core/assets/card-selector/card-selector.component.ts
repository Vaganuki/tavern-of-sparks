import {Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CardSelectorConfig, MtgCard, SearchState} from '../../../../interfaces/core/cards/card.interface';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, startWith, switchMap, tap} from 'rxjs';
import {CardService} from '../../../../services/card.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-card-selector',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './card-selector.component.html',
  styleUrl: './card-selector.component.scss'
})
export class CardSelectorComponent implements OnInit {

  private _destroyRef = inject(DestroyRef);
  private _cardService = inject(CardService);

  @Input() config: CardSelectorConfig = {
    placeholder: 'Search a Magic Card...',
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 20,
    retryAttempts: 1,
    noResultsText: 'No card found for "{query}"',
    loadingText: 'Searching...',
    errorText: 'Search failed',
  };

  @Output() stateChanged = new EventEmitter<SearchState>();
  @Output() cardSelected = new EventEmitter<MtgCard>();
  @Output() cardCleared = new EventEmitter<void>();

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  inputId = `card-selector-${crypto.randomUUID()}`;
  listboxId = `${this.inputId}-listbox`;
  errorId = `${this.inputId}-error`;

  searchControl = new FormControl('', {
    validators: [Validators.minLength(this.config.minQueryLength)],
  });


  state: SearchState = {
    isLoading: false,
    error: null,
    results: null,
    selectedIndex: -1,
  }

  selectedCard: MtgCard | null = null;
  currentQuery = '';
  showSuggestions: boolean = false;

  get showNoResults(): boolean {
    return this.showSuggestions &&
      this.currentQuery.length >= this.config.minQueryLength &&
      this.state.results?.cards.length === 0 &&
      !this.state.isLoading &&
      !this.state.error;
  }

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(this.config.debounceMs),
      distinctUntilChanged(),
      tap(query => {
        this.currentQuery = query?.trim() || '';
        this.updateState({selectedIndex: -1});
      }),
      filter(query => {
        const trimmed = query!.trim() || '';
        if (trimmed.length < this.config.minQueryLength) {
          this.updateState({
            isLoading: false,
            error: null,
            results: null,
          });
          this.showSuggestions = false;
          return false;
        }
        return true;
      }),
      tap(() => this.updateState({ isLoading: true, error: null })),
      switchMap(query => {
        return this._cardService.searchCards(query, this.config);}),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (res) => {
        this.updateState({
          isLoading: false,
          results: res,
          error: null,
        });
        this.showSuggestions = res.cards.length > 0;
      },
      error:(err) => {
        console.error(err);
        this.updateState({
          isLoading: false,
          error: this.config.errorText,
          results: null,
        });
        this.showSuggestions = false;
      }
    });
  }

  updateState(partialState: Partial<SearchState>) {
    this.state = {...this.state, ...partialState};
    this.stateChanged.emit(this.state);
  }

  selectCard(card: MtgCard, index: number) {
    this.selectedCard = card;
    this.searchControl.setValue(card.name, {emitEvent: false});
    this.showSuggestions = false;
    this.updateState({selectedIndex: -1});
    this.cardSelected.emit(card);
  }

  clearSelection(): void {
    this.selectedCard = null;
    this.searchControl.setValue('', {emitEvent: false});
    this.currentQuery = '';
    this.showSuggestions = false;
    this.updateState({
      results: null,
      selectedIndex: -1,
      error: null,
      isLoading: false,
    });
    this.cardCleared.emit();

    setTimeout(() => this.searchInputRef?.nativeElement.focus(), 0);
  }

  updateSelectedIndex(index: number) {
    this.updateState({selectedIndex: index});
  }

  getOptionId(index: number): string {
    return `${this.listboxId}-option-${index}`
  }

  onFocus(): void {
    if (this.state.results?.cards.length) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
