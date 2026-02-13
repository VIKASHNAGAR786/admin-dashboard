import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  emoji: string;
}

@Component({
  selector: 'app-logout-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.css']
})
export class LogoutPageComponent implements OnInit {
  countdown: number = 5;
  showRedirect: boolean = false;
  confettiPieces: Confetti[] = [];
  characterClicked: boolean = false;
  clickCount: number = 0;
  private confettiIdCounter: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Start countdown timer
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.showRedirect = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      }
    }, 1000);
  }

  handleCharacterClick(): void {
    this.characterClicked = true;
    this.clickCount++;
    
    // Generate confetti burst
    this.generateConfettiBurst(40);
    
    // Reset animated state after animation
    setTimeout(() => {
      this.characterClicked = false;
    }, 600);
  }

  private generateConfettiBurst(count: number): void {
    const emojis = ['🎉', '✨', '⭐', '💫', '🌟', '🎊', '🎈', '🌈', '💝', '🎁'];
    
    for (let i = 0; i < count; i++) {
      const confetti: Confetti = {
        id: this.confettiIdCounter++,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 1.5,
        size: 10 + Math.random() * 30,
        opacity: 0.8 + Math.random() * 0.2,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      };
      
      this.confettiPieces.push(confetti);
      
      // Auto remove confetti after it falls
      setTimeout(() => {
        const index = this.confettiPieces.findIndex(c => c.id === confetti.id);
        if (index > -1) {
          this.confettiPieces.splice(index, 1);
        }
      }, (confetti.delay + confetti.duration) * 1000 + 100);
    }
  }

  handleReturnToLogin(): void {
    this.router.navigate(['/']);
  }
}
