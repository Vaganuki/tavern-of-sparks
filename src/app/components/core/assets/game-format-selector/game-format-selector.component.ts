import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {GameFormatService} from '../../../../services/game_format.service';
import {Subject, takeUntil} from 'rxjs';
import {GameFormat} from '../../../../interfaces/core/deck_list.interface';

@Component({
  selector: 'app-game-format-selector',
  imports: [],
  templateUrl: './game-format-selector.component.html',
  standalone: true,
  styleUrl: './game-format-selector.component.scss'
})
export class GameFormatSelectorComponent implements OnInit, OnDestroy {

  private _gameFormatService = inject(GameFormatService);
  private _destroy$ = new Subject<void>();

  @Output() formatSelected = new EventEmitter<GameFormat>();

  formats: GameFormat[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadFormats();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private loadFormats(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this._gameFormatService.getAllFormats()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: data => {
          this.formats = data;
          this.isLoading = false;
        },
        error: err => {
          console.error('Failed to load game formats:', err);
          this.errorMessage = 'Failed to load game formats. Please try again.';
          this.isLoading = false;
        }
      })
  }

  retryLoad(): void {
    this.loadFormats();
  }

  onFormatChange(evt: Event): void {
    const selectElement = evt.target as HTMLSelectElement;
    const selectedFormatId = selectElement.value;

    if (selectedFormatId) {
      const selectedFormat = this.formats.find(format => format.id.toString() === selectedFormatId);

      if (selectedFormat) this.formatSelected.emit(selectedFormat);
    }

  }
}
