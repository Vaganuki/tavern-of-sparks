export interface Decklist {
  id: number;
  name: string;
  user_id: number;
  main_card_id: number | null;
}

export interface GameFormat {
  name: string;
  id: number;
}
