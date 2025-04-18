import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="text-input-container">
      <label for="speech-text" class="label">Enter text to speak</label>
      
      <textarea
        id="speech-text"
        class="text-area"
        [ngModel]="text"
        (ngModelChange)="onTextChange($event)"
        placeholder="Type or paste your text here..."
        rows="6"
        [maxlength]="maxLength"
      ></textarea>
      
      <div class="character-count">
        <span>{{ text.length }} / {{ maxLength }}</span>
        <span *ngIf="text.length >= maxLength * 0.9" class="warning">
          {{ maxLength - text.length }} characters left
        </span>
      </div>
    </div>
  `,
  styles: [`
    .text-input-container {
      display: flex;
      flex-direction: column;
    }
    
    .label {
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-color-secondary, #6b7280);
    }
    
    .text-area {
      padding: 1rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      font-size: 1rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background-color: var(--input-bg-color, white);
      color: var(--text-color, #1f2937);
    }
    
    .text-area:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .character-count {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-color-secondary, #6b7280);
    }
    
    .warning {
      color: var(--warning-color, #f97316);
      font-weight: 500;
    }
  `]
})
export class TextInputComponent {
  @Input() text = '';
  @Input() maxLength = 500;
  @Output() textChange = new EventEmitter<string>();
  
  onTextChange(value: string): void {
    this.textChange.emit(value);
  }
}