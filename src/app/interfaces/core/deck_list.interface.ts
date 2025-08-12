export interface Decklist {
  id: number;
  name: string;
  // user_id: number;
  main_card_id: number | null;
  created_at: Date;
  last_updated: Date;
  user:{
    username: string;
  };
  game_format:{
    name: string;
  }
}

export interface GameFormat {
  name: string;
  id: number;
}
