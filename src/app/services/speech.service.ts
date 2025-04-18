import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Voice } from '../models/voice.model';
import { HistoryItem } from '../models/history-item.model';
import { FavoritePhrase } from '../models/favorite-phrase.model';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  
  private voicesSubject = new BehaviorSubject<Voice[]>([]);
  private isSpeakingSubject = new BehaviorSubject<boolean>(false);
  private isPausedSubject = new BehaviorSubject<boolean>(false);
  
  private historyItems: HistoryItem[] = [];
  private historySubject = new BehaviorSubject<HistoryItem[]>([]);
  
  private favoritePhrasesSubject = new BehaviorSubject<FavoritePhrase[]>([]);
  private favoritesPhrases: FavoritePhrase[] = [];
  
  voices$: Observable<Voice[]> = this.voicesSubject.asObservable();
  isSpeaking$: Observable<boolean> = this.isSpeakingSubject.asObservable();
  isPaused$: Observable<boolean> = this.isPausedSubject.asObservable();
  history$: Observable<HistoryItem[]> = this.historySubject.asObservable();
  favoritesPhrases$: Observable<FavoritePhrase[]> = this.favoritePhrasesSubject.asObservable();

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    // Voice list might load asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    // Load history from localStorage
    this.loadHistory();
    this.loadFavorites();
  }
  
  private loadVoices(): void {
    const availableVoices = this.synth.getVoices();
    const voices: Voice[] = availableVoices.map((voice, index) => ({
      id: index.toString(),
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService,
      originalVoice: voice
    }));
    
    this.voicesSubject.next(voices);
  }
  
  speak(text: string, voice: Voice, rate: number = 1, pitch: number = 1): void {
    if (this.isSpeakingSubject.value) {
      this.stop();
    }
    
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.voice = voice.originalVoice;
    this.utterance.rate = rate;
    this.utterance.pitch = pitch;
    
    // Set up event handlers
    this.utterance.onstart = () => {
      this.isSpeakingSubject.next(true);
      this.isPausedSubject.next(false);
    };
    
    this.utterance.onend = () => {
      this.isSpeakingSubject.next(false);
      this.isPausedSubject.next(false);
    };
    
    this.utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      this.isSpeakingSubject.next(false);
      this.isPausedSubject.next(false);
    };
    
    // Add to history
    this.addToHistory(text, voice, rate, pitch);
    
    // Speak
    this.synth.speak(this.utterance);
  }
  
  pause(): void {
    if (this.isSpeakingSubject.value && !this.isPausedSubject.value) {
      this.synth.pause();
      this.isPausedSubject.next(true);
    }
  }
  
  resume(): void {
    if (this.isPausedSubject.value) {
      this.synth.resume();
      this.isPausedSubject.next(false);
    }
  }
  
  stop(): void {
    this.synth.cancel();
    this.isSpeakingSubject.next(false);
    this.isPausedSubject.next(false);
  }
  
  private addToHistory(text: string, voice: Voice, rate: number, pitch: number): void {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      voice,
      rate,
      pitch,
      timestamp: new Date().toISOString()
    };
    
    this.historyItems.unshift(historyItem);
    // Keep only the last 10 items
    if (this.historyItems.length > 10) {
      this.historyItems.pop();
    }
    
    this.historySubject.next([...this.historyItems]);
    this.saveHistory();
  }
  
  private saveHistory(): void {
    try {
      localStorage.setItem('speechHistory', JSON.stringify(this.historyItems));
    } catch (error) {
      console.warn('Could not save history to localStorage', error);
    }
  }
  
  private loadHistory(): void {
    try {
      const saved = localStorage.getItem('speechHistory');
      if (saved) {
        this.historyItems = JSON.parse(saved);
        this.historySubject.next([...this.historyItems]);
      }
    } catch (error) {
      console.warn('Could not load history from localStorage', error);
    }
  }
  
  addToFavorites(text: string, voice: Voice, rate: number, pitch: number, name: string): void {
    const favorite: FavoritePhrase = {
      id: Date.now().toString(),
      name,
      text,
      voice,
      rate,
      pitch
    };
    
    this.favoritesPhrases.push(favorite);
    this.favoritePhrasesSubject.next([...this.favoritesPhrases]);
    this.saveFavorites();
  }
  
  removeFavorite(id: string): void {
    this.favoritesPhrases = this.favoritesPhrases.filter(fav => fav.id !== id);
    this.favoritePhrasesSubject.next([...this.favoritesPhrases]);
    this.saveFavorites();
  }
  
  private saveFavorites(): void {
    try {
      localStorage.setItem('speechFavorites', JSON.stringify(this.favoritesPhrases));
    } catch (error) {
      console.warn('Could not save favorites to localStorage', error);
    }
  }
  
  private loadFavorites(): void {
    try {
      const saved = localStorage.getItem('speechFavorites');
      if (saved) {
        this.favoritesPhrases = JSON.parse(saved);
        this.favoritePhrasesSubject.next([...this.favoritesPhrases]);
      }
    } catch (error) {
      console.warn('Could not load favorites from localStorage', error);
    }
  }
}