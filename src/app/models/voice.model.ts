export interface Voice {
  id: string;
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
  originalVoice: SpeechSynthesisVoice;
}