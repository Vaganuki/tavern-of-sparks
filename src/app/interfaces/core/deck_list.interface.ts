export interface Decklist {
  id: number;
  name: string;
  // user_id: number;
  main_card_id: string | null;
  created_at: Date;
  last_updated: Date;
  user: {
    username: string;
  };
  game_format: {
    name: string;
  }
}

export interface GameFormat {
  name: string;
  id: number;
}

export interface DeckCard {
  // id: number;
  is_commander: boolean;
  is_sideboard: boolean;
  card: {
    oracle_id: string;
    name: string;
    type_line: string;
    oracle_text: string;
    cmc: string;
    power?: string;
    toughness?: string;
  };
}

export interface DeckResponse {
  decklist: Decklist[];
  cards: DeckCard[];
}
