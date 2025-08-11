import {FormControl} from '@angular/forms';

export interface NewDeckListForm {
  name: FormControl<string | null>;
  // main_card_id: FormControl<string | null>;
  game_format: FormControl<number | null>;
}

export interface NewDeckListData {
  name: string | null;
  main_card_id?: string | null;
  game_format: number | null;
  user_id?: number;
}
