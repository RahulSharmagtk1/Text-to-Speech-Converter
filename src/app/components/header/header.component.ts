import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>SpeakEasy</h1>
        </div>
        <div class="controls">
          <button 
            class="theme-toggle" 
            (click)="toggleDarkMode.emit()"
            aria-label="Toggle dark mode"
          >
            <span class="icon">{{ darkMode ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }
    
    .theme-toggle {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .icon {
      font-size: 1.25rem;
    }
  `]
})
export class HeaderComponent {
  @Input() darkMode = false;
  @Output() toggleDarkMode = new EventEmitter<void>();
}