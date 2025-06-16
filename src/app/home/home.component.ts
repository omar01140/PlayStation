import { Component, effect, inject, signal } from '@angular/core';
import { CardComponent } from "./card/card.component";
import { CardService } from '../shared/card.service';
import { AddCardComponent } from "./add-card/add-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, AddCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cardService= inject(CardService);
  AddingTask = false;
  IDs= this.cardService.IDs;

  removeCard(id: string) {
    if (window.confirm(`Are you sure you want to Remove the device?`)){
      this.cardService.removeStopwatch(id);
    }
  }

  onAddingCard(){
    this.AddingTask = true;
  }
  onCancelAddingCard(){
    this.AddingTask = false;
  }
}
