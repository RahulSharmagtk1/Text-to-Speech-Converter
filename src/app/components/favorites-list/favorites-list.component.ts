import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritePhrase } from '../../models/favorite-phrase.model';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="favorites-list">
      <h3 class="section-title">Saved Phrases</h3>
      
      <div *ngIf="favorites.length === 0" class="empty-state">
        <p>No saved phrases yet. Use the "Save" button to add favorites.</p>
      </div>
      
      <ul class="list" *ngIf="favorites.length > 0">
        <li *ngFor="let favorite of favorites" class="list-item">
          <div class="item-content">
            <div class="item-header">
              <h4 class="item-name">{{ favorite.name }}</h4>
              <div class="item-actions">
                <button 
                  class="action-button play-button" 
                  (click)="useFavorite.emit(favorite)"
                  aria-label="Play favorite"
                >
                  <span class="icon">▶</span>
                </button>
                <button 
                  class="action-button delete-button" 
                  (click)="onRemove(favorite.id)"
                  aria-label="Delete favorite"
                >
                  <span class="icon">✕</span>
                </button>
              </div>
            </div>
            <div class="item-text">{{ truncateText(favorite.text) }}</div>
            <div class="item-meta">
              <span class="voice-name">{{ favorite.voice.name }}</span>
              <span class="settings">
                Rate: {{ favorite.rate.toFixed(1) }}, 
                Pitch: {{ favorite.pitch.toFixed(1) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .favorites-list {
      padding: 0.5rem 0;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--text-color, #1f2937);
    }
    
    .empty-state {
      padding: 1.5rem;
      text-align: center;
      color: var(--text-color-secondary, #6b7280);
      background-color: var(--input-bg-color, white);
      border-radius: 8px;
      border: 1px dashed var(--border-color, #e5e7eb);
    }
    
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .list-item {
      margin-bottom: 0.75rem;
    }
    
    .item-content {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      background-color: var(--input-bg-color, white);
      transition: background-color 0.2s ease;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .item-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .item-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: var(--bg-alt-color, #f8f9fa);
      color: var(--text-color-secondary, #6b7280);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .play-button:hover {
      background-color: var(--primary-color);
      color: white;
    }
    
    .delete-button:hover {
      background-color: var(--error-color, #ef4444);
      color: white;
    }
    
    .item-text {
      font-size: 0.9rem;
      color: var(--text-color, #1f2937);
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    
    .item-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-color-secondary, #6b7280);
    }
    
    .voice-name {
      font-weight: 500;
    }
    
    .settings {
      font-style: italic;
    }
  `]
})
export class FavoritesListComponent {
  @Input() favorites: FavoritePhrase[] = [];
  @Output() useFavorite = new EventEmitter<FavoritePhrase>();
  @Output() removeFavorite = new EventEmitter<string>();
  
  truncateText(text: string, maxLength = 100): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  
  onRemove(id: string): void {
    if (confirm('Are you sure you want to remove this favorite phrase?')) {
      this.removeFavorite.emit(id);
    }
  }
}