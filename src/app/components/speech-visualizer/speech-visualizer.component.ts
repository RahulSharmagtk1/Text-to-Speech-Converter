import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-speech-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualizer-container" [@fadeInOut]="active">
      <canvas #canvas class="visualizer-canvas"></canvas>
    </div>
  `,
  styles: [`
    .visualizer-container {
      width: 100%;
      height: 60px;
      overflow: hidden;
      border-radius: 8px;
      background-color: var(--bg-alt-color);
      margin-top: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all var(--transition-speed) ease-in-out;
    }
    
    .visualizer-canvas {
      width: 100%;
      height: 100%;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      state('true', style({ opacity: 1, transform: 'translateY(0)' })),
      state('false', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition('false => true', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('true => false', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class SpeechVisualizerComponent implements OnInit, OnChanges {
  @Input() active = false;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId?: number;
  private bars = 30;
  private barHeights: number[] = [];
  
  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.initCanvas();
    
    for (let i = 0; i < this.bars; i++) {
      this.barHeights.push(0);
    }
    
    if (this.active) {
      this.startAnimation();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.ctx) {
      if (this.active) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }
  
  private initCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  private startAnimation(): void {
    this.stopAnimation();
    this.animate();
  }
  
  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }
  
  private animate(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = (this.canvas.width / this.bars) * 0.8;
    const spacing = (this.canvas.width / this.bars) * 0.2;
    const maxHeight = this.canvas.height * 0.8;
    
    for (let i = 0; i < this.bars; i++) {
      if (this.active) {
        const centerEffect = Math.cos((i / this.bars - 0.5) * Math.PI) * 0.5 + 0.5;
        const targetHeight = maxHeight * (0.1 + Math.random() * 0.5 * centerEffect);
        this.barHeights[i] = this.barHeights[i] * 0.85 + targetHeight * 0.15;
      } else {
        this.barHeights[i] *= 0.95;
      }
      
      const x = i * (barWidth + spacing) + spacing / 2;
      const height = this.barHeights[i];
      const y = (this.canvas.height - height) / 2;
      
      const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
      gradient.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim());
      gradient.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim());
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, barWidth, height, [barWidth / 2]);
      this.ctx.fill();
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}