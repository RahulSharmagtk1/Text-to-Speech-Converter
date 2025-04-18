import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpeechService } from '../../services/speech.service';
import { Voice } from '../../models/voice.model';
import { HistoryItem } from '../../models/history-item.model';
import { FavoritePhrase } from '../../models/favorite-phrase.model';
import { Subject, takeUntil } from 'rxjs';
import { TextInputComponent } from '../text-input/text-input.component';
import { VoiceControlsComponent } from '../voice-controls/voice-controls.component';
import { HistoryListComponent } from '../history-list/history-list.component';
import { FavoritesListComponent } from '../favorites-list/favorites-list.component';
import { SpeechVisualizerComponent } from '../speech-visualizer/speech-visualizer.component';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextInputComponent,
    VoiceControlsComponent,
    HistoryListComponent,
    FavoritesListComponent,
    SpeechVisualizerComponent
  ],
  template: `
    <div class="text-to-speech-container">
      <h2 class="title">Text to Speech Converter</h2>
      
      <div class="main-section">
        <div class="input-controls">
          <app-text-input 
            [text]="text" 
            (textChange)="onTextChange($event)"
            [maxLength]="maxLength">
          </app-text-input>
          
          <app-voice-controls
            [voices]="voices"
            [selectedVoice]="selectedVoice"
            [rate]="rate"
            [pitch]="pitch"
            [isSpeaking]="isSpeaking"
            [isPaused]="isPaused"
            (voiceChange)="onVoiceChange($event)"
            (rateChange)="onRateChange($event)"
            (pitchChange)="onPitchChange($event)"
            (speak)="speak()"
            (pause)="pause()"
            (resume)="resume()"
            (stop)="stop()"
            (saveAsFavorite)="saveAsFavorite()">
          </app-voice-controls>
          
          <app-speech-visualizer 
            *ngIf="isSpeaking" 
            [active]="isSpeaking && !isPaused">
          </app-speech-visualizer>
        </div>
        
        <div class="history-favorites-section">
          <div class="tabs">
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'history'"
              (click)="activeTab = 'history'">
              Recent History
            </button>
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'favorites'"
              (click)="activeTab = 'favorites'">
              Favorites
            </button>
          </div>
          
          <div class="tab-content">
            <app-history-list 
              *ngIf="activeTab === 'history'"
              [historyItems]="historyItems"
              (useHistoryItem)="useHistoryItem($event)">
            </app-history-list>
            
            <app-favorites-list
              *ngIf="activeTab === 'favorites'"
              [favorites]="favorites"
              (useFavorite)="useFavorite($event)"
              (removeFavorite)="removeFavorite($event)">
            </app-favorites-list>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-to-speech-container {
      padding: 1rem;
      border-radius: 12px;
      background-color: var(--card-bg-color, white);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    }
    
    .title {
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 1.75rem;
      font-weight: 600;
      text-align: center;
      color: var(--primary-color);
    }
    
    .main-section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 992px) {
      .main-section {
        grid-template-columns: 3fr 2fr;
      }
    }
    
    .input-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .history-favorites-section {
      border-radius: 8px;
      background-color: var(--bg-alt-color, #f8f9fa);
      overflow: hidden;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
    }
    
    .tab-button {
      flex: 1;
      padding: 0.75rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-color-secondary, #6b7280);
      transition: all 0.2s ease;
    }
    
    .tab-button.active {
      color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.05);
      border-bottom: 2px solid var(--primary-color);
    }
    
    .tab-button:hover:not(.active) {
      background-color: rgba(59, 130, 246, 0.02);
    }
    
    .tab-content {
      padding: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class TextToSpeechComponent implements OnInit, OnDestroy {
  voices: Voice[] = [];
  selectedVoice: Voice | null = null;
  text = '';
  rate = 1;
  pitch = 1;
  isSpeaking = false;
  isPaused = false;
  maxLength = 500;
  
  historyItems: HistoryItem[] = [];
  favorites: FavoritePhrase[] = [];
  
  activeTab: 'history' | 'favorites' = 'history';
  
  private destroy$ = new Subject<void>();
  
  constructor(private speechService: SpeechService) {}
  
  ngOnInit(): void {
    // Subscribe to voices
    this.speechService.voices$
      .pipe(takeUntil(this.destroy$))
      .subscribe(voices => {
        this.voices = voices;
        if (voices.length > 0 && !this.selectedVoice) {
          // Select the first voice by default, or preferably an English one
          const englishVoice = voices.find(v => v.lang.startsWith('en-'));
          this.selectedVoice = englishVoice || voices[0];
        }
      });
    
    // Subscribe to speech status
    this.speechService.isSpeaking$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSpeaking => {
        this.isSpeaking = isSpeaking;
      });
    
    this.speechService.isPaused$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPaused => {
        this.isPaused = isPaused;
      });
    
    // Subscribe to history
    this.speechService.history$
      .pipe(takeUntil(this.destroy$))
      .subscribe(history => {
        this.historyItems = history;
      });
    
    // Subscribe to favorites
    this.speechService.favoritesPhrases$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favorites = favorites;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.speechService.stop();
  }
  
  onTextChange(text: string): void {
    this.text = text;
  }
  
  onVoiceChange(voice: Voice): void {
    this.selectedVoice = voice;
  }
  
  onRateChange(rate: number): void {
    this.rate = rate;
  }
  
  onPitchChange(pitch: number): void {
    this.pitch = pitch;
  }
  
  speak(): void {
    if (this.text.trim() && this.selectedVoice) {
      this.speechService.speak(this.text, this.selectedVoice, this.rate, this.pitch);
    }
  }
  
  pause(): void {
    this.speechService.pause();
  }
  
  resume(): void {
    this.speechService.resume();
  }
  
  stop(): void {
    this.speechService.stop();
  }
  
  useHistoryItem(item: HistoryItem): void {
    this.text = item.text;
    this.selectedVoice = item.voice;
    this.rate = item.rate;
    this.pitch = item.pitch;
  }
  
  useFavorite(favorite: FavoritePhrase): void {
    this.text = favorite.text;
    this.selectedVoice = favorite.voice;
    this.rate = favorite.rate;
    this.pitch = favorite.pitch;
    this.speak();
  }
  
  saveAsFavorite(): void {
    if (this.text.trim() && this.selectedVoice) {
      const name = prompt('Enter a name for this favorite phrase:');
      if (name) {
        this.speechService.addToFavorites(
          this.text, 
          this.selectedVoice, 
          this.rate, 
          this.pitch,
          name
        );
      }
    }
  }
  
  removeFavorite(id: string): void {
    this.speechService.removeFavorite(id);
  }
}