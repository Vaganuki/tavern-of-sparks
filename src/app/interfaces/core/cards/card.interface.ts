export interface MtgCard {
  oracle_id: string;
  name: string;
  type_line: string;
  oracle_text?: string;
  cmc: number;
  power?: string;
  toughness?: string;
}

export interface SearchResult {
  cards: MtgCard[];
}

export interface SearchState{
  isLoading: boolean;
  error: string | null;
  results: SearchResult | null;
  selectedIndex: number;
}

export interface CardSelectorConfig {
  placeholder: string;
  debounceMs: number;
  minQueryLength: number;
  maxResults: number;
  retryAttempts: number;
  noResultsText: string;
  loadingText: string;
  errorText: string;
}
