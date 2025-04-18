import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 SpeakEasy Text-to-Speech | Built with Angular</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 1.5rem;
      background-color: var(--primary-color);
      color: white;
      text-align: center;
      margin-top: auto;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    p {
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class FooterComponent {}