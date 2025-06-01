import { Component, EventEmitter, inject, Input, Output} from '@angular/core';
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
  @Input({ required: true }) id!: string;
  @Output() remove = new EventEmitter<string>()

  private cardService = inject(CardService)

  StartBtn = this.cardService.getStartBtn(this.id)
  minutes = this.cardService.getMinutes(this.id)
  hours = this.cardService.getHours(this.id)

  ngOnInit() {
    this.cardService.initStopwatch(this.id);

    this.StartBtn = this.cardService.getStartBtn(this.id)
    this.minutes = this.cardService.getMinutes(this.id)
    this.hours = this.cardService.getHours(this.id)
  }

  start(){
    this.cardService.onStart(this.id)
  }
  end(){
    this.cardService.onEnd(this.id);
  }
  onRemove(){
    this.remove.emit(this.id)
  }
}
