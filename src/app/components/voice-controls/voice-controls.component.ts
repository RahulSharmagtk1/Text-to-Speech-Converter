import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Voice } from '../../models/voice.model';

@Component({
  selector: 'app-voice-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="voice-controls">
      <div class="control-group">
        <label for="voice-select" class="label">Voice</label>
        <select 
          id="voice-select" 
          class="select"
          [ngModel]="selectedVoice?.id"
          (ngModelChange)="onVoiceSelect($event)"
        >
          <option *ngFor="let voice of voices" [value]="voice.id">
            {{ voice.name }} ({{ voice.lang }})
          </option>
        </select>
      </div>
      
      <div class="control-row">
        <div class="control-group">
          <label for="rate-slider" class="label">Rate: {{ rate.toFixed(1) }}</label>
          <input 
            type="range" 
            id="rate-slider"
            class="slider"
            min="0.5" 
            max="2" 
            step="0.1"
            [ngModel]="rate"
            (ngModelChange)="onRateChange($event)"
          />
        </div>
        
        <div class="control-group">
          <label for="pitch-slider" class="label">Pitch: {{ pitch.toFixed(1) }}</label>
          <input 
            type="range" 
            id="pitch-slider"
            class="slider"
            min="0.5" 
            max="2" 
            step="0.1"
            [ngModel]="pitch"
            (ngModelChange)="onPitchChange($event)"
          />
        </div>
      </div>
      
      <div class="presets">
        <span class="preset-label">Presets:</span>
        <button class="preset-button" (click)="applyPreset('casual')">Casual</button>
        <button class="preset-button" (click)="applyPreset('formal')">Formal</button>
        <button class="preset-button" (click)="applyPreset('storytelling')">Storytelling</button>
      </div>
      
      <div class="playback-controls">
        <button 
          class="control-button speak-button" 
          (click)="speak.emit()"
          [disabled]="isSpeaking && !isPaused"
          aria-label="Speak text"
        >
          <span class="icon">▶</span> Speak
        </button>
        
        <button 
          *ngIf="isSpeaking && !isPaused"
          class="control-button"
          (click)="pause.emit()"
          aria-label="Pause speech"
        >
          <span class="icon">❚❚</span> Pause
        </button>
        
        <button 
          *ngIf="isSpeaking && isPaused"
          class="control-button"
          (click)="resume.emit()"
          aria-label="Resume speech"
        >
          <span class="icon">▶</span> Resume
        </button>
        
        <button 
          *ngIf="isSpeaking"
          class="control-button stop-button"
          (click)="stop.emit()"
          aria-label="Stop speech"
        >
          <span class="icon">■</span> Stop
        </button>
        
        <button 
          class="control-button favorite-button"
          (click)="saveAsFavorite.emit()"
          aria-label="Save as favorite"
        >
          <span class="icon">★</span> Save
        </button>
      </div>
    </div>
  `,
  styles: [`
    .voice-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--bg-alt-color, #f8f9fa);
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .control-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-color-secondary, #6b7280);
    }
    
    .select {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.9rem;
      background-color: var(--input-bg-color, white);
      color: var(--text-color, #1f2937);
      height: 38px;
    }
    
    .select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--border-color, #e5e7eb);
      outline: none;
    }
    
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
      transition: background 0.2s ease;
      border: none;
    }
    
    .playback-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .control-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      background-color: var(--input-bg-color, white);
      color: var(--text-color, #1f2937);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    
    .control-button:hover:not(:disabled) {
      background-color: var(--hover-color, #f3f4f6);
    }
    
    .control-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .speak-button {
      background-color: var(--primary-color);
      color: white;
    }
    
    .speak-button:hover:not(:disabled) {
      background-color: var(--primary-color-dark, #2563eb);
    }
    
    .stop-button {
      background-color: var(--error-color, #ef4444);
      color: white;
    }
    
    .stop-button:hover {
      background-color: var(--error-color-dark, #dc2626);
    }
    
    .favorite-button {
      background-color: var(--accent-color, #0ea5e9);
      color: white;
    }
    
    .favorite-button:hover {
      background-color: var(--accent-color-dark, #0284c7);
    }
    
    .presets {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }
    
    .preset-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-color-secondary, #6b7280);
    }
    
    .preset-button {
      font-size: 0.8rem;
      padding: 0.25rem 0.75rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 999px;
      background-color: var(--input-bg-color, white);
      color: var(--text-color, #1f2937);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .preset-button:hover {
      background-color: var(--hover-color, #f3f4f6);
      border-color: var(--primary-color);
    }
  `]
})
export class VoiceControlsComponent {
  @Input() voices: Voice[] = [];
  @Input() selectedVoice: Voice | null = null;
  @Input() rate = 1;
  @Input() pitch = 1;
  @Input() isSpeaking = false;
  @Input() isPaused = false;
  
  @Output() voiceChange = new EventEmitter<Voice>();
  @Output() rateChange = new EventEmitter<number>();
  @Output() pitchChange = new EventEmitter<number>();
  @Output() speak = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() resume = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() saveAsFavorite = new EventEmitter<void>();
  
  onVoiceSelect(voiceId: string): void {
    const voice = this.voices.find(v => v.id === voiceId);
    if (voice) {
      this.voiceChange.emit(voice);
    }
  }
  
  onRateChange(rate: number): void {
    this.rateChange.emit(rate);
  }
  
  onPitchChange(pitch: number): void {
    this.pitchChange.emit(pitch);
  }
  
  applyPreset(preset: 'casual' | 'formal' | 'storytelling'): void {
    switch (preset) {
      case 'casual':
        this.rateChange.emit(1.1);
        this.pitchChange.emit(1.0);
        break;
      case 'formal':
        this.rateChange.emit(0.9);
        this.pitchChange.emit(0.9);
        break;
      case 'storytelling':
        this.rateChange.emit(0.8);
        this.pitchChange.emit(1.1);
        break;
    }
  }
}