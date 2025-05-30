import { Component, inject} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CardService } from '../../shared/card.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatMenuModule, MatSlideToggleModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  // private cardService = new CardService();
  private cardService = inject(CardService)

  StartBtn = this.cardService.StartBtn
  minutes = this.cardService.minutes
  hours = this.cardService.hours

  start(){
    this.cardService.onStart()
  }
  end(){
    this.cardService.onEnd();
  }
}
