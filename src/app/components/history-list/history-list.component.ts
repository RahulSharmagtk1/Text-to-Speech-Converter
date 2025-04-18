import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryItem } from '../../models/history-item.model';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-list">
      <h3 class="section-title">Recent Text</h3>
      
      <div *ngIf="historyItems.length === 0" class="empty-state">
        <p>No recent history yet. Start speaking to see your history here.</p>
      </div>
      
      <ul class="list" *ngIf="historyItems.length > 0">
        <li *ngFor="let item of historyItems" class="list-item">
          <div class="item-content" (click)="useHistoryItem.emit(item)">
            <div class="item-text">{{ truncateText(item.text) }}</div>
            <div class="item-meta">
              <span class="voice-name">{{ item.voice.name }}</span>
              <span class="timestamp">{{ formatTimestamp(item.timestamp) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .history-list {
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
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    
    .item-content:hover {
      background-color: var(--hover-color, #f3f4f6);
      transform: translateY(-1px);
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
    
    .timestamp {
      font-style: italic;
    }
  `]
})
export class HistoryListComponent {
  @Input() historyItems: HistoryItem[] = [];
  @Output() useHistoryItem = new EventEmitter<HistoryItem>();
  
  truncateText(text: string, maxLength = 100): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  
  formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    
    // If it's today, show only the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}