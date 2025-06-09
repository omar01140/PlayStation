import { Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CardService } from '../../shared/card.service';
import { ItemsMenuComponent } from "./items-menu/items-menu.component";
import { OrdresMenuComponent } from "./ordres-menu/ordres-menu.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatMenuModule, MatSlideToggleModule, ItemsMenuComponent, OrdresMenuComponent, NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) index!: string;
  @Output() remove = new EventEmitter<string>()

  private cardService = inject(CardService)

  StartBtn = this.cardService.getStartBtn(this.id)
  minutes = this.cardService.getMinutes(this.id)
  hours = this.cardService.getHours(this.id)
  deviceImage: string = '';
  deviceType: string = '';

  closed = signal(true);

  ngOnInit() {
    this.cardService.initStopwatch(this.id);

    this.StartBtn = this.cardService.getStartBtn(this.id)
    this.minutes = this.cardService.getMinutes(this.id)
    this.hours = this.cardService.getHours(this.id)
    this.deviceImage = this.cardService.getDeviceImage(this.id);
    this.deviceType = this.cardService.getDeviceType(this.id);
  }

  start(){
    this.cardService.onStart(this.id)
    console.log(this.deviceType);

  }
  end(){
    this.cardService.onEnd(this.id);
  }
  onRemove(){
    this.remove.emit(this.id)
  }

  onOpenMenu(){
    this.closed.set(!this.closed())
  }
}
