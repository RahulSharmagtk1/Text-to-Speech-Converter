import { Voice } from './voice.model';

export interface HistoryItem {
  id: string;
  text: string;
  voice: Voice;
  rate: number;
  pitch: number;
  timestamp: string;
}