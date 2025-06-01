import { Component, effect, inject, signal } from '@angular/core';
import { CardComponent } from "./card/card.component";
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cardService= inject(CardService)
  IDs= signal<string[]>([]);
  counter= 0;

  constructor() {
    // Initialize from localStorage
    const saved = localStorage.getItem('cards-array');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        this.IDs.set(parsed); // Set initial IDs from localStorage
        // Update counter to avoid duplicate IDs
        this.counter = Math.max(...parsed.map(id => parseInt(id) || 0), 0);
      }
    }
    effect(() => {
      localStorage.setItem('cards-array', JSON.stringify(this.IDs()));
    });
  }

  addCard(){
    this.counter++;
    this.IDs.update(()=>[...this.IDs(),this.counter.toString()])
  }
  removeCard(id: string) {
    this.IDs.update(ids => ids.filter(existingId => existingId !== id));
    this.cardService.removeStopwatch(id);
  }
}
