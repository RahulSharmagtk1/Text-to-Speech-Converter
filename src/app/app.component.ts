import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TextToSpeechComponent } from './components/text-to-speech/text-to-speech.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    TextToSpeechComponent,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" [class.dark-mode]="darkMode">
      <app-header [darkMode]="darkMode" (toggleDarkMode)="toggleDarkMode()"></app-header>
      <main class="main-content">
        <app-text-to-speech></app-text-to-speech>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    
    .dark-mode {
      --bg-color: #121212;
      --text-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  darkMode = false;
  
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
  }
}