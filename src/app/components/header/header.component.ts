import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [@headerFade]>
      <div class="header-content">
        <div class="logo" [@logoSlide]>
          <h1>SpeakEasy</h1>
        </div>
        <div class="controls">
          <button 
            class="theme-toggle" 
            (click)="toggleDarkMode.emit()"
            aria-label="Toggle dark mode"
            [@rotateIcon]="darkMode"
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
      transition: all var(--transition-speed) ease-in-out;
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
      background: linear-gradient(45deg, white, var(--accent-color-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
      transition: all var(--transition-speed) ease-in-out;
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
    
    .icon {
      font-size: 1.25rem;
    }
  `],
  animations: [
    trigger('headerFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('logoSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('500ms 200ms ease-in-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('rotateIcon', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0)' })),
      transition('* => *', animate('500ms ease-in-out'))
    ])
  ]
})
export class HeaderComponent {
  @Input() darkMode = false;
  @Output() toggleDarkMode = new EventEmitter<void>();
}