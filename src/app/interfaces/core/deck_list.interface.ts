export interface Decklist {
  id: number;
  name: string;
  main_card_id: string | null;
  created_at: Date;
  last_updated: Date;
  user: {
    username: string;
  };
  game_format: {
    name: string;
  }
  deck: DeckListCardLight[];
}

export interface DeckListDetails {
  id: number;
  name: string;
  main_card_id: string | null;
  created_at: Date;
  last_updated: Date;
  user: {
    username: string;
  };
  game_format: {
    name: string;
  }
  cards: DeckCard[];
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

export interface ImageUris {

}

export interface DeckListCardLight {
  id: number;
  card: {
    name: string;
    oracle_id: string;
  },
  printing: {
    image_uris: {
      png: string;
      large: string;
      small: string;
      normal: string;
      art_crop: string;
      border_crop: string;
    };
  }
}

export interface NewCard {
  deck_id: number;
  user_id: number;
  card_id: string;
}
