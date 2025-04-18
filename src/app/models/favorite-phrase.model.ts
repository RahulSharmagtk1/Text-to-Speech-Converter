import { Voice } from './voice.model';

export interface FavoritePhrase {
  id: string;
  name: string;
  text: string;
  voice: Voice;
  rate: number;
  pitch: number;
}